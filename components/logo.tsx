import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"}>
    <div className="flex flex-row items-center">
      <Image  src={"/logo.svg"} alt="logo" width={25} height={25} className="mr-2 rounded-sm sm:flex hidden"/>
      <div className="text-white font-semibold text-sm">TaskMaster</div>
    </div>
    </Link>
  );
}
