"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DialogLogin from "./_components/login-dialog";

export default function LandingPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  return (
    <div className="relative flex items-center justify-center flex-col">
      <div className="absolute w-48 h-48 bg-red-300 rounded-full filter opacity-50 top-[30%]  animate-blob blur-2xl"></div>
      <div className="absolute w-48 h-48 bg-teal-300 rounded-full filter opacity-50 top-[20%] right-[40%] animate-blob animation-delay-2000 blur-2xl"></div>
      <div className="absolute w-48 h-48 bg-purple-300 rounded-full filter opacity-50 top-[20%] left-[40%]  animate-blob animation-delay-4000 blur-2xl"></div>
      <div className="relative flex items-center justify-center flex-col">
        <div className="text-white/90 text-center flex items-center flex-col">
          <h1 className="font-bold text-4xl">
            Manage your task easier than ever
          </h1>
          <p className="text-base text-balance mt-4 max-w-xl px-4">
            Streamline your workflow with customizable lists, real-time
            collaboration. Boost your productivity and stay organized
            effortlessly with TaskMaster.
          </p>
        </div>
        <div className="flex flex-row justify-center space-x-4 mt-6">
          {userId ? (
            <Link href={"/workspace"}>
              {/* <Button variant={"outline"} className="h-8 font-semibold">
                Get started
              </Button> */}
              <div className="relative h-8 w-28 bg-white/50 rounded-lg transition-all group flex items-center justify-center overflow-hidden">
                <div className="text-sm font-semibold group-hover:text-white z-10 transition-colors duration-500">
                  Get started
                </div>
                <div className="absolute z-0 h-24 w-32 rounded-t-full bg-black/80 group-hover:-translate-y-8 transition-all translate-y-16 duration-500"/>
              </div>
            </Link>
          ) : (
            <DialogLogin>
              <Button variant={"outline"} className="h-8 font-semibold">
                Get started
              </Button>
            </DialogLogin>
          )}
        </div>
      </div>
    </div>
  );
}
