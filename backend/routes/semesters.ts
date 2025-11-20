import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const semesterRouter = express.Router();

// full route would be 'http://localhost:3001/semesters"
// sends semester seasons for a given department and year
// Ex: localhost:3001/semesters?department=Computer%20Science&year=2025
// returns ['SP', 'SU'] at time of writing since Fall 2025 has not concluded
semesterRouter.get("/", (req: Request, res: Response) => {
  const { department, year, subj } = req.query;
  console.log(department, subj, year);
  const rows = db
    .prepare(
      `
        SELECT s.season
        FROM courses c
        JOIN semesters s ON c.semester_id = s.id
        WHERE c.subj_cd = ? AND c.dept_name = ? AND s.year = ?
        GROUP BY semester_id
        ORDER BY s.season ASC;
      `
    )
    .all(subj, department, year) as { season: string }[];

  const semesters = rows.map((r) => r.season);
  if (!semesters) {
    return res.status(400).json({ error: "DB Error" });
  }

  console.log("semesters:", semesters);

  res.json(semesters);
});

// returns available course numbers for a given department, year, and season
semesterRouter.get("/courses", (req: Request, res: Response) => {
  const { subj, department, year, season } = req.query;

  const rows = db
    .prepare(
      `
        SELECT DISTINCT course_nbr from courses c
        Join semesters s on c.semester_id = s.id
        Where c.dept_name = ? AND c.subj_cd = ? and s.year = ? and s.season = ?
        Order by c.course_nbr ASC;
      `
    )
    .all(department, subj, year, season) as { course_nbr: string }[];
  const courseNumbers = rows.map((r) => r.course_nbr);

  console.log(
    "ddd: ",
    `subj=${subj}&department=${department}&year=${year}&season=${season}`
  );
  console.log("cnusm: ", courseNumbers);

  if (!courseNumbers) {
    return res.status(400).json({ error: "DB Error" });
  }
  res.json(courseNumbers);
});
