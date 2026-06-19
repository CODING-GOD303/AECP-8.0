import StarField from "@/components/Stars-bg";

export default function Home() {
  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 20% 15%, #2f1f52 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 10%, #1a2e20 0%, transparent 55%),
            radial-gradient(ellipse 45% 55% at 70% 90%, #1e1628 0%, transparent 55%),
            linear-gradient(145deg, #0f0c1a 0%, #1e1628 45%, #111a13 100%)
          `,
        }}
      />

      {/* Floating orbs */}
      <div className="fixed -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-[90px] bg-mystic-purple/35 animate-float pointer-events-none z-0" />
      <div className="fixed top-1/5 -right-20 w-[300px] h-[300px] rounded-full blur-[90px] bg-forest-green/30 animate-float pointer-events-none z-0" style={{ animationDelay: "-4s" }} />
      <div className="fixed -bottom-24 left-[35%] w-[360px] h-[360px] rounded-full blur-[90px] bg-wisteria/15 animate-float pointer-events-none z-0" style={{ animationDelay: "-6s" }} />
      <div className="fixed bottom-1/4 right-[15%] w-[220px] h-[220px] rounded-full blur-[90px] bg-royal-gold/[0.07] animate-float pointer-events-none z-0" style={{ animationDelay: "-2s" }} />

      <StarField />

      {/* HERO */}
      <section className="relative z-5 min-h-[calc(100vh-77px)] flex flex-col items-center justify-center text-center px-8 py-20">

        {/* Magic circle rings */}
        <div className="absolute w-[580px] h-[580px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-wisteria/10 animate-spin-slow" />
          <div className="absolute inset-10 rounded-full border border-royal-gold/[0.07] animate-spin-reverse" />
          <div className="absolute inset-[90px] rounded-full border border-sage-green/10 animate-spin-medium" />
        </div>

      
        <div className="absolute top-[22%] left-[16%] text-royal-gold animate-sparkle">✦</div>
        <div className="absolute top-[30%] right-[19%] text-royal-gold animate-sparkle" style={{ animationDelay: "-1.5s" }}>✧</div>
        <div className="absolute top-[65%] left-[23%] text-royal-gold animate-sparkle" style={{ animationDelay: "-0.8s" }}>✦</div>
        <div className="absolute top-[55%] right-[13%] text-royal-gold animate-sparkle" style={{ animationDelay: "-2s" }}>✧</div>
        <div className="absolute top-[15%] right-[32%] text-royal-gold animate-sparkle" style={{ animationDelay: "-1s" }}>✦</div>
        <div className="absolute top-[75%] right-[36%] text-royal-gold animate-sparkle" style={{ animationDelay: "-0.5s" }}>✧</div>

       
        <div className="font-cinzel text-[0.68rem] tracking-[0.35em] uppercase text-wisteria mb-8 flex items-center gap-5 animate-fade-up opacity-0" style={{ animationDelay: "0.2s" }}>
          <span className="text-royal-gold text-[0.5rem]">✦</span>
          Annual English Competition — Polban
          <span className="text-royal-gold text-[0.5rem]">✦</span>
        </div>

      
        <h1
          className="font-cinzel-deco text-[clamp(2.8rem,6.5vw,6.5rem)] leading-[1.06] font-bold mb-2 animate-fade-up opacity-0"
          style={{ animationDelay: "0.35s" }}
        >
          <span className="block bg-gradient-to-br from-warm-cream to-lilac-mist bg-clip-text text-transparent">
            Speak.
          </span>
          <span className="block italic bg-gradient-to-br from-royal-gold to-wisteria bg-clip-text text-transparent">
            Write.
          </span>
          <span className="block bg-gradient-to-br from-lilac-mist to-lavender bg-clip-text text-transparent">
            Inspire.
          </span>
        </h1>

   
        <div className="font-cinzel text-[0.7rem] tracking-[0.25em] uppercase text-warm-cream/30 mt-5 mb-7 animate-fade-up opacity-0" style={{ animationDelay: "0.5s" }}>
          Politeknik Negeri Bandung &nbsp;·&nbsp; 2025
        </div>

    
        <div
          className="w-[120px] h-px mb-8 opacity-0"
          style={{
            background: "linear-gradient(90deg, transparent, #F2D37A, #B9A7E4, transparent)",
            animation: "fadeUp 1s ease 0.6s forwards",
          }}
        />

       
        <p className="text-[0.95rem] font-light leading-[1.85] text-warm-cream/50 max-w-[46ch] mb-12 animate-fade-up opacity-0" style={{ animationDelay: "0.65s" }}>
          The official platform for AECP participants — track your attendance, explore competition rules, access documentation, and follow the event live.
        </p>

        <div className="flex gap-5 items-center flex-wrap justify-center animate-fade-up opacity-0" style={{ animationDelay: "0.8s" }}>
          
          <a href="/register"
            className="font-cinzel font-semibold text-[0.78rem] tracking-[0.14em] uppercase rounded-full no-underline text-warm-cream bg-gradient-to-br from-mystic-purple to-lavender shadow-[0_0_30px_rgba(135,115,198,0.3)] hover:shadow-[0_8px_40px_rgba(135,115,198,0.5)] hover:-translate-y-0.5 transition-all"
            style={{ padding: "28px 64px" }}
          >
            ✦ Join the Competition
          </a>

          <a href="#"
            className="font-cinzel text-[0.78rem] tracking-[0.14em] uppercase rounded-full no-underline text-warm-cream/50 border border-wisteria/40 hover:border-wisteria hover:text-wisteria hover:shadow-[0_0_20px_rgba(185,167,228,0.15)] transition-all"
            style={{ padding: "28px 64px" }}
          >
            View Documentation
          </a>
        </div>
      </section>

      {/* CATEGORY STRIP */}
      <div className="relative z-5 flex justify-center flex-wrap border-t border-b border-wisteria/20 bg-forest-green/15 backdrop-blur-md">
        {[
          { icon: "🟣", name: "Speech" },
          { icon: "🌿", name: "Debate" },
          { icon: "✨", name: "Story Telling" },
          { icon: "📜", name: "Essay Writing" },
          { icon: "🔮", name: "Spelling Bee" },
        ].map((cat) => (
 <div
  key={cat.name}
  className="border-r border-l-0 first:border-l border-wisteria/20 flex items-center gap-3 hover:bg-wisteria/[0.08] transition-colors"
  style={{ padding: "16px 36px" }}
>
            <div className="text-sm">{cat.icon}</div>
            <div className="font-cinzel text-[0.65rem] tracking-[0.18em] uppercase text-warm-cream/50">
              {cat.name}
            </div>
          </div>
        ))}
      </div>

      {/* TICKER */}
      <div
        className="relative z-5 overflow-hidden py-2.5 border-b border-wisteria/20 bg-deep-charcoal/30"
        style={{ maskImage: "linear-gradient(90deg, transparent, black 6%, black 94%, transparent)" }}
      >
        <div className="inline-flex animate-ticker whitespace-nowrap">
          {Array.from({ length: 2 }).flatMap((_, dup) =>
            [
              "Attendance System Live",
              "Documentation Portal Open",
              "AECP 2025 · Politeknik Negeri Bandung",
              "Registration Now Open",
              "Competition Rules Published",
              "Where Words Cast Spells",
            ].map((text, i) => (
              <div key={`${dup}-${i}`} className="font-cinzel text-[0.6rem] tracking-[0.18em] uppercase text-warm-cream/30 whitespace-nowrap" style={{ padding: "0 48px" }}>
                <span className="text-royal-gold/60" style={{ marginRight: "48px" }}>✦</span>
                {text}  
              </div>
            ))
          )}
        </div>
      </div>

      {/* STAT BAR */}
      <div className="relative z-5 flex justify-center border-b border-wisteria/20 bg-mystic-purple/[0.12]">
        {[
          { num: "—", label: "Participants" },
          { num: "5", label: "Categories" },
          { num: "—", label: "Days" },
          { num: "—", label: "Prizes" },
        ].map((stat, i) => (
          <div
            key={i}
            className="text-center border-r border-l-0 first:border-l border-wisteria/20 flex-1 max-w-[220px] hover:bg-wisteria/[0.06] transition-colors"
            style={{ padding: "32px 48px" }}
            >
            <div className="font-cinzel-deco text-[1.8rem] font-bold bg-gradient-to-br from-royal-gold to-wisteria bg-clip-text text-transparent leading-none mb-2">
              {stat.num}
            </div>
            <div className="font-cinzel text-[0.6rem] tracking-[0.2em] uppercase text-warm-cream/30">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
     <section className="relative z-5" style={{ padding: "96px 64px" }}>
        <div className="text-center mb-14">
          <div className="font-cinzel text-[0.65rem] tracking-[0.3em] uppercase text-sage-green/85 mb-3">
            ✦ Platform Features ✦
          </div>
           <div className="font-cinzel-deco italic text-[1.8rem] font-bold bg-gradient-to-br from-warm-cream to-lilac-mist bg-clip-text text-transparent">
            Your Enchanted Portal
          </div>
        </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))]" style={{ gap: "24px" }} >
          {[
            { icon: "🪄", num: "01", title: "Attendance System", desc: "Real-time check-in tracking and participant session logs for every competition event." },
            { icon: "📖", num: "02", title: "Documentation Hub", desc: "Official rules, scoring criteria, forms, and all competition materials in one place." },
            { icon: "🏆", num: "03", title: "Live Standings", desc: "Real-time scores and rankings across all categories as events unfold." },
            { icon: "🔮", num: "04", title: "Event Schedule", desc: "Full competition timeline, venue info, and all session slots throughout the event." },
          ].map((card) => (
              <div
                  key={card.num}
                  className="relative overflow-hidden bg-mystic-purple/[0.28] border border-wisteria/20 rounded-2xl backdrop-blur-md hover:-translate-y-1 hover:border-wisteria/40 hover:shadow-[0_20px_60px_rgba(75,59,110,0.35)] transition-all"
                  style={{ padding: "32px 28px" }}
                  >
              <div
                className="rounded-xl bg-mystic-purple/50 border border-wisteria/40 mb-6"
                style={{
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.25rem",
                  lineHeight: "1",
                }}>
                <span style={{ display: "block" }}>{card.icon}</span>
              </div>    
              <div className="font-cinzel text-[0.58rem] tracking-[0.15em] text-royal-gold/45 mb-3">
                {card.num}
              </div>
              <div className="font-cinzel text-[0.95rem] font-semibold text-warm-cream mb-3 leading-snug">
                {card.title}
              </div>
              <div className="text-[0.8rem] font-light text-warm-cream/50 leading-relaxed">
                {card.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-5 border-t border-wisteria/20 flex items-center justify-between bg-deep-charcoal/50 backdrop-blur-md" style={{ padding: "24px 56px" }}>
        <div className="font-cinzel text-[0.6rem] tracking-[0.15em] text-warm-cream/30">
          © 2025 AECP · Politeknik Negeri Bandung — All rights reserved
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-[0.6rem] tracking-[0.1em] uppercase text-warm-cream/30 hover:text-wisteria no-underline transition-colors">Contact</a>
          <a href="#" className="text-[0.6rem] tracking-[0.1em] uppercase text-warm-cream/30 hover:text-wisteria no-underline transition-colors">About</a>
          <a href="#" className="text-[0.6rem] tracking-[0.1em] uppercase text-warm-cream/30 hover:text-wisteria no-underline transition-colors">Privacy</a>
        </div>
      </footer>
    </>
  );
}