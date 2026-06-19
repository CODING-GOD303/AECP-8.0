"use client";

import { useState } from "react";
import StarField from "@/components/Stars-bg";
import { supabase } from "@/lib/supabase";

type Registration = {
  full_name: string;
  student_id: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  category: string;
  notes: string;
};

export default function Register() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastEntry, setLastEntry] = useState<Registration | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    student_id: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    category: "",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.category) {
      setError("Please select a competition category.");
      return;
    }

    setError("");
    setLoading(true);

    const { error: dbError } = await supabase
      .from("registrations")
      .insert([form]);

    setLoading(false);

    if (dbError) {
      setError("Something went wrong: " + dbError.message);
      return;
    }

    setLastEntry(form);
    setSubmitted(true);
  }

  function resetForm() {
    setSubmitted(false);
    setLastEntry(null);
    setForm({
      full_name: "",
      student_id: "",
      email: "",
      phone: "",
      department: "",
      year: "",
      category: "",
      notes: "",
    });
  }

return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 15% 25%, #2f1f52 0%, transparent 60%),
            radial-gradient(ellipse 45% 40% at 85% 10%, #1a2e20 0%, transparent 55%),
            linear-gradient(145deg, #0f0c1a 0%, #1e1628 45%, #111a13 100%)
          `,
        }}
      />

      {/* Orbs */}
      <div className="fixed -top-24 -left-24 w-[380px] h-[380px] rounded-full blur-[90px] bg-mystic-purple/35 animate-float pointer-events-none z-0" />
      <div className="fixed bottom-[10%] -right-16 w-[280px] h-[280px] rounded-full blur-[90px] bg-forest-green/30 animate-float pointer-events-none z-0" style={{ animationDelay: "-4s" }} />
      <div className="fixed -bottom-24 left-[40%] w-[320px] h-[320px] rounded-full blur-[90px] bg-wisteria/10 animate-float pointer-events-none z-0" style={{ animationDelay: "-6s" }} />

      <StarField />

      {/* PAGE LAYOUT */}
      <div className="relative z-5 min-h-[calc(100vh-77px)] grid md:grid-cols-2" style={{ alignItems: "stretch" }}>

        {/* LEFT PANEL */}
        <div className="flex flex-col justify-center border-r border-wisteria/20" style={{ padding: "80px 56px" }}>
          <div className="font-cinzel text-[0.65rem] tracking-[0.32em] uppercase text-wisteria mb-6 flex items-center gap-3" style={{ opacity: 0.85 }}>
            <span className="text-royal-gold text-[0.5rem]">✦</span>
            Join the Competition
          </div>

          <h1 className="font-cinzel-deco text-[clamp(2rem,3.5vw,3.2rem)] font-bold leading-[1.1] mb-4">
            <span className="block bg-gradient-to-br from-warm-cream to-lilac-mist bg-clip-text text-transparent">
              Cast Your
            </span>
            <span className="block italic bg-gradient-to-br from-royal-gold to-wisteria bg-clip-text text-transparent">
              Spell.
            </span>
          </h1>

          <div
            className="h-px"
            style={{
              width: "80px",
              background: "linear-gradient(90deg, #F2D37A, #B9A7E4, transparent)",
              margin: "24px 0",
            }}
          />

          <p className="text-[0.88rem] font-light leading-[1.85] text-warm-cream/45 max-w-[38ch] mb-10">
            Register for AECP 2025 and showcase your English mastery. Choose your category and let your words work magic.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { icon: "📅", label: "Event Date", val: "To be announced — stay tuned" },
              { icon: "📍", label: "Venue", val: "Politeknik Negeri Bandung, West Java" },
              { icon: "🏆", label: "Categories", val: "Speech · Debate · Story Telling · Essay · Spelling Bee" },
              { icon: "✨", label: "Registration", val: "Open — deadline TBA" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4 rounded-xl border" style={{ padding: "16px 20px", background: "rgba(47,75,58,0.2)", borderColor: "rgba(107,128,111,0.2)" }}>
                <div className="text-lg" style={{ marginTop: "1px" }}>{item.icon}</div>
                <div>
                  <div className="font-cinzel text-[0.62rem] tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(242,211,122,0.65)" }}>{item.label}</div>
                  <div className="text-[0.82rem] font-light text-warm-cream/55">{item.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex flex-col justify-center" style={{ padding: "64px 56px" }}>
          <div
            className="relative overflow-hidden rounded-2xl border border-wisteria/20 backdrop-blur-md"
            style={{ padding: "40px", background: "rgba(75,59,110,0.28)" }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wisteria/[0.07] via-transparent to-sage-green/5 pointer-events-none" />

            {!submitted ? (
              <div className="relative">
                <div className="mb-8">
                  <div className="font-cinzel text-[1.1rem] font-semibold text-warm-cream mb-1">✦ Participant Registration</div>
                  <div className="text-[0.78rem] font-light text-warm-cream/40">All fields are required unless marked optional</div>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2" style={{ gap: "18px" }}>

                    {[
                      { field: "full_name", label: "Full Name", type: "text", placeholder: "Your full name" },
                      { field: "student_id", label: "Student ID", type: "text", placeholder: "e.g. 221511001" },
                      { field: "email", label: "Email Address", type: "email", placeholder: "you@student.polban.ac.id" },
                      { field: "phone", label: "WhatsApp Number", type: "tel", placeholder: "+62 8xx xxxx xxxx" },
                    ].map((input) => (
                      <div key={input.field} className="flex flex-col" style={{ gap: "8px" }}>
                        <label className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-warm-cream/45">{input.label}</label>
                        <input
                          type={input.type}
                          placeholder={input.placeholder}
                          required
                          value={form[input.field as keyof typeof form]}
                          onChange={(e) => update(input.field as keyof typeof form, e.target.value)}
                          className="w-full rounded-lg border border-wisteria/20 text-warm-cream outline-none focus:border-wisteria"
                          style={{ padding: "12px 16px", background: "rgba(247,242,228,0.05)" }}
                        />
                      </div>
                    ))}

                    {[
                      {
                        field: "department", label: "Department / Jurusan",
                        options: ["Teknik Sipil", "Teknik Mesin", "Teknik Elektro", "Teknik Kimia", "Akuntansi", "Administrasi Niaga", "Teknik Informatika", "Bahasa Inggris"],
                        placeholder: "Select your department",
                      },
                      {
                        field: "year", label: "Year / Angkatan",
                        options: ["2024 (1st Year)", "2023 (2nd Year)", "2022 (3rd Year)", "2021 (4th Year)"],
                        placeholder: "Select year",
                      },
                    ].map((sel) => (
                      <div key={sel.field} className="flex flex-col" style={{ gap: "8px" }}>
                        <label className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-warm-cream/45">{sel.label}</label>
                        <select
                          required
                          value={form[sel.field as keyof typeof form]}
                          onChange={(e) => update(sel.field as keyof typeof form, e.target.value)}
                          className="w-full rounded-lg border border-wisteria/20 text-warm-cream outline-none focus:border-wisteria"
                          style={{ padding: "12px 16px", background: "#2d1f4e" }}
                        >
                          <option value="" disabled>{sel.placeholder}</option>
                          {sel.options.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}

                    {/* CATEGORY PICKER */}
                    <div className="md:col-span-2 flex flex-col" style={{ gap: "12px" }}>
                      <div className="h-px" style={{ background: "rgba(185,167,228,0.2)", margin: "8px 0" }} />
                      <label className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-warm-cream/45">Competition Category</label>
                      <div className="grid grid-cols-5" style={{ gap: "10px" }}>
                        {[
                          { emoji: "💜", label: "Speech" },
                          { emoji: "🌿", label: "Debate" },
                          { emoji: "✨", label: "Story Telling" },
                          { emoji: "📜", label: "Essay Writing" },
                          { emoji: "🔮", label: "Spelling Bee" },
                        ].map((cat) => {
                          const isSelected = form.category === cat.label;
                          return (
                            <label
                              key={cat.label}
                              className="flex flex-col items-center justify-center rounded-lg border cursor-pointer transition-all"
                              style={{
                                padding: "12px 8px", gap: "6px", textAlign: "center",
                                background: isSelected ? "rgba(75,59,110,0.5)" : "rgba(247,242,228,0.04)",
                                borderColor: isSelected ? "#B9A7E4" : "rgba(185,167,228,0.18)",
                                boxShadow: isSelected ? "0 0 16px rgba(185,167,228,0.25)" : "none",
                              }}
                            >
                              <input type="radio" name="category" value={cat.label} checked={isSelected} onChange={(e) => update("category", e.target.value)} style={{ display: "none" }} />
                              <span style={{ fontSize: "1rem" }}>{cat.emoji}</span>
                              <span className="font-cinzel text-warm-cream/50" style={{ fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.4 }}>{cat.label}</span>
                            </label>
                          );
                        })}
                      </div>
                      {error && <div style={{ color: "#f472b6", fontSize: "0.75rem" }}>{error}</div>}
                    </div>

                    <div className="md:col-span-2 flex flex-col" style={{ gap: "8px" }}>
                      <label className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-warm-cream/45">
                        Additional Notes <span style={{ color: "rgba(247,242,228,0.25)", fontSize: "0.55rem" }}>(optional)</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Anything you'd like us to know..."
                        value={form.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        className="w-full rounded-lg border border-wisteria/20 text-warm-cream outline-none focus:border-wisteria resize-none"
                        style={{ padding: "12px 16px", background: "rgba(247,242,228,0.05)" }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full font-cinzel font-semibold tracking-[0.18em] uppercase rounded-xl text-warm-cream bg-gradient-to-br from-mystic-purple to-lavender transition-all"
                    style={{
                      padding: "16px",
                      fontSize: "0.82rem",
                      marginTop: "24px",
                      boxShadow: "0 0 28px rgba(135,115,198,0.25)",
                      opacity: loading ? 0.7 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                  >
                    {loading ? "Submitting..." : "✦ Submit Registration ✦"}
                  </button>
                </form>

                <div className="text-center" style={{ marginTop: "20px", fontSize: "0.72rem", color: "rgba(247,242,228,0.28)" }}>
                  Already registered? <a href="#" className="text-wisteria hover:text-royal-gold no-underline">Check your status →</a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center relative" style={{ padding: "48px 32px", gap: "16px" }}>
                <div style={{ fontSize: "3.5rem" }}>🌟</div>
                <div className="font-cinzel-deco font-bold bg-gradient-to-br from-royal-gold to-wisteria bg-clip-text text-transparent" style={{ fontSize: "1.4rem" }}>You&apos;re In!</div>
                <p className="font-light text-warm-cream/45" style={{ fontSize: "0.85rem", maxWidth: "32ch", lineHeight: 1.7 }}>
                  Your registration has been saved successfully.
                </p>
                {lastEntry && (
                  <div className="w-full text-left rounded-xl border" style={{ padding: "16px 20px", background: "rgba(47,75,58,0.15)", borderColor: "rgba(107,128,111,0.2)", fontSize: "0.8rem", lineHeight: 1.8, color: "rgba(247,242,228,0.6)" }}>
                    <div><strong style={{ color: "#F2D37A" }}>Name:</strong> {lastEntry.full_name}</div>
                    <div><strong style={{ color: "#F2D37A" }}>Student ID:</strong> {lastEntry.student_id}</div>
                    <div><strong style={{ color: "#F2D37A" }}>Email:</strong> {lastEntry.email}</div>
                    <div><strong style={{ color: "#F2D37A" }}>Category:</strong> {lastEntry.category}</div>
                    <div><strong style={{ color: "#F2D37A" }}>Department:</strong> {lastEntry.department}</div>
                  </div>
                )}
                <button
                  onClick={resetForm}
                  className="font-cinzel text-wisteria border border-wisteria/40 rounded-full bg-transparent hover:bg-wisteria/10 transition-all"
                  style={{ fontSize: "0.72rem", letterSpacing: "0.14em", padding: "10px 26px", marginTop: "8px" }}
                >
                  ← Register Another
                </button>
              </div>
            )}
          </div>
        </div>
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