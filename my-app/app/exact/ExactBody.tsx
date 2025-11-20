"use client";
import { useEffect, useState } from "react";
import { useStore } from "../store";
import Button from "../_components/Button";
import Select from "../_components/Select";
import SearchableSelect from "../_components/SearchableSelect";
import Card from "../_components/Card";

export default function ExactBody() {
  const {
    department,
    setDepartment,
    year,
    setYear,
    term,
    setTerm,
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

  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  // initial fetch sets all selections with persistence
  useEffect(() => {
    const fetchInitialData = async () => {
      const deptsRes = await fetch(`${BASE}/department`);
      // const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
      // await delay(1000); // artificial delay for loading demo
      const depts: { subj_cd: string; dept_name: string }[] = (
        await deptsRes.json()
      ).slice(1); // removes empty dept at start
      if (!depts.length) return;

      setDepartments(depts);

      // searches for saved department, otherwise defaults to first
      const deptMatch = depts.find(
        (d) => d.subj_cd === subj && d.dept_name === department
      );
      const currentDept = deptMatch ?? depts[0];

      setDepartment(currentDept.dept_name);
      setSubj(currentDept.subj_cd);

      // fetch years
      const yearsRes = await fetch(
        `${BASE}/year?s=${encodeURIComponent(
          currentDept.subj_cd
        )}&d=${encodeURIComponent(currentDept.dept_name)}`
      );
      const yearsData = await yearsRes.json();
      setYears(yearsData);

      // either saved year or most recent year
      const currentYear = yearsData.includes(year) ? year : yearsData[0];
      setYear(currentYear);

      // fetch terms
      const termsRes = await fetch(
        `${BASE}/semesters?department=${encodeURIComponent(
          currentDept.dept_name
        )}&subj=${encodeURIComponent(
          currentDept.subj_cd
        )}&year=${encodeURIComponent(currentYear)}`
      );
      const termsData = await termsRes.json();
      setTerms(termsData);

      // either saved term or most recent term
      const currentTerm = termsData.includes(term) ? term : termsData[0];
      setTerm(currentTerm);

      // fetch courses
      const coursesRes = await fetch(
        `${BASE}/semesters/courses?subj=${encodeURIComponent(
          currentDept.subj_cd
        )}&department=${encodeURIComponent(
          currentDept.dept_name
        )}&year=${encodeURIComponent(currentYear)}&season=${encodeURIComponent(
          currentTerm
        )}`
      );
      const coursesData = await coursesRes.json();
      setCourseNumbers(coursesData);

      // either saved course or first course
      const currentCourse = coursesData.includes(courseNumber)
        ? courseNumber
        : coursesData[0];
      setCourseNumber(currentCourse);
    };
    const run = async () => {
      await fetchInitialData();
      setLoaded(true);
    };
    run();
  }, []);

  // fetch years available for department
  useEffect(() => {
    if (!loaded || !subj || !department) return;

    const fetchYears = async () => {
      const res = await fetch(
        `${BASE}/year?s=${encodeURIComponent(subj)}&d=${encodeURIComponent(
          department
        )}`
      );
      const data = await res.json();
      setYears(data);
      const newYear = data.includes(year) ? year : data[0];
      setYear(newYear);
    };

    fetchYears();
  }, [subj, department, loaded]);

  // fetch terms available for department and year
  useEffect(() => {
    if (!loaded || !subj || !year || !department) return;

    const fetchTerms = async () => {
      const res = await fetch(
        `${BASE}/semesters?department=${encodeURIComponent(
          department
        )}&subj=${encodeURIComponent(subj)}&year=${encodeURIComponent(year)}`
      );
      const data = await res.json();
      setTerms(data);
      const newTerm = data.includes(term) ? term : data[0];
      setTerm(newTerm);
    };

    fetchTerms();
  }, [subj, year, department, loaded]);

  // fetch course numbers available for department, year, and term
  useEffect(() => {
    if (!loaded || !subj || !year || !term || !department) return;

    const fetchCourses = async () => {
      const res = await fetch(
        `${BASE}/semesters/courses?subj=${encodeURIComponent(
          subj
        )}&department=${encodeURIComponent(
          department
        )}&year=${encodeURIComponent(year)}&season=${encodeURIComponent(term)}`
      );
      const data = await res.json();
      setCourseNumbers(data);
      const newCourse = data.includes(courseNumber) ? courseNumber : data[0];
      setCourseNumber(newCourse);
    };

    fetchCourses();
  }, [subj, year, term, department, loaded]);

  // used to determine loading state
  const loadingYears = years.length === 0;
  const loadingTerms = terms.length === 0;
  const loadingCourses = courseNumbers.length === 0;

  return (
    <div>
      <Card>
        {/* Searchbar for departments */}
        {departments.length > 0 ? (
          <SearchableSelect
            label="Departments"
            items={departments}
            value={
              departments.find(
                (d) => d.subj_cd === subj && d.dept_name === department
              ) ?? departments[0]
            } // initial value either saved or first
            getOptionText={(d) => `${d.dept_name} - ${d.subj_cd}`} // format for the options list
            onChange={(d) => {
              setDepartment(d.dept_name);
              setSubj(d.subj_cd);
            }}
          />
        ) : (
          <Select label="Departments" items={[]} loading={true} />
        )}
        {/* Select bar for year, terms/seasons, and course numbers */}
        <Select
          label="Year"
          items={years}
          value={year}
          onChange={setYear}
          loading={loadingYears}
        />
        <Select
          label="Terms"
          items={terms}
          value={term}
          onChange={setTerm}
          loading={loadingTerms}
        />
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
            href={`./graph?d=${subj}&t=${term}&y=${year}&n=${courseNumber}`}
          >
            Get Graph
          </Button>
        </div>
      </Card>
    </div>
  );
}
