import { Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bankDetails = [
  { label: "Account Name", value: "Karunasindhu" },
  { label: "Bank", value: "Indian Overseas Bank" },
  { label: "Branch", value: "ISKCON Juhu" },
  { label: "Account Number", value: "124501000010370" },
  { label: "IFSC Code", value: "IOBA0001245" },
];

export default function Donate() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-linear-to-b from-slate-50 via-background to-orange-50/40 font-sans text-foreground antialiased">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(70vh,520px)] bg-[radial-gradient(ellipse_70%_55%_at_30%_-5%,rgba(10,37,64,0.14),transparent_55%),radial-gradient(ellipse_65%_50%_at_75%_0%,rgba(251,146,60,0.14),transparent_50%)]"
        aria-hidden
      />
      <header className="relative overflow-hidden border-b border-border/50 bg-linear-to-br from-[#0a2540]/7 via-orange-50/25 to-sky-50/30 backdrop-blur-xl supports-backdrop-filter:bg-white/25">
        <div
          className="pointer-events-none absolute -top-28 left-0 h-96 w-[min(100%,36rem)] rounded-full bg-[#0a2540]/20 blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-20 right-0 h-80 w-80 rounded-full bg-orange-400/20 blur-[95px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-full max-w-3xl -translate-x-1/2 rounded-full bg-sky-400/15 blur-[100px]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pb-16 sm:pt-20 lg:px-8">
          <h1 className="text-balance bg-linear-to-br from-[#0a2540] via-orange-800 to-amber-800 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Donate
          </h1>
        </div>
      </header>

      <section className="relative py-12 sm:py-16 lg:py-20">
        <div
          className="pointer-events-none absolute left-[15%] top-32 h-56 w-56 rounded-full bg-[#0a2540]/12 blur-[80px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[10%] top-20 h-64 w-64 rounded-full bg-orange-400/12 blur-[85px]"
          aria-hidden
        />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Card className="group relative overflow-hidden rounded-2xl border border-white/55 bg-linear-to-br from-sky-50/50 via-white/45 to-orange-50/45 shadow-[0_8px_40px_rgba(10,37,64,0.08),0_8px_32px_rgba(234,88,12,0.06),0_1px_0_rgba(255,255,255,0.65)_inset] ring-1 ring-[#0a2540]/10 backdrop-blur-2xl transition duration-300 hover:shadow-[0_16px_48px_rgba(10,37,64,0.1),0_12px_40px_rgba(234,88,12,0.08),0_1px_0_rgba(255,255,255,0.7)_inset] dark:from-slate-950/50 dark:via-slate-950/35 dark:to-orange-950/25 dark:border-white/10 dark:ring-white/10">
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#0a2540]/6 via-transparent to-orange-300/15 opacity-90"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-400/18 blur-3xl transition duration-500 group-hover:bg-orange-400/25"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-16 h-52 w-52 rounded-full bg-[#0a2540]/15 blur-3xl"
                aria-hidden
              />
              <CardHeader className="relative space-y-0 pb-2 pt-8 sm:px-8 sm:pt-10">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0a2540]/15 bg-linear-to-br from-[#0a2540]/10 to-orange-500/10 text-[#0a2540] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-md transition group-hover:border-orange-300/40 group-hover:from-[#0a2540]/12 group-hover:to-orange-500/14 dark:border-sky-400/25 dark:from-sky-400/15 dark:to-orange-400/10 dark:text-sky-100">
                  <Landmark className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </div>
                <CardTitle className="text-xl font-semibold tracking-tight text-[#0a2540] sm:text-2xl dark:text-orange-50/95">
                  Donate via NEFT / RTGS
                </CardTitle>
              </CardHeader>
              <CardContent className="relative space-y-0 px-6 pb-8 pt-2 sm:px-8 sm:pb-10">
                <dl className="divide-y divide-[#0a2540]/10 dark:divide-orange-500/20">
                  {bankDetails.map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                    >
                      <dt className="shrink-0 text-sm font-semibold text-[#0a2540]/55 dark:text-orange-200/65">
                        {item.label}
                      </dt>
                      <dd
                        className={`text-sm font-medium text-foreground sm:text-right ${
                          item.label === "Account Number" ||
                          item.label === "IFSC Code"
                            ? "tabular-nums tracking-wide"
                            : ""
                        }`}
                      >
                        {item.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* <div className="bg-muted p-4 rounded-xl text-sm">
            <p>
              After making the transfer, please send a screenshot along with
              your name and address to{" "}
              <span className="font-medium text-primary">
                donations@vyasapuja.com
              </span>{" "}
              for a digital receipt.
            </p>
          </div> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
