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
      end: () => `+=${items.length * 250}%`, // Increased scroll distance
      scrub: 0.5, // Reduced from 1 to 0.5 for snappier response
      snap: {
        snapTo: 1 / (items.length - 1), // Snap to each section
        duration: 0.1, // Quick snap duration
        ease: "power1.inOut" // Slightly eased snap
      },
      invalidateOnRefresh: true,
    },
    defaults: { 
      ease: "power2.inOut", // Changed from "none" to add some snappiness
      duration: 0.5 // Control animation duration
    },
  });
  items.forEach((item, index) => {
    if (index !== items.length - 1) {
      tl.to(item, {
        scale: 0.9,
        opacity: 0,
      }).to(
        items[index + 1],
        {
          yPercent: 0, // Change xPercent to yPercent
        },
        "<"
      );
    }
  });
}
// Initialize
initScroll();
