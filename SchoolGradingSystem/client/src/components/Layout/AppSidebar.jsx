import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  LogOut,
  GraduationCap,
  FileText,
  Calendar,
  User
} from "lucide-react";

export function AppSidebar({ userRole }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const isActive = (path) => currentPath === path;
  const getNavCls = ({ isActive }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  // Role-specific navigation items
  const getMenuItems = () => {
    const baseItems = [
      { title: "Dashboard", url: `/dashboard/${userRole}`, icon: LayoutDashboard },
    ];

    switch (userRole) {
      case "teacher":
        return [
          ...baseItems,
          { title: "My Classes", url: "/dashboard/teacher/classes", icon: BookOpen },
          { title: "Students", url: "/dashboard/teacher/students", icon: Users },
          { title: "Grades", url: "/dashboard/teacher/grades", icon: FileText },
          { title: "Analytics", url: "/dashboard/teacher/analytics", icon: BarChart3 },
        ];
      case "student":
        return [
          ...baseItems,
          { title: "My Grades", url: "/dashboard/student/grades", icon: FileText },
          { title: "My Classes", url: "/dashboard/student/classes", icon: BookOpen },
          { title: "Schedule", url: "/dashboard/student/schedule", icon: Calendar },
          { title: "Profile", url: "/dashboard/student/profile", icon: User },
        ];
      case "parent":
        return [
          ...baseItems,
          { title: "Child's Grades", url: "/dashboard/parent/grades", icon: FileText },
          { title: "Progress Report", url: "/dashboard/parent/progress", icon: BarChart3 },
          { title: "Teachers", url: "/dashboard/parent/teachers", icon: GraduationCap },
          { title: "Settings", url: "/dashboard/parent/settings", icon: Settings },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();
  const isExpanded = menuItems.some((item) => isActive(item.url));

  const getRoleColor = () => {
    switch (userRole) {
      case "teacher": return "text-teacher";
      case "student": return "text-student";
      case "parent": return "text-parent";
      default: return "text-primary";
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "teacher": return GraduationCap;
      case "student": return BookOpen;
      case "parent": return Users;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarContent>
        {/* Header */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-base font-semibold">
            <RoleIcon className={`h-5 w-5 ${getRoleColor()}`} />
            {!collapsed && (
              <span className="capitalize">{userRole} Portal</span>
            )}
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}