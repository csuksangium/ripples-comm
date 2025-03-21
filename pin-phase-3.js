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
      end: () => `+=${items.length * 200}%`, // Reduced from 300% to 200%
      scrub: 2,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "power1.inOut" },
  });
  
  // For each item, create a dwell period + transition
  items.forEach((item, index) => {
    if (index !== items.length - 1) {
      // Reduced dwell period duration
      tl.to({}, { duration: 0.7 }) // Reduced from 1 to 0.7
      
      // Then add the transition to the next item
      .to(item, {
        scale: 0.95,
        opacity: 0,
        duration: 0.8, // Reduced from 1 to 0.8
      })
      .to(
        items[index + 1],
        {
          yPercent: 0,
          duration: 0.8, // Reduced from 1 to 0.8
        },
        "<"
      );
    }
  });
}
// Initialize
initScroll();
