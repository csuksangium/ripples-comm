// fade-phase-13.js (ES module)
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

let tl;

async function waitForLayout() {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      // Give extra time for Webflow to settle
      setTimeout(resolve, 100);
    } else {
      window.addEventListener('load', () => setTimeout(resolve, 100), { once: true });
    }
  });
}

export default async function initScroll() {
  // Respect reduced motion
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  
  // Wait for layout stability
  await waitForLayout();
  
  const verticalSection = document.querySelector("#horizontal-section");
  if (!verticalSection) return;

  const wrapper = verticalSection.querySelector(".wrapper");
  if (!wrapper) return;

  const items = wrapper.querySelectorAll(".item");
  if (!items.length) return;

  // Cleanup from prior runs
  if (tl) tl.kill();
  ScrollTrigger.getAll().forEach(st => st.kill());

  // Wait one more frame to ensure DOM is painted
  await new Promise(resolve => requestAnimationFrame(resolve));

  // Reset items
  items.forEach(item => gsap.set(item, { clearProps: "all" }));

  // Initial states
  items.forEach((item, index) => {
    gsap.set(item, index === 0 ? { opacity: 1, yPercent: 0 } : { opacity: 0, yPercent: 100 });
  });

  // Smoother pinning on mobile
  const pinType = getComputedStyle(document.body).transform !== 'none' ? 'transform' : 'fixed';

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
      onRefresh: () => {
        // Recalculate positions on refresh
        ScrollTrigger.refresh();
      }
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

  // Final refresh after everything is set up
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });

  return tl;
}
