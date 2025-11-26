
/* Config */
const PHONE = "+917093434056";
const MRP = 4999;
const OFFER = 2999;

/* Products */
const products = [
  { id: "gigi", name: "Gigi — Joy", image: "assets/images/gigi.png" },
  { id: "zenzo", name: "Zenzo — Calm", image: "assets/images/zenzo.png" },
  { id: "bluvi", name: "Bluvi — Curiosity", image: "assets/images/bluvi.png" },
  { id: "melo", name: "Melo — Caring", image: "assets/images/melo.png" },
  { id: "nix", name: "Nix — Alert", image: "assets/images/nix.png" },
  { id: "sparx", name: "Sparx — Excitement", image: "assets/images/sparx.png" },
  { id: "nova", name: "Nova — Wonder", image: "assets/images/nova.png" },
  { id: "bobo", name: "Bobo — Warmth", image: "assets/images/bobo.png" },
  { id: "astra", name: "Astra — Focus", image: "assets/images/astra.png" },
];

function inr(n){ return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n); }

/* Build cards */
const grid = document.getElementById('productGrid');
grid.innerHTML = products.map((p,i)=>`
  <div class="col-12 col-sm-6 col-lg-4">
    <div class="card-gz h-100 card-3d" data-tilt data-reveal style="--d:${i*0.04}s">
      <div class="shine"></div>
      <div class="img-wrap"><img src="${p.image}" alt="${p.name}"></div>
      <div class="p-3 pt-2">
        <h5 class="fw-bold mb-1">${p.name}</h5>
        <p class="text-white-60 small mb-2">Emotion‑Aware • Wi‑Fi + BLE • Qi wireless</p>
        <div class="d-flex align-items-center gap-2 price">
          <span class="text-white-60"><s>${inr(MRP)}</s></span>
          <span class="text-success fw-bold">${inr(OFFER)}</span>
          <span class="badge border border-success-subtle text-success bg-success-subtle">Launch Offer</span>
        </div>
      </div>
      <div class="p-3 pt-0 pb-4">
        <div class="d-grid gap-2">
          <a class="btn btn-success rounded-pill magnetic" target="_blank" href="${waPre({model:p.name,qty:1})}"><i class="bi bi-whatsapp me-2"></i>Pre‑order via WhatsApp</a>
          <button class="btn btn-outline-light rounded-pill magnetic" data-bs-toggle="modal" data-bs-target="#orderModal" data-model="${p.name}">Customize & Pre‑order</button>
        </div>
      </div>
    </div>
  </div>
`).join('');


/* Modal model options */
const modelSelect = document.querySelector('#orderModal select[name="model"]');
modelSelect.innerHTML = products.map(p=>`<option>${p.name}</option>`).join('');

/* WhatsApp formatter */
function waPre({model, qty=1, name='', city='', notes=''}){
  const text = [
    `Pre‑order: ${model}`,
    `Qty: ${qty}`,
    `Offer: ${inr(OFFER)} (MRP ${inr(MRP)})`,
    name && `Name: ${name}`,
    city && `City: ${city}`,
    notes && `Notes: ${notes}`
  ].filter(Boolean).join('\n');
  const number = PHONE.replace(/[^0-9]/g,'');
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

document.getElementById('orderModal').addEventListener('show.bs.modal', (evt)=>{
  const m = evt.relatedTarget?.getAttribute('data-model');
  if (m){
    for (const opt of modelSelect.options) opt.selected = opt.textContent === m;
  }
});

document.getElementById('orderForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const url = waPre({
    model: fd.get('model'),
    qty: fd.get('qty') || 1,
    name: fd.get('name') || '',
    city: fd.get('city') || '',
    notes: fd.get('notes') || ''
  });
  window.open(url,'_blank');
});

/* GSAP effects */
gsap.registerPlugin(ScrollTrigger);

/* Reveal */
document.querySelectorAll('[data-reveal]').forEach((el, i)=>{
  const d = parseFloat(el.getAttribute('delay') || el.style.getPropertyValue('--d') || 0);
  gsap.fromTo(el, {y:24, opacity:0}, {y:0, opacity:1, duration:.8, delay:d, ease:"power3.out",
    scrollTrigger:{trigger:el, start:"top 85%", toggleActions:"play none none reverse"}});
});

/* Parallax for gallery */
gsap.utils.toArray('.pg-item').forEach((el, i)=>{
  gsap.to(el, {
    y: i===0? 120 : (i===1? -140 : 80),
    ease:"none",
    scrollTrigger:{trigger:el.closest('.parallax-gallery'), start:"top bottom", end:"bottom top", scrub:true}
  });
});

/* Hero mouse parallax */
const heroStage = document.querySelector('.hero-stage');
const heroImg = document.querySelector('.hero-image');
const p1 = document.querySelector('.hero-parallax.p1');
const p2 = document.querySelector('.hero-parallax.p2');

heroStage.addEventListener('mousemove', (e)=>{
  const r = heroStage.getBoundingClientRect();
  const x = (e.clientX - r.left)/r.width - .5;
  const y = (e.clientY - r.top)/r.height - .5;
  const rx = y * -8, ry = x * 12;
  heroImg.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
  p1.style.transform = `translate3d(${x*20}px, ${y*20}px, 0)`;
  p2.style.transform = `translate3d(${x*-24}px, ${y*-24}px, 0)`;
});
heroStage.addEventListener('mouseleave', ()=>{
  heroImg.style.transform = '';
  p1.style.transform = '';
  p2.style.transform = '';
});

/* 3D tilt + shine on cards */
document.querySelectorAll('.card-3d').forEach(card=>{
  const shine = card.querySelector('.shine');
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    const rx = (y - .5) * -10;
    const ry = (x - .5) * 12;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    shine.style.setProperty('--mx', `${x*100}%`);
    shine.style.setProperty('--my', `${y*100}%`);
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform='';
  });
});

/* Magnetic buttons */
document.querySelectorAll('.magnetic').forEach(btn=>{
  const strength = 12;
  btn.addEventListener('mousemove', (e)=>{
    const r = btn.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width/2);
    const y = e.clientY - (r.top + r.height/2);
    btn.style.transform = `translate(${x/strength}px, ${y/strength}px)`;
    btn.style.setProperty('--mx', `${((x/r.width)+.5)*100}%`);
    btn.style.setProperty('--my', `${((y/r.height)+.5)*100}%`);
  });
  btn.addEventListener('mouseleave', ()=> btn.style.transform='');
});

/* Cursor blob follow */
const cursorBlob = document.getElementById('cursorBlob');
let cx=0, cy=0;
window.addEventListener('mousemove', (e)=>{
  cx = e.clientX; cy = e.clientY;
  cursorBlob.style.transform = `translate(${cx}px, ${cy}px)`;
});

/* Button ripple-like highlight handled in CSS with --mx/--my set from magnetic handler above */

/* Year */
document.getElementById('year').textContent = new Date().getFullYear();
