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
      portal: {
        title: "Client portal — UASYS GmbH",
        description:
          "Company registration and client sign-in for technical information from UASYS GmbH. Requests are available after authorisation.",
      },
      legal: {
        title: "Legal notice — UASYS GmbH",
        description: "Legal notice of UASYS GmbH, Roosstrasse 53, 8832 Wollerau, Switzerland.",
      },
      privacy: {
        title: "Privacy policy — UASYS GmbH",
        description: "How UASYS GmbH handles personal data on this website and in the client portal.",
      },
    },
    de: {
      index: {
        title: "UASYS GmbH — Engineering für autonome Systeme",
        description:
          "UASYS GmbH entwickelt und integriert Navigation, Embedded-Elektronik, inertiale Systeme und HF-Kommunikation für autonome, unbemannte und industrielle Plattformen.",
      },
      portal: {
        title: "Kundenportal — UASYS GmbH",
        description:
          "Registrierung für Unternehmen und Kundenlogin für technische Informationen der UASYS GmbH. Anfragen sind nach der Freigabe möglich.",
      },
      legal: {
        title: "Impressum — UASYS GmbH",
        description: "Impressum der UASYS GmbH, Roosstrasse 53, 8832 Wollerau, Schweiz.",
      },
      privacy: {
        title: "Datenschutz — UASYS GmbH",
        description:
          "Wie die UASYS GmbH Personendaten auf dieser Website und im Kundenportal bearbeitet.",
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

  const bindPreview = (formId, doneId) => {
    const form = document.getElementById(formId);
    const done = document.getElementById(doneId);
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.hidden = true;
      if (done) done.hidden = false;
    });
  };

  const registerForm = document.getElementById("registerForm");
  const registerDone = document.getElementById("registerDone");
  const registerError = document.getElementById("registerError");
  const registerSubmit = document.getElementById("registerSubmit");

  registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!registerForm.reportValidity()) return;
    if (registerError) registerError.hidden = true;
    if (registerSubmit) registerSubmit.disabled = true;

    try {
      const payload = new FormData(registerForm);
      payload.set("subject", "UASYS — company access request");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "submit failed");
      }
      registerForm.hidden = true;
      if (registerDone) registerDone.hidden = false;
    } catch {
      if (registerError) registerError.hidden = false;
      if (registerSubmit) registerSubmit.disabled = false;
    }
  });

  bindPreview("loginForm", "loginDone");
})();
