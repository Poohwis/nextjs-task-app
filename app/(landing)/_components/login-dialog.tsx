"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loginform from "./login-form";
import Social from "./social";
import { RegisterDialogContent } from "./register-dialog";
import { useState } from "react";
import React from "react";

interface DialogLoginProps {
  children: React.ReactNode;
}
export default function DialogLogin({ children }: DialogLoginProps) {
  const [isToggled, setIsToggled] = useState(false);
  return (
    <Dialog onOpenChange={(open) => (!open ? setIsToggled(false) : null)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-md">
      {isToggled ? (
        <RegisterDialogContent toggle={() => setIsToggled(false)} />
      ) : (
        <LoginDialogContent toggle={() => setIsToggled(true)} />
      )}
    </DialogContent>
    </Dialog>
  );
}

interface LoginDialogContentProps {
  toggle: () => void;
}
export function LoginDialogContent({ toggle }: LoginDialogContentProps) {
  return (
      <>
      <DialogHeader>
        <DialogTitle className="self-center text-white">Login</DialogTitle>
        <DialogDescription />
      </DialogHeader>
      <Loginform />
      <Social />
      <div className="mt-2 text-xs text-center text-white flex flex-row gap-x-1 justify-center">
        Don't have an account?
        <div onClick={toggle} className="hover:underline hover:cursor-pointer">
          Register
        </div>
      </div>
      </>
  );
}
