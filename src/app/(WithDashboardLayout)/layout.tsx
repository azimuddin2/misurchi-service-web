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
    <div>
      <Header />
      <div className="container mx-auto">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
              </div>
            </header>
            <div className="min-h-[100vh] bg-white flex-1 rounded md:min-h-min p-3 lg:p-8 lg:m-2 mt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
