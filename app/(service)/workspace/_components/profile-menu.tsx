import { auth, signOut } from "@/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import Image from "next/image";

export default async function ProfileMenu() {
  const session = await auth();
  const profileImage = session?.user?.image;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex flex-row items-center space-x-4 hover:cursor-pointer">
          <div className="w-6 h-6 bg-white rounded-full overflow-clip">
            {profileImage ? (
              <Image
                src={profileImage}
                alt="profile-image"
                width={40}
                height={40}
              />
            ) : (
              <div className="w-8 h-8  bg-darkgray text-white flex items-center justify-center">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-1 ">
        <DropdownMenuGroup className="px-4">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <div className="flex flex-row items-center space-x-4 ml-2 mb-2">
            <div className="flex flex-col">
              <div className="text-white font-bold text-xs">
                {session?.user?.name}
              </div>
              <div className="text-white/80 text-xs">
                {session?.user?.email}
              </div>
            </div>
            <div className="w-8 h-8 bg-white rounded-full overflow-clip">
              {profileImage ? (
                <Image
                  src={profileImage || ""}
                  alt="profile-image"
                  width={40}
                  height={40}
                />
              ) : (
                <div className="w-8 h-8  bg-darkgray text-white flex items-center justify-center">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <DropdownMenuSeparator className="my-2"/>
        </DropdownMenuGroup>
        <DropdownMenuGroup className="mb-2">
        <DropdownMenuItem className="hover:cursor-pointer ">
          <Settings size={14} className="mr-1 ml-4" />
          <div className="text-xs">Settings</div>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer ">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="flex flex-row items-center" type="submit">
              <LogOut size={14} className="mr-1 ml-4 " />
              <div className="text-xs">Logout</div>
            </button>
          </form>
        </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
