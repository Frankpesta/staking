import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fade in animation for page elements
 */
export function fadeIn(element: HTMLElement | string, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay,
      ease: "power2.out",
    }
  );
}

/**
 * Slide in from left animation
 */
export function slideInLeft(element: HTMLElement | string, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
    }
  );
}

/**
 * Slide in from right animation
 */
export function slideInRight(element: HTMLElement | string, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay,
      ease: "power3.out",
    }
  );
}

/**
 * Scale in animation
 */
export function scaleIn(element: HTMLElement | string, delay = 0) {
  return gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      delay,
      ease: "back.out(1.7)",
    }
  );
}

/**
 * Counter animation for numbers
 */
export function animateCounter(
  element: HTMLElement,
  targetValue: number,
  duration = 2
) {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: targetValue,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = obj.value.toFixed(2);
    },
  });
}

/**
 * Stagger animation for multiple elements
 */
export function staggerFadeIn(
  elements: HTMLElement[] | string,
  delay = 0.1
) {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: delay,
      ease: "power2.out",
    }
  );
}

/**
 * Scroll-triggered animation
 */
export function scrollFadeIn(element: HTMLElement | string) {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );
}

/**
 * Hover scale animation
 */
export function hoverScale(element: HTMLElement | string) {
  const el = typeof element === "string" ? document.querySelector(element) : element;
  if (!el) return;

  el.addEventListener("mouseenter", () => {
    gsap.to(el, { scale: 1.05, duration: 0.3, ease: "power2.out" });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" });
  });
}

/**
 * Page transition animation
 */
export function pageTransition(callback: () => void) {
  const tl = gsap.timeline();
  tl.to(".page-transition", {
    opacity: 1,
    duration: 0.3,
    ease: "power2.in",
  })
    .call(callback)
    .to(".page-transition", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
}

