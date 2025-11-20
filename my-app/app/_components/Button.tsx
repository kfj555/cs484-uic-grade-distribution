import Link from "next/link";
import React from "react";

interface ButtonProps {
  href?: string;
  children?: React.ReactNode | null;
}

// basic button for now, takes href to link to another page, children used as text like
// an actual button element
const Button = ({ href = "", children = null }: ButtonProps) => {
  return (
    <Link href={href}>
      <button className="border w-30 rounded-md hover:bg-gray-200 hover:cursor-pointer">
        {children}
      </button>
    </Link>
  );
};

export default Button;
