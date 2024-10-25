"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Footer() {
  const session = useSession();
  
  return (
    <div className="fixed bottom-0 py-6 sm:px-10 px-4">
      <div className=" text-white/50 text-xs">
        This is demo project. See more in my{" "}
        <Link href="/" className="underline">
          portfolio
        </Link>
      </div>
      {/* <div className="flex flex-row gap-x-2">
        <div
          onClick={() => {
            console.log(session);
          }}
          className="text-white"
        >
          get session
        </div>
        <div className="text-white" onClick={()=>{signOut()}}>sign out</div>
      </div> */}
    </div>
  );
}
