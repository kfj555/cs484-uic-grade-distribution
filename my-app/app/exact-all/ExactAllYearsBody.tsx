"use client";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import Button from "../_components/Button";
import Select from "../_components/Select";
import SearchableSelect from "../_components/SearchableSelect";
import Card from "../_components/Card";

export default function ExactAllYearsBody() {
  const {
    department,
    setDepartment,
    courseNumber,
    setCourseNumber,
    subj,
    setSubj,
    departments,
    setDepartments,
    years,
    setYears,
    terms,
    setTerms,
    courseNumbers,
    setCourseNumbers,
  } = useStore();

  const [loaded, setLoaded] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  // build unique course numbers across all available years/terms
  const buildAllCourseNumbers = async (subjCd: string, deptName: string) => {
    setLoadingCourses(true);
    try {
      const yearsRes = await fetch(
        `${BASE}/year?s=${encodeURIComponent(subjCd)}&d=${encodeURIComponent(
          deptName
        )}`
      );
      const yearsData: number[] = await yearsRes.json();
      setYears(yearsData);

      // fetch terms for each year
      const termsPerYear = await Promise.all(
        yearsData.map(async (y) => {
          const res = await fetch(
            `${BASE}/semesters?department=${encodeURIComponent(
              deptName
            )}&subj=${encodeURIComponent(subjCd)}&year=${encodeURIComponent(y)}`
          );
          const t = await res.json();
          return { year: y, terms: t as string[] };
        })
      );
      const allCourses = new Set<string>();

      // fetch course numbers per (year, term)
      for (const yt of termsPerYear) {
        await Promise.all(
          yt.terms.map(async (season) => {
            const res = await fetch(
              `${BASE}/semesters/courses?subj=${encodeURIComponent(
                subjCd
              )}&department=${encodeURIComponent(
                deptName
              )}&year=${encodeURIComponent(yt.year)}&season=${encodeURIComponent(
                season
              )}`
            );
            const list: string[] = await res.json();
            list.forEach((cn) => allCourses.add(String(cn)));
          })
        );
      }

      const sorted = Array.from(allCourses).sort((a, b) => a.localeCompare(b));
      setCourseNumbers(sorted);
      if (sorted.length && !sorted.includes(courseNumber)) {
        setCourseNumber(sorted[0]);
      }
    } finally {
      setLoadingCourses(false);
    }
  };

  // Initial load: departments and initial course numbers
  useEffect(() => {
    const run = async () => {
      const deptsRes = await fetch(`${BASE}/department`);
      const depts: { subj_cd: string; dept_name: string }[] = (
        await deptsRes.json()
      ).slice(1);
      if (!depts.length) return;

      setDepartments(depts);

      const current =
        depts.find((d) => d.subj_cd === subj && d.dept_name === department) ??
        depts[0];
      setDepartment(current.dept_name);
      setSubj(current.subj_cd);

      await buildAllCourseNumbers(current.subj_cd, current.dept_name);
      setLoaded(true);
    };
    run();
  }, []);

  // When department changes, rebuild course numbers list
  useEffect(() => {
    if (!loaded || !subj || !department) return;
    buildAllCourseNumbers(subj, department);
  }, [subj, department, loaded]);

  return (
    <div>
      <Card>
        {departments.length > 0 ? (
          <SearchableSelect
            label="Departments"
            items={departments}
            value={
              departments.find(
                (d) => d.subj_cd === subj && d.dept_name === department
              ) ?? departments[0]
            }
            getOptionText={(d) => `${d.dept_name} - ${d.subj_cd}`}
            onChange={(d) => {
              setDepartment(d.dept_name);
              setSubj(d.subj_cd);
            }}
          />
        ) : (
          <Select label="Departments" items={[]} loading={true} />
        )}

        <Select
          label="Course Numbers"
          items={courseNumbers}
          value={courseNumber}
          onChange={setCourseNumber}
          loading={loadingCourses}
        />

        <div className="flex justify-evenly">
          <Button href="./">Back</Button>
          <Button
            href={`/graph-all?d=${encodeURIComponent(
              subj
            )}&dp=${encodeURIComponent(department)}&n=${encodeURIComponent(
              courseNumber
            )}`}
          >
            Get Graph
          </Button>
        </div>
      </Card>
    </div>
  );
}
