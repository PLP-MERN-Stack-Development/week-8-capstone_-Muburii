import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { 
  BookOpen, 
  BarChart3, 
  Calendar,
  TrendingUp,
  Target,
  Star,
  Loader2
} from "lucide-react";
import API from "@/services/api";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get student ID from auth context or localStorage
        const studentId = localStorage.getItem('studentId');
        if (!studentId) throw new Error('Student ID not found');
        
        const [studentRes, subjectsRes, gradesRes, assignmentsRes] = await Promise.all([
          API.get(`/students/${studentId}`),
          API.get(`/students/${studentId}/subjects`),
          API.get(`/students/${studentId}/grades/recent`),
          API.get(`/students/${studentId}/assignments/upcoming`)
        ]);
        // Check responses
        if (!studentResponse.ok) throw new Error('Failed to fetch student info');
        if (!subjectsResponse.ok) throw new Error('Failed to fetch subjects');
        if (!gradesResponse.ok) throw new Error('Failed to fetch grades');
        if (!assignmentsResponse.ok) throw new Error('Failed to fetch assignments');

        // Parse responses
        const [studentInfo, subjectsData, gradesData, assignmentsData] = await Promise.all([
          studentResponse.json(),
          subjectsResponse.json(),
          gradesResponse.json(),
          assignmentsResponse.json()
        ]);

        // Update state
        setStudentData(studentInfo);
        setSubjects(subjectsData);
        setRecentGrades(gradesData);
        setUpcomingAssignments(assignmentsData);
        
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-student';
    if (grade.startsWith('B')) return 'text-primary';
    return 'text-muted-foreground';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="mt-4 text-lg">Loading your dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh] text-center p-4">
          <div className="bg-destructive/20 p-6 rounded-lg max-w-md">
            <h2 className="text-xl font-bold text-destructive mb-2">Data Loading Error</h2>
            <p className="mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Retry Loading Data
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {studentData?.name}! Track your academic progress.
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Admission Number</p>
            <p className="font-mono font-semibold">{studentData?.admissionNumber}</p>
          </div>
        </div>

        {/* Student Info & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
              <Star className="h-4 w-4 text-student" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData?.overallGPA}</div>
              <p className="text-xs text-muted-foreground">{studentData?.class}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-student" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData?.stats?.totalSubjects}</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-student" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData?.stats?.averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                {studentData?.stats?.scoreTrend || '+0.0% from last month'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Class Rank</CardTitle>
              <Target className="h-4 w-4 text-student" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{studentData?.stats?.currentRank}</div>
              <p className="text-xs text-muted-foreground">
                {studentData?.stats?.totalStudents 
                  ? `Out of ${studentData.stats.totalStudents} students` 
                  : 'Class ranking'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject Performance */}
          <Card className="lg:col-span-2 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-student" />
                Subject Performance
              </CardTitle>
              <CardDescription>Your current grades and progress in each subject</CardDescription>
            </CardHeader>
            <CardContent>
              {subjects.length > 0 ? (
                <div className="space-y-4">
                  {subjects.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{subject.name}</h4>
                          <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className={getGradeColor(subject.grade)}>
                            {subject.grade}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{subject.score}%</p>
                        </div>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No subject data available
                </div>
              )}
              <Button variant="outline" className="w-full mt-4">
                View Detailed Reports
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Assignments */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-student" />
                Upcoming Assignments
              </CardTitle>
              <CardDescription>Assignments and tests due soon</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAssignments.map((assignment, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{assignment.assignment}</p>
                          <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                        </div>
                        <Badge variant={getPriorityColor(assignment.priority)} className="text-xs">
                          {assignment.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Due: {assignment.due}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming assignments
                </div>
              )}
              <Button variant="student" className="w-full mt-4">
                View All Assignments
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-student" />
              Recent Grades
            </CardTitle>
            <CardDescription>Your latest assignment and test results</CardDescription>
          </CardHeader>
          <CardContent>
            {recentGrades.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div>
                      <h4 className="font-medium">{grade.assignment}</h4>
                      <p className="text-sm text-muted-foreground">{grade.subject}</p>
                      <p className="text-xs text-muted-foreground">{grade.date}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={getGradeColor(grade.grade)}>
                        {grade.grade}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{grade.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent grades available
              </div>
            )}
            <Button variant="outline" className="w-full mt-4">
              View Grade History
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;