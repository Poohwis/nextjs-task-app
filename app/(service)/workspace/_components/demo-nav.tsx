import Logo from "@/components/logo";
import { Plus } from "lucide-react";
import ProfileMenu from "./profile-menu";

export default function DemoNavbar() {
  return (
    <div
      className="fixed top-0 w-full h-[50px]
      flex items-center justify-center border-b-[1px] border-b-white/20 sm:px-6 px-4 py-2"
    >
      {/* removed max-w-screen-2xl from below */}
      <div className="w-full flex items-center flex-row justify-between">
        <div className="flex flex-row items-center">
          <Logo />
          <div className="sm:hidden flex ml-2">
            {/* mobile create menu */}
            <div className="flex justify-center items-center w-8 h-8 bg-darkgray rounded-lg">
              <Plus size={14} className="text-white/90" />
            </div>
          </div>
        </div>
        <ProfileMenu />
      </div>
    </div>
  );
}
