(() => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const mobileNav = document.getElementById("mobileNav");
  const page = document.body.dataset.page || "index";

  const meta = {
    en: {
      index: {
        title: "UASYS GmbH — Engineering for autonomous systems",
        description:
          "UASYS GmbH designs and integrates navigation, embedded electronics, inertial systems and RF communication for autonomous, unmanned and industrial platforms.",
      },
      legal: {
        title: "Legal notice — UASYS GmbH",
        description: "Legal notice of UASYS GmbH, Roosstrasse 53, 8832 Wollerau, Switzerland.",
      },
      privacy: {
        title: "Datenschutz — UASYS GmbH",
        description: "How UASYS GmbH handles personal data on this website.",
      },
      "service-auto": {
        title: "Autonomous systems & navigation — UASYS GmbH",
        description:
          "UASYS develops autonomous control and navigation architectures on PX4 and ArduPilot, with sensor fusion, GNSS and embedded integration.",
      },
      "service-imu": {
        title: "Inertial measurement & sensors — UASYS GmbH",
        description:
          "UASYS develops MEMS IMU architectures, calibration and sensor fusion for inertial navigation and positioning.",
      },
      "service-rf": {
        title: "RF communication & data link — UASYS GmbH",
        description:
          "Configurable RF modules and digital data links between ground stations and remote platforms.",
      },
      "service-elec": {
        title: "RF analysis, resilience & custom electronics — UASYS GmbH",
        description:
          "RF spectrum monitoring, GNSS resilience and custom PCB electronics by UASYS GmbH.",
      },
    },
    de: {
      index: {
        title: "UASYS GmbH — Engineering für autonome Systeme",
        description:
          "UASYS GmbH entwickelt und integriert Navigation, Embedded-Elektronik, inertiale Systeme und HF-Kommunikation für autonome, unbemannte und industrielle Plattformen.",
      },
      legal: {
        title: "Impressum — UASYS GmbH",
        description: "Impressum der UASYS GmbH, Roosstrasse 53, 8832 Wollerau, Schweiz.",
      },
      privacy: {
        title: "Datenschutz — UASYS GmbH",
        description: "Wie die UASYS GmbH Personendaten auf dieser Website bearbeitet.",
      },
      "service-auto": {
        title: "Autonome Systeme und Navigation — UASYS GmbH",
        description:
          "UASYS entwickelt Architekturen für autonome Steuerung und Navigation auf PX4 und ArduPilot mit Sensorfusion und GNSS.",
      },
      "service-imu": {
        title: "Inertiale Messtechnik und Sensorik — UASYS GmbH",
        description:
          "UASYS entwickelt IMU-Architekturen auf MEMS-Basis, Kalibrierung und Sensorfusion für inertiale Navigation.",
      },
      "service-rf": {
        title: "HF-Kommunikation und Datenlink — UASYS GmbH",
        description:
          "Konfigurierbare HF-Module und digitale Datenlinks zwischen Bodenstation und entfernter Plattform.",
      },
      "service-elec": {
        title: "HF-Analyse, Resilienz und Elektronik — UASYS GmbH",
        description:
          "HF-Spektrumsüberwachung, GNSS-Resilienz und kundenspezifische PCB-Elektronik der UASYS GmbH.",
      },
    },
  };

  const menuLabel = {
    en: { open: "Open menu", close: "Close menu" },
    de: { open: "Menü öffnen", close: "Menü schliessen" },
  };

  const readLang = () => (document.documentElement.lang === "de" ? "de" : "en");

  const withLang = (href, lang) => {
    if (/^(https?:|mailto:|tel:)/.test(href)) return href;
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return href;
    if (lang === "de") url.searchParams.set("lang", "de");
    else url.searchParams.delete("lang");
    return url.pathname + url.search + url.hash;
  };

  const applyLang = (lang) => {
    const next = lang === "de" ? "de" : "en";
    document.documentElement.lang = next;
    try {
      localStorage.setItem("uasys-lang", next);
    } catch {
      /* ignore */
    }
    const url = new URL(location.href);
    if (next === "de") url.searchParams.set("lang", "de");
    else url.searchParams.delete("lang");
    history.replaceState(null, "", url.pathname + url.search + url.hash);

    const copy = meta[next][page] || meta[next].index;
    document.title = copy.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", copy.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", copy.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", copy.description);

    document.querySelectorAll("a[href]").forEach((a) => {
      if (!a.dataset.href) a.dataset.href = a.getAttribute("href");
      a.setAttribute("href", withLang(a.dataset.href, next));
    });

    document.querySelectorAll("[data-ph-en]").forEach((field) => {
      field.placeholder = next === "de" ? field.dataset.phDe : field.dataset.phEn;
    });

    if (menuToggle) {
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-label", open ? menuLabel[next].close : menuLabel[next].open);
    }
  };

  applyLang(readLang());

  document.querySelectorAll("[data-set-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLang(button.dataset.setLang);
      if (menuToggle?.getAttribute("aria-expanded") === "true") closeMenu();
    });
  });

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const closeMenu = () => {
    if (!menuToggle || !mobileNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", menuLabel[readLang()].open);
    mobileNav.hidden = true;
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    if (open) closeMenu();
    else {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", menuLabel[readLang()].close);
      mobileNav.hidden = false;
      document.body.style.overflow = "hidden";
    }
  });

  mobileNav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  document.querySelectorAll(".nav-dd").forEach((dd) => {
    const trigger = dd.querySelector(".nav-dd-trigger");
    if (!trigger) return;

    const setOpen = (open) => {
      dd.classList.toggle("is-open", open);
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    };

    trigger.addEventListener("click", (e) => {
      const href = trigger.getAttribute("href");
      const isTouch =
        window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(pointer: coarse)").matches;
      if (isTouch || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (dd.classList.contains("is-open") && href) return;
      e.preventDefault();
      setOpen(!dd.classList.contains("is-open"));
    });

    dd.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!dd.contains(e.target)) setOpen(false);
    });
  });

  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    const siblings = [...(el.parentElement?.children || [])].filter((c) =>
      c.classList?.contains("reveal")
    );
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

  const requestForm = document.getElementById("requestForm");
  const requestDone = document.getElementById("requestDone");
  const requestError = document.getElementById("requestError");
  const requestSubmit = document.getElementById("requestSubmit");

  requestForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!requestForm.reportValidity()) return;
    if (requestError) requestError.hidden = true;
    if (requestSubmit) requestSubmit.disabled = true;

    try {
      const payload = new FormData(requestForm);
      payload.set("subject", "UASYS — technical information request");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "submit failed");
      }
      requestForm.hidden = true;
      if (requestDone) requestDone.hidden = false;
    } catch {
      if (requestError) requestError.hidden = false;
      if (requestSubmit) requestSubmit.disabled = false;
    }
  });
})();
