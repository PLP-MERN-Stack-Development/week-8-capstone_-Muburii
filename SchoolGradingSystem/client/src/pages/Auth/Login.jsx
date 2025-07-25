import React, { useState } from 'react';
import { GraduationCap, Users, BookOpen, ArrowLeft, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

// Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  const toast = ({ title, description, variant = 'default' }) => {
    const id = Date.now();
    const newToast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };
  
  return { toast, toasts, setToasts };
};

// Toast Component
const Toast = ({ toast, onClose }) => {
  const isError = toast.variant === 'destructive';
  
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-xl shadow-2xl border z-50 min-w-80 transform transition-all duration-300 backdrop-blur-lg ${
      isError 
        ? 'bg-red-500/10 border-red-500/20 text-red-100' 
        : 'bg-green-500/10 border-green-500/20 text-green-100'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {isError ? (
            <AlertCircle className="w-5 h-5 text-red-400" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-400" />
          )}
        </div>
        <div className="ml-3 flex-1">
          <h4 className="font-semibold">{toast.title}</h4>
          <p className="text-sm mt-1 opacity-90">{toast.description}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-200 text-xl leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Tabs Components
const Tabs = ({ children, value, onValueChange }) => {
  return (
    <div className="w-full">
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab: value, onTabChange: onValueChange })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm rounded-lg p-1 border border-white/10">
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, onTabChange })
      )}
    </div>
  );
};

const TabsTrigger = ({ value, children, activeTab, onTabChange }) => {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onTabChange(value)}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, activeTab }) => {
  if (activeTab !== value) return null;
  return <div className="mt-6">{children}</div>;
};

// Main Login Component
const TabbedLogin = () => {
  const [activeTab, setActiveTab] = useState('teacher');
  const [showPassword, setShowPassword] = useState(false);
  const { toast, toasts, setToasts } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    admissionNumber: ''
  });

  const handleBackToHome = () => {
    console.log('Navigate to home');
  };

  const handleLogin = (role) => {
    // Validation
    if (role === 'student' && !formData.admissionNumber) {
      toast({
        variant: 'destructive',
        title: 'Missing Admission Number',
        description: 'Students must enter their admission number to login.'
      });
      return;
    }

    if (role !== 'student' && (!formData.email || !formData.password)) {
      toast({
        variant: 'destructive',
        title: 'Missing Credentials',
        description: 'Please enter your email and password.'
      });
      return;
    }

    // Mock authentication
    const mockUsers = {
      teacher: { email: 'teacher@school.com', password: 'teacher123' },
      student: { admissionNumber: 'STU001' },
      parent: { email: 'parent@school.com', password: 'parent123' }
    };

    let isValid = false;
    
    if (role === 'student') {
      isValid = formData.admissionNumber === mockUsers.student.admissionNumber;
    } else {
      const user = mockUsers[role];
      isValid = formData.email === user.email && formData.password === user.password;
    }

    if (!isValid) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid credentials. Please check your information.'
      });
      return;
    }

    // Store auth data
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', formData.email || 'student@school.com');
    
    toast({
      title: 'Login Successful',
      description: `Welcome back! Redirecting to ${role} dashboard...`
    });

    // Simulate redirect
    setTimeout(() => {
      console.log(`Navigate to /dashboard/${role}`);
    }, 1500);
  };

  const handleSignup = () => {
    console.log('Navigate to Signup');
  };

  const roleConfig = {
    teacher: {
      icon: GraduationCap,
      title: 'Teacher Login',
      description: 'Access your classroom management tools',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10'
    },
    student: {
      icon: BookOpen,
      title: 'Student Login',
      description: 'View your grades and academic progress',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10'
    },
    parent: {
      icon: Users,
      title: 'Parent Login',
      description: 'Monitor your child\'s academic performance',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Toast Container */}
      {toasts.map(toastItem => (
        <Toast 
          key={toastItem.id} 
          toast={toastItem} 
          onClose={() => setToasts(prev => prev.filter(t => t.id !== toastItem.id))}
        />
      ))}
      
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button 
          onClick={handleBackToHome}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="text-center p-8 pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-blue-200">Choose your role and sign in to your account</p>
          </div>

          {/* Content */}
          <div className="p-8 pt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="parent">Parent</TabsTrigger>
              </TabsList>

              {Object.entries(roleConfig).map(([role, config]) => (
                <TabsContent key={role} value={role}>
                  {/* Role Header */}
                  <div className="text-center mb-6">
                    <div className={`mx-auto p-3 ${config.bgColor} backdrop-blur-sm rounded-full w-fit mb-3 border border-white/10`}>
                      <config.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">{config.title}</h3>
                    <p className="text-sm text-blue-200">{config.description}</p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {role === 'student' ? (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Admission Number
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Enter your admission number"
                            value={formData.admissionNumber}
                            onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <p className="text-xs text-gray-300 mt-1">Demo: STU001</p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Login Button */}
                    <button
                      onClick={() => handleLogin(role)}
                      className={`w-full bg-gradient-to-r ${config.color} text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 mt-6`}
                    >
                      Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>

                    {/* Signup Link for Teachers */}
                    {role === 'teacher' && (
                      <div className="text-center mt-4">
                        <button 
                          onClick={handleSignup}
                          className="text-sm text-blue-300 hover:text-blue-200 underline">
                          Don't have an account? Signup here
                        </button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/60">
            Secure login powered by modern authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabbedLogin;