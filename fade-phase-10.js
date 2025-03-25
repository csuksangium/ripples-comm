import gsap from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function initResponsiveScroll() {
  // Check device type
  const isMobile = window.innerWidth <= 768;

  const verticalSection = document.querySelector("#horizontal-section");
  const wrapper = verticalSection.querySelector(".wrapper");
  const items = wrapper.querySelectorAll(".item");

  // Reset any existing ScrollTriggers
  ScrollTrigger.getAll().forEach(st => st.kill());

  // Different approaches for mobile and desktop
  if (isMobile) {
    // Mobile-specific animation
    items.forEach((item, index) => {
      gsap.to(item, {
        scrollTrigger: {
          trigger: item,
          start: "top center",
          toggleActions: "play none none reverse",
          markers: false,
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power1.inOut"
      });
    });
  } else {
    // Desktop pin and fade scroll (your original logic)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: verticalSection,
        pin: true,
        start: "top top",
        end: () => `+=${items.length * 150 + 100}%`,
        scrub: 2,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "power1.inOut" },
    });
    
    items.forEach((item, index) => {
      if (index !== items.length - 1) {
        tl.to({}, { duration: 0.7 })
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
      } else {
        tl.to({}, { duration: 1.5 });
        tl.to(item, {
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
        });
      }
    });

    return tl;
  }
}

// Initialize on load and resize
function setupResponsiveAnimation() {
  initResponsiveScroll();
  
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
    initResponsiveScroll(); // Reinitialize on resize
  });
}

window.addEventListener("load", setupResponsiveAnimation);
