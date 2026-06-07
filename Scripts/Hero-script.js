const starsEl = document.getElementById('stars');
for (let i = 0; i < 120; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 2 + 0.5;
  const delay = Math.random() * 6;
  const dur = 3 + Math.random() * 4;
  const minOp = 0.05 + Math.random() * 0.2;
  s.style.cssText = `
    width:${size}px; height:${size}px;
    top:${Math.random()*100}%; left:${Math.random()*100}%;
    --d:${dur}s; --min:${minOp}; opacity:${minOp};
    animation-delay:${delay}s;
  `;
  starsEl.appendChild(s);
}