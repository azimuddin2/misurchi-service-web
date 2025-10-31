import { AppSidebar } from '@/components/modules/dashboard/sidebar/app-sidebar';
import { Footer } from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white">
        <Header />
      </div>

      <div className="flex flex-1 container mx-auto">
        <SidebarProvider>
          {/* Sticky Sidebar */}
          <div className="sticky top-[160px] z-40 h-[calc(100vh-68px)] overflow-y-auto">
            <AppSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <SidebarInset>
              <header className="flex h-16 items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </header>

              <div className="min-h-[calc(100vh-64px)] bg-white rounded p-3 lg:p-8 lg:pt-0 lg:m-2 mt-0">
                {children}
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
