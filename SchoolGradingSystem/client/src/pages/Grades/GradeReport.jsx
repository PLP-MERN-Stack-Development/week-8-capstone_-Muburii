import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const GradeReport = () => {
  const [grades, setGrades] = useState([]);
  const [classPerformance, setClassPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [gradesRes, classesRes, subjectsRes, performanceRes] = await Promise.all([
        axios.get('/grades'),
        axios.get('/classes'),
        axios.get('/subjects'),
        axios.get('/grades/class-performance')
      ]);

      setGrades(gradesRes.data);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
      setClassPerformance(performanceRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = grades.filter(grade => {
    const matchesClass = selectedClass === 'all' || grade.student._id === selectedClass;
    const matchesSubject = selectedSubject === 'all' || grade.subject._id === selectedSubject;
    return matchesClass && matchesSubject;
  });

  // Chart data
  const gradeDistribution = [
    { name: 'A (90-100%)', count: filteredGrades.filter(g => g.percentage >= 90).length, color: '#22c55e' },
    { name: 'B (80-89%)', count: filteredGrades.filter(g => g.percentage >= 80 && g.percentage < 90).length, color: '#3b82f6' },
    { name: 'C (70-79%)', count: filteredGrades.filter(g => g.percentage >= 70 && g.percentage < 80).length, color: '#eab308' },
    { name: 'D (60-69%)', count: filteredGrades.filter(g => g.percentage >= 60 && g.percentage < 70).length, color: '#f97316' },
    { name: 'F (<60%)', count: filteredGrades.filter(g => g.percentage < 60).length, color: '#ef4444' }
  ];

  const monthlyPerformance = grades.reduce((acc, grade) => {
    const month = new Date(grade.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.totalGrades += grade.percentage;
      existing.count += 1;
      existing.averageGrade = existing.totalGrades / existing.count;
    } else {
      acc.push({
        month,
        totalGrades: grade.percentage,
        count: 1,
        averageGrade: grade.percentage
      });
    }
    return acc;
  }, []);

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-blue-100 text-blue-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const overallStats = {
    totalGrades: filteredGrades.length,
    averageGrade: filteredGrades.length > 0 
      ? (filteredGrades.reduce((sum, grade) => sum + grade.percentage, 0) / filteredGrades.length).toFixed(1)
      : '0',
    highestGrade: filteredGrades.length > 0 
      ? Math.max(...filteredGrades.map(g => g.percentage)).toFixed(1)
      : '0',
    lowestGrade: filteredGrades.length > 0 
      ? Math.min(...filteredGrades.map(g => g.percentage)).toFixed(1)
      : '0'
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Grade Reports</h1>
            <p className="text-muted-foreground">Analyze student performance and grade trends</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Link to="/grades/assign">
              <Button>
                <Award className="h-4 w-4 mr-2" />
                Assign Grade
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalGrades}</div>
              <p className="text-xs text-muted-foreground">Recorded grades</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.averageGrade}%</div>
              <p className="text-xs text-muted-foreground">Class performance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Grade</CardTitle>
              <Award className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{overallStats.highestGrade}%</div>
              <p className="text-xs text-muted-foreground">Best performance</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lowest Grade</CardTitle>
              <Award className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overallStats.lowestGrade}%</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Breakdown of grades by letter grade</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({name, count}) => count > 0 ? `${name}: ${count}` : ''}
                  >
                    {gradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend</CardTitle>
              <CardDescription>Average grades over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="averageGrade" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Average grades by class</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="className" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="averageGrade" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>Latest grades assigned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredGrades.slice(0, 10).map((grade) => (
                <div key={grade._id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{grade.student.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {grade.subject.name} - {grade.assignmentName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(grade.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getGradeColor(grade.percentage)}>
                      {grade.percentage.toFixed(1)}%
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {grade.grade}/{grade.maxGrade}
                    </div>
                  </div>
                </div>
              ))}
              {filteredGrades.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No grades found for the selected filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default GradeReport;