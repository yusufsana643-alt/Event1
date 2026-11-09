/* Gather: event listing, search, filter, registration, countdown, theme */
const EVENTS = [
  { id: 1, name: "CodeSprint 24h Hackathon", category: "Tech", date: "2026-12-05T10:00", venue: "Innovation Hall, KIIT Square", desc: "Build a working prototype in 24 hours with mentors on call.", more: ["Teams of 2 to 4", "Prizes worth Rs. 1,00,000", "Meals included"], colors: ["#4B2FE0", "#9b8cff"] },
  { id: 2, name: "Sunset Indie Music Night", category: "Music", date: "2026-11-21T18:30", venue: "Open Air Stage, Janpath", desc: "Six local bands, one open lawn and a golden hour set list.", more: ["Gates open 5:30 PM", "Food stalls on site", "All ages welcome"], colors: ["#ff6b6b", "#ffb703"] },
  { id: 3, name: "UI/UX Design Workshop", category: "Workshop", date: "2026-11-28T11:00", venue: "Studio 4, Design Block", desc: "Learn to take an app idea from sketch to clickable prototype.", more: ["Hands-on in Figma", "Bring a laptop", "Certificate provided"], colors: ["#0f9d8a", "#7be0cf"] },
  { id: 4, name: "Startup Pitch Day", category: "Business", date: "2026-12-12T14:00", venue: "Auditorium B", desc: "Ten student founders pitch to a panel of investors.", more: ["Live Q&A with judges", "Networking tea", "Open to all students"], colors: ["#1b1b3a", "#4B2FE0"] },
  { id: 5, name: "Odissi and Folk Dance Fest", category: "Culture", date: "2026-12-19T17:00", venue: "Rabindra Mandap", desc: "An evening of classical and folk performances from across Odisha.", more: ["Seated entry", "Photography allowed", "Runs about 3 hours"], colors: ["#c2185b", "#ff9a9e"] },
  { id: 6, name: "City Half Marathon", category: "Sports", date: "2027-01-10T05:30", venue: "Marine Drive Start Line", desc: "A flat, fast 21 km route with hydration points every 3 km.", more: ["Timing chip included", "10 km option", "Finisher medal"], colors: ["#2e7d32", "#a5d6a7"] },
  { id: 7, name: "AI and Machine Learning Talks", category: "Tech", date: "2026-11-30T15:00", venue: "Seminar Hall 2", desc: "Three short talks on applied AI from industry engineers.", more: ["Slides shared after", "Open Q&A", "Free entry"], colors: ["#283593", "#64b5f6"] },
  { id: 8, name: "Photography Walk", category: "Workshop", date: "2026-12-06T06:30", venue: "Ekamra Kanan Gate 1", desc: "Golden hour shooting with a pro. Phones and cameras both fine.", more: ["2 hour guided walk", "Feedback session", "Limited to 25"], colors: ["#ef6c00", "#ffe082"] }
];

const $ = (s, r = document) => r.querySelector(s);
const store = {
  get: () => { try { return JSON.parse(localStorage.getItem("gather-regs")) || []; } catch { return []; } },
  set: v => { try { localStorage.setItem("gather-regs", JSON.stringify(v)); } catch {} }
};
const fmt = (d, o) => new Date(d).toLocaleDateString("en-IN", o);
const upcoming = () => EVENTS.filter(e => new Date(e.date) > new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
const bg = e => `background-image:linear-gradient(135deg,${e.colors[0]},${e.colors[1]})`;
let category = "All", query = "", current = null;

/* Theme */
const root = document.documentElement;
try { root.dataset.theme = localStorage.getItem("gather-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch {}
$("#themeBtn").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("gather-theme", root.dataset.theme); } catch {}
};

/* Events grid */
function renderChips() {
  const cats = ["All", ...new Set(EVENTS.map(e => e.category))];
  $("#chips").innerHTML = cats.map(c => `<button class="chip" role="tab" aria-selected="${c === category}" data-c="${c}">${c}</button>`).join("");
}
function renderGrid() {
  const q = query.toLowerCase();
  const list = upcoming().filter(e => (category === "All" || e.category === category) &&
    (e.name + e.venue + e.desc + e.category).toLowerCase().includes(q));
  $("#grid").innerHTML = list.map(e => `
    <article class="card" tabindex="0" data-id="${e.id}" aria-label="${e.name}">
      <div class="thumb" style="${e.image ? `background-image:url(${e.image})` : bg(e)}">
        <div class="date"><small>${fmt(e.date, { month: "short" })}</small>${fmt(e.date, { day: "numeric" })}</div>
        <span class="cat">${e.category}</span>
      </div>
      <div class="body">
        <h3>${e.name}</h3>
        <p class="meta">${e.venue}</p>
        <p class="desc">${e.desc}</p>
        <button class="btn small">View and register</button>
      </div>
    </article>`).join("");
  $("#empty").hidden = list.length > 0;
}
$("#chips").onclick = e => { const c = e.target.dataset.c; if (c) { category = c; renderChips(); renderGrid(); } };
$("#search").oninput = e => { query = e.target.value.trim(); renderGrid(); };
const open = e => { const c = e.target.closest(".card"); if (c) openEvent(+c.dataset.id); };
$("#grid").onclick = open;
$("#grid").onkeydown = e => { if (e.key === "Enter") open(e); };

/* Hero countdown */
function tick() {
  const e = upcoming()[0];
  if (!e) { $("#nextTitle").textContent = "No upcoming events"; return; }
  $("#nextTitle").textContent = e.name;
  $("#nextMeta").textContent = `${fmt(e.date, { weekday: "long", day: "numeric", month: "long" })} at ${e.venue}`;
  let s = Math.max(0, Math.floor((new Date(e.date) - new Date()) / 1000));
  const parts = [["days", 86400], ["hrs", 3600], ["min", 60], ["sec", 1]].map(([l, n]) => {
    const v = Math.floor(s / n); s -= v * n;
    return `<div><b>${String(v).padStart(2, "0")}</b><span>${l}</span></div>`;
  });
  $("#timer").innerHTML = parts.join("");
  $("#nextBtn").onclick = () => openEvent(e.id);
}
setInterval(tick, 1000);

/* Modal and form */
const modal = $("#modal"), form = $("#form");
function openEvent(id) {
  current = EVENTS.find(e => e.id === id);
  $("#detail").innerHTML = `
    <div class="thumb" style="${current.image ? `background-image:url(${current.image})` : bg(current)}"></div>
    <div class="info"><h2>${current.name}</h2>
      <p><b>${fmt(current.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</b>, ${new Date(current.date).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}<br>${current.venue}</p>
      <p>${current.desc}</p><ul>${current.more.map(m => `<li>${m}</li>`).join("")}</ul></div>`;
  form.elements.event.innerHTML = `<option value="">Select an event</option>` +
    upcoming().map(e => `<option value="${e.id}" ${e.id === id ? "selected" : ""}>${e.name}</option>`).join("");
  form.reset(); form.elements.event.value = id;
  form.querySelectorAll(".err").forEach(x => x.textContent = "");
  form.querySelectorAll("input,select").forEach(x => x.classList.remove("bad", "good"));
  form.hidden = false; $("#done").hidden = true;
  modal.showModal();
}
$("#closeModal").onclick = () => modal.close();
modal.onclick = e => { if (e.target === modal) modal.close(); };

const rules = {
  name: v => !v.trim() ? "Enter your full name." : !/^[A-Za-z][A-Za-z .'-]{1,59}$/.test(v.trim()) ? "Use letters only, at least 2 characters." : "",
  email: v => !v.trim() ? "Enter your email address." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter a valid email, like name@example.com." : "",
  phone: v => !v.trim() ? "Enter your phone number." : !/^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")) ? "Enter a 10 digit mobile number starting with 6 to 9." : "",
  event: v => v ? "" : "Select an event."
};
function check(input) {
  const msg = rules[input.name](input.value);
  input.nextElementSibling.textContent = msg;
  input.classList.toggle("bad", !!msg);
  input.classList.toggle("good", !msg);
  return !msg;
}
form.addEventListener("input", e => { if (e.target.name && e.target.classList.contains("bad")) check(e.target); });
form.addEventListener("focusout", e => { if (e.target.name) check(e.target); });
form.onsubmit = ev => {
  ev.preventDefault();
  const fields = [...form.querySelectorAll("input,select")];
  if (!fields.map(check).every(Boolean)) { fields.find(f => f.classList.contains("bad")).focus(); return; }
  const rec = { name: form.name.value.trim(), email: form.email.value.trim().toLowerCase(), phone: form.phone.value.replace(/[\s-]/g, ""), eventId: +form.event.value, at: Date.now() };
  const regs = store.get();
  if (regs.some(r => r.email === rec.email && r.eventId === rec.eventId)) {
    form.email.nextElementSibling.textContent = "This email is already registered for this event.";
    form.email.classList.add("bad"); return;
  }
  regs.push(rec); store.set(regs); updateCount();
  const ev = EVENTS.find(e => e.id === rec.eventId);
  $("#done").innerHTML = `<div class="tick">&#10003;</div><h3>You are registered, ${rec.name.split(" ")[0]}!</h3>
    <p>${ev.name}<br>${fmt(ev.date, { day: "numeric", month: "long", year: "numeric" })} at ${ev.venue}</p>
    <p>A confirmation will be sent to ${rec.email}.</p><button class="btn" id="doneBtn">Done</button>`;
  form.hidden = true; $("#done").hidden = false;
  $("#doneBtn").onclick = () => modal.close();
};

/* My tickets */
const tickets = $("#tickets");
function updateCount() { $("#regCount").textContent = store.get().length; }
$("#regBtn").onclick = () => {
  const regs = store.get();
  $("#ticketList").innerHTML = regs.length ? regs.map(r => {
    const e = EVENTS.find(x => x.id === r.eventId);
    return `<li><b>${e.name}</b><br><small>${r.name}, ${r.email}<br>${fmt(e.date, { day: "numeric", month: "short", year: "numeric" })}</small></li>`;
  }).join("") : "<li>No registrations yet. Pick an event to get started.</li>";
  tickets.showModal();
};
$("#closeTickets").onclick = () => tickets.close();
tickets.onclick = e => { if (e.target === tickets) tickets.close(); };

renderChips(); renderGrid(); updateCount(); tick();
