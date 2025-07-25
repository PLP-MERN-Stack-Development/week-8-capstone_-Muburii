import { useEffect, useState } from 'react';
import { GraduationCap, Users, BookOpen, BarChart3, Shield, Zap } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Separate dashboards for Teachers, Students, and Parents with role-based permissions."
    },
    {
      icon: BookOpen,
      title: "Grade Management", 
      description: "Comprehensive grade tracking with automatic percentage and grade calculations."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Real-time performance tracking and trend analysis for academic progress."
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "JWT-based authentication with admission number login for students."
    }
  ];

  const userRoles = [
    {
      role: "Teacher",
      description: "Create classes, manage students, record grades and track performance",
      variant: "bg-blue-600 hover:bg-blue-700",
      icon: GraduationCap
    },
    {
      role: "Student", 
      description: "View grades, track academic progress using admission number",
      variant: "bg-green-600 hover:bg-green-700",
      icon: BookOpen
    },
    {
      role: "Parent",
      description: "Monitor your child's academic performance and progress trends",
      variant: "bg-purple-600 hover:bg-purple-700",
      icon: Users
    }
  ];

  const handleGetStarted = () => {
    console.log("Navigate to login");
  };

  const handleRoleLogin = (role) => {
    console.log(`Login as ${role}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm border border-white/30">
              <GraduationCap size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            SchoolGradingSystem
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            A comprehensive role-based student performance management platform designed to streamline 
            academic tracking and enhance communication between Teachers, Students, and Parents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Zap className="mr-2" size={20} />
              Get Started
            </button>
            <button className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-blue-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 bg-purple-400/20 rounded-full animate-ping"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Powerful Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage academic performance effectively
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 group"
              >
                <div className="text-center">
                  <div className="mx-auto p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Built for Everyone</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tailored experiences for each user role in the educational ecosystem
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {userRoles.map((role, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="text-center">
                  <div className="mx-auto p-4 bg-gray-100 rounded-full w-fit mb-4">
                    <role.icon className="h-10 w-10 text-gray-700" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{role.role}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{role.description}</p>
                  <button 
                    onClick={() => handleRoleLogin(role.role.toLowerCase())}
                    className={`w-full text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg ${role.variant}`}
                  >
                    Login as {role.role}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Schools Worldwide</h2>
            <p className="text-xl text-blue-200">Join thousands of educational institutions already using our platform</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-200">Active Students</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Schools</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-blue-200">Grades Recorded</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Ready to Transform Your School?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of educational institutions already using our platform to improve student outcomes and streamline academic management.
          </p>
          <button 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-blue-600 to-purple-700 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Free Trial
          </button>
          
          <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">No Setup Fees</h4>
                <p className="text-gray-600">Get started immediately with no upfront costs</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">24/7 Support</h4>
                <p className="text-gray-600">Round-the-clock assistance when you need it</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Secure & Reliable</h4>
                <p className="text-gray-600">Bank-level security for your data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="w-8 h-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">SchoolGradingSystem</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering educational institutions with modern technology for better student outcomes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SchoolGradingSystem. Built with React & Modern Design. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;