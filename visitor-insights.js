(function () {
  const CONFIG = {
    endpoint: window.ODDYSEE_VISITOR_ENDPOINT || "YOUR_VISITOR_GOOGLE_SCRIPT_URL_HERE",
    ipInfoUrl: "https://ipapi.co/json/",
    requestGeolocation: false,
    storageKey: "oddysee_visitor_logs"
  };

  function getAcquisitionInfo() {
    const params = new URLSearchParams(window.location.search);
    const source = params.get("utm_source") || null;
    const medium = params.get("utm_medium") || null;
    const campaign = params.get("utm_campaign") || null;
    const content = params.get("utm_content") || null;
    const term = params.get("utm_term") || null;
    const qrTag = params.get("qr") || params.get("qr_id") || params.get("source") || null;
    const isQrScan = Boolean(qrTag) || (source ? source.toLowerCase().includes("qr") : false);

    return {
      utmSource: source,
      utmMedium: medium,
      utmCampaign: campaign,
      utmContent: content,
      utmTerm: term,
      qrTag,
      isQrScan
    };
  }

  function getDeviceType() {
    const ua = navigator.userAgent || "";
    if (/tablet|ipad|playbook|silk|(android(?!.*mobile))/i.test(ua)) return "tablet";
    if (/mobi|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) return "mobile";
    return "desktop";
  }

  function collectBaseInfo() {
    const nav = navigator;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection || null;

    return {
      openedAtISO: new Date().toISOString(),
      openedAtLocal: new Date().toString(),
      page: {
        url: location.href,
        path: location.pathname,
        title: document.title,
        referrer: document.referrer || null
      },
      acquisition: getAcquisitionInfo(),
      device: {
        type: getDeviceType(),
        userAgent: nav.userAgent || null,
        platform: nav.platform || null,
        language: nav.language || null,
        languages: nav.languages || [],
        hardwareConcurrency: nav.hardwareConcurrency || null,
        deviceMemoryGB: nav.deviceMemory || null,
        maxTouchPoints: nav.maxTouchPoints || 0
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
        pixelRatio: window.devicePixelRatio || 1,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      },
      browser: {
        cookiesEnabled: nav.cookieEnabled,
        doNotTrack: nav.doNotTrack || null,
        onLine: nav.onLine,
        vendor: nav.vendor || null,
        productSub: nav.productSub || null,
        webdriver: !!nav.webdriver,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null
      },
      network: connection
        ? {
            effectiveType: connection.effectiveType || null,
            downlinkMbps: connection.downlink || null,
            rttMs: connection.rtt || null,
            saveData: !!connection.saveData
          }
        : null
    };
  }

  async function attachGeolocation(payload) {
    if (!CONFIG.requestGeolocation || !navigator.geolocation) return payload;

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          payload.location = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracyMeters: position.coords.accuracy
          };
          resolve(payload);
        },
        () => resolve(payload),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
      );
    });
  }

  async function attachIpInfo(payload) {
    if (!CONFIG.ipInfoUrl) return payload;

    try {
      const response = await fetch(CONFIG.ipInfoUrl, { cache: "no-store" });
      if (!response.ok) return payload;
      const data = await response.json();

      payload.ipInfo = {
        ip: data.ip || null,
        city: data.city || null,
        region: data.region || null,
        country: data.country_name || null,
        countryCode: data.country_code || null,
        postal: data.postal || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        org: data.org || null,
        asn: data.asn || null,
        timezone: data.timezone || null,
        utcOffset: data.utc_offset || null
      };
    } catch (_) {
      // Ignore IP enrichment errors to avoid blocking tracking
    }

    return payload;
  }

  function persistLocal(payload) {
    const existing = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "[]");
    existing.push(payload);
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(existing));
  }

  function flattenPayload(input, prefix = "", output = {}) {
    Object.keys(input || {}).forEach((key) => {
      const value = input[key];
      const nextKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value)) {
        output[nextKey] = value.join(", ");
      } else if (value && typeof value === "object") {
        flattenPayload(value, nextKey, output);
      } else {
        output[nextKey] = value;
      }
    });
    return output;
  }

  function sendToEndpoint(payload) {
    if (!CONFIG.endpoint || CONFIG.endpoint === "YOUR_VISITOR_GOOGLE_SCRIPT_URL_HERE") return;

    const flat = flattenPayload(payload);
    const body = new URLSearchParams();
    Object.keys(flat).forEach((key) => {
      const value = flat[key];
      body.append(key, value == null ? "" : String(value));
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(CONFIG.endpoint, body);
      return;
    }

    fetch(CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
      keepalive: true
    }).catch(() => {});
  }

  async function trackVisit() {
    const base = collectBaseInfo();
    const withIp = await attachIpInfo(base);
    const payload = await attachGeolocation(withIp);
    persistLocal(payload);
    sendToEndpoint(payload);
    window.lastVisitorPayload = payload;
    console.log("Visitor info captured:", payload);
  }

  function init() {
    trackVisit();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
