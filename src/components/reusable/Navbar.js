import React from "react";
import Logo from "./Logo";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-8 border-b border-base-200">
      <div className="flex-1">
        <Logo />
      </div>
      <div className="flex-none gap-2">
        <Link href="/login" className="btn btn-ghost btn-sm">
          Sign In
        </Link>
        <Link href="/signup" className="btn btn-primary btn-sm rounded-full">
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
