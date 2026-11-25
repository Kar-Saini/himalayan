(() => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // =====================================================
  // FOOTER YEAR
  // =====================================================

  $$("[data-year]").forEach(
    (el) => (el.textContent = new Date().getFullYear()),
  );

  // =====================================================
  // MOBILE NAVIGATION
  // =====================================================

  const menu = $(".menu-toggle");
  const nav = $(".nav");

  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.textContent = open ? "×" : "☰";
    });
  }

  // =====================================================
  // LANGUAGE CONFIGURATION
  // =====================================================

  const languageOptions = [
    // Indian languages
    { code: "hi", flag: "🇮🇳", name: "हिन्दी" },
    { code: "mr", flag: "🇮🇳", name: "मराठी" },
    { code: "bn", flag: "🇮🇳", name: "বাংলা" },
    { code: "ta", flag: "🇮🇳", name: "தமிழ்" },
    { code: "te", flag: "🇮🇳", name: "తెలుగు" },
    { code: "kn", flag: "🇮🇳", name: "ಕನ್ನಡ" },
    { code: "ml", flag: "🇮🇳", name: "മലയാളം" },
    { code: "gu", flag: "🇮🇳", name: "ગુજરાતી" },
    { code: "pa", flag: "🇮🇳", name: "ਪੰਜਾਬੀ" },
    { code: "or", flag: "🇮🇳", name: "ଓଡ଼ିଆ" },
    { code: "as", flag: "🇮🇳", name: "অসমীয়া" },
    { code: "ne", flag: "🇮🇳", name: "नेपाली" },

    // International languages
    { code: "en", flag: "🇬🇧", name: "English" },
    { code: "ar", flag: "🇸🇦", name: "العربية" },
    { code: "ru", flag: "🇷🇺", name: "Русский" },
    { code: "fr", flag: "🇫🇷", name: "Français" },
    { code: "es", flag: "🇪🇸", name: "Español" },
    { code: "pt", flag: "🇧🇷", name: "Português" },
    { code: "de", flag: "🇩🇪", name: "Deutsch" },
    { code: "zh-CN", flag: "🇨🇳", name: "中文" },
    { code: "tr", flag: "🇹🇷", name: "Türkçe" },
    { code: "id", flag: "🇮🇩", name: "Bahasa Indonesia" },
  ];

  const savedLanguage = localStorage.getItem("ht-language") || "en";

  // =====================================================
  // LANGUAGE DIRECTION (ARABIC RTL)
  // =====================================================

  function applyLanguageDirection(code) {
    const isRTL = code === "ar";

    document.documentElement.lang = code;
    document.documentElement.dir = isRTL ? "rtl" : "ltr";

    let rtlStyle = $("#translation-direction-styles");

    if (!rtlStyle) {
      rtlStyle = document.createElement("style");
      rtlStyle.id = "translation-direction-styles";
      document.head.appendChild(rtlStyle);
    }

    rtlStyle.textContent = `
      html[dir="rtl"] body {
        direction: rtl;
        text-align: right;
      }

      html[dir="rtl"] .nav-wrap,
      html[dir="rtl"] .nav,
      html[dir="rtl"] .hero-actions,
      html[dir="rtl"] .hero-trust,
      html[dir="rtl"] .cta-inner,
      html[dir="rtl"] .form-heading,
      html[dir="rtl"] .consult-points > div {
        direction: rtl;
      }

      html[dir="rtl"] .hero-shade {
        background:
          linear-gradient(
            270deg,
            rgba(5, 28, 47, 0.87) 0%,
            rgba(6, 35, 51, 0.67) 42%,
            rgba(5, 29, 44, 0.1) 100%
          );
      }

      html[dir="rtl"] .hero-note {
        right: auto;
        left: max(22px, calc((100% - 1180px) / 2));
      }

      html[dir="rtl"] .notice {
        border-left: 0;
        border-right: 3px solid var(--gold);
      }

      html[dir="rtl"] .service-card,
      html[dir="rtl"] .hospital-body,
      html[dir="rtl"] .doctor-card,
      html[dir="rtl"] .field {
        text-align: right;
      }

      html[dir="rtl"] .translate-fixed {
        direction: ltr;
        text-align: left;
      }

      html[dir="rtl"] .footer-bottom {
        direction: rtl;
      }

      @media (max-width: 760px) {
        html[dir="rtl"] .hero-note {
          left: 15px;
          right: auto;
        }
      }
    `;
  }

  applyLanguageDirection(savedLanguage);

  // =====================================================
  // GOOGLE TRANSLATE COOKIE
  // =====================================================

  function setGoogleTranslateCookie(code) {
    const cookieValue = `/en/${code}`;

    document.cookie =
      "googtrans=" + cookieValue + "; path=/; max-age=31536000; SameSite=Lax";

    // Also set the cookie for the current hostname.
    // This helps on some hosting configurations.
    const hostname = location.hostname;

    if (
      hostname &&
      hostname !== "localhost" &&
      hostname.includes(".") &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)
    ) {
      document.cookie =
        "googtrans=" +
        cookieValue +
        "; path=/; domain=" +
        hostname +
        "; max-age=31536000; SameSite=Lax";
    }
  }

  // =====================================================
  // CUSTOM LANGUAGE SELECTOR
  // =====================================================

  const translateUI = document.createElement("div");
  translateUI.className = "translate-fixed";

  translateUI.innerHTML = `
    <div id="google_translate_element" class="google-translate-hidden"></div>

    <button
      class="translate-trigger"
      type="button"
      aria-expanded="false"
      aria-controls="translateMenu"
      aria-label="Translate website"
    >
      <svg class="google-translate-mark" viewBox="0 0 72 72" aria-hidden="true">
        <rect x="5" y="5" width="38" height="49" rx="4" fill="#07579b"/>
        <path d="M13 24c0-8 5-13 13-13 5 0 9 2 12 6l-6 5c-2-3-4-4-7-4-4 0-7 3-7 7s3 7 7 7c3 0 5-1 6-3h-7v-6h15v4c0 9-6 15-14 15-7 0-12-5-12-13z" fill="#fff"/>
        <rect x="34" y="18" width="31" height="46" rx="4" fill="#fff" stroke="#07579b" stroke-width="4"/>
        <path d="M38 29h23M49 24v7M41 35c3 8 8 13 16 17M56 35c-3 7-7 12-12 15" fill="none" stroke="#07579b" stroke-width="3" stroke-linecap="round"/>
        <path d="M43 48l8-11 8 11" fill="none" stroke="#07579b" stroke-width="2.5"/>
      </svg>

      <span class="translate-selected-flag">🇬🇧</span>
      <span class="translate-selected-name">English</span>

      <svg class="translate-chevron" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 9 7 7 7-7" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <div class="translate-menu" id="translateMenu" hidden>
      <div class="translate-menu-title">Choose language</div>

      <div class="translate-options">
        ${languageOptions
          .map(
            (language) => `
          <button
            type="button"
            class="translate-option"
            data-lang="${language.code}"
          >
            <span class="translate-flag">${language.flag}</span>
            <span>${language.name}</span>
          </button>
        `,
          )
          .join("")}
      </div>

      <p class="translate-powered">Powered by Google Translate</p>
    </div>
  `;

  const headerWrap = $(".nav-wrap");

  if (headerWrap) {
    headerWrap.appendChild(translateUI);
  } else {
    document.body.appendChild(translateUI);
  }

  const translateTrigger = $(".translate-trigger", translateUI);
  const translateMenu = $(".translate-menu", translateUI);
  const translateStatus = $(".translate-powered", translateUI);

  function updateLanguageButton(code) {
    const language =
      languageOptions.find((item) => item.code === code) ||
      languageOptions.find((item) => item.code === "en");

    $(".translate-selected-flag", translateUI).textContent = language.flag;

    $(".translate-selected-name", translateUI).textContent = language.name;

    translateTrigger.setAttribute(
      "aria-label",
      "Current language: " + language.name,
    );
  }

  updateLanguageButton(savedLanguage);

  function closeLanguageMenu() {
    translateMenu.hidden = true;
    translateTrigger.setAttribute("aria-expanded", "false");
  }

  translateTrigger.addEventListener("click", () => {
    const open = translateMenu.hidden;

    translateMenu.hidden = !open;
    translateTrigger.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("click", (event) => {
    if (!translateUI.contains(event.target)) {
      closeLanguageMenu();
    }
  });

  // =====================================================
  // SELECT LANGUAGE
  // =====================================================

  function selectLanguage(code) {
    const validLanguage = languageOptions.some(
      (language) => language.code === code,
    );

    if (!validLanguage) return;

    localStorage.setItem("ht-language", code);

    updateLanguageButton(code);
    applyLanguageDirection(code);
    closeLanguageMenu();

    // Google Translate reads this cookie when the page loads.
    setGoogleTranslateCookie(code);

    translateStatus.textContent =
      code === "en" ? "Switching to English..." : "Translating website...";

    // Reload to apply the selected language.
    location.reload();
  }

  $$("[data-lang]", translateUI).forEach((button) => {
    button.addEventListener("click", () => {
      selectLanguage(button.dataset.lang);
    });
  });

  // =====================================================
  // GOOGLE TRANSLATE INITIALIZATION
  // =====================================================

  window.googleTranslateElementInit = function () {
    if (
      !window.google ||
      !google.translate ||
      !google.translate.TranslateElement
    ) {
      translateStatus.textContent = "Google Translate could not initialize.";
      return;
    }

    try {
      new google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages:
            "en,hi,mr,bn,ta,te,kn,ml,gu,pa,or,as,ne,ar,ru,fr,es,pt,de,zh-CN,tr,id",
          autoDisplay: false,
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      );

      translateStatus.textContent = "Powered by Google Translate";
    } catch (error) {
      console.error("Google Translate initialization error:", error);

      translateStatus.textContent = "Google Translate initialization failed.";
    }
  };

  // Load Google Translate only once.
  if (!window.googleTranslateScriptLoaded) {
    window.googleTranslateScriptLoaded = true;

    const googleTranslateScript = document.createElement("script");

    googleTranslateScript.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

    googleTranslateScript.async = true;

    googleTranslateScript.onerror = () => {
      translateStatus.textContent =
        "Google Translate could not load. Check your connection.";
    };

    document.head.appendChild(googleTranslateScript);
  }

  // =====================================================
  // HOSPITAL SEARCH
  // =====================================================

  const hospitalSearch = $("#hospitalSearch");

  if (hospitalSearch) {
    const cards = $$(".searchable");

    hospitalSearch.addEventListener("input", () => {
      const query = hospitalSearch.value.toLowerCase().trim();

      let count = 0;

      cards.forEach((card) => {
        const show = ((card.dataset.search || "") + " " + card.textContent)
          .toLowerCase()
          .includes(query);

        card.hidden = !show;

        if (show) count++;
      });

      const noHospitals = $("#noHospitals");

      if (noHospitals) {
        noHospitals.hidden = count > 0;
      }
    });
  }

  // =====================================================
  // DOCTOR SEARCH AND FILTER
  // =====================================================

  const doctorSearch = $("#doctorSearch");
  const doctorHospital = $("#doctorHospital");

  if (doctorSearch && doctorHospital) {
    const cards = $$(".searchable-doctor");

    const filterDoctors = () => {
      const query = doctorSearch.value.toLowerCase().trim();
      const hospitalValue = doctorHospital.value;

      let count = 0;

      cards.forEach((card) => {
        const matchesText = (
          (card.dataset.search || "") +
          " " +
          card.textContent
        )
          .toLowerCase()
          .includes(query);

        const matchesHospital =
          hospitalValue === "all" || card.dataset.hospital === hospitalValue;

        const show = matchesText && matchesHospital;

        card.hidden = !show;

        if (show) count++;
      });

      const noDoctors = $("#noDoctors");

      if (noDoctors) {
        noDoctors.hidden = count > 0;
      }
    };

    doctorSearch.addEventListener("input", filterDoctors);
    doctorHospital.addEventListener("change", filterDoctors);
  }

  // =====================================================
  // HOSPITAL URL PARAMETER
  // =====================================================

  const params = new URLSearchParams(location.search);
  const hospital = params.get("hospital");
  const hospitalSelect = $("#hospital");

  if (hospital && hospitalSelect) {
    const match = [...hospitalSelect.options].find(
      (option) => option.text.toLowerCase() === hospital.toLowerCase(),
    );

    if (match) {
      hospitalSelect.value = match.value;
    } else {
      const option = document.createElement("option");

      option.textContent = hospital;
      option.value = hospital;

      hospitalSelect.insertBefore(option, hospitalSelect.options[1]);

      hospitalSelect.value = hospital;
    }
  }

  // =====================================================
  // CONSULTATION FORM
  // =====================================================

  const form = $("#consultForm");

  if (form) {
    form.addEventListener("submit", async (event) => {
      if (
        !form.action ||
        (form.action.endsWith("backend/contact.php") &&
          location.protocol === "file:")
      ) {
        event.preventDefault();

        const status = $("#formStatus");

        if (status) {
          status.textContent =
            "The form is ready, but email delivery requires hosting with PHP enabled. Please deploy the site and configure backend/contact.php.";

          status.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }

        return;
      }

      if (form.dataset.ajax === "true") {
        event.preventDefault();

        const status = $("#formStatus");

        if (status) {
          status.textContent = "Sending...";
        }

        try {
          const response = await fetch(form.action, {
            method: "POST",
            body: new FormData(form),
            headers: {
              Accept: "application/json",
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Could not send your enquiry.");
          }

          if (status) {
            status.textContent =
              data.message || "Thank you. Your enquiry has been sent.";
          }

          form.reset();
        } catch (error) {
          if (status) {
            status.textContent =
              error.message || "Unable to send right now. Please try again.";
          }
        }
      }
    });
  }
})();
