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
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    classId: '',
    parentEmail: ''
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setClassesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/students', {
        ...formData,
        role: 'student'
      });
      
      toast({
        title: 'Success!',
        description: 'Student added successfully.',
      });
      
      navigate('/students');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add student',
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

  const handleClassChange = (value) => {
    setFormData({
      ...formData,
      classId: value
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Student</h1>
            <p className="text-muted-foreground">Enroll a new student in your class</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5 text-primary" />
                <CardTitle>Student Information</CardTitle>
              </div>
              <CardDescription>
                Fill in the student details to create their account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password for student"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classId">Assign to Class *</Label>
                  <Select value={formData.classId} onValueChange={handleClassChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classesLoading ? (
                        <SelectItem value="loading" disabled>Loading classes...</SelectItem>
                      ) : (
                        classes.map((cls) => (
                          <SelectItem key={cls._id} value={cls._id}>
                            {cls.name} - {cls.subject}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Parent/Guardian Email</Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                    placeholder="parent@email.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    Optional: Parent will receive progress updates
                  </p>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit" disabled={loading || classesLoading} className="flex-1">
                    {loading ? 'Adding Student...' : 'Add Student'}
                  </Button>
                  <Link to="/students" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Account Creation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• The student will be able to log in with their email and password</p>
              <p>• They'll have access to view their grades and class information</p>
              <p>• If a parent email is provided, they'll also receive account access</p>
              <p>• You can always update student information later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
export default AddStudent;