import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    return localStorage.getItem('sidebar_expanded') === 'true';
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setSidebarExpanded(localStorage.getItem('sidebar_expanded') === 'true');
    };

    // Listen for custom event from Sidebar component
    const handleSidebarToggle = () => {
      setSidebarExpanded(localStorage.getItem('sidebar_expanded') === 'true');
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    // Poll localStorage periodically to catch changes from same window
    const interval = setInterval(() => {
      const currentState = localStorage.getItem('sidebar_expanded') === 'true';
      if (currentState !== sidebarExpanded) {
        setSidebarExpanded(currentState);
      }
    }, 100);

    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
      clearInterval(interval);
    };
  }, [sidebarExpanded]);
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main 
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarExpanded ? '14rem' : '5rem' }}
      >
        <div className="px-5 py-6 max-w-[1600px] mx-auto">
          <Header title={title} />
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
