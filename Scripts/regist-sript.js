const starsEl = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const size = Math.random() * 2 + 0.5;
  s.style.cssText = `width:${size}px;height:${size}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${3+Math.random()*4}s;--min:${0.05+Math.random()*0.2};opacity:0.1;animation-delay:${Math.random()*6}s;`;
  starsEl.appendChild(s);
}

function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('form-view').style.display = 'none';
  const sv = document.getElementById('success-view');
  sv.style.display = 'flex';
}

function resetForm() {
  document.getElementById('reg-form').reset();
  document.getElementById('success-view').style.display = 'none';
  document.getElementById('form-view').style.display = 'block';
}