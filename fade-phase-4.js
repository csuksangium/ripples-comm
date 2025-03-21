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
    gsap.set(item, { yPercent: 100 }); // Change xPercent to yPercent
    // Hide items that aren't the first one to prevent them from being visible
    gsap.set(item, { visibility: "hidden" });
  }
});
function initScroll() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: verticalSection,
      pin: true,
      start: "top top",
      end: () => `+=${items.length * 180}%`,
      scrub: 2,
      invalidateOnRefresh: true,
      onUpdate: self => {
        // When we're at the very end, make sure the last item doesn't show
        if (self.progress > 0.99) {
          items[items.length-1].style.opacity = "0";
        }
      }
    },
    defaults: { ease: "power1.inOut" },
  });
  
  // For each item, create a dwell period + transition
  items.forEach((item, index) => {
    if (index !== items.length - 1) {
      // Make the item visible right before it appears
      tl.set(items[index+1], { visibility: "visible" })
      // Add dwell period
      .to({}, { duration: 0.7 })
      // Then add the transition to the next item
      .to(item, {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
      })
      .to(
        items[index + 1],
        {
          yPercent: 0,
          duration: 0.8,
        },
        "<"
      );
    }
  });
}
// Initialize
initScroll();

// Additional code to handle resize events
window.addEventListener("resize", () => {
  // Force ScrollTrigger to recalculate dimensions
  ScrollTrigger.refresh();
});
