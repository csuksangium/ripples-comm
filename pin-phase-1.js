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
      scrub: 1,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "power2.out" },
  });
  
  // For each item, create a dwell period + transition
  items.forEach((item, index) => {
    if (index !== items.length - 1) {
      // First add a blank space in the timeline - this creates the "pinned" feeling
      // The "null" tween doesn't animate anything, just takes up timeline space
      tl.to({}, { duration: 1 }) // This creates a pause/dwell period
      
      // Then add the transition to the next item
      .to(item, {
        scale: 0.9,
        opacity: 0,
        duration: 0.5, // Controls fade out speed
      })
      .to(
        items[index + 1],
        {
          yPercent: 0,
          duration: 0.5, // Controls slide in speed
        },
        "<" // Makes this animation happen at the same time as the fade out
      );
    }
  });
}
// Initialize
initScroll();
