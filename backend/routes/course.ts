import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const courseRouter = express.Router();

// full route would be 'http://localhost:3001/course?department=_"
// sends list of course numbers given department name
courseRouter.get("/", (req: Request, res: Response) => {
  const { department } = req.query;

  const courses = db
    .prepare(
      `
      SELECT DISTINCT course_nbr 
      FROM courses
      WHERE dept_name = ?
      ORDER BY course_nbr ASC
      `
    )
    .all(department);

  console.log("courses ", courses);

  if (!courses) {
    return res.status(400).json({ error: "DB Error" });
  }

  res.json(courses);
});

// full route would be 'http://localhost:3001/course/exact?dept=_&term=_&year=_&cn=_"
// sends all information as an exact course given its dept, term, year, and course number
// (i.e Computer Science 484 Fall 2025)
courseRouter.get("/exact", (req: Request, res: Response) => {
  const { dept, term, year, cn } = req.query;

  if (!dept || !term || !year || !cn) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  const course = db
    .prepare(
      `
      SELECT c.*, s.season, s.year
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.subj_cd = ? AND c.course_nbr = ? AND s.season = ? AND s.year = ?
      `
    )
    .all(dept, cn, term.toString().toUpperCase(), year);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  console.log(course);

  res.json(course);
});
