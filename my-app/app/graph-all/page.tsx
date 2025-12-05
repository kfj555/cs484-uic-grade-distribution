import GraphAllBody from "./GraphAllBody";
import { Course } from "@/app/types";

export default async function GraphAll({
  searchParams,
}: {
  searchParams: { d: string; dp: string; n: string };
}) {
  const { d, dp, n } = await searchParams;
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  // fetch years for this department
  const yearsRes = await fetch(
    `${BASE}/year?s=${encodeURIComponent(d)}&d=${encodeURIComponent(dp)}`
  );
  const years: number[] = await yearsRes.json();

  // fetch terms for each year
  const allTerms = await Promise.all(
    years.map(async (y) => {
      const tr = await fetch(
        `${BASE}/semesters?department=${encodeURIComponent(
          dp
        )}&subj=${encodeURIComponent(d)}&year=${encodeURIComponent(y)}`
      );
      const terms: string[] = await tr.json();
      return { year: y, terms };
    })
  );

  // for each (year, term), check if course number exists, then fetch details
  const courseFetches: Promise<Course[] | Course | []>[] = [];
  for (const { year, terms } of allTerms) {
    for (const term of terms) {
      // check available course numbers first
      const cnListRes = await fetch(
        `${BASE}/semesters/courses?subj=${encodeURIComponent(
          d
        )}&department=${encodeURIComponent(dp)}&year=${encodeURIComponent(
          year
        )}&season=${encodeURIComponent(term)}`
      );
      const cnList: string[] = await cnListRes.json();
      if (!cnList.includes(String(n))) continue;

      courseFetches.push(
        fetch(
          `${BASE}/course/exact?dept=${encodeURIComponent(d)}&cn=${encodeURIComponent(
            n
          )}&term=${encodeURIComponent(term)}&year=${encodeURIComponent(year)}`
        ).then((r) => r.json())
      );
    }
  }

  const results = await Promise.all(courseFetches);
  const data: Course[] = results.flat() as Course[];

  const error = data.length === 0 ? 1 : 0;

  return (
    <div className="flex flex-col justify-center items-center py-10">
      {error === 0 && <GraphAllBody data={data} />}
      {error === 1 && (
        <div className="border">
          <p className="px-10 py-20 font-semibold text-2xl">Course not found</p>
        </div>
      )}
    </div>
  );
}
