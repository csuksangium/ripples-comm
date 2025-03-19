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
      end: () => `+=${items.length * 100}%`,
      scrub: 1,
      invalidateOnRefresh: true,
    },
    defaults: { ease: "none" },
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
