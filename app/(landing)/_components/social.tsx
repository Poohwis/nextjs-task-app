"use client";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default function Social() {
  const onClick = (provider: "google" | "github") => {
    signIn(provider,{callbackUrl: DEFAULT_LOGIN_REDIRECT});
  };
  return (
    <div className="flex flex-row items-center w-full gap-x-2">
      <Button
        variant={"outline"}
        onClick={() => {
          onClick("google");
        }}
        className="font-normal w-full flex flex-row items-center justify-center space-x-2"
      >
        <FcGoogle />
        <span className="">Login with Google</span>
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          onClick("github");
        }}
        className="font-normal w-full flex flex-row items-center justify-center space-x-2"
      >
        <FaGithub /> <span>Login with Github</span>
      </Button>
    </div>
  );
}
