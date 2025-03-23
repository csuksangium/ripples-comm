// Import GSAP and the ScrollTrigger plugin
import gsap from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function() {
  // Initialize Locomotive Scroll
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".locomotive-scroll"),
    smooth: true,
    smartphone: {
      smooth: true
    },
    tablet: {
      smooth: true
    },
    smoothMobile: 1,
    multiplier: 1.0,
  });
  
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  // Set up the proxy for ScrollTrigger
  ScrollTrigger.scrollerProxy(".locomotive-scroll", {
    scrollTop(value) {
      return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
    },
    pinType: document.querySelector(".locomotive-scroll").style.transform ? "transform" : "fixed"
  });
  
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
        scroller: ".locomotive-scroll", // Important: point to the locomotive-scroll container
        pin: true,
        start: "top top",
        end: () => `+=${items.length * 200 + 150}%`,
        scrub: 2,
        invalidateOnRefresh: true,
      },
      defaults: { ease: "power1.inOut" },
    });
    
    // For each item, create a dwell period + transition
    items.forEach((item, index) => {
      if (index !== items.length - 1) {
        // Add dwell period - standard for most items
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
      } else {
        // This is the last item - add an extended dwell period
        tl.to({}, { duration: 1.5 }); // Extended duration for last item
        
        // Add fade-out animation for the last item
        tl.to(item, {
          scale: 0.95,
          opacity: 0,
          duration: 0.8,
        });
      }
    });
    
    return tl;
  }
  
  // Initialize the scroll animations
  const timeline = initScroll();
  
  // Update ScrollTrigger when Locomotive Scroll updates
  locoScroll.on("scroll", ScrollTrigger.update);
  
  // Update both when window resizes
  window.addEventListener("resize", () => {
    locoScroll.update();
    ScrollTrigger.refresh();
  });
  
  // After everything is set up, wait a bit and update both
  setTimeout(() => {
    locoScroll.update();
    ScrollTrigger.refresh();
  }, 2000);
});
