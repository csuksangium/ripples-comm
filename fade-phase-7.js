// Import GSAP and the ScrollTrigger plugin from a CDN (Content Delivery Network)
import gsap from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
// Make ScrollTrigger available for use in GSAP animations
gsap.registerPlugin(ScrollTrigger);
// Select the HTML elements needed for the animation
const verticalSection = document.querySelector("#horizontal-section");
const wrapper = verticalSection.querySelector(".wrapper");
const items = wrapper.querySelectorAll(".item");

// Reset all items first to ensure consistent starting state
items.forEach(item => {
  gsap.set(item, { clearProps: "all" });
});

// Initial states - ensure first item is visible, others are hidden
items.forEach((item, index) => {
  if (index === 0) {
    // First item is visible
    gsap.set(item, { opacity: 1, yPercent: 0 });
  } else {
    // Position items below the viewport and make them invisible
    gsap.set(item, { opacity: 0, yPercent: 100 });
  }
});

function initScroll() {
  // Make sure ScrollTrigger is properly initialized
  ScrollTrigger.getAll().forEach(st => st.kill());
  
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: verticalSection,
      pin: true,
      start: "top top",
      end: () => `+=${items.length * 180}%`,
      scrub: 2,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "power1.inOut" },
  });
  
  // For each item, create a dwell period + transition
  items.forEach((item, index) => {
    if (index !== items.length - 1) {
      // Add dwell period
      tl.to({}, { duration: 0.7 })
      
      // Create transition - fade out current, fade in next
      .to(item, {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
      })
      .to(
        items[index + 1],
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
        },
        "<"
      );
    }
  });
  
  return tl;
}


// Add resize handling
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});

// Add a load event handler to ensure everything is properly initialized
window.addEventListener("load", () => {
  console.log("Page loaded, refreshing ScrollTrigger");
  ScrollTrigger.refresh(true);
});
