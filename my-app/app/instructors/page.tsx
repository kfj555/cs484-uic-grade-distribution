"use client";
import { useState, useEffect } from "react";
import Card from "../_components/Card";
import SearchableSelect from "../_components/SearchableSelect";
import Button from "../_components/Button";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
const Instructor = () => {
  const [instructor, setInstructor] = useState<string>("");
  const [instructors, setInstructors] = useState<{ instructor: string }[]>([]);
  const [instructorInfo, setInstructorInfo] = useState<
    { title: string; avg_gpa: number }[]
  >([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      const res = await fetch(`${BASE}/instructor`);
      const data = await res.json();
      const instructorData = data.splice(1); // remove , at start
      setInstructors(instructorData);
      setInstructor(instructorData[0]?.instructor || "");
    };
    fetchInstructors();
  }, []);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!instructor) return;
      const res = await fetch(
        `${BASE}/instructor/info?name=${encodeURIComponent(instructor)}`
      );
      const data = await res.json();
      console.log("instructor info data", data);
      setInstructorInfo(data);
    };
    fetchInfo();
  }, [instructor]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Card>
        <SearchableSelect
          label="Instructors"
          items={instructors}
          value={{ instructor: instructor }}
          getOptionText={(i) => i.instructor}
          onChange={(i) => setInstructor(i.instructor)}
        />
        <Button href="/">Back</Button>
      </Card>
      <Card>
        <div className="w-120">
          <h2 className="text-lg font-bold mb-4">Selected Instructor</h2>
          {instructor ? (
            <div>
              <p>{instructor}</p>
              <h3 className="text-md font-semibold mt-4 mb-2">
                Courses Taught:
              </h3>
              {instructorInfo.length > 0 ? (
                <ul className="list-disc list-inside">
                  {instructorInfo.map((course, index) => (
                    <li key={index}>
                      {course.title} -{" "}
                      {course.avg_gpa !== 0
                        ? `Average GPA: ${course.avg_gpa.toFixed(2)}`
                        : "No GPA data"}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">
                  No courses found for this instructor.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No instructor selected</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Instructor;
