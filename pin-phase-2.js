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
  }
});
function initScroll() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: verticalSection,
      pin: true,
      start: "top top",
      end: () => `+=${items.length * 300}%`, // Increased for longer scrolling distance
      scrub: 2, // Increased for smoother scrolling (higher = smoother)
      invalidateOnRefresh: true,
    },
    defaults: { ease: "power1.inOut" }, // Changed to a gentler easing for smoother transitions
  });
  
  // For each item, create a dwell period + transition
  items.forEach((item, index) => {
    if (index !== items.length - 1) {
      // First add a blank space in the timeline - this creates the "pinned" feeling
      tl.to({}, { duration: 1 }) // This creates a pause/dwell period
      
      // Then add the transition to the next item with smoother, longer durations
      .to(item, {
        scale: 0.95, // Less scale reduction for smoother feel
        opacity: 0,
        duration: 1, // Increased duration for smoother fade out
      })
      .to(
        items[index + 1],
        {
          yPercent: 0,
          duration: 1, // Increased duration for smoother slide in
        },
        "<" // Makes this animation happen at the same time as the fade out
      );
    }
  });
}
// Initialize
initScroll();
