// fade-phase-13.js (ES module)
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

let tl;

export default async function initScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const verticalSection = document.querySelector("#horizontal-section");
  if (!verticalSection) return;

  const wrapper = verticalSection.querySelector(".wrapper");
  if (!wrapper) return;

  const items = wrapper.querySelectorAll(".item");
  if (!items.length) return;

  // Wait for layout to fully settle (images, fonts, async content)
  await Promise.all([
    // images
    ...[...document.images].filter(i => !i.complete).map(i => new Promise(res => {
      i.addEventListener('load', res, { once: true });
      i.addEventListener('error', res, { once: true });
    })),
    // fonts
    (document.fonts?.ready ?? Promise.resolve()),
    // let Webflow IX2/page-load animations finish a frame
    new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
  ]);

  // Reset items
  items.forEach(item => gsap.set(item, { clearProps: "all" }));

  // Initial states
  items.forEach((item, index) => {
    gsap.set(item, index === 0 ? { opacity: 1, yPercent: 0 } : { opacity: 0, yPercent: 100 });
  });

  // Cleanup from prior runs
  if (tl) tl.kill();
  ScrollTrigger.getAll().forEach(st => st.kill());

  tl = gsap.timeline({
    scrollTrigger: {
      trigger: verticalSection,
      pin: true,
      // Force fixed pinning to avoid body transforms from Webflow
      pinType: "fixed",
      pinReparent: true,
      anticipatePin: 1,
      start: "top top",
      end: () => `+=${items.length * 150 + 100}%`,
      scrub: 2,
      invalidateOnRefresh: true,
      // Extra safety: refresh once when the trigger first enters
      onEnter: () => ScrollTrigger.refresh(),
    },
    defaults: { ease: "power1.inOut" },
  });

  // Dwell + transitions
  items.forEach((item, index) => {
    if (index !== items.length - 1) {
      tl
        .to({}, { duration: 0.7 })
        .to(item, { scale: 0.95, opacity: 0, duration: 0.8 })
        .to(items[index + 1], { yPercent: 0, opacity: 1, duration: 0.8 }, "<");
    } else {
      tl
        .to({}, { duration: 1.5 })
        .to(item, { scale: 0.95, opacity: 0, duration: 0.8 });
    }
  });

  // Light video defaults if items contain <video>
  items.forEach(item => {
    item.querySelectorAll("video").forEach(v => {
      v.setAttribute("playsinline", "");
      v.muted = true;
      v.preload = "metadata";
    });
  });

  // Final double refresh after everything is mounted
  gsap.delayedCall(0.05, () => ScrollTrigger.refresh(true));
  gsap.delayedCall(0.3, () => ScrollTrigger.refresh(true));

  return tl;
}
