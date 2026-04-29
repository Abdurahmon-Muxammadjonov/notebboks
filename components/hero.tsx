import { ChevronLeft, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 pb-8 pt-0">
      <div className="relative overflow-hidden bg-[#070707] text-white">
        <button className="absolute left-0 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-r-full bg-white/10 text-white/90 backdrop-blur-sm">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className="absolute right-0 top-1/2 z-10 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-l-full bg-white/10 text-white/90 backdrop-blur-sm">
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="grid min-h-[408px] grid-cols-1 lg:grid-cols-[1.05fr_1.45fr]">
          <div className="relative flex flex-col justify-center px-10 py-12 lg:px-14">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-[18px] border border-white/10 bg-[#a30815] shadow-[0_0_40px_rgba(163,8,21,0.45)]">
                <span className="text-3xl font-black text-white">🐉</span>
              </div>
              <span className="text-7xl font-black italic leading-none tracking-tight">msi</span>
            </div>

            <div className="mb-5 inline-flex w-fit items-center border border-white/70 px-3 py-1 text-[13px] font-semibold tracking-[0.25em] text-white/90">
              EOFY DEAL
            </div>

            <h1 className="max-w-[560px] text-[38px] font-extrabold uppercase leading-[1.05] tracking-tight md:text-[56px]">
              Score A Bonus Gaming Monitor
            </h1>

            <p className="mt-4 max-w-[620px] text-[18px] font-medium uppercase tracking-wide text-white/90 md:text-[20px]">
              When you buy any selected MSI gaming desktop
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button className="bg-white px-7 py-3 text-[18px] font-black text-black shadow-lg transition hover:bg-slate-100">
                SHOP NOW
              </button>
              <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-white/80">
                Valid from May 12 – Sep 7, 2020 or while stocks last.
              </p>
            </div>
          </div>

          <div className="relative hidden min-h-[408px] lg:block">
            <div className="absolute inset-0 bg-radial-[at_25%_70%] from-white/25 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-white/10" />

            <div className="absolute left-8 top-24 rotate-[-8deg] bg-[#fa3349] px-5 py-3 text-center text-[18px] font-black uppercase leading-none tracking-[0.16em] text-white shadow-2xl">
              <div>Worth Up</div>
              <div>To $599AU</div>
            </div>

            <div className="absolute right-12 top-10 w-[120px] rounded-sm bg-white/95 px-4 py-3 text-center text-black shadow-2xl">
              <div className="text-[15px] font-black uppercase tracking-wider text-slate-500">intel</div>
              <div className="mt-1 text-4xl font-black leading-none">CORE i9</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">10th Gen</div>
              <div className="mt-4 text-[15px] font-semibold leading-tight text-slate-700">Intel® Core™ i9 processor</div>
            </div>

            <div className="absolute bottom-10 left-22 flex items-end gap-8">
              <div className="h-28 w-16 rounded-full border border-white/15 bg-linear-to-b from-zinc-900 to-zinc-700 shadow-[0_0_40px_rgba(255,255,255,0.12)]" />
              <div className="h-44 w-[220px] rounded-t-[18px] rounded-b-[10px] border border-white/10 bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-700 shadow-[0_0_60px_rgba(255,255,255,0.08)]">
                <div className="mx-auto mt-3 h-2 w-28 rounded-full bg-zinc-700" />
                <div className="mx-auto mt-4 flex h-[130px] w-[190px] items-center justify-center rounded-[8px] border border-red-500/30 bg-linear-to-br from-black via-zinc-900 to-red-950 shadow-[inset_0_0_50px_rgba(255,0,0,0.25)]">
                  <div className="text-center">
                    <div className="text-5xl font-black uppercase text-red-500/90">🐉</div>
                    <div className="mt-2 text-lg font-black uppercase tracking-[0.25em] text-red-400">msi</div>
                  </div>
                </div>
                <div className="mx-auto mt-2 h-2 w-10 rounded-full bg-zinc-500" />
              </div>
              <div className="relative h-[300px] w-[210px] skew-y-[-6deg] rounded-[10px] border border-white/10 bg-linear-to-b from-zinc-800 via-zinc-900 to-black shadow-[0_0_80px_rgba(255,255,255,0.08)]">
                <div className="absolute left-10 top-10 h-24 w-20 rounded-md border border-white/10 bg-zinc-700/60" />
                <div className="absolute bottom-12 right-6 h-24 w-9 rounded-full bg-black shadow-[inset_-6px_0_12px_rgba(255,0,0,0.6)]" />
              </div>
            </div>

            <div className="absolute bottom-5 left-16 right-10 h-16 bg-radial-[ellipse_at_center] from-white/35 via-white/10 to-transparent blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
