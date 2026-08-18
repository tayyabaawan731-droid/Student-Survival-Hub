import { MemphisBackdrop, MemphisMark } from "@/components/MemphisMark";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowRight, BookOpenCheck, CalendarDays, Search, UsersRound } from "lucide-react";
import { useLocation } from "wouter";

const features = [
  { icon: BookOpenCheck, title: "Notes that travel", text: "Share class notes, find the right subject, and download the material you need." },
  { icon: UsersRound, title: "Your study circle", text: "Create a focused group or join students working through the same subject." },
  { icon: CalendarDays, title: "A calmer week", text: "Keep classes and deadlines together, so nothing important slips through." },
];

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const goToWorkspace = () => {
    if (isAuthenticated) setLocation("/app");
    else startLogin();
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#ffdfcf] text-black">
      <MemphisBackdrop />
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 md:px-10">
        <button onClick={() => setLocation("/")} className="flex items-center gap-3 text-left" aria-label="Go to the home page">
          <span className="grid h-11 w-11 place-items-center rounded-[14px] border-2 border-black bg-[#c6f6e7] font-black shadow-[4px_4px_0_#000]">S</span>
          <span className="font-display text-lg font-black uppercase tracking-tight">Student<br className="sm:hidden" /> Survival Hub</span>
        </button>
        <Button onClick={goToWorkspace} disabled={loading} className="memphis-button hidden sm:inline-flex">
          {isAuthenticated ? "Open my hub" : "Sign in"}<ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-8 md:px-10 md:pb-24 md:pt-14">
        <section className="grid items-center gap-14 lg:grid-cols-[1.15fr_.85fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-black bg-[#fff7ef] px-4 py-2 text-xs font-black uppercase tracking-[.16em] shadow-[3px_3px_0_#000]">
              <span className="h-2 w-2 rounded-full bg-[#ff8e72]" /> One place. Your pace.
            </div>
            <h1 className="font-display text-5xl font-black uppercase leading-[.88] tracking-[-.065em] text-black drop-shadow-[4px_4px_0_#fff7ef] sm:text-6xl md:text-8xl">
              Survive the <span className="relative inline-block text-[#6046a6]">semester<span className="absolute -bottom-3 left-0 h-2 w-full -rotate-2 bg-[#ffe46a]" /></span> in style.
            </h1>
            <p className="mt-8 max-w-xl text-lg font-medium leading-8 text-black/75 md:text-xl">
              Your bright little corner for notes, study friends, class schedules, deadlines, and campus lost-and-found.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button onClick={goToWorkspace} disabled={loading} className="memphis-button text-base">
                {isAuthenticated ? "Go to dashboard" : "Start your hub"}<ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="font-black uppercase tracking-wide underline decoration-2 underline-offset-4">
                See what’s inside
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="rotate-2 rounded-[28px] border-[3px] border-black bg-[#fffaf4] p-5 shadow-[10px_10px_0_#000]">
              <div className="flex items-center justify-between border-b-2 border-black pb-4">
                <div><p className="font-display text-xl font-black uppercase">Today’s tiny wins</p><p className="mt-1 text-xs font-bold text-black/60">Tuesday · 3 things lined up</p></div>
                <MemphisMark />
              </div>
              <div className="space-y-3 py-5">
                <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-[#c6f6e7] p-3"><span className="grid h-9 w-9 place-items-center rounded-lg border-2 border-black bg-white font-black">09</span><div><p className="font-black">Data Structures</p><p className="text-xs font-semibold">Room B-204 · 09:00–10:30</p></div></div>
                <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-[#e8ddff] p-3"><span className="h-5 w-5 rounded-full border-2 border-black bg-[#8f6eea]" /><div><p className="font-black">Algorithms assignment</p><p className="text-xs font-semibold">Due Friday · High priority</p></div></div>
                <div className="flex items-center gap-3 rounded-xl border-2 border-black bg-[#ffe46a] p-3"><Search className="h-5 w-5" /><div><p className="font-black">New notes: Linear Algebra</p><p className="text-xs font-semibold">Uploaded by a classmate</p></div></div>
              </div>
              <div className="rounded-xl border-2 border-dashed border-black p-3 text-center text-xs font-black uppercase tracking-wider">Make student life feel possible</div>
            </div>
            <span className="absolute -right-8 -top-7 h-20 w-20 rounded-full border-2 border-black bg-[#ffe46a]" />
            <span className="absolute -bottom-6 -left-10 h-16 w-16 rotate-12 border-2 border-black bg-[#b8e8ff]" />
          </div>
        </section>

        <section id="features" className="mt-24 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className={`memphis-card ${index === 1 ? "md:-translate-y-4" : ""}`}>
              <div className="mb-6 flex items-center justify-between"><span className="grid h-12 w-12 place-items-center rounded-xl border-2 border-black bg-white"><Icon className="h-6 w-6" /></span><span className="font-display text-4xl font-black text-black/20">0{index + 1}</span></div>
              <h2 className="font-display text-2xl font-black uppercase leading-none">{title}</h2><p className="mt-3 font-medium leading-6 text-black/70">{text}</p>
            </article>
          ))}
        </section>
      </main>
      <footer className="relative z-10 border-t-2 border-black bg-black px-5 py-5 text-center text-sm font-semibold text-[#fff7ef]">Made for deadline dodgers, group-study planners, and every student in between.</footer>
    </div>
  );
}
