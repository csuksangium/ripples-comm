// fade-phase-15.js (ES module)
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

let tl;
let isInitialized = false;

async function waitForLayout() {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      setTimeout(resolve, 150); // Increased delay
    } else {
      window.addEventListener('load', () => setTimeout(resolve, 150), { once: true });
    }
  });
}

function cleanup() {
  if (tl) {
    tl.kill();
    tl = null;
  }
  
  // More thorough ScrollTrigger cleanup
  ScrollTrigger.getAll().forEach(st => {
    if (st) st.kill(true);
  });
  
  isInitialized = false;
}

export default async function initScroll() {
  // Prevent multiple initializations
  if (isInitialized) return;
  
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

  // Clean up any existing instances
  cleanup();
  
  // Wait for cleanup to complete
  await new Promise(resolve => requestAnimationFrame(resolve));

  // Reset items with error handling
  items.forEach(item => {
    try {
      gsap.set(item, { clearProps: "all" });
    } catch (e) {
      console.warn('Error clearing props:', e);
    }
  });

  // Initial states
  items.forEach((item, index) => {
    try {
      gsap.set(item, index === 0 ? { opacity: 1, yPercent: 0 } : { opacity: 0, yPercent: 100 });
    } catch (e) {
      console.warn('Error setting initial state:', e);
    }
  });

  // Smoother pinning on mobile
  const pinType = getComputedStyle(document.body).transform !== 'none' ? 'transform' : 'fixed';

  try {
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
        onUpdate: () => {
          // Optional: Add any update logic here
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

    isInitialized = true;

  } catch (error) {
    console.error('Error creating timeline:', error);
    cleanup();
    return null;
  }

  // Light video defaults if items contain <video>
  items.forEach(item => {
    item.querySelectorAll("video").forEach(v => {
      v.setAttribute("playsinline", "");
      v.muted = true;
      v.preload = "metadata";
    });
  });

  // Safe refresh with delay
  setTimeout(() => {
    if (ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
      ScrollTrigger.refresh();
    }
  }, 100);

  return tl;
}

// Export cleanup function for external use if needed
export { cleanup };
