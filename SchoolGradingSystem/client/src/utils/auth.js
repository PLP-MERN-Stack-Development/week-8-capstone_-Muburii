// utils/auth.js

// Decode JWT token payload
export const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Get decoded user from localStorage token
export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return decodeToken(token);
};

// Get the role of the logged-in user
export const getUserRole = () => {
  const user = getUserFromToken();
  return user?.role || null;
};

// Check if user is a teacher
export const isTeacher = () => {
  return getUserRole() === "teacher";
};

// Check if user is a student
export const isStudent = () => {
  return getUserRole() === "student";
};

// Check if user is a parent
export const isParent = () => {
  return getUserRole() === "parent";
};

// Get the username (or name/email depending on what token has)
export const getUsername = () => {
  const user = getUserFromToken();
  return user?.username || user?.name || user?.email || null;
};
