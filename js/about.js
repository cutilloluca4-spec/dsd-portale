/* ==================================================================
   D.S.D. — about.js
   Intro logo, reveal on scroll, nav e back-to-top per la pagina About.
   ================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------------
     0. Split del titolo hero in parole (per lo stagger GSAP)
     --------------------------------------------------------------- */
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    const lines = heroTitle.innerHTML.split("<br>");
    heroTitle.innerHTML = lines
      .map(line =>
        line
          .trim()
          .split(" ")
          .map(w => '<span class="word">' + w + "</span>")
          .join(" ")
      )
      .join("<br>");
  }
  const heroWords = heroTitle ? heroTitle.querySelectorAll(".word") : [];
  const heroRevealEls = document.querySelectorAll(".hero .reveal-up");

  gsap.set(heroWords, { y: "110%", opacity: 0 });
  gsap.set(heroRevealEls, { y: 24, opacity: 0 });

  /* ---------------------------------------------------------------
     1. Intro — animazione del logo (metà che si compongono)
     --------------------------------------------------------------- */
  const intro = document.getElementById("intro");
  const mono1 = document.querySelectorAll("#intro-logo #monogram .cls-1");
  const mono2 = document.querySelectorAll("#intro-logo #monogram .cls-2");
  const wordmarkPaths = document.querySelectorAll("#intro-logo #wordmark path");
  const gridLines = document.querySelectorAll(".intro-grid span");
  const introBar = document.getElementById("introBar");

  gsap.set(mono1, { x: -140, opacity: 0, transformOrigin: "50% 50%" });
  gsap.set(mono2, { x: 140, opacity: 0, transformOrigin: "50% 50%" });
  gsap.set(wordmarkPaths, { y: 16, opacity: 0 });
  gsap.set(gridLines, { scaleX: 0, transformOrigin: "left center" });

  const heroTl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  heroTl
    .to(heroWords, { y: "0%", opacity: 1, duration: 0.7, stagger: 0.05 }, 0)
    .to(heroRevealEls, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.25);

  const introTl = gsap.timeline({
    defaults: { ease: "power2.out" },
    onComplete: () => {
      gsap.to(intro, {
        yPercent: -100,
        duration: 0.9,
        ease: "power3.inOut",
        onComplete: () => {
          intro.style.display = "none";
          document.body.style.overflow = "";
        }
      });
      heroTl.play();
    }
  });

  document.body.style.overflow = "hidden";
  introTl
    .to(introBar, { width: "100%", duration: 1.9, ease: "power1.inOut" }, 0)
    .to(gridLines, { scaleX: 1, duration: 0.6, stagger: 0.08 }, 0)
    .to(mono1, { x: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "power3.out" }, 0.25)
    .to(mono2, { x: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: "power3.out" }, 0.25)
    .to("#intro-logo", { scale: 1.045, duration: 0.14 }, 1.0)
    .to("#intro-logo", { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.55)" }, 1.14)
    .to(wordmarkPaths, { y: 0, opacity: 1, duration: 0.45, stagger: 0.018 }, 1.15)
    .to({}, { duration: 0.35 });

  /* ---------------------------------------------------------------
     2. Reveal on scroll per il resto della pagina
     --------------------------------------------------------------- */
  const otherReveals = document.querySelectorAll(".reveal-up:not(.hero .reveal-up)");
  gsap.set(otherReveals, { y: 24, opacity: 0 });
  otherReveals.forEach(el => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%" }
    });
  });

  /* ---------------------------------------------------------------
     3. Nav: stato "scrolled" + menu mobile
     --------------------------------------------------------------- */
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");

  ScrollTrigger.create({
    start: 40,
    onUpdate: self => nav.classList.toggle("is-scrolled", self.scroll() > 40)
  });

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMobile.classList.toggle("is-open");
    });
    navMobile.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => navMobile.classList.remove("is-open"))
    );
  }

  /* ---------------------------------------------------------------
     4. Back to top
     --------------------------------------------------------------- */
  const backToTop = document.getElementById("backToTop");
  ScrollTrigger.create({
    start: 600,
    onUpdate: self => backToTop.classList.toggle("is-visible", self.scroll() > 600),
    onLeaveBack: () => backToTop.classList.remove("is-visible")
  });
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
