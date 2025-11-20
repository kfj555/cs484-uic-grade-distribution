// server.js
import express from "express";
import cors from "cors";
import { courseRouter } from "./routes/course.ts";
import { deptRouter } from "./routes/department.ts";
import { yearRouter } from "./routes/year.ts";
import { semesterRouter } from "./routes/semesters.ts";
import { statisticsRouter } from "./routes/statistics.ts";
import { instructorRouter } from "./routes/instructor.ts";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());

app.use("/course", courseRouter);
app.use("/department", deptRouter);
app.use("/year", yearRouter);
app.use("/semesters", semesterRouter);
app.use("/statistics", statisticsRouter);
app.use("/instructor", instructorRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
