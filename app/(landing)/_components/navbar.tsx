import { Button } from "@/components/ui/button";
import Logo from "../../../components/logo";
import { auth } from "@/auth";
import ProfileMenu from "./profile-menu";
import DialogLogin from "./login-dialog";
import DialogRegister from "./register-dialog";

export default async function Navbar() {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <div
      className="fixed top-0 backdrop-blur-2xl bg-black/10 w-full  flex h-12 
     items-center justify-center border-b-[1px] border-b-white/20 sm:px-10 px-4 py-2"
    >
      <div className="max-w-screen-2xl w-full flex items-center flex-row justify-between">
        <Logo />
        <div className="sm:space-x-4 space-x-2 flex flex-row">
          {!userId ? (
            <>
              <DialogRegister>
                <Button variant={"default"} className="h-8 ">
                  <span className="text-sm">Sign up</span>
                </Button>
              </DialogRegister>

              <DialogLogin>
                <Button variant={"default"} className="h-8 ">
                  <span className="text-sm">Login</span>
                </Button>
              </DialogLogin>
            </>
          ) : (
            <ProfileMenu />
          )}
        </div>
      </div>
    </div>
  );
}
