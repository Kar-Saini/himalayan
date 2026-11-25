(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [
    ...root.querySelectorAll(selector),
  ];

  // =====================================================
  // GOOGLE TRANSLATE CLEANUP
  // =====================================================

  const cleanupStyles = document.createElement("style");
  cleanupStyles.id = "google-translate-cleanup-styles";

  cleanupStyles.textContent = `
    .goog-te-banner-frame,
    .goog-te-banner-frame.skiptranslate,
    iframe.goog-te-banner-frame {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      max-height: 0 !important;
      border: 0 !important;
    }

    body {
      top: 0 !important;
      margin-top: 0 !important;
      position: static !important;
    }

    html {
      margin-top: 0 !important;
    }

    #goog-gt-tt,
    .goog-tooltip,
    .goog-tooltip:hover,
    .goog-text-highlight {
      display: none !important;
    }

    .google-translate-hidden {
      position: fixed !important;
      left: -10000px !important;
      top: 0 !important;
      width: 260px !important;
      height: 45px !important;
      overflow: visible !important;
      z-index: -1 !important;
    }
  `;

  document.head.appendChild(cleanupStyles);

  // =====================================================
  // FOOTER YEAR
  // =====================================================

  $$("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // =====================================================
  // MOBILE NAVIGATION
  // =====================================================

  const menuToggle = $(".menu-toggle");
  const nav = $(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "×" : "☰";
    });
  }

  // =====================================================
  // LANGUAGE CONFIGURATION
  // =====================================================

  const languageOptions = [
    { code: "en", flag: "🇬🇧", name: "English" },
    { code: "fr", flag: "🇫🇷", name: "Français" },
    { code: "hi", flag: "🇮🇳", name: "हिन्दी" },
    { code: "ar", flag: "🇸🇦", name: "العربية" },
    { code: "ru", flag: "🇷🇺", name: "Русский" },
    { code: "es", flag: "🇪🇸", name: "Español" },
    { code: "bn", flag: "🇧🇩", name: "বাংলা" },
    { code: "pt", flag: "🇧🇷", name: "Português" },
    { code: "bg", flag: "🇧🇬", name: "Български" },
    { code: "ro", flag: "🇷🇴", name: "Română" },
    { code: "sq", flag: "🇦🇱", name: "Shqip" },
    { code: "uz", flag: "🇺🇿", name: "Oʻzbekcha" },
  ];

  const storedLanguage = localStorage.getItem("ht-language") || "en";

  const savedLanguage = languageOptions.some(
    (language) => language.code === storedLanguage,
  )
    ? storedLanguage
    : "en";

  if (savedLanguage !== storedLanguage) {
    localStorage.setItem("ht-language", "en");
  }

  // =====================================================
  // LANGUAGE DIRECTION
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
    const hostname = location.hostname;

    const expired =
      "expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax";

    // Clear existing translation cookies.
    document.cookie = `googtrans=; ${expired}`;

    if (
      hostname &&
      hostname !== "localhost" &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)
    ) {
      document.cookie = `googtrans=; domain=${hostname}; ${expired}`;

      document.cookie = `googtrans=; domain=.${hostname}; ${expired}`;

      const parts = hostname.split(".");

      if (parts.length >= 2) {
        const parentDomain = parts.slice(-2).join(".");

        document.cookie = `googtrans=; domain=${parentDomain}; ${expired}`;

        document.cookie = `googtrans=; domain=.${parentDomain}; ${expired}`;
      }
    }

    // English is the original language.
    // No /en/en cookie is required.
    if (code === "en") {
      return;
    }

    const cookieValue = `/en/${code}`;

    document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax`;

    if (
      hostname &&
      hostname !== "localhost" &&
      !/^\d+\.\d+\.\d+\.\d+$/.test(hostname)
    ) {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${hostname}; max-age=31536000; SameSite=Lax`;
    }
  }

  // =====================================================
  // CUSTOM LANGUAGE SELECTOR
  // Compact details/summary control
  // =====================================================

  const translateUI = document.createElement("div");
  translateUI.className = "translate-fixed";

  translateUI.innerHTML = `
    <div
      id="google_translate_element"
      class="google-translate-hidden"
    ></div>

    <details class="ht-language-switcher">
      <summary
        aria-label="Choose language"
        class="ht-language-summary"
      >
        <svg
          class="ht-language-icon"
          viewBox="0 -960 960 960"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="m480-80-40-120H160q-33 0-56.5-23.5T80-280v-520q0-33 23.5-56.5T160-880h240l35 120h365q35 0 57.5 22.5T880-680v520q0 33-22.5 56.5T800-80H480ZM286-376q69 0 113.5-44.5T444-536q0-8-.5-14.5T441-564H283v62h89q-8 28-30.5 43.5T287-443q-39 0-67-28t-28-69q0-41 28-69t67-28q18 0 34 6.5t29 19.5l49-47q-21-22-50.5-34T286-704q-67 0-114.5 47.5T124-540q0 69 47.5 116.5T286-376Zm268 20 22-21q-14-17-25.5-33T528-444l26 88Zm50-51q28-33 42.5-63t19.5-47H507l12 42h40q8 15 19 32.5t26 35.5Zm-84 287h280q18 0 29-11.5t11-28.5v-520q0-18-11-29t-29-11H447l47 162h79v-42h41v42h146v41h-51q-10 38-30 74t-47 67l109 107-29 29-108-108-36 37 32 111-80 80Z"></path>
        </svg>

        <span
          class="ht-language-current notranslate"
          translate="no"
        >
          <span class="ht-language-current-flag" aria-hidden="true">🇬🇧</span>
          <span class="ht-language-current-name">English</span>
        </span>

        <svg
          class="ht-language-chevron"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </summary>

      <ul class="ht-language-list">
        ${languageOptions
          .map(
            (language) => `
              <li>
                <button
                  type="button"
                  class="ht-language-option"
                  data-lang="${language.code}"
                  aria-current="${language.code === savedLanguage ? "true" : "false"}"
                >
                  <span
                    class="ht-language-option-content notranslate"
                    translate="no"
                  >
                    <span class="ht-language-option-flag" aria-hidden="true">${language.flag}</span>
                    <span>${language.name}</span>
                  </span>

                  <svg
                    class="ht-language-check"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    ${language.code === savedLanguage ? "" : "hidden"}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.79 6.8-6.79a1 1 0 011.4 0z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </button>
              </li>
            `,
          )
          .join("")}
      </ul>
    </details>

    <span class="ht-language-status" aria-live="polite">
      Powered by Google Translate
    </span>
  `;

  const headerWrap = $(".nav-wrap");

  if (headerWrap) {
    headerWrap.appendChild(translateUI);
  } else {
    document.body.appendChild(translateUI);
  }

  const languageDetails = $(".ht-language-switcher", translateUI);
  const languageButtons = $$("[data-lang]", translateUI);
  const languageStatus = $(".ht-language-status", translateUI);

  // =====================================================
  // UPDATE SELECTED LANGUAGE
  // =====================================================

  function updateLanguageButton(code) {
    const language =
      languageOptions.find((item) => item.code === code) ||
      languageOptions.find((item) => item.code === "en");

    $(".ht-language-current-flag", translateUI).textContent = language.flag;

    $(".ht-language-current-name", translateUI).textContent = language.name;

    languageButtons.forEach((button) => {
      const isSelected = button.dataset.lang === language.code;

      button.setAttribute("aria-current", String(isSelected));

      const check = $(".ht-language-check", button);

      if (check) {
        check.hidden = !isSelected;
      }
    });

    $(".ht-language-summary", translateUI).setAttribute(
      "aria-label",
      `Choose language. Current language: ${language.name}`,
    );
  }

  updateLanguageButton(savedLanguage);

  // =====================================================
  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  document.addEventListener("click", (event) => {
    if (!translateUI.contains(event.target)) {
      languageDetails.open = false;
    }
  });

  // Escape key closes the dropdown.
  languageDetails.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      languageDetails.open = false;

      $(".ht-language-summary", translateUI).focus();
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

    languageDetails.open = false;

    setGoogleTranslateCookie(code);

    languageStatus.textContent =
      code === "en" ? "Restoring English..." : "Translating website...";

    // Reload so Google Translate reads the updated cookie.
    location.reload();
  }

  languageButtons.forEach((button) => {
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
      languageStatus.textContent = "Google Translate could not initialize.";

      return;
    }

    try {
      new google.translate.TranslateElement(
        {
          pageLanguage: "en",

          includedLanguages: "en,fr,hi,ar,ru,es,bn,pt,bg,ro,sq,uz",

          autoDisplay: false,

          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element",
      );

      languageStatus.textContent = "Powered by Google Translate";
    } catch (error) {
      console.error("Google Translate initialization error:", error);

      languageStatus.textContent = "Google Translate initialization failed.";
    }
  };

  // =====================================================
  // LOAD GOOGLE TRANSLATE SCRIPT
  // =====================================================

  if (!window.googleTranslateScriptLoaded) {
    window.googleTranslateScriptLoaded = true;

    const googleTranslateScript = document.createElement("script");

    googleTranslateScript.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

    googleTranslateScript.async = true;

    googleTranslateScript.onerror = () => {
      languageStatus.textContent =
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
