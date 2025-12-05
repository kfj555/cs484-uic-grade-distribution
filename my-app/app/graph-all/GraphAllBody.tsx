"use client";
import { ChartData, Chart as ChartJS, ChartOptions } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Course } from "@/app/types";
import Button from "../_components/Button";
void ChartJS;

const seasonMap: { [key: string]: string } = {
  FA: "Fall",
  SP: "Spring",
  SU: "Summer",
};

const GraphAllBody = ({ data }: { data: Course[] }) => {
  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: "index", intersect: false },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const raw = context.raw as number | null | undefined;
            const value = Number(raw ?? 0);
            const dataset = context.dataset.data as number[];
            const total = dataset.reduce((acc, v) => acc + v, 0);
            const pct = total > 0 ? ` (${Math.round((value / total) * 100)}%)` : "";
            return `${String(context.label ?? "")} : ${value}${pct}`;
          },
        },
      },
      title: { display: false, text: "", font: { size: 22 } },
      legend: { display: false },
    },
    scales: {
      x: { title: { text: "Grade", display: true, font: { size: 16 } } },
      y: {
        title: { text: "# of students", display: true, font: { size: 16 } },
      },
    },
  };

  const title = `${data[0].subj_cd} ${data[0].course_nbr}: ${data[0].title}`;

  return (
    <div className="flex flex-col w-200 gap-7">
      <div>
        <Button href="/exact-all">Back</Button>
        <h1 className="text-lg font-semibold justify-self-center">{title}</h1>
      </div>

      {data.map((course, index) => {
        let labels: string[] = [];
        const dataset = {
          data: [] as number[],
          borderWidth: 1,
          backgroundColor: "rgba(212, 31, 11, .7)",
          borderColor: "rgba(212, 31, 11,.7)",
          borderRadius: 10,
          hoverBackgroundColor: "rgba(212, 31, 11, 1)",
        };
        if (course.A + course.B + course.C + course.D + course.F + course.NR > 0) {
          labels = ["A", "B", "C", "D", "F", "Not Reported"];
          dataset.data = [
            course.A,
            course.B,
            course.C,
            course.D,
            course.F,
            course.NR,
          ];
        } else if (course.S > 0 || course.U > 0) {
          labels = ["S", "U"];
          dataset.data = [course.S, course.U];
        } else {
          labels = ["No Data Available"];
          dataset.data = [0];
        }

        const cData: ChartData<"bar"> = {
          labels,
          datasets: [dataset],
        };

        const { A, B, C, D, F, grade_regs, W, S } = course;

        return (
          <div key={`${course.year}-${course.season}-${index}`} className="border mx-3 p-3">
            <div className="mb-2">
              <h2 className="font-semibold">{`${seasonMap[course.season] ?? course.season} ${course.year}`}</h2>
            </div>
            <Bar data={cData} options={chartOptions} />
            <div className="pl-15">
              <p>Professor: {course.instructor}</p>
              <p>Total Registrations: {grade_regs}</p>
              <p>
                {`Average GPA: ${((4 * A + 3 * B + 2 * C + D) / Math.max(1, grade_regs - W)).toFixed(2)}`}
              </p>
              <p>Withdraws: {W}</p>
              {A + B + C + D + F ? (
                <p title="Pass rate includes letter grades from A-D">
                  Pass Rate: {(((A + B + C + D) / Math.max(1, grade_regs - W)) * 100).toFixed(2)}%
                </p>
              ) : (
                <p title="S is passing, U is not passing">
                  Pass Rate: {((S / Math.max(1, grade_regs - W)) * 100).toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GraphAllBody;
