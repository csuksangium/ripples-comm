// fade-phase-13.js (ES module)

// Prefer jsDelivr ESM paths (stable + fast)
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

let tl; // keep a reference so we can kill on re-init

export default function initScroll() {
  // Respect reduced-motion
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const verticalSection = document.querySelector("#horizontal-section");
  if (!verticalSection) return;

  const wrapper = verticalSection.querySelector(".wrapper");
  const items = wrapper ? wrapper.querySelectorAll(".item") : null;
  if (!wrapper || !items || !items.length) return;

  // Reset items
  items.forEach(item => gsap.set(item, { clearProps: "all" }));

  // Initial states
  items.forEach((item, index) => {
    gsap.set(item, index === 0 ? { opacity: 1, yPercent: 0 } : { opacity: 0, yPercent: 100 });
  });

  // Cleanup previous run
  if (tl) tl.kill();
  ScrollTrigger.getAll().forEach(st => st.kill());

  // Smoother pinning on mobile
  const pinType = document.body.style.transform ? "transform" : "fixed";

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: verticalSection,
      pin: true,
      pinType,
      anticipatePin: 1,
      start: "top top",
      end: () => `+=${items.length * 150 + 100}%`,
      scrub: 2,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "power1.inOut" },
  });

  items.forEach((item, index) => {
    if (index !== items.length - 1) {
      tl.to({}, { duration: 0.7 })
        .to(item, { scale: 0.95, opacity: 0, duration: 0.8 })
        .to(items[index + 1], { yPercent: 0, opacity: 1, duration: 0.8 }, "<");
    } else {
      tl.to({}, { duration: 1.5 })
        .to(item, { scale: 0.95, opacity: 0, duration: 0.8 });
    }
  });

  // If items contain <video>, set light defaults
  items.forEach(item => {
    item.querySelectorAll("video").forEach(v => {
      v.setAttribute("playsinline", "");
      v.muted = true;
      v.preload = "metadata";
    });
  });

  // Final refresh pass
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return tl;
}
