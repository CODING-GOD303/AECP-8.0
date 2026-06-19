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
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [lastEntry, setLastEntry] = useState<Registration | null>(null);

  const [form, setForm] = useState<Registration>({
    full_name: "",
    student_id: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    category: "",
    notes: "",
  });

  // Handler input dengan tipe data TypeScript yang ketat
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handler submit form ke database Supabase
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Menyimpan data ke tabel 'registrations' di database Supabase Anda
      const { error: supabaseError } = await supabase
        .from("registrations")
        .insert([form]);

      if (supabaseError) throw supabaseError;

      setSubmitted(true);
      setLastEntry(form);
      
      // Reset form setelah sukses
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
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 pt-32 pb-16">
      {/* Background Bintang */}
      {StarField && <StarField />}

      <div className="z-10 w-full max-w-xl bg-zinc-900/80 p-8 rounded-2xl border border-zinc-800 shadow-2xl backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-2 text-center font-cinzel tracking-wider bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
          REGISTRATION
        </h2>
        <p className="text-zinc-400 text-xs text-center uppercase tracking-widest mb-8">AECP 2025 Competition</p>

        {submitted && (
          <div className="mb-6 p-4 bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl text-center animate-fade-in">
            🎉 Pendaftaran berhasil untuk <strong>{lastEntry?.full_name}</strong>!
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-950/50 border border-rose-500/30 text-rose-400 text-sm rounded-xl text-center">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Student ID / NIM</label>
              <input
                type="text"
                name="student_id"
                value={form.student_id}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="221234001"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="johndoe@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="08123456789"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Department</label>
              <input
                type="text"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Teknik Informatika"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Year / Angkatan</label>
              <input
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="2023"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors text-zinc-300"
              >
                <option value="">Select Category</option>
                <option value="web-design">Web Design</option>
                <option value="ui-ux">UI/UX Design</option>
                <option value="competitive-programming">Programming</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Notes / Catatan Tambahan</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
              placeholder="Tulis catatan atau persyaratan khusus di sini..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_30px_rgba(135,115,198,0.2)] disabled:opacity-50 text-sm tracking-wide uppercase font-semibold"
          >
            {loading ? "Processing..." : "Submit Registration ✦"}
          </button>
        </form>
      </div>
    </div>
  );
}
