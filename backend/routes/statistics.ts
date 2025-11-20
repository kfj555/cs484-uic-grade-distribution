import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const statisticsRouter = express.Router();

statisticsRouter.get("/", (req: Request, res: Response) => {
  res.json([]);
});

statisticsRouter.get("/easy", (req: Request, res: Response) => {
  const { department, subj, level } = req.query;
  // Normalize and validate level to avoid producing `undefined%`.
  const stringLevel = String(level).trim();
  let dbCourseLevel: string;
  if (stringLevel === "all") {
    dbCourseLevel = "%";
  } else {
    dbCourseLevel = `${stringLevel.at(0)}%`;
  }
  const rows = db
    .prepare(
      `
      SELECT c.subj_cd,
        c.course_nbr,
        c.instructor,
        ROUND( ( (4.0 * c.A + 3.0 * c.B + 2.0 * c.C + c.D) / (c.grade_regs - c.W) ), 2) AS avg_gpa
      FROM courses c
      JOIN semesters s ON c.semester_id = s.id
      WHERE c.dept_name = ? AND 
            c.subj_cd = ? AND
            c.course_nbr LIKE ?
      GROUP BY c.subj_cd,
              c.course_nbr,
              c.instructor
      HAVING avg_gpa >= 3
      ORDER BY c.course_nbr ASC, avg_gpa DESC
      `
    )
    .all(department, subj, dbCourseLevel) as {
    subj_cd: string;
    course_nbr: string;
    instructor: string;
    avg_gpa: number;
  }[];

  if (!rows) {
    return res.status(400).json({ error: "DB Error" });
  }

  console.log("easy courses", department, subj, level, rows);

  res.json(rows);
});
