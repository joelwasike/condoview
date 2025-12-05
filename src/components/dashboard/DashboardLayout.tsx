import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-20 px-8 py-10">
        <div className="max-w-[1600px] mx-auto">
          <Header title={title} />
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
