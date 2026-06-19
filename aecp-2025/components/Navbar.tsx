export default function Navbar() {
  return (
    <nav className="relative z-[100] flex items-center justify-between border-b border-wisteria/20 backdrop-blur-xl bg-[#1e1628]/65" style={{ padding: "20px 56px" }}>
      <a href="/" className="flex flex-col gap-1 no-underline">
        <div className="font-cinzel font-semibold text-base tracking-[0.22em] bg-gradient-to-r from-royal-gold via-wisteria to-royal-gold bg-clip-text text-transparent">
          AECP 2025
        </div>
        <div className="text-[0.58rem] tracking-[0.18em] uppercase text-warm-cream/30">
          Politeknik Negeri Bandung
        </div>
      </a>

      <ul className="flex list-none" style={{ gap: "40px" }}>
        <li>
          <a href="#" className="text-xs tracking-[0.12em] uppercase text-warm-cream/50 hover:text-wisteria transition-colors font-medium">
            Competition
          </a>
        </li>
        <li>
          <a href="#" className="text-xs tracking-[0.12em] uppercase text-warm-cream/50 hover:text-wisteria transition-colors font-medium">
            Attendance
          </a>
        </li>
        <li>
          <a href="#" className="text-xs tracking-[0.12em] uppercase text-warm-cream/50 hover:text-wisteria transition-colors font-medium">
            Documentation
          </a>
        </li>
        <li>
          <a href="#" className="text-xs tracking-[0.12em] uppercase text-warm-cream/50 hover:text-wisteria transition-colors font-medium">
            Schedule
          </a>
        </li>
      </ul>

      
        <a href="/register"
        className="font-cinzel text-xs tracking-[0.14em] text-royal-gold border border-royal-gold/40 rounded-full bg-royal-gold/10 hover:bg-royal-gold/20 transition-all no-underline"
        style={{ padding: "10px 20px" }}
      >
        Register Now
      </a>
    </nav>
  );
}