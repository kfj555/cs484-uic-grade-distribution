import React from "react";
interface CardProps {
  children: React.ReactNode;
}

const Card = ({ children }: CardProps) => {
  return (
    <div className="flex flex-col gap-3 border w-fit p-6 my-10">{children}</div>
  );
};

export default Card;
