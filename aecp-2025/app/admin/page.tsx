"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StarField from "@/components/Stars-bg";

type Registration = {
  id: string;
  created_at: string;
  full_name: string;
  student_id: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  category: string;
  notes: string;
};

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

const emptyEvent = {
  day: 1,
  time_start: "",
  time_end: "",
  title: "",
  description: "",
  location: "",
  category: "",
  type: "general",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"registrations" | "schedule">("registrations");

  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filtered, setFiltered] = useState<Registration[]>([]);
  const [loadingReg, setLoadingReg] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDept, setFilterDept] = useState("All");

  // Schedule state
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [loadingSched, setLoadingSched] = useState(true);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);
  const [eventForm, setEventForm] = useState(emptyEvent);
  const [savingEvent, setSavingEvent] = useState(false);
  const [schedDay, setSchedDay] = useState(1);

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push("/admin/login");
    });
  }, [router]);

  // Fetch registrations
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) { setRegistrations(data); setFiltered(data); }
      setLoadingReg(false);
    }
    fetchData();
  }, []);

  // Fetch schedule
  useEffect(() => {
    async function fetchSchedule() {
      const { data, error } = await supabase
        .from("schedule")
        .select("*")
        .order("day", { ascending: true })
        .order("time_start", { ascending: true });
      if (!error && data) setScheduleEvents(data);
      setLoadingSched(false);
    }
    fetchSchedule();
  }, []);

  // Filter registrations
  useEffect(() => {
    let result = registrations;
    if (filterCategory !== "All") result = result.filter((r) => r.category === filterCategory);
    if (filterDept !== "All") result = result.filter((r) => r.department === filterDept);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.student_id.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, filterCategory, filterDept, registrations]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  async function handleDeleteReg(id: string) {
    if (!confirm("Delete this registration?")) return;
    await supabase.from("registrations").delete().eq("id", id);
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  }

  function openNewEvent() {
    setEditingEvent(null);
    setEventForm(emptyEvent);
    setShowEventForm(true);
  }

  function openEditEvent(event: ScheduleEvent) {
    setEditingEvent(event);
    setEventForm({
      day: event.day,
      time_start: event.time_start,
      time_end: event.time_end,
      title: event.title,
      description: event.description,
      location: event.location,
      category: event.category,
      type: event.type,
    });
    setShowEventForm(true);
  }

  async function handleSaveEvent(e: React.FormEvent) {
    e.preventDefault();
    setSavingEvent(true);

    if (editingEvent) {
      const { data, error } = await supabase
        .from("schedule")
        .update(eventForm)
        .eq("id", editingEvent.id)
        .select()
        .single();
      if (!error && data) {
        setScheduleEvents((prev) => prev.map((ev) => ev.id === editingEvent.id ? data : ev));
      }
    } else {
      const { data, error } = await supabase
        .from("schedule")
        .insert([eventForm])
        .select()
        .single();
      if (!error && data) {
        setScheduleEvents((prev) => [...prev, data].sort((a, b) => a.day - b.day || a.time_start.localeCompare(b.time_start)));
      }
    }

    setSavingEvent(false);
    setShowEventForm(false);
    setEditingEvent(null);
    setEventForm(emptyEvent);
  }

  async function handleDeleteEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    await supabase.from("schedule").delete().eq("id", id);
    setScheduleEvents((prev) => prev.filter((e) => e.id !== id));
  }

  const categories = ["All", "Speech", "Debate", "Story Telling", "Essay Writing", "Spelling Bee"];
  const departments = ["All", "Teknik Sipil", "Teknik Mesin", "Teknik Elektro", "Teknik Kimia", "Akuntansi", "Administrasi Niaga", "Teknik Informatika", "Bahasa Inggris"];
  const categoryCounts = ["Speech", "Debate", "Story Telling", "Essay Writing", "Spelling Bee"].map((cat) => ({
    cat, count: registrations.filter((r) => r.category === cat).length,
  }));

  const inputStyle = { padding: "10px 14px", background: "rgba(247,242,228,0.05)" };
  const labelClass = "font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-warm-cream/45";

  return (
    <>
      <div className="fixed inset-0 z-0" style={{ background: `radial-gradient(ellipse 55% 45% at 15% 25%, #2f1f52 0%, transparent 60%), linear-gradient(145deg, #0f0c1a 0%, #1e1628 45%, #111a13 100%)` }} />
      <div className="fixed -top-24 -left-24 w-[380px] h-[380px] rounded-full blur-[90px] bg-mystic-purple/35 animate-float pointer-events-none z-0" />
      <div className="fixed bottom-[10%] -right-16 w-[280px] h-[280px] rounded-full blur-[90px] bg-forest-green/30 animate-float pointer-events-none z-0" style={{ animationDelay: "-4s" }} />
      <StarField />

      <div className="relative z-5" style={{ minHeight: "100vh", padding: "40px 48px" }}>

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="font-cinzel text-[0.65rem] tracking-[0.3em] uppercase text-wisteria mb-2" style={{ opacity: 0.7 }}>✦ Administration Panel</div>
            <div className="font-cinzel-deco font-bold text-[1.8rem] bg-gradient-to-br from-warm-cream to-lilac-mist bg-clip-text text-transparent">AECP 2025</div>
          </div>
          <div className="flex items-center" style={{ gap: "16px" }}>
            <a href="/" className="font-cinzel text-[0.65rem] tracking-[0.12em] uppercase text-warm-cream/30 hover:text-wisteria no-underline transition-colors">← Home</a>
            <a href="/schedule" className="font-cinzel text-[0.65rem] tracking-[0.12em] uppercase text-warm-cream/30 hover:text-wisteria no-underline transition-colors">View Schedule</a>
            <button onClick={handleLogout} className="font-cinzel text-[0.7rem] tracking-[0.14em] uppercase text-warm-cream/50 border border-wisteria/30 rounded-full hover:border-wisteria hover:text-wisteria transition-all" style={{ padding: "8px 20px" }}>Sign Out</button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex mb-8" style={{ gap: "8px" }}>
          {(["registrations", "schedule"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-cinzel tracking-[0.15em] uppercase rounded-full transition-all"
              style={{
                padding: "10px 28px", fontSize: "0.72rem",
                background: activeTab === tab ? "linear-gradient(135deg, #4B3B6E, #8773C6)" : "rgba(75,59,110,0.2)",
                color: activeTab === tab ? "#F7F2E4" : "rgba(247,242,228,0.4)",
                border: activeTab === tab ? "1px solid rgba(185,167,228,0.5)" : "1px solid rgba(185,167,228,0.15)",
                boxShadow: activeTab === tab ? "0 0 20px rgba(135,115,198,0.25)" : "none",
              }}
            >
              {tab === "registrations" ? "📋 Registrations" : "📅 Schedule"}
            </button>
          ))}
        </div>

        {/* ── REGISTRATIONS TAB ── */}
        {activeTab === "registrations" && (
          <>
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8" style={{ gap: "12px" }}>
              <div className="rounded-xl border border-wisteria/20 text-center col-span-2 md:col-span-1" style={{ padding: "20px 16px", background: "rgba(75,59,110,0.3)" }}>
                <div className="font-cinzel-deco font-bold text-[2rem] bg-gradient-to-br from-royal-gold to-wisteria bg-clip-text text-transparent leading-none mb-1">{registrations.length}</div>
                <div className="font-cinzel text-[0.58rem] tracking-[0.15em] uppercase text-warm-cream/35">Total</div>
              </div>
              {categoryCounts.map(({ cat, count }) => (
                <div key={cat} className="rounded-xl border border-wisteria/20 text-center cursor-pointer transition-all hover:border-wisteria/50" style={{ padding: "20px 16px", background: filterCategory === cat ? "rgba(75,59,110,0.5)" : "rgba(75,59,110,0.2)" }} onClick={() => setFilterCategory(filterCategory === cat ? "All" : cat)}>
                  <div className="font-cinzel-deco font-bold text-[2rem] bg-gradient-to-br from-royal-gold to-wisteria bg-clip-text text-transparent leading-none mb-1">{count}</div>
                  <div className="font-cinzel text-[0.55rem] tracking-[0.1em] uppercase text-warm-cream/35 leading-tight">{cat}</div>
                </div>
              ))}
            </div>

            {/* FILTERS */}
            <div className="rounded-xl border border-wisteria/20 mb-6 flex flex-wrap items-center" style={{ padding: "16px 24px", background: "rgba(75,59,110,0.2)", gap: "16px" }}>
              <input type="text" placeholder="Search by name, ID, or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 rounded-lg border border-wisteria/20 text-warm-cream outline-none focus:border-wisteria text-sm" style={{ padding: "10px 14px", background: "rgba(247,242,228,0.05)", minWidth: "200px" }} />
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="rounded-lg border border-wisteria/20 text-warm-cream outline-none font-cinzel text-[0.7rem]" style={{ padding: "10px 14px", background: "#2d1f4e" }}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="rounded-lg border border-wisteria/20 text-warm-cream outline-none font-cinzel text-[0.7rem]" style={{ padding: "10px 14px", background: "#2d1f4e" }}>
                {departments.map((d) => <option key={d}>{d}</option>)}
              </select>
              <div className="font-cinzel text-[0.65rem] tracking-[0.1em] uppercase text-warm-cream/35">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
            </div>

            {/* TABLE */}
            <div className="rounded-2xl border border-wisteria/20 overflow-hidden" style={{ background: "rgba(75,59,110,0.2)" }}>
              {loadingReg ? (
                <div className="text-center font-cinzel text-warm-cream/40 text-sm" style={{ padding: "60px" }}>Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center font-cinzel text-warm-cream/40 text-sm" style={{ padding: "60px" }}>No registrations found.</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(185,167,228,0.15)" }}>
                        {["#", "Name", "Student ID", "Email", "Phone", "Department", "Year", "Category", "Registered", ""].map((h) => (
                          <th key={h} className="font-cinzel text-left text-[0.58rem] tracking-[0.15em] uppercase text-warm-cream/35" style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((reg, i) => (
                        <tr key={reg.id} className="transition-colors hover:bg-wisteria/[0.05]" style={{ borderBottom: "1px solid rgba(185,167,228,0.08)" }}>
                          <td className="font-cinzel text-[0.65rem] text-warm-cream/30" style={{ padding: "14px 16px" }}>{i + 1}</td>
                          <td className="font-cinzel text-[0.78rem] font-medium text-warm-cream" style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>{reg.full_name}</td>
                          <td className="font-cinzel text-[0.72rem] text-warm-cream/60" style={{ padding: "14px 16px" }}>{reg.student_id}</td>
                          <td className="text-[0.72rem] text-warm-cream/60" style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>{reg.email}</td>
                          <td className="text-[0.72rem] text-warm-cream/60" style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>{reg.phone}</td>
                          <td className="text-[0.72rem] text-warm-cream/60" style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>{reg.department}</td>
                          <td className="text-[0.72rem] text-warm-cream/60" style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>{reg.year}</td>
                          <td style={{ padding: "14px 16px" }}>
                            <span className="font-cinzel text-[0.6rem] tracking-[0.1em] uppercase rounded-full" style={{ padding: "4px 10px", background: "rgba(185,167,228,0.15)", color: "#B9A7E4", whiteSpace: "nowrap" }}>{reg.category}</span>
                          </td>
                          <td className="text-[0.68rem] text-warm-cream/40" style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                            {new Date(reg.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <button onClick={() => handleDeleteReg(reg.id)} className="font-cinzel text-[0.6rem] tracking-[0.1em] uppercase rounded-lg transition-all hover:bg-red-500/20" style={{ padding: "6px 12px", color: "rgba(244,114,182,0.6)", border: "1px solid rgba(244,114,182,0.2)" }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── SCHEDULE TAB ── */}
        {activeTab === "schedule" && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex" style={{ gap: "8px" }}>
                {[1, 2].map((day) => (
                  <button key={day} onClick={() => setSchedDay(day)} className="font-cinzel tracking-[0.12em] uppercase rounded-full transition-all" style={{ padding: "8px 24px", fontSize: "0.7rem", background: schedDay === day ? "rgba(75,59,110,0.5)" : "rgba(75,59,110,0.2)", color: schedDay === day ? "#F7F2E4" : "rgba(247,242,228,0.4)", border: schedDay === day ? "1px solid rgba(185,167,228,0.5)" : "1px solid rgba(185,167,228,0.15)" }}>
                    Day {day}
                  </button>
                ))}
              </div>
              <button onClick={openNewEvent} className="font-cinzel tracking-[0.14em] uppercase rounded-xl text-warm-cream bg-gradient-to-br from-mystic-purple to-lavender transition-all" style={{ padding: "10px 24px", fontSize: "0.72rem", boxShadow: "0 0 20px rgba(135,115,198,0.2)" }}>
                ✦ Add Event
              </button>
            </div>

            {/* EVENT FORM MODAL */}
            {showEventForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(13,5,32,0.8)", backdropFilter: "blur(8px)" }}>
                <div className="relative w-full max-w-lg rounded-2xl border border-wisteria/30 overflow-hidden" style={{ padding: "40px", background: "rgba(45,31,78,0.95)", maxHeight: "90vh", overflowY: "auto" }}>
                  <div className="font-cinzel font-semibold text-warm-cream mb-6" style={{ fontSize: "1rem" }}>
                    {editingEvent ? "✦ Edit Event" : "✦ New Event"}
                  </div>

                  <form onSubmit={handleSaveEvent}>
                    <div className="flex flex-col" style={{ gap: "16px" }}>

                      <div className="grid grid-cols-2" style={{ gap: "12px" }}>
                        <div className="flex flex-col" style={{ gap: "6px" }}>
                          <label className={labelClass}>Day</label>
                          <select value={eventForm.day} onChange={(e) => setEventForm((p) => ({ ...p, day: Number(e.target.value) }))} className="rounded-lg border border-wisteria/20 text-warm-cream outline-none" style={{ ...inputStyle, background: "#2d1f4e" }}>
                            <option value={1}>Day 1</option>
                            <option value={2}>Day 2</option>
                          </select>
                        </div>
                        <div className="flex flex-col" style={{ gap: "6px" }}>
                          <label className={labelClass}>Type</label>
                          <select value={eventForm.type} onChange={(e) => setEventForm((p) => ({ ...p, type: e.target.value }))} className="rounded-lg border border-wisteria/20 text-warm-cream outline-none" style={{ ...inputStyle, background: "#2d1f4e" }}>
                            <option value="general">General</option>
                            <option value="competition">Competition</option>
                            <option value="ceremony">Ceremony</option>
                            <option value="break">Break</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2" style={{ gap: "12px" }}>
                        <div className="flex flex-col" style={{ gap: "6px" }}>
                          <label className={labelClass}>Start Time</label>
                          <input type="time" value={eventForm.time_start} onChange={(e) => setEventForm((p) => ({ ...p, time_start: e.target.value }))} required className="rounded-lg border border-wisteria/20 text-warm-cream outline-none" style={inputStyle} />
                        </div>
                        <div className="flex flex-col" style={{ gap: "6px" }}>
                          <label className={labelClass}>End Time</label>
                          <input type="time" value={eventForm.time_end} onChange={(e) => setEventForm((p) => ({ ...p, time_end: e.target.value }))} required className="rounded-lg border border-wisteria/20 text-warm-cream outline-none" style={inputStyle} />
                        </div>
                      </div>

                      <div className="flex flex-col" style={{ gap: "6px" }}>
                        <label className={labelClass}>Event Title</label>
                        <input type="text" placeholder="e.g. Opening Ceremony" value={eventForm.title} onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))} required className="rounded-lg border border-wisteria/20 text-warm-cream outline-none" style={inputStyle} />
                      </div>

                      <div className="flex flex-col" style={{ gap: "6px" }}>
                        <label className={labelClass}>Description <span style={{ color: "rgba(247,242,228,0.25)", fontSize: "0.55rem" }}>(optional)</span></label>
                        <textarea rows={2} placeholder="Short description..." value={eventForm.description} onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))} className="rounded-lg border border-wisteria/20 text-warm-cream outline-none resize-none" style={inputStyle} />
                      </div>

                      <div className="grid grid-cols-2" style={{ gap: "12px" }}>
                        <div className="flex flex-col" style={{ gap: "6px" }}>
                          <label className={labelClass}>Location <span style={{ color: "rgba(247,242,228,0.25)", fontSize: "0.55rem" }}>(optional)</span></label>
                          <input type="text" placeholder="e.g. Aula Barat" value={eventForm.location} onChange={(e) => setEventForm((p) => ({ ...p, location: e.target.value }))} className="rounded-lg border border-wisteria/20 text-warm-cream outline-none" style={inputStyle} />
                        </div>
                        <div className="flex flex-col" style={{ gap: "6px" }}>
                          <label className={labelClass}>Category <span style={{ color: "rgba(247,242,228,0.25)", fontSize: "0.55rem" }}>(optional)</span></label>
                          <select value={eventForm.category} onChange={(e) => setEventForm((p) => ({ ...p, category: e.target.value }))} className="rounded-lg border border-wisteria/20 text-warm-cream outline-none" style={{ ...inputStyle, background: "#2d1f4e" }}>
                            <option value="">None</option>
                            <option>Speech</option>
                            <option>Debate</option>
                            <option>Story Telling</option>
                            <option>Essay Writing</option>
                            <option>Spelling Bee</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex" style={{ gap: "12px", marginTop: "8px" }}>
                        <button type="button" onClick={() => setShowEventForm(false)} className="flex-1 font-cinzel tracking-[0.14em] uppercase rounded-xl text-warm-cream/50 border border-wisteria/20 transition-all hover:border-wisteria/40" style={{ padding: "12px", fontSize: "0.72rem" }}>
                          Cancel
                        </button>
                        <button type="submit" disabled={savingEvent} className="flex-1 font-cinzel tracking-[0.14em] uppercase rounded-xl text-warm-cream bg-gradient-to-br from-mystic-purple to-lavender transition-all" style={{ padding: "12px", fontSize: "0.72rem", opacity: savingEvent ? 0.7 : 1 }}>
                          {savingEvent ? "Saving..." : editingEvent ? "✦ Update" : "✦ Add Event"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* SCHEDULE LIST */}
            <div className="flex flex-col" style={{ gap: "8px" }}>
              {loadingSched ? (
                <div className="text-center font-cinzel text-warm-cream/30 text-sm" style={{ padding: "60px" }}>Loading schedule...</div>
              ) : scheduleEvents.filter((e) => e.day === schedDay).length === 0 ? (
                <div className="text-center rounded-2xl border border-wisteria/15" style={{ padding: "60px", background: "rgba(75,59,110,0.15)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📅</div>
                  <div className="font-cinzel text-warm-cream/30 text-sm tracking-widest uppercase">No events for Day {schedDay}</div>
                  <div className="font-cinzel text-warm-cream/20 text-xs mt-2">Click "Add Event" to get started</div>
                </div>
              ) : (
                scheduleEvents.filter((e) => e.day === schedDay).map((event) => (
                  <div key={event.id} className="flex items-center rounded-xl border border-wisteria/15 transition-all hover:border-wisteria/30" style={{ padding: "16px 20px", background: "rgba(75,59,110,0.2)", gap: "16px" }}>
                    <div className="flex-shrink-0 text-right" style={{ width: "80px" }}>
                      <div className="font-cinzel text-[0.7rem] text-royal-gold">{event.time_start}</div>
                      <div className="font-cinzel text-[0.6rem] text-warm-cream/25">{event.time_end}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-cinzel font-semibold text-warm-cream text-sm mb-1">{event.title}</div>
                      {event.description && <div className="text-warm-cream/45 text-xs">{event.description}</div>}
                      <div className="flex items-center mt-1" style={{ gap: "8px" }}>
                        {event.location && <span className="font-cinzel text-[0.58rem] text-warm-cream/30">📍 {event.location}</span>}
                        {event.category && <span className="font-cinzel text-[0.58rem] text-royal-gold/60">· {event.category}</span>}
                      </div>
                    </div>
                    <span className="font-cinzel text-[0.58rem] tracking-[0.1em] uppercase rounded-full flex-shrink-0" style={{ padding: "3px 10px", background: "rgba(185,167,228,0.12)", color: "#B9A7E4" }}>
                      {event.type}
                    </span>
                    <div className="flex flex-shrink-0" style={{ gap: "8px" }}>
                      <button onClick={() => openEditEvent(event)} className="font-cinzel text-[0.6rem] tracking-[0.1em] uppercase rounded-lg transition-all hover:bg-wisteria/20" style={{ padding: "6px 12px", color: "rgba(185,167,228,0.6)", border: "1px solid rgba(185,167,228,0.2)" }}>Edit</button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="font-cinzel text-[0.6rem] tracking-[0.1em] uppercase rounded-lg transition-all hover:bg-red-500/20" style={{ padding: "6px 12px", color: "rgba(244,114,182,0.6)", border: "1px solid rgba(244,114,182,0.2)" }}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}