# SchoolGradingSystem
server/
├── controllers/
│   ├── authController.js
│   ├── studentController.js
│   ├── teacherController.js
│   ├── parentController.js
│   ├── classController.js
│   ├── gradeController.js
│   ├── subjectController.js
│   └── dashboardController.js
├── models/
│   ├── User.js
│   ├── Student.js
│   ├── Teacher.js
│   ├── Parent.js
│   ├── Class.js
│   ├── Grade.js
│   └── Subject.js
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── teacherRoutes.js
│   ├── parentRoutes.js
│   ├── classRoutes.js
│   ├── gradeRoutes.js
│   ├── subjectRoutes.js
│   └── dashboardRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── config/
│   └── db.js
├── server.js
├── .env
└── ...
server/
├── controllers/
│   ├── authController.js
│   ├── studentController.js
│   ├── teacherController.js
│   ├── parentController.js
│   ├── classController.js
│   ├── gradeController.js
│   ├── subjectController.js
│   └── dashboardController.js
├── models/
│   ├── User.js
│   ├── Student.js
│   ├── Teacher.js
│   ├── Parent.js
│   ├── Class.js
│   ├── Grade.js
│   └── Subject.js
├── routes/
│   ├── authRoutes.js
│   ├── studentRoutes.js
│   ├── teacherRoutes.js
│   ├── parentRoutes.js
│   ├── classRoutes.js
│   ├── gradeRoutes.js
│   ├── subjectRoutes.js
│   └── dashboardRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── config/
│   └── db.js
├── server.js
├── .env
└── ...



Great structure, Brian! Your folder layout looks clean and scalable. Based on your explanation — where:

* ✅ **Only teachers can sign up** (they are the admins).
* ✅ **Teachers add Students** and **link Parents** to them.
* ✅ **Students & Parents only log in** (not sign up).
* ✅ Teachers manage Classes and Subjects.

Let me now walk you through what should go in **each controller and route file**, given this logic.

---

## ✅ CONTROLLERS & ROUTES OVERVIEW

### 1. `authController.js` + `authRoutes.js`

#### 💡 Purpose:

Handle login and signup logic.

#### Features to Implement:

* `POST /auth/login` → Login all users (teacher, parent, student).
* `POST /auth/signup` → Only allow `teacher` signup.

  * Check if `role === 'teacher'` before proceeding.
* (Optional) `GET /auth/me` → Get logged-in user info by role.

---

### 2. `teacherController.js` + `teacherRoutes.js`

#### 💡 Purpose:

Manage all teacher-exclusive actions (admins).

#### Routes:

* `POST /teachers/students` → Add student (auto create Student + User).
* `POST /teachers/parents` → Add parent and link to student.
* `GET /teachers/students` → View all students.
* `GET /teachers/parents` → View all parents.
* `POST /teachers/classes` → Create class.
* `POST /teachers/subjects` → Create subject.
* `POST /teachers/grades` → Assign grades.

> 🔒 All routes must be protected by middleware: `requireAuth(['teacher'])`.

---

### 3. `studentController.js` + `studentRoutes.js`

#### 💡 Purpose:

Teachers manage students.

#### Routes:

* `GET /students` → For teachers to view all students.
* `GET /students/:id` → Detailed student profile.
* `PUT /students/:id` → Update student info.
* `DELETE /students/:id` → Remove student.

> Protected with `requireAuth(['teacher'])`.

---

### 4. `studentAccessController.js` + used in `studentRoutes.js`

#### 💡 Purpose:

Allow students to view their own profile.

#### Routes:

* `GET /students/profile` → Student sees their profile.
* `GET /students/grades` → View grades for the logged-in student.

> Protected with `requireAuth(['student'])`.

---

### 5. `parentController.js` + `parentRoutes.js`

#### 💡 Purpose:

Parents can only view their child’s data.

#### Routes:

* `GET /parents/profile` → View their profile and children.
* `GET /parents/children/:id/grades` → View child’s grades.

> Protected with `requireAuth(['parent'])`.

---

### 6. `classController.js` + `classRoutes.js`

#### 💡 Purpose:

Teachers create and assign classes.

#### Routes:

* `POST /classes` → Create new class.
* `GET /classes` → List all classes.
* `PUT /classes/:id` → Update class details.
* `POST /classes/:id/add-student` → Add student to class.

> Protected with `requireAuth(['teacher'])`.

---

### 7. `subjectController.js` + `subjectRoutes.js`

#### 💡 Purpose:

Manage school subjects.

#### Routes:

* `POST /subjects` → Add new subject.
* `GET /subjects` → View all subjects.
* `PUT /subjects/:id` → Edit subject name.
* `DELETE /subjects/:id` → Remove subject.

> Protected with `requireAuth(['teacher'])`.

---

### 8. `gradeController.js` + `gradeRoutes.js`

#### 💡 Purpose:

Allow teachers to record grades.

#### Routes:

* `POST /grades` → Add grade (linked to student, subject, term).
* `GET /grades/student/:id` → View grades for specific student.
* `GET /grades` → View all grades (optional).

> Protected with `requireAuth(['teacher'])`.

---

### 9. `middleware/auth.js`

#### 💡 Purpose:

JWT authentication and role-based access control.

#### What it should include:

* `requireAuth(roles = [])` → Middleware to check valid token and role match.

Example:

```js
function requireAuth(allowedRoles = []) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Access Denied' });
      }
      req.user = user;
      next();
    });
  };
}
```

---

## 🗂 Final Folder Summary (What Should Be Inside Each File)

| File                      | Should Contain                                              |
| ------------------------- | ----------------------------------------------------------- |
| `authController.js`       | Login/signup logic (teacher signup only)                    |
| `teacherController.js`    | Teacher CRUD + add students/parents/classes/subjects/grades |
| `studentController.js`    | CRUD students (for teacher)                                 |
| `studentAccessController` | `GET /profile`, `GET /grades` (for logged-in student only)  |
| `parentController.js`     | `GET /profile`, `GET /children/:id/grades`                  |
| `classController.js`      | Create/update classes and assign students                   |
| `subjectController.js`    | Create/update/delete subjects                               |
| `gradeController.js`      | Assign/view grades                                          |

---

Would you like me to:

* Help you implement each controller function by function?
* Give you a role-based signup/login system that enforces this logic?

Let me know where to begin.



client/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── axios.js               # Axios instance with base URL + token logic
│
│   ├── assets/
│   │   └── logo.png               # School logo or icons
│
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── LoadingSpinner.jsx
│
│   ├── context/
│   │   └── AuthContext.jsx        # Auth provider + token + role context
│
│   ├── hooks/
│   │   └── useAuth.js             # Custom hook for auth access
│
│   ├── pages/
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── Dashboard/
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── ParentDashboard.jsx
│   │   ├── Students/
│   │   │   ├── AddStudent.jsx
│   │   │   ├── StudentList.jsx
│   │   │   └── StudentDetails.jsx
│   │   ├── Grades/
│   │   │   ├── AssignGrade.jsx
│   │   │   └── GradeReport.jsx
│   │   ├── Classes/
│   │   │   ├── CreateClass.jsx
│   │   │   └── ClassList.jsx
│   │   ├── Subjects/
│   │   │   └── SubjectList.jsx
│   │   └── Parents/
│   │       ├── AddParent.jsx
│   │       └── ParentList.jsx
│
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
│       └── main.css               # Tailwind / CSS Modules / Global styles
│
├── .env
├── package.json
└── vite.config.js
