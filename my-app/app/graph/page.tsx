// "use client";
import GraphBody from "./GraphBody";

export default async function Graph({
  searchParams,
}: {
  searchParams: { d: string; t: string; y: number; n: number };
}) {
  // department, term, year, and (course) number given from prev page
  const { d, t, y, n } = await searchParams;
  const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

  const res = await fetch(
    `${BASE}/course/exact?dept=${d}&cn=${n}&term=${t}&year=${y}`
  );

  const data = await res.json();
  console.log(data);
  const error = data.length === 0 ? 1 : 0; // TODO: create a full error page/component

  console.log(data);

  return (
    <div className="flex flex-col justify-center items-center py-10">
      {error === 0 && <GraphBody data={data} />}
      {error === 1 && (
        <div className="border">
          <p className="px-10 py-20 font-semibold text-2xl">Course not found</p>
        </div>
      )}
    </div>
  );
}
