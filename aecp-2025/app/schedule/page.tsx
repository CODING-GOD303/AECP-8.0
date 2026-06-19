"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StarField from "@/components/Stars-bg";

type ScheduleEvent = {
  id: string;
  day: number;
  time_start: string;
  time_end: string;
  title: string;
  description: string;
  location: string;
  category: string;
  type: string;
};

export default function Schedule() {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    async function fetchSchedule() {
      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("day", { ascending: true })
        .order("time_start", { ascending: true });

      if (!error && data) setEvents(data);
      setLoading(false);
    }
    fetchSchedule();
  }, []);

  const day1 = events.filter((e) => e.day === 1);
  const day2 = events.filter((e) => e.day === 2);
  const currentDayEvents = activeDay === 1 ? day1 : day2;

  const typeColors: Record<string, string> = {
    general:     "rgba(185,167,228,0.2)",
    competition: "rgba(242,211,122,0.15)",
    ceremony:    "rgba(107,128,111,0.2)",
    break:       "rgba(75,59,110,0.2)",
  };

  const typeText: Record<string, string> = {
    general:     "#B9A7E4",
    competition: "#F2D37A",
    ceremony:    "#6B806F",
    break:       "rgba(247,242,228,0.3)",
  };

  return (
    <>
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 15%, #2f1f52 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 10%, #1a2e20 0%, transparent 55%),
            linear-gradient(145deg, #0f0c1a 0%, #1e1628 45%, #111a13 100%)
          `,
        }}
      />
      <div className="fixed -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-[90px] bg-mystic-purple/35 animate-float pointer-events-none z-0" />
      <div className="fixed top-1/4 -right-20 w-[300px] h-[300px] rounded-full blur-[90px] bg-forest-green/30 animate-float pointer-events-none z-0" style={{ animationDelay: "-4s" }} />

      <StarField />

      <div className="relative z-5" style={{ minHeight: "calc(100vh - 77px)", padding: "64px 64px 80px" }}>

        {/* HEADER */}
        <div className="text-center mb-14">
          <div className="font-cinzel text-[0.65rem] tracking-[0.3em] uppercase text-wisteria mb-4" style={{ opacity: 0.75 }}>
            ✦ Competition Timeline ✦
          </div>
          <h1 className="font-cinzel-deco font-bold mb-3" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            <span className="bg-gradient-to-br from-warm-cream to-lilac-mist bg-clip-text text-transparent">
              Event Schedule
            </span>
          </h1>
          <p className="font-raleway font-light text-warm-cream/45 text-sm max-w-lg mx-auto">
            Full timeline of AECP 2025 — sessions, ceremonies, and competition rounds.
          </p>
        </div>

        {/* DAY TABS */}
        <div className="flex justify-center mb-12" style={{ gap: "12px" }}>
          {[1, 2].map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className="font-cinzel tracking-[0.15em] uppercase rounded-full transition-all"
              style={{
                padding: "12px 36px",
                fontSize: "0.78rem",
                background: activeDay === day
                  ? "linear-gradient(135deg, #4B3B6E, #8773C6)"
                  : "rgba(75,59,110,0.2)",
                color: activeDay === day ? "#F7F2E4" : "rgba(247,242,228,0.4)",
                border: activeDay === day ? "1px solid rgba(185,167,228,0.5)" : "1px solid rgba(185,167,228,0.15)",
                boxShadow: activeDay === day ? "0 0 24px rgba(135,115,198,0.3)" : "none",
              }}
            >
              Day {day}
            </button>
          ))}
        </div>

        {/* TIMELINE */}
        {loading ? (
          <div className="text-center font-cinzel text-warm-cream/30 text-sm" style={{ padding: "80px" }}>
            Loading schedule...
          </div>
        ) : currentDayEvents.length === 0 ? (
          <div className="text-center" style={{ padding: "80px" }}>
            <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔮</div>
            <div className="font-cinzel text-warm-cream/30 text-sm tracking-widest uppercase">
              Schedule coming soon
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto relative">
            {/* Timeline line */}
            <div
              className="absolute left-[88px] top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(180deg, transparent, rgba(185,167,228,0.2) 10%, rgba(185,167,228,0.2) 90%, transparent)" }}
            />

            <div className="flex flex-col" style={{ gap: "8px" }}>
              {currentDayEvents.map((event, i) => (
                <div key={event.id} className="flex items-start" style={{ gap: "24px" }}>

                  {/* TIME */}
                  <div className="text-right flex-shrink-0" style={{ width: "72px", paddingTop: "18px" }}>
                    <div className="font-cinzel text-[0.65rem] font-medium text-royal-gold" style={{ letterSpacing: "0.05em" }}>
                      {event.time_start}
                    </div>
                    <div className="font-cinzel text-[0.55rem] text-warm-cream/25" style={{ letterSpacing: "0.05em" }}>
                      {event.time_end}
                    </div>
                  </div>

                  {/* DOT */}
                  <div className="flex-shrink-0 relative" style={{ paddingTop: "22px" }}>
                    <div
                      className="rounded-full"
                      style={{
                        width: "10px",
                        height: "10px",
                        background: typeText[event.type] || "#B9A7E4",
                        boxShadow: `0 0 8px ${typeText[event.type] || "#B9A7E4"}`,
                      }}
                    />
                  </div>

                  {/* EVENT CARD */}
                  <div
                    className="flex-1 rounded-xl border border-wisteria/15 transition-all hover:border-wisteria/35"
                    style={{
                      padding: "16px 20px",
                      background: typeColors[event.type] || "rgba(75,59,110,0.2)",
                      marginBottom: "4px",
                    }}
                  >
                    <div className="flex items-start justify-between" style={{ gap: "12px" }}>
                      <div>
                        <div className="font-cinzel font-semibold text-warm-cream mb-1" style={{ fontSize: "0.88rem" }}>
                          {event.title}
                        </div>
                        {event.description && (
                          <div className="font-raleway text-warm-cream/45 font-light" style={{ fontSize: "0.78rem", lineHeight: 1.6 }}>
                            {event.description}
                          </div>
                        )}
                        {event.location && (
                          <div className="font-cinzel text-warm-cream/30 mt-2" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>
                            📍 {event.location}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end flex-shrink-0" style={{ gap: "6px" }}>
                        {event.type && (
                          <span
                            className="font-cinzel rounded-full"
                            style={{
                              padding: "3px 10px",
                              fontSize: "0.55rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              background: typeColors[event.type] || "rgba(185,167,228,0.15)",
                              color: typeText[event.type] || "#B9A7E4",
                              border: `1px solid ${typeText[event.type]}30`,
                            }}
                          >
                            {event.type}
                          </span>
                        )}
                        {event.category && (
                          <span
                            className="font-cinzel rounded-full"
                            style={{
                              padding: "3px 10px",
                              fontSize: "0.55rem",
                              letterSpacing: "0.1em",
                              textTransform: "uppercase",
                              background: "rgba(242,211,122,0.1)",
                              color: "#F2D37A",
                              border: "1px solid rgba(242,211,122,0.2)",
                            }}
                          >
                            {event.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-5 border-t border-wisteria/20 flex items-center justify-between bg-deep-charcoal/50 backdrop-blur-md" style={{ padding: "24px 56px" }}>
        <div className="font-cinzel text-[0.6rem] tracking-[0.15em] text-warm-cream/30">© 2025 AECP · Politeknik Negeri Bandung</div>
        <div className="flex gap-8">
          {["Contact", "About", "Privacy"].map((link) => (
            <a key={link} href="#" className="text-[0.6rem] tracking-[0.1em] uppercase text-warm-cream/30 hover:text-wisteria no-underline transition-colors">{link}</a>
          ))}
        </div>
      </footer>
    </>
  );
}