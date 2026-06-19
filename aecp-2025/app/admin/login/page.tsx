"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import StarField from "@/components/Stars-bg";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/admin");
  }

  return (
    <>
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
      <div className="fixed -top-24 -left-24 w-[380px] h-[380px] rounded-full blur-[90px] bg-mystic-purple/35 animate-float pointer-events-none z-0" />
      <div className="fixed bottom-[10%] -right-16 w-[280px] h-[280px] rounded-full blur-[90px] bg-forest-green/30 animate-float pointer-events-none z-0" style={{ animationDelay: "-4s" }} />

      <StarField />

      <div className="relative z-5 min-h-screen flex items-center justify-center" style={{ padding: "40px 20px" }}>
        <div
          className="w-full max-w-md relative overflow-hidden rounded-2xl border border-wisteria/20 backdrop-blur-md"
          style={{ padding: "48px 40px", background: "rgba(75,59,110,0.28)" }}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wisteria/[0.07] via-transparent to-sage-green/5 pointer-events-none" />

          <div className="relative">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="font-cinzel text-[0.65rem] tracking-[0.3em] uppercase text-wisteria mb-4" style={{ opacity: 0.8 }}>
                ✦ Admin Access ✦
              </div>
              <div className="font-cinzel-deco font-bold text-[1.8rem] bg-gradient-to-br from-warm-cream to-lilac-mist bg-clip-text text-transparent">
                AECP 2025
              </div>
              <div className="font-cinzel text-[0.7rem] tracking-[0.2em] uppercase text-warm-cream/30 mt-2">
                Administration Portal
              </div>
            </div>

            <form onSubmit={handleLogin}>
              <div className="flex flex-col" style={{ gap: "20px" }}>
                <div className="flex flex-col" style={{ gap: "8px" }}>
                  <label className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-warm-cream/45">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="admin@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-wisteria/20 text-warm-cream outline-none focus:border-wisteria"
                    style={{ padding: "12px 16px", background: "rgba(247,242,228,0.05)" }}
                  />
                </div>

                <div className="flex flex-col" style={{ gap: "8px" }}>
                  <label className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-warm-cream/45">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-wisteria/20 text-warm-cream outline-none focus:border-wisteria"
                    style={{ padding: "12px 16px", background: "rgba(247,242,228,0.05)" }}
                  />
                </div>

                {error && (
                  <div className="text-center text-[0.78rem]" style={{ color: "#f472b6" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-cinzel font-semibold tracking-[0.18em] uppercase rounded-xl text-warm-cream bg-gradient-to-br from-mystic-purple to-lavender transition-all"
                  style={{
                    padding: "14px",
                    fontSize: "0.82rem",
                    marginTop: "8px",
                    boxShadow: "0 0 28px rgba(135,115,198,0.25)",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Signing in..." : "✦ Sign In ✦"}
                </button>
              </div>
            </form>

            <div className="text-center" style={{ marginTop: "24px" }}>
              <a href="/" className="font-cinzel text-[0.65rem] tracking-[0.1em] uppercase text-warm-cream/25 hover:text-wisteria no-underline transition-colors">
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}