const root = document.documentElement;
const slider = document.querySelector(".theme-slider");
const nameEl = document.querySelector(".name");
const buttons = [...document.querySelectorAll(".theme-slider button")];

const themes = root.__themes || [
  { name: "dawn", bg: "oklch(96% 0.025 21)", text: "oklch(20% 0.015 21)", muted: "oklch(50% 0.02 21)", border: "oklch(86% 0.018 21)", accent: "oklch(62% 0.19 21)", cardHover: "oklch(62% 0.19 21)", onAccent: "#fff", onAccentMuted: "rgba(255,255,255,.7)" },
  { name: "morning", bg: "oklch(97.5% 0.014 21)", text: "oklch(20% 0.015 21)", muted: "oklch(50% 0.02 21)", border: "oklch(87.5% 0.018 21)", accent: "oklch(62% 0.19 21)", cardHover: "oklch(62% 0.19 21)", onAccent: "#fff", onAccentMuted: "rgba(255,255,255,.7)" },
  { name: "noon", bg: "oklch(99.5% 0.006 21)", text: "oklch(20% 0.015 21)", muted: "oklch(50% 0.02 21)", border: "oklch(89.5% 0.018 21)", accent: "oklch(62% 0.19 21)", cardHover: "oklch(62% 0.19 21)", onAccent: "#fff", onAccentMuted: "rgba(255,255,255,.7)" },
  { name: "evening", bg: "oklch(14% 0.018 21)", text: "oklch(91% 0.012 21)", muted: "oklch(66% 0.018 21)", border: "oklch(28% 0.018 21)", accent: "oklch(70% 0.16 21)", cardHover: "oklch(70% 0.16 21)", onAccent: "#fff", onAccentMuted: "rgba(255,255,255,.7)" },
  { name: "night", bg: "oklch(6% 0.012 21)", text: "oklch(91% 0.012 21)", muted: "oklch(66% 0.018 21)", border: "oklch(28% 0.018 21)", accent: "oklch(70% 0.16 21)", cardHover: "oklch(70% 0.16 21)", onAccent: "#fff", onAccentMuted: "rgba(255,255,255,.7)" },
];

const names = [
  "Vaibhaav",
  "वैभव",
  "ವೈಭವ್",
  "వైభవ్",
  "വൈഭവ്",
  "வைபவ்",
  "ویبھو",
  "Vaibhaav",
];

let step = Number(root.getAttribute("data-theme-step")) || 3;
let dragging = false;
let startX = 0;
let startStep = step;
const stepWidth = 80 / 4;

function cssName(key) {
  return "--theme-" + key.replace(/[A-Z]/g, (match) => "-" + match.toLowerCase());
}

function applyTheme(index) {
  step = Math.max(0, Math.min(themes.length - 1, index));
  const theme = themes[step];

  root.setAttribute("data-theme", theme.name);
  root.setAttribute("data-theme-step", String(step));
  root.style.setProperty("--theme-slider-fill", `${step * 25}%`);

  Object.keys(theme).forEach((key) => {
    if (key !== "name") root.style.setProperty(cssName(key), theme[key]);
  });

  localStorage.setItem("theme-step", String(step));
}

function snapFromX(clientX) {
  const rect = slider.getBoundingClientRect();
  const nearest = Math.round((clientX - rect.left) / stepWidth);
  applyTheme(nearest);
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(Number(button.dataset.step));
  });
});

slider.addEventListener("pointerdown", (event) => {
  dragging = true;
  startX = event.clientX;
  startStep = step;
  slider.classList.add("dragging");
  slider.setPointerCapture(event.pointerId);
});

slider.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const delta = event.clientX - startX;
  const next = startStep + Math.round(delta / stepWidth);
  applyTheme(next);
});

slider.addEventListener("pointerup", (event) => {
  if (!dragging) return;
  dragging = false;
  slider.classList.remove("dragging");
  snapFromX(event.clientX);
});

slider.addEventListener("pointercancel", () => {
  dragging = false;
  slider.classList.remove("dragging");
});

let delay = 135;
let nameIndex = 1;

function animateName() {
  if (!nameEl || nameIndex >= names.length) return;
  nameEl.textContent = names[nameIndex];
  nameIndex += 1;
  delay *= 1.1;
  window.setTimeout(animateName, delay);
}

window.setTimeout(animateName, delay);

const butterflies = [...document.querySelectorAll("[data-butterfly]")];
const butterflyPerches = [...document.querySelectorAll("[data-butterfly-perch]")];
const dog = document.querySelector("[data-dog]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const occupiedPerches = new Set();

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

function randomViewportPoint(edgeBias = false) {
  const gutter = window.innerWidth < 640 ? 12 : 28;
  const x = edgeBias
    ? (Math.random() > 0.5 ? window.innerWidth - gutter : gutter)
    : gutter + Math.random() * Math.max(1, window.innerWidth - gutter * 2);
  const y = 36 + Math.random() * Math.max(1, window.innerHeight - 92);
  return { x, y };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function nearbyViewportPoint(current) {
  const gutter = window.innerWidth < 640 ? 12 : 28;
  const angle = Math.random() * Math.PI * 2;
  const distance = 150 + Math.random() * Math.min(320, window.innerWidth * 0.32);

  return {
    x: clamp(current.x + Math.cos(angle) * distance, gutter, window.innerWidth - gutter - 42),
    y: clamp(current.y + Math.sin(angle) * distance * 0.72, 28, window.innerHeight - 70),
  };
}

function perchPoint(perch, butterflyIndex) {
  const rect = perch.getBoundingClientRect();
  if (perch === dog) {
    return {
      x: Math.max(12, Math.min(window.innerWidth - 48, rect.left + rect.width * 0.42 - 18)),
      y: Math.max(14, Math.min(window.innerHeight - 48, rect.top + rect.height * 0.46 - 18)),
    };
  }
  const x = rect.left + Math.min(rect.width - 4, 8 + butterflyIndex * 9);
  return {
    x: Math.max(12, Math.min(window.innerWidth - 48, x)),
    y: Math.max(14, Math.min(window.innerHeight - 48, rect.top - 28)),
  };
}

function makeDogGoofy() {
  if (!dog) return;
  dog.classList.remove("goofy");
  void dog.offsetWidth;
  dog.classList.add("goofy");
  window.setTimeout(() => dog.classList.remove("goofy"), 800);
}

function transformAt(point, facing, rotation = 0) {
  return `translate3d(${point.x}px, ${point.y}px, 0) rotate(${rotation}deg) scaleX(${facing})`;
}

function flightKeyframes(start, end, facing, isLanding) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const normal = { x: -dy / distance, y: dx / distance };
  const bend = (34 + Math.min(92, distance * 0.16)) * (Math.random() > 0.5 ? 1 : -1);
  const firstControl = {
    x: start.x + dx * 0.3 + normal.x * bend,
    y: start.y + dy * 0.3 + normal.y * bend,
  };
  const secondControl = {
    x: start.x + dx * 0.72 - normal.x * bend * 0.42,
    y: start.y + dy * 0.72 - normal.y * bend * 0.42,
  };
  const points = [];
  const steps = 14;

  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const inverse = 1 - t;
    const point = {
      x:
        inverse ** 3 * start.x +
        3 * inverse ** 2 * t * firstControl.x +
        3 * inverse * t ** 2 * secondControl.x +
        t ** 3 * end.x,
      y:
        inverse ** 3 * start.y +
        3 * inverse ** 2 * t * firstControl.y +
        3 * inverse * t ** 2 * secondControl.y +
        t ** 3 * end.y,
    };
    const flutter = Math.sin(t * Math.PI * 5) * 3.5 * Math.sin(t * Math.PI);
    point.x += normal.x * flutter;
    point.y += normal.y * flutter;

    const previous = points[index - 1]?.point || start;
    const heading = Math.atan2(point.y - previous.y, point.x - previous.x) * (180 / Math.PI);
    const rotation = index === steps && isLanding ? 0 : clamp(heading * 0.18, -16, 16);
    points.push({ point, rotation });
  }

  return points.map(({ point, rotation }, index) => ({
    transform: transformAt(point, facing, rotation),
    offset: index / steps,
  }));
}

async function animateButterfly(butterfly, index) {
  let current = randomViewportPoint(true);
  let facing = index % 2 ? -1 : 1;
  butterfly.style.transform = transformAt(current, facing);

  await wait(450 + index * 420);
  butterfly.style.opacity = "1";

  while (!reducedMotion.matches && document.body.contains(butterfly)) {
    const visiblePerches = butterflyPerches.filter((perch) => {
      const rect = perch.getBoundingClientRect();
      return !occupiedPerches.has(perch) && rect.bottom > 36 && rect.top < window.innerHeight - 20;
    });
    const shouldPerch = visiblePerches.length > 0 && Math.random() > 0.44;
    const targetPerch = shouldPerch
      ? visiblePerches[Math.floor(Math.random() * visiblePerches.length)]
      : null;
    if (targetPerch) occupiedPerches.add(targetPerch);
    const target = targetPerch ? perchPoint(targetPerch, index) : nearbyViewportPoint(current);
    const deltaX = target.x - current.x;
    const nextFacing = Math.abs(deltaX) > 16 ? (deltaX < 0 ? -1 : 1) : facing;
    const distance = Math.hypot(deltaX, target.y - current.y);
    const duration = clamp(1200 + distance * 3.8, 1600, 4300);

    if (nextFacing !== facing) {
      butterfly.dataset.state = "turning";
      const turn = butterfly.animate(
        [
          { transform: transformAt(current, facing) },
          { transform: `translate3d(${current.x}px, ${current.y}px, 0) scaleX(0.08)` },
          { transform: transformAt(current, nextFacing) },
        ],
        { duration: 240, easing: "ease-in-out", fill: "forwards" },
      );
      try {
        await turn.finished;
      } catch (error) {
        if (targetPerch) occupiedPerches.delete(targetPerch);
        return;
      }
      facing = nextFacing;
      butterfly.style.transform = transformAt(current, facing);
      turn.cancel();
    }

    butterfly.dataset.state = "flying";
    const flight = butterfly.animate(
      flightKeyframes(current, target, facing, Boolean(targetPerch)),
      {
        duration,
        easing: "linear",
        fill: "forwards",
      },
    );

    try {
      await flight.finished;
    } catch (error) {
      if (targetPerch) occupiedPerches.delete(targetPerch);
      return;
    }

    butterfly.style.transform = transformAt(target, facing);
    flight.cancel();
    current = target;
    butterfly.dataset.state = targetPerch ? "resting" : "hovering";
    if (targetPerch === dog) makeDogGoofy();
    await wait(targetPerch ? 1900 + Math.random() * 3000 : 120 + Math.random() * 260);
    if (targetPerch) occupiedPerches.delete(targetPerch);
  }
}

if (!reducedMotion.matches) {
  butterflies.forEach((butterfly, index) => animateButterfly(butterfly, index));
}
