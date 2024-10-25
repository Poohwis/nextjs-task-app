"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RegisterForm from "./register-form";
import { LoginDialogContent } from "./login-dialog";
import { useState } from "react";
import React from "react";

interface DialogRegisterProps {
  children?: React.ReactNode;
}
export default function DialogRegister({ children }: DialogRegisterProps) {
  const [isToggled, setIsToggled] = useState(false);
  return (
    <Dialog onOpenChange={(open) => (!open ? setIsToggled(false) : null)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent className="sm:max-w-md">
      {isToggled ? (
        <LoginDialogContent toggle={() => setIsToggled(false)} />
      ) : (
        <RegisterDialogContent toggle={() => setIsToggled(true)} />
      )}
      </DialogContent>
    </Dialog>
  );
}

interface RegisterDialogContentProps {
  toggle: () => void;
}
export function RegisterDialogContent({ toggle }: RegisterDialogContentProps) {
  return (
      <>
      <DialogHeader>
        <DialogTitle className="self-center text-white">Register</DialogTitle>
        <DialogDescription />
      </DialogHeader>
        <RegisterForm />
        <div className="text-white text-xs text-center pt-2 flex flex-row gap-x-1 justify-center">
          Already have an account?{" "}
            <div
              onClick={toggle}
              className="hover:underline hover:cursor-pointer"
            >
              Login
            </div>
        </div>
      </>
  );
}
