/* ===== Helper ===== */
const $ = (id) => document.getElementById(id);

/* ===== 1. Date object + live digital clock (setInterval) ===== */
function updateClock() {
  const now = new Date();                       // Date object
  $("liveClock").textContent = now.toLocaleTimeString();
  $("dateLine").textContent = now.toDateString();
}
updateClock();
setInterval(updateClock, 1000);                 // runs every second
$("year").textContent = new Date().getFullYear();

/* ===== 2. Typing effect (setTimeout) ===== */
const phrases = ["Aspiring Software Developer", "Web Development Enthusiast", "Creator of E-DOUSE"];
let phraseIndex = 0, charIndex = 0, deleting = false;
function typeEffect() {
  const text = phrases[phraseIndex];
  charIndex += deleting ? -1 : 1;
  $("typed").textContent = text.substring(0, charIndex);
  let delay = deleting ? 40 : 90;
  if (!deleting && charIndex === text.length) { deleting = true; delay = 1400; }
  else if (deleting && charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 400; }
  setTimeout(typeEffect, delay);
}
typeEffect();

/* ===== 3. Animated navbar, scroll progress, active link ===== */
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  $("navbar").classList.toggle("scrolled", window.scrollY > 40);   // change class/CSS on scroll
  const max = document.body.scrollHeight - window.innerHeight;
  $("scrollBar").style.width = (window.scrollY / max) * 100 + "%";
  sections.forEach((sec) => {
    const link = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
    const inView = window.scrollY + 120 >= sec.offsetTop && window.scrollY + 120 < sec.offsetTop + sec.offsetHeight;
    if (link) link.classList.toggle("active", inView);
  });
});
$("menuBtn").addEventListener("click", () => $("navLinks").classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", () => $("navLinks").classList.remove("open")));

/* ===== 4. Scroll reveal + progress bars + counters ===== */
function animateCounter(el) {
  const target = +el.dataset.target;
  let value = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {              // setInterval
    value += step;
    if (value >= target) { value = target; clearInterval(timer); }  // clearInterval
    el.textContent = value;
  }, 25);
}
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".bar i").forEach((b) => (b.style.width = b.dataset.level + "%"));
    entry.target.querySelectorAll(".counter").forEach(animateCounter);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

/* ===== 5. Dynamic background colour + CSS property changes ===== */
const colours = ["#050b1a", "#0a1a2f", "#12082b", "#04201f", "#1a0b14"];
let colourIndex = 0;
function changeBackground() {
  colourIndex = (colourIndex + 1) % colours.length;
  document.body.style.background = colours[colourIndex];
}
$("themeBtn").addEventListener("click", changeBackground);
$("bgBtn").addEventListener("click", changeBackground);

/* ===== 6. Font size changes: click + mouseover/mouseout ===== */
const sizeText = $("sizeText");
sizeText.addEventListener("mouseover", () => { sizeText.style.fontSize = "1.5rem"; });
sizeText.addEventListener("mouseout", () => { sizeText.style.fontSize = "1rem"; });
let big = false;
$("sizeBtn").addEventListener("click", () => {
  big = !big;
  document.querySelector(".intro").style.fontSize = big ? "1.3rem" : "1rem";
});

/* ===== 7. Show / hide using style.display ===== */
$("toggleBtn").addEventListener("click", () => {
  const box = $("hideBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
});

/* ===== 8. Timers: setInterval, clearInterval, setTimeout, clearTimeout ===== */
let counter = 0, intervalId = null, timeoutId = null;
$("startInt").addEventListener("click", () => {
  if (intervalId) return;                        // prevent double start
  intervalId = setInterval(() => { counter++; $("timerOut").textContent = "Counter: " + counter; }, 500);
});
$("stopInt").addEventListener("click", () => { clearInterval(intervalId); intervalId = null; });
$("startTO").addEventListener("click", () => {
  clearTimeout(timeoutId);
  $("toMsg").textContent = "Message in 3 seconds...";
  timeoutId = setTimeout(() => { $("toMsg").textContent = "setTimeout finished!"; }, 3000);
});
$("stopTO").addEventListener("click", () => { clearTimeout(timeoutId); $("toMsg").textContent = "Timeout cancelled."; });

/* ===== 9. Moving box animation (setInterval) ===== */
let moveId = null, boxPos = 0, dir = 1;
$("moveBtn").addEventListener("click", () => {
  const box = $("moveBox"), limit = box.parentElement.clientWidth - box.offsetWidth;
  if (moveId) { clearInterval(moveId); moveId = null; $("moveBtn").textContent = "Move box"; return; }
  $("moveBtn").textContent = "Stop box";
  moveId = setInterval(() => {
    boxPos += 3 * dir;
    if (boxPos >= limit || boxPos <= 0) dir *= -1;   // bounce at the edges
    box.style.left = boxPos + "px";
  }, 16);
});

/* ===== 10. Fade in / fade out using opacity ===== */
let fadeId = null, opacity = 1, fadeDir = -1;
$("fadeBtn").addEventListener("click", () => {
  clearInterval(fadeId);
  fadeDir = opacity > 0.5 ? -1 : 1;
  fadeId = setInterval(() => {
    opacity = Math.min(1, Math.max(0, opacity + fadeDir * 0.05));
    $("fadeBox").style.opacity = opacity;
    if (opacity === 0 || opacity === 1) clearInterval(fadeId);
  }, 30);
});

/* ===== 11. E-DOUSE delivery tracker (setInterval + clearInterval) ===== */
let trackId = null, progress = 0;
const stages = [[0, "Order placed"], [34, "Picked up from PG"], [67, "Washing and ironing"], [100, "Delivered!"]];
function drawTracker() {
  $("trackFill").style.width = progress + "%";
  $("truck").style.left = progress + "%";
  const spans = $("trackSteps").children;
  stages.forEach((s, i) => spans[i].classList.toggle("done", progress >= s[0] && (i > 0 || progress > 0)));
  const current = stages.filter((s) => progress >= s[0]).pop();
  $("trackStatus").textContent = progress ? current[1] + " (" + progress + "%)" : "Ready to start";
}
$("startTrack").addEventListener("click", () => {
  if (trackId) return;
  if (progress >= 100) progress = 0;
  trackId = setInterval(() => {
    progress++;
    drawTracker();
    if (progress >= 100) { clearInterval(trackId); trackId = null; }
  }, 80);
});
$("stopTrack").addEventListener("click", () => { clearInterval(trackId); trackId = null; });
$("resetTrack").addEventListener("click", () => { clearInterval(trackId); trackId = null; progress = 0; drawTracker(); });

/* ===== 12. Contact form validation ===== */
function setError(id, msg) { $(id + "Err").textContent = msg; return msg === ""; }
function validateName() {
  const v = $("name").value.trim();
  if (!v) return setError("name", "Name is required.");
  if (v.length > 8) return setError("name", "Name can be at most 8 characters.");
  if (!/^[A-Za-z ]+$/.test(v)) return setError("name", "Use letters and spaces only.");
  return setError("name", "");
}
function validateEmail() {
  const v = $("email").value.trim();
  return setError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address.");
}
function validatePhone() {
  const v = $("phone").value.trim();
  return setError("phone", /^[6-9]\d{9}$/.test(v) ? "" : "Phone must be 10 digits and start with 6, 7, 8 or 9.");
}
function validateMessage() {
  return setError("message", $("message").value.trim() ? "" : "Message cannot be empty.");
}
["name", "email", "phone", "message"].forEach((id) =>
  $(id).addEventListener("input", { name: validateName, email: validateEmail, phone: validatePhone, message: validateMessage }[id]));

$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const ok = [validateName(), validateEmail(), validatePhone(), validateMessage()].every(Boolean);
  const out = $("formSuccess");
  if (ok) {
    out.textContent = "Thank you! Your details are valid. (Demo only: sending needs a backend.)";
    $("contactForm").reset();
    setTimeout(() => (out.textContent = ""), 5000);
  } else out.textContent = "";
});
