// Import GSAP and the ScrollTrigger plugin from a CDN (Content Delivery Network)
import gsap from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
// Make ScrollTrigger available for use in GSAP animations
gsap.registerPlugin(ScrollTrigger);
// Select the HTML elements needed for the animation
const verticalSection = document.querySelector("#horizontal-section");
const wrapper = verticalSection.querySelector(".wrapper");
const items = wrapper.querySelectorAll(".item");
// Initial states
items.forEach((item, index) => {
  if (index !== 0) {
    // Position items below the viewport
    gsap.set(item, { yPercent: 100 });
    // Make them invisible
    gsap.set(item, { autoAlpha: 0 });
  }
});
function initScroll() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: verticalSection,
      pin: true,
      start: "top top",
      end: () => `+=${items.length * 200}%`,
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
      // Then add the transition to the next item
      .to(item, {
        scale: 0.95,
        autoAlpha: 0, // Using autoAlpha instead of opacity
        duration: 0.8,
      })
      // Start making the next item visible as we begin the transition
      .to(
        items[index + 1],
        {
          yPercent: 0,
          autoAlpha: 1, // Using autoAlpha instead of opacity and visibility
          duration: 0.8,
        },
        "<"
      );
    }
  });
}
// Initialize
initScroll();

// Create an extra barrier for overflow
gsap.set(wrapper, { overflow: "hidden", height: "100%" });

// Additional code to handle resize events
window.addEventListener("resize", () => {
  // Force ScrollTrigger to recalculate dimensions
  ScrollTrigger.refresh();
});
