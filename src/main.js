(function () {
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.classList.remove("is-active");
    setTimeout(function () {
      preloader.remove();
    }, 500);
  }
  window.addEventListener("load", function () {
    setTimeout(hidePreloader, 200);
  });

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  var header = document.getElementById("siteHeader");
  function paintHeader() {
    if (!header) return;
    var solid = window.scrollY > 24;
    header.classList.toggle("border-white/10", solid);
    header.classList.toggle("bg-blue-1000/90", solid);
    header.classList.toggle("backdrop-blur-md", solid);
    header.classList.toggle("shadow-lg", solid);
  }
  paintHeader();
  window.addEventListener("scroll", paintHeader, { passive: true });

  var back = document.getElementById("backTop");
  function toggleBack() {
    if (!back) return;
    var show = window.scrollY > 400;
    back.classList.toggle("opacity-0", !show);
    back.classList.toggle("pointer-events-none", !show);
  }
  toggleBack();
  window.addEventListener("scroll", toggleBack, { passive: true });

  var offcanvas = document.getElementById("offcanvas");
  var overlay = document.getElementById("offcanvasOverlay");
  function setOffcanvas(open) {
    if (!offcanvas || !overlay) return;
    offcanvas.classList.toggle("translate-x-full", !open);
    offcanvas.setAttribute("aria-hidden", open ? "false" : "true");
    overlay.classList.toggle("opacity-0", !open);
    overlay.classList.toggle("pointer-events-none", !open);
    document.body.classList.toggle("offcanvas-open", open);
  }
  document.getElementById("offcanvasOpen")?.addEventListener("click", function () {
    setOffcanvas(true);
  });
  document.getElementById("offcanvasClose")?.addEventListener("click", function () {
    setOffcanvas(false);
  });
  overlay?.addEventListener("click", function () {
    setOffcanvas(false);
  });
  document.querySelectorAll(".offcanvas-close-trigger").forEach(function (el) {
    el.addEventListener("click", function () {
      setOffcanvas(false);
    });
  });

  var searchToggle = document.getElementById("searchToggle");
  var searchPanel = document.getElementById("searchPanel");
  searchToggle?.addEventListener("click", function (e) {
    e.stopPropagation();
    if (!searchPanel) return;
    var open = searchPanel.classList.toggle("hidden") === false;
    searchToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.addEventListener("click", function (e) {
    if (!searchPanel || searchPanel.classList.contains("hidden")) return;
    var wrap = document.getElementById("searchWrap");
    if (wrap && !wrap.contains(e.target)) {
      searchPanel.classList.add("hidden");
      searchToggle?.setAttribute("aria-expanded", "false");
    }
  });

  var aboutCopy = {
    h: "Since our establishment, we have grown into a trusted provider in the vehicle services industry, specializing in heavy-duty, military, industrial, and commercial landcraft. We began with a focus on delivering reliable automotive solutions and have expanded into manufacturing support, parts distribution, and comprehensive repair and maintenance services for civilian, government, and defense sectors.",
    m: "Our mission is to provide high-quality vehicle solutions by manufacturing, supplying, and servicing military, industrial, and commercial vehicles. We are committed to delivering reliable parts, expert maintenance, and technical support while ensuring safety, durability, and performance for every client we serve.",
    v: "Our vision is to be a leading and trusted name in the global vehicle services and manufacturing industry, recognized for excellence in innovation, quality, and service across military, industrial, and commercial automotive sectors.",
  };
  var panel = document.getElementById("aboutPanel");
  document.querySelectorAll(".about-tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-about-tab");
      document.querySelectorAll(".about-tab").forEach(function (b) {
        b.dataset.active = b === btn ? "true" : "false";
      });
      if (panel && key && aboutCopy[key]) panel.textContent = aboutCopy[key];
    });
  });

  document.querySelectorAll(".carousel-next").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-target");
      var el = id ? document.getElementById(id) : null;
      if (el) el.scrollBy({ left: Math.min(el.clientWidth, 340), behavior: "smooth" });
    });
  });
  document.querySelectorAll(".carousel-prev").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-target");
      var el = id ? document.getElementById(id) : null;
      if (el) el.scrollBy({ left: -Math.min(el.clientWidth, 340), behavior: "smooth" });
    });
  });

  var track = document.getElementById("testimonialTrack");
  var ti = 0;
  function slideTestimonial(dir) {
    if (!track) return;
    var slides = track.children.length;
    ti = (ti + dir + slides) % slides;
    track.style.transform = "translateX(-" + ti * 100 + "%)";
  }
  document.getElementById("tPrev")?.addEventListener("click", function () {
    slideTestimonial(-1);
  });
  document.getElementById("tNext")?.addEventListener("click", function () {
    slideTestimonial(1);
  });

  var counted = false;
  var stats = document.querySelectorAll("[data-count]");
  function runCounters() {
    if (counted) return;
    stats.forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count") || "0", 10);
      var start = 0;
      var t0 = performance.now();
      var dur = 1400;
      function tick(now) {
        var p = Math.min(1, (now - t0) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(start + (target - start) * eased));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    counted = true;
  }
  if (stats.length) {
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) runCounters();
        });
      },
      { threshold: 0.35 }
    );
    stats[0].closest("section") && obs.observe(stats[0].closest("section"));
  }

  document.querySelectorAll("[data-reveal-ltr], [data-reveal-rtl], [data-reveal-fade]").forEach(function (el) {
    var revealObs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in-view");
            observer.unobserve(e.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    revealObs.observe(el);
  });

  document.querySelectorAll("[data-reveal-services]").forEach(function (el) {
    var servicesObs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in-view");
            observer.unobserve(e.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    servicesObs.observe(el);
  });

  document.querySelectorAll("[data-reveal-vehicles]").forEach(function (el) {
    var vehiclesObs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in-view");
            observer.unobserve(e.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    vehiclesObs.observe(el);
  });

  document.querySelectorAll("[data-zoom-reveal]").forEach(function (el) {
    var img = el.querySelector(".zoom-reveal-img");
    if (img) {
      img.addEventListener("animationend", function onZoomRevealEnd(ev) {
        if (ev.animationName !== "zoom-reveal-out") return;
        el.classList.add("zoom-reveal-ready");
        img.removeEventListener("animationend", onZoomRevealEnd);
      });
    }
    var zoomObs = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in-view");
            observer.unobserve(e.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    zoomObs.observe(el);
  });
})();
