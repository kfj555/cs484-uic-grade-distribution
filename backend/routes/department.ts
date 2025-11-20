import express from "express";
import type { Request, Response } from "express";
import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "data", "courses.db");
const db = new Database(dbPath, { readonly: true });

export const deptRouter = express.Router();

// full route would be 'http://localhost:3001/departments"
// sends full list of departments
deptRouter.get("/", (req: Request, res: Response) => {
  const departments = db
    .prepare(
      `
      SELECT DISTINCT subj_cd, dept_name 
      FROM courses 
      ORDER BY dept_name ASC
      `
    )
    .all();

  console.log("departments", departments);

  if (!departments) {
    return res.status(400).json({ error: "DB Error" });
  }

  res.json(departments);
});
