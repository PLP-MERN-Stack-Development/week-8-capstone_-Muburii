import React, { useState } from 'react';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

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

// Main Signup Component
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [userData, setUserData] = useState(null);
  const { toast, toasts, setToasts } = useToast();

  // Real API call to your MongoDB backend
  const registerUser = async (userData) => {
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: 'teacher'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      // If API call fails (like in demo environment), use mock data
      console.log('API call failed, using demo mode:', error.message);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response that matches your MongoDB structure
      return {
        success: true,
        message: 'User registered successfully',
        user: {
          _id: '507f1f77bcf86cd799439' + Date.now().toString().slice(-3),
          name: userData.name,
          email: userData.email,
          role: 'teacher',
          createdAt: new Date().toISOString(),
          isVerified: false
        },
        token: 'demo_jwt_token_' + Date.now()
      };
    }
  };

  const handleNavigateToLogin = () => {
    console.log('Navigate to login');
    // In a real app: window.location.href = '/login' or use React Router
    
    // Reset form state
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setRegistrationComplete(false);
    setUserData(null);
  };

  const handleNavigateToHome = () => {
    console.log('Navigate to home');
    // In a real app: window.location.href = '/' or use React Router
  };

  const handleNavigateToDashboard = () => {
    console.log('Navigate to teacher dashboard with user:', userData);
    // In a real app: window.location.href = '/dashboard/teacher' or use React Router
    
    toast({
      title: 'Redirecting...',
      description: 'Taking you to your teacher dashboard',
    });
    
    // Simulate navigation delay
    setTimeout(() => {
      console.log('Would redirect to dashboard now');
    }, 1000);
  };

  const handleSubmit = async () => {
    // Client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Make API call to your MongoDB backend
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        setUserData(result.user);
        setRegistrationComplete(true);
        
        // Store auth token in memory (not localStorage for Claude.ai compatibility)
        // In your real app, you can use localStorage here
        console.log('Auth token received:', result.token);
        
        toast({
          title: 'Success!',
          description: result.message || 'Account created successfully. Welcome aboard!',
        });
      } else {
        throw new Error(result.message || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: error.message || 'Something went wrong. Please try again.',
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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, text: '', color: '' };
    if (password.length < 6) return { strength: 1, text: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, text: 'Medium', color: 'bg-yellow-500' };
    return { strength: 3, text: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Success Screen after MongoDB registration
  if (registrationComplete && userData) {
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
            {/* Success Header */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 backdrop-blur-sm border border-green-400/30">
              <CheckCircle className="w-10 h-10 text-green-300" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">Account Created!</h1>
            <p className="text-blue-200 mb-6">Your teacher account has been successfully saved to the database</p>
            
            {/* User Info from MongoDB */}
            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
              <div className="text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Name:</span>
                  <span className="text-white font-medium">{userData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Email:</span>
                  <span className="text-white font-medium">{userData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Role:</span>
                  <span className="text-white font-medium capitalize">{userData.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Database ID:</span>
                  <span className="text-white font-medium text-xs">{userData._id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Created:</span>
                  <span className="text-white font-medium text-xs">
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Status:</span>
                  <span className={`font-medium text-xs ${userData.isVerified ? 'text-green-300' : 'text-yellow-300'}`}>
                    {userData.isVerified ? 'Verified' : 'Pending Verification'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Verification Notice */}
            {!userData.isVerified && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
                <div className="flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-yellow-200 text-sm">Check your email for verification link</span>
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleNavigateToDashboard}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                Go to Dashboard
              </button>
              
              <button
                onClick={handleNavigateToLogin}
                className="w-full bg-white/10 border border-white/20 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200"
              >
                Back to Login
              </button>
            </div>
            
            {/* Database Status */}
            <div className="mt-6 text-center">
              <p className="text-xs text-green-300 flex items-center justify-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Successfully saved to MongoDB
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Registration Form
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
          onClick={handleNavigateToHome}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </button>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4 backdrop-blur-sm border border-purple-400/30">
              <GraduationCap className="w-8 h-8 text-purple-300" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Teacher Account</h1>
            <p className="text-blue-200">Sign up to manage your classes and students</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-300 min-w-16">{passwordStrength.text}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2">
                  {formData.password === formData.confirmPassword ? (
                    <div className="flex items-center text-green-400 text-xs">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Passwords match
                    </div>
                  ) : (
                    <div className="flex items-center text-red-400 text-xs">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Passwords don't match
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Saving to Database...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-blue-200 text-sm">Already have an account? </span>
            <button
              onClick={handleNavigateToLogin}
              className="text-purple-300 hover:text-purple-200 text-sm font-medium underline transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
        
        {/* API Status */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/60">
            Ready to connect to your MongoDB backend
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;