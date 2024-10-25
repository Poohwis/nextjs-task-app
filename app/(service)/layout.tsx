import { Toaster } from "@/components/ui/toaster";
import SidebarContainer from "./workspace/_components/sidebar-container";
import ProfileMenu from "./workspace/_components/profile-menu";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {/* <div className="bg-gradient-to-b from-slate-950 via-black to-black w-full flex justify-center "> */}
      <div className="bg-[#90909c]  w-full flex justify-center ">
        <div className="flex w-full">
          {/* <Sidebar /> */}
          <SidebarContainer />
          {children}
          <div className="flex items-center justify-center absolute h-8 w-8 right-4 top-2 rounded-full transition-all hover:bg-darkgray">
            <ProfileMenu />
          </div>
          <Toaster />
        </div>
      </div>
    </main>
  );
}
