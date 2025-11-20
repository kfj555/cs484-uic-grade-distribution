"use client";
import { useEffect, useState } from "react";
import Select from "../_components/Select";
import "../_styles/easyCourses.css";
import SearchableSelect from "../_components/SearchableSelect";
import { url } from "inspector";
import Card from "../_components/Card";
import Button from "../_components/Button";
import Link from "next/link";

type EasyCourse = {
  subj_cd: string;
  course_nbr: string;
  instructor: string;
  avg_gpa: number;
};
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
export default function EasyCoursesPage() {
  const courseLevels: string[] = ["all", "100", "200", "300", "400", "500"];
  const [departmentArray, setDepartmentArray] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [easyCoursesMap, setEasyCoursesMap] = useState<
    Map<string, EasyCourse[]>
  >(new Map());

  useEffect(() => {
    const fetchDepartments = async () => {
      const res = await fetch(`${BASE}/department`);
      const data1 = await res.json();
      const data = data1.splice(1);
      setDepartmentArray(
        data.map(
          (dept: { dept_name: string; subj_cd: string }) =>
            `${dept.dept_name} - ${dept.subj_cd}`
        )
      );
      setSelectedDepartment(data[1]?.dept_name || "");
    };
    fetchDepartments();
  }, []);

  async function findEasyCourseHandler(): Promise<void> {
    const fetchEasyCourses = async () => {
      const [deptName, subjCode] = selectedDepartment.split(" - ");

      const easyCoursesRes = await fetch(
        `${BASE}/statistics/easy?department=${encodeURIComponent(
          deptName
        )}&subj=${encodeURIComponent(subjCode)}&level=${encodeURIComponent(
          selectedLevel
        )}`
      );
      const easyCoursesData: EasyCourse[] = await easyCoursesRes.json();
      const copiedArray: EasyCourse[] = [...easyCoursesData];
      const newArray: Map<string, EasyCourse[]> = new Map();
      while (copiedArray.length) {
        const currentSubjectName = copiedArray.at(0)?.subj_cd;
        const currentCourseNumber = copiedArray.at(0)?.course_nbr;
        const currentKey = `${currentSubjectName} ${currentCourseNumber}`;
        // Initialize the array for this key if it doesn't exist
        if (!newArray.has(currentKey)) {
          newArray.set(currentKey, []);
        }
        newArray.get(currentKey)?.push(copiedArray.at(0)!);
        copiedArray.splice(0, 1);
      }
      setEasyCoursesMap(newArray);
    };
    fetchEasyCourses();
  }

  function getGpaColor(gpa: number): string {
    // Green at 4.0 and yellow at 3.0
    const red = Math.min(255, Math.round((4.0 - gpa) * 255));
    const green = Math.min(255, Math.round((gpa - 1.0) * 110));
    return `rgb(${red}, ${green}, 0)`;
  }

  return (
    <div className="flex flex-col items-center py-10">
      <div className=" mt-8 mr-120"></div>
      <Card>
        <div className="flex flex-col items-center">
          <SearchableSelect
            label="Department"
            items={departmentArray}
            onChange={(d) => setSelectedDepartment(d)}
            value={selectedDepartment}
          />
          <Select
            label="Course Levels"
            items={courseLevels}
            onChange={setSelectedLevel}
            value={selectedLevel}
          />
          <div className="flex flex-col gap-4">
            <button
              id="easy-course-find-button"
              onClick={findEasyCourseHandler}
            >
              Find
            </button>
            <Button href="/">Back</Button>
          </div>
        </div>
        <div className="easy-courses-results-container">
          <div className="flex flex-col">
            {easyCoursesMap.size > 0 ? (
              Array.from(easyCoursesMap.entries()).map(
                ([courseKey, courses], index) => (
                  <table
                    className="courses-table"
                    key={`${courseKey}-${index}`}
                  >
                    <thead>
                      <tr>
                        <th
                          id={courseKey}
                          className="course-subject-number-header"
                          colSpan={2}
                        >
                          {courses[0].subj_cd + " " + courses[0].course_nbr}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="courses-entries-header-row">
                        <th>Instructor</th>
                        <th>Average GPA</th>
                      </tr>
                      {courses.map((course, index) => (
                        <tr
                          className="courses-entries-row"
                          key={`${courseKey}-${index}`}
                        >
                          <th>{course.instructor}</th>
                          <th
                            style={{
                              backgroundColor: getGpaColor(course.avg_gpa),
                            }}
                          >
                            {course.avg_gpa.toFixed(2)}
                          </th>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )
            ) : (
              <p>No entries</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
