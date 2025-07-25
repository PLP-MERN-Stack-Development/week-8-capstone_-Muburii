import { useState, useEffect } from "react";
import API from "@/services/api"; // Update with your actual API path
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { 
  User, 
  BarChart3, 
  Calendar,
  TrendingUp,
  Award,
  FileText,
  Users,
  AlertTriangle,
  MessageSquare,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const ParentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/parent/dashboard");
        setDashboardData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again later.");
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-student" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-destructive rotate-180" />;
      default: return <div className="h-3 w-3 rounded-full bg-muted" />;
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-student';
    if (grade.startsWith('B')) return 'text-primary';
    if (grade.startsWith('C')) return 'text-orange-600';
    return 'text-destructive';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto mt-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Data Loading Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <p className="mt-4 text-lg">No dashboard data available</p>
          <p className="text-muted-foreground mt-2">
            We couldn't find any data for your dashboard
          </p>
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
            <h1 className="text-3xl font-bold">Parent Dashboard</h1>
            <p className="text-muted-foreground">
              Monitoring {dashboardData.child.name}'s academic progress and development.
            </p>
          </div>
          <Button variant="parent" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Teacher
          </Button>
        </div>

        {/* Child Info Card */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-parent" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Student Name</p>
                <p className="font-semibold">{dashboardData.child.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-semibold">{dashboardData.child.class}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class Teacher</p>
                <p className="font-semibold">{dashboardData.child.teacher}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Admission Number</p>
                <p className="font-mono font-semibold">{dashboardData.child.admissionNumber}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall GPA</CardTitle>
              <Award className="h-4 w-4 text-parent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.child.overallGPA}</div>
              <p className="text-xs text-muted-foreground">Class rank #{dashboardData.stats.rank}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-parent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.averageScore}%</div>
              <p className="text-xs text-muted-foreground">Across all subjects</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-parent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.child.attendance}%</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <FileText className="h-4 w-4 text-parent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.stats.completedAssignments}</div>
              <p className="text-xs text-muted-foreground">Completed this term</p>
            </CardContent>
          </Card>
        </div>

        {/* Concerns Alert */}
        {dashboardData.concerns?.length > 0 && (
          <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-5 w-5" />
                Areas Requiring Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData.concerns.map((concern, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-orange-800 dark:text-orange-200">{concern.subject}</p>
                      <p className="text-sm text-orange-600 dark:text-orange-300">{concern.issue}</p>
                    </div>
                    <Badge variant={concern.severity === 'medium' ? 'default' : 'secondary'}>
                      {concern.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subject Performance */}
          <Card className="lg:col-span-2 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-parent" />
                Subject Performance
              </CardTitle>
              <CardDescription>Your child's current grades and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{subject.name}</h4>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className={getGradeColor(subject.grade)}>
                        {subject.grade}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{subject.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View Detailed Reports
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-parent" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Important school events and meetings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.upcomingEvents.map((event, index) => (
                  <div key={index} className="space-y-1">
                    <h4 className="font-medium text-sm">{event.type}</h4>
                    <p className="text-xs text-muted-foreground">
                      {event.date} {event.time && `at ${event.time}`}
                    </p>
                    {event.teacher && (
                      <p className="text-xs text-muted-foreground">with {event.teacher}</p>
                    )}
                    {event.location && (
                      <p className="text-xs text-muted-foreground">{event.location}</p>
                    )}
                    {event.note && (
                      <p className="text-xs text-muted-foreground">{event.note}</p>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="parent" className="w-full mt-4">
                View School Calendar
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card className="bg-gradient-card shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-parent" />
              Recent Grades
            </CardTitle>
            <CardDescription>Latest assignment and test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.recentGrades.map((grade, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  grade.concern ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800' : 'bg-background/50'
                }`}>
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
                    {grade.concern && (
                      <AlertTriangle className="h-3 w-3 text-orange-600 mt-1 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Complete Grade History
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;