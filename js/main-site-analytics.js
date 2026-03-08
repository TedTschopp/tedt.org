(function () {
  const script = document.currentScript;

  if (!script || script.dataset.enabled !== "true") {
    return;
  }

  const measurementId = script.dataset.gaMeasurementId;
  if (!measurementId) {
    return;
  }

  const trackOutboundLinks = script.dataset.trackOutboundLinks === "true";
  const trackFileDownloads = script.dataset.trackFileDownloads === "true";
  const trackSearch = script.dataset.trackSearch === "true";
  const host = window.location.hostname;
  const isLocalHost = !host || host === "localhost" || host === "127.0.0.1";

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  if (!isLocalHost) {
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      transport_type: "beacon"
    });
  }

  function sendEvent(eventName, params) {
    if (isLocalHost) {
      return;
    }

    window.gtag("event", eventName, params);
  }

  function toUrl(href) {
    try {
      return new URL(href, window.location.href);
    } catch (error) {
      return null;
    }
  }

  function trackSearchValue(input, locationHint) {
    if (!trackSearch || !input) {
      return;
    }

    const term = (input.value || "").trim();
    if (!term) {
      return;
    }

    if (input.dataset.analyticsLastSearch === term) {
      return;
    }

    input.dataset.analyticsLastSearch = term;
    sendEvent("search", {
      search_term: term.slice(0, 100),
      search_location: locationHint || window.location.pathname
    });
  }

  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (!link) {
      return;
    }

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
      return;
    }

    const url = toUrl(href);
    if (!url) {
      return;
    }

    const isDownload = link.hasAttribute("download") || /\.(pdf|zip|csv|tsv|json|xml|txt|docx?|xlsx?|pptx?|epub|mp3|mp4|webm)$/i.test(url.pathname);
    if (trackFileDownloads && isDownload) {
      const fileName = url.pathname.split("/").pop() || url.pathname;
      sendEvent("file_download", {
        file_name: fileName,
        file_extension: fileName.includes(".") ? fileName.split(".").pop().toLowerCase() : "",
        link_url: url.href,
        link_domain: url.hostname
      });
      return;
    }

    if (trackOutboundLinks && url.origin !== window.location.origin) {
      sendEvent("outbound_click", {
        link_url: url.href,
        link_domain: url.hostname,
        link_text: (link.textContent || "").trim().slice(0, 120)
      });
    }
  }, true);

  document.addEventListener("submit", function (event) {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const input = form.querySelector('input[type="search"], input[name="q"], input[name="query"], input[name="search"], input[name*="search"]');
    trackSearchValue(input, form.getAttribute("action") || window.location.pathname);
  }, true);

  document.addEventListener("change", function (event) {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== "search") {
      return;
    }

    trackSearchValue(input, input.id || input.name || window.location.pathname);
  }, true);
})();