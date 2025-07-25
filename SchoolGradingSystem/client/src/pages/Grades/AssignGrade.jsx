import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { GraduationCap, ArrowLeft, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export const AssignGrade = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    assignmentName: '',
    grade: '',
    maxGrade: '100',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/students');
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseInt(formData.grade) > parseInt(formData.maxGrade)) {
      toast({
        title: 'Error',
        description: 'Grade cannot be higher than maximum grade',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post('/grades', {
        ...formData,
        grade: parseInt(formData.grade),
        maxGrade: parseInt(formData.maxGrade)
      });
      
      toast({
        title: 'Success!',
        description: 'Grade assigned successfully.',
      });
      
      navigate('/grades');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to assign grade',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const getGradePercentage = () => {
    if (formData.grade && formData.maxGrade) {
      return ((parseInt(formData.grade) / parseInt(formData.maxGrade)) * 100).toFixed(1);
    }
    return '0';
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/grades">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Grades
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assign Grade</h1>
            <p className="text-muted-foreground">Record a new grade for a student</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <CardTitle>Grade Information</CardTitle>
              </div>
              <CardDescription>
                Select the student and enter grade details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="studentId">Student *</Label>
                    <Select 
                      value={formData.studentId} 
                      onValueChange={(value) => handleSelectChange('studentId', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataLoading ? (
                          <SelectItem value="loading" disabled>Loading students...</SelectItem>
                        ) : (
                          students.map((student) => (
                            <SelectItem key={student._id} value={student._id}>
                              {student.name} - {student.class.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subjectId">Subject *</Label>
                    <Select 
                      value={formData.subjectId} 
                      onValueChange={(value) => handleSelectChange('subjectId', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {dataLoading ? (
                          <SelectItem value="loading" disabled>Loading subjects...</SelectItem>
                        ) : (
                          subjects.map((subject) => (
                            <SelectItem key={subject._id} value={subject._id}>
                              {subject.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignmentName">Assignment/Test Name *</Label>
                  <Input
                    id="assignmentName"
                    name="assignmentName"
                    value={formData.assignmentName}
                    onChange={handleChange}
                    placeholder="e.g., Math Quiz #1, Final Exam"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade *</Label>
                    <Input
                      id="grade"
                      name="grade"
                      type="number"
                      value={formData.grade}
                      onChange={handleChange}
                      placeholder="85"
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxGrade">Max Grade *</Label>
                    <Input
                      id="maxGrade"
                      name="maxGrade"
                      type="number"
                      value={formData.maxGrade}
                      onChange={handleChange}
                      placeholder="100"
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage</Label>
                    <div className={`p-2 text-center font-bold text-lg ${getGradeColor(parseFloat(getGradePercentage()))}`}>
                      {getGradePercentage()}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description/Notes</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Additional notes about the assignment or student performance..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit" disabled={loading || dataLoading} className="flex-1">
                    {loading ? 'Assigning Grade...' : 'Assign Grade'}
                  </Button>
                  <Link to="/grades" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Grade Preview */}
        {formData.grade && formData.maxGrade && (
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle className="text-lg">Grade Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getGradeColor(parseFloat(getGradePercentage()))}`}>
                    {getGradePercentage()}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.grade} out of {formData.maxGrade} points
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">Grade Level:</div>
                  <div className="text-lg">
                    {parseFloat(getGradePercentage()) >= 97 ? 'A+' :
                     parseFloat(getGradePercentage()) >= 93 ? 'A' :
                     parseFloat(getGradePercentage()) >= 90 ? 'A-' :
                     parseFloat(getGradePercentage()) >= 87 ? 'B+' :
                     parseFloat(getGradePercentage()) >= 83 ? 'B' :
                     parseFloat(getGradePercentage()) >= 80 ? 'B-' :
                     parseFloat(getGradePercentage()) >= 77 ? 'C+' :
                     parseFloat(getGradePercentage()) >= 73 ? 'C' :
                     parseFloat(getGradePercentage()) >= 70 ? 'C-' :
                     parseFloat(getGradePercentage()) >= 67 ? 'D+' :
                     parseFloat(getGradePercentage()) >= 65 ? 'D' : 'F'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};
export default AssignGrade;