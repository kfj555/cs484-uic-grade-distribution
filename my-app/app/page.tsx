import Link from "next/link";
import Button from "./_components/Button";
import Card from "./_components/Card";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      <h1 className="text-3xl font-semibold mb-5 underline-offset-8 underline">
        Course Analytics Dashboard
      </h1>
      <div className="flex flex-col gap-4 px-55 py-20 border rounded-md">
        <Link href="./department_summary">
          <button className="border w-80 h-15 rounded-md hover:bg-gray-200 hover:cursor-pointer">
            See Department Summary
          </button>
        </Link>
        <Link href="./exact">
          <button className="border w-80 h-15 rounded-md hover:bg-gray-200 hover:cursor-pointer">
            See Exact Courses
          </button>
        </Link>
        <Link href="./instructors">
          <button className="border w-80 h-15 rounded-md hover:bg-gray-200 hover:cursor-pointer">
            See Instructors
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
