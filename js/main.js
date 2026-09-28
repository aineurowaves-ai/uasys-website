(() => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    mobileNav.hidden = true;
  };

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    if (open) closeMenu();
    else {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Close menu");
      mobileNav.hidden = false;
    }
  });

  mobileNav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const i = siblings.indexOf(el);
    if (i > 0) el.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
