import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const yearRouter = express.Router();

// full route would be 'http://localhost:3001/years"
// sends full list of years
yearRouter.get("/", (req: Request, res: Response) => {
  const { s, d } = req.query;

  const term = db
    .prepare(
      `
      SELECT DISTINCT s.year 
      FROM semesters AS s
      JOIN courses as c
      ON c.semester_id = s.id
      WHERE c.subj_cd = ? AND c.dept_name = ?
      ORDER BY year DESC
      `
    )
    .all(s, d) as { year: number }[];

  const years = term.map((r) => r.year);

  if (!years) {
    return res.status(400).json({ error: "DB Error" });
  }

  console.log("year ", years);
  res.json(years);
});
