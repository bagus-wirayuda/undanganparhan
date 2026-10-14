(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const weddingDate = new Date("2026-10-25T10:00:00+08:00");
  const address = "Panjang Selatan, Desa Labbo, Kec. Tompobulu, Kab. Bantaeng";
  const body = document.body;
  let toastTimer;

  function toast(message) {
    const element = $("#toast");
    if (!element) return;
    clearTimeout(toastTimer);
    element.textContent = message;
    element.classList.add("is-visible");
    toastTimer = setTimeout(() => element.classList.remove("is-visible"), 4200);
  }

  // Guest names are treated exclusively as text, including names supplied in the URL.
  const query = new URLSearchParams(window.location.search);
  const guest = (query.get("to") || query.get("nama") || "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || "Tamu Istimewa";
  $$("[data-guest]").forEach((element) => { element.textContent = guest; });
  if (guest.length > 45) body.classList.add("has-long-guest");

  const cover = $("#cover");
  const invitation = $("#invitation");
  const openButton = $("#open-invitation");
  let opening = false;

  function openInvitation() {
    if (opening || body.classList.contains("is-open")) return;
    opening = true;
    if (openButton) {
      openButton.disabled = true;
      openButton.setAttribute("aria-expanded", "true");
    }
    body.classList.add("is-opening");
    setTimeout(() => {
      if (cover) cover.hidden = true;
      if (invitation) {
        invitation.inert = false;
        invitation.removeAttribute("inert");
        invitation.removeAttribute("aria-hidden");
      }
      body.classList.remove("is-opening", "is-locked");
      body.classList.add("is-open");
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      const title = $("#main-title");
      if (title) {
        if (!title.hasAttribute("tabindex")) title.setAttribute("tabindex", "-1");
        title.focus({ preventScroll: true });
      }
      opening = false;
      window.dispatchEvent(new Event("invitation:opened"));
    }, motionPreference.matches ? 100 : 2300);
  }
  if (openButton) openButton.addEventListener("click", openInvitation);

  function updateCountdown() {
    const difference = Math.max(0, weddingDate.getTime() - Date.now());
    const seconds = Math.floor(difference / 1000);
    const values = {
      days: Math.floor(seconds / 86400),
      hours: Math.floor(seconds / 3600) % 24,
      minutes: Math.floor(seconds / 60) % 60,
      seconds: seconds % 60,
    };
    Object.entries(values).forEach(([key, value]) => {
      $$(`[data-count="${key}"]`).forEach((element) => {
        const next = String(value).padStart(2, "0");
        if (element.textContent !== next) element.textContent = next;
      });
    });
    const label = $("#countdown-label");
    if (label && difference === 0) {
      label.textContent = Date.now() < weddingDate.getTime() + 86400000
        ? "Hari bahagia telah tiba"
        : "Terima kasih atas doa dan restunya";
    }
  }
  updateCountdown();
  const countdownTimer = setInterval(updateCountdown, 1000);

  $$("[data-map-link]").forEach((link) => {
    link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (_) { /* Older browsers and local files use the selection fallback. */ }
    }
    const previousFocus = document.activeElement;
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.setAttribute("aria-label", "Teks untuk disalin");
    Object.assign(field.style, { position: "fixed", left: "-9999px", top: "0", opacity: "0" });
    document.body.append(field);
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, field.value.length);
    let copied = false;
    try { copied = document.execCommand("copy"); } catch (_) { /* Report the outcome below. */ }
    field.remove();
    if (previousFocus && previousFocus.focus) previousFocus.focus({ preventScroll: true });
    return copied;
  }

  $("#copy-address")?.addEventListener("click", async () => {
    toast(await copyText(address)
      ? "Alamat berhasil disalin. Sampai bertemu!"
      : "Alamat belum tersalin. Silakan salin alamat pada bagian lokasi.");
  });

  $("#share-invitation")?.addEventListener("click", async () => {
    if (window.location.protocol === "file:") {
      toast("Bagikan tautannya setelah undangan diunggah ke hosting.");
      return;
    }
    const shareURL = new URL(window.location.href);
    shareURL.hash = "";
    const data = {
      title: "Undangan Pernikahan Lili & Parhan",
      text: "Dengan bahagia kami mengundang Anda ke pernikahan Lili & Parhan, Minggu, 25 Oktober 2026.",
      url: shareURL.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    toast(await copyText(shareURL.href)
      ? "Tautan undangan berhasil disalin."
      : "Tautan belum tersalin. Salin tautan dari bilah alamat browser.");
  });

  function calendarText(value) {
    return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
  }

  $("#save-date")?.addEventListener("click", () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Lili dan Parhan//Undangan Pernikahan//ID",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:lili-parhan-20261025@undangan.local",
      `DTSTAMP:${stamp}`,
      "DTSTART:20261025T020000Z",
      "SUMMARY:Akad Nikah Lili & Parhan",
      `LOCATION:${calendarText(address)}`,
      `DESCRIPTION:${calendarText("Akad nikah Sulis Saputri (Lili) dan M. Parhan Pawis (Parhan). Minggu, 25 Oktober 2026, pukul 10.00 WITA. Merupakan suatu kehormatan bagi kami atas kehadiran dan doa restu Anda.")}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    // RFC 5545 line folding; the calendar content here uses ASCII characters.
    const content = lines.map((line) => line.match(/.{1,73}/g).join("\r\n ")).join("\r\n") + "\r\n";
    const url = URL.createObjectURL(new Blob([content], { type: "text/calendar;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "akad-lili-parhan-25-oktober-2026.ics";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast("Buka berkas kalender untuk menyimpan tanggal akad.");
  });

  const dockLinks = $$(".dock a[href^='#']");
  const sections = dockLinks.map((link) => document.getElementById(link.hash.slice(1))).filter(Boolean);
  dockLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: motionPreference.matches ? "instant" : "smooth", block: "start" });
      try { history.replaceState(null, "", link.hash); } catch (_) { /* File URLs may restrict history. */ }
    });
  });

  if ("IntersectionObserver" in window) {
    const ratios = new Map();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      const visible = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
      if (!visible || visible[1] <= 0) return;
      dockLinks.forEach((link) => {
        const active = link.hash === `#${visible[0]}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-15% 0px -40% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.09, rootMargin: "0px 0px -25px 0px" });
    const observeReveals = () => $$(".reveal").forEach((element) => revealObserver.observe(element));
    if (body.classList.contains("is-locked")) {
      window.addEventListener("invitation:opened", observeReveals, { once: true });
    } else {
      observeReveals();
    }
  } else {
    $$(".reveal").forEach((element) => element.classList.add("is-visible"));
  }

  // A quiet, original pentatonic composition. Audio starts only with the music button.
  const musicButton = $("#music-toggle");
  let audioContext;
  let musicGain;
  let musicFilter;
  let musicPlaying = false;
  let musicStarting = false;
  let noteTimer;
  let nextNoteTime = 0;
  let noteIndex = 0;
  const melody = [74, 78, 81, 85, 81, 78, 76, 74, 69, 74, 78, 81, 78, 76, 74, null];

  function updateMusicUI() {
    if (!musicButton) return;
    musicButton.setAttribute("aria-pressed", String(musicPlaying));
    musicButton.setAttribute("aria-label", musicPlaying ? "Jeda musik" : "Putar musik");
    musicButton.classList.toggle("is-playing", musicPlaying);
    const status = $("#music-status");
    if (status) status.textContent = musicPlaying ? "Musik aktif" : "Putar musik";
  }

  function playNote(midi, time, duration, amplitude = 0.2) {
    if (midi === null) return;
    const oscillator = audioContext.createOscillator();
    const overtone = audioContext.createOscillator();
    const envelope = audioContext.createGain();
    const harmonic = audioContext.createGain();
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    overtone.type = "sine";
    overtone.frequency.value = frequency * 2;
    harmonic.gain.value = 0.06;
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(amplitude, time + 0.035);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope);
    overtone.connect(harmonic);
    harmonic.connect(envelope);
    envelope.connect(musicFilter);
    oscillator.start(time);
    overtone.start(time);
    oscillator.stop(time + duration + 0.1);
    overtone.stop(time + duration + 0.1);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    overtone.onended = () => { overtone.disconnect(); harmonic.disconnect(); };
  }

  function scheduleMusic() {
    if (!musicPlaying || !audioContext || audioContext.state !== "running") return;
    while (nextNoteTime < audioContext.currentTime + 0.3) {
      playNote(melody[noteIndex % melody.length], nextNoteTime, 3.2, 0.18);
      if (noteIndex % 4 === 0) {
        const base = [50, 55, 57, 55][Math.floor(noteIndex / 4) % 4];
        [base, base + 7, base + 12].forEach((note, index) => playNote(note, nextNoteTime + index * 0.12, 4.8, 0.055));
      }
      nextNoteTime += 0.85;
      noteIndex += 1;
    }
  }

  async function toggleMusic() {
    if (musicStarting) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      toast("Browser ini belum mendukung musik. Undangan tetap dapat dinikmati.");
      return;
    }
    if (musicPlaying) {
      musicPlaying = false;
      clearInterval(noteTimer);
      musicGain.gain.cancelScheduledValues(audioContext.currentTime);
      musicGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.12);
      updateMusicUI();
      return;
    }
    musicStarting = true;
    try {
      if (!audioContext) {
        audioContext = new AudioContextClass();
        musicGain = audioContext.createGain();
        musicFilter = audioContext.createBiquadFilter();
        musicFilter.type = "lowpass";
        musicFilter.frequency.value = 3200;
        const delay = audioContext.createDelay(2);
        const feedback = audioContext.createGain();
        const wet = audioContext.createGain();
        delay.delayTime.value = 0.43;
        feedback.gain.value = 0.28;
        wet.gain.value = 0.18;
        musicFilter.connect(musicGain);
        musicFilter.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(wet);
        wet.connect(musicGain);
        musicGain.gain.value = 0;
        musicGain.connect(audioContext.destination);
      }
      await audioContext.resume();
      musicPlaying = true;
      musicGain.gain.setTargetAtTime(0.32, audioContext.currentTime, 0.2);
      nextNoteTime = audioContext.currentTime + 0.08;
      scheduleMusic();
      noteTimer = setInterval(scheduleMusic, 120);
      updateMusicUI();
    } catch (_) {
      musicPlaying = false;
      updateMusicUI();
      toast("Musik belum dapat diputar. Coba sentuh tombol musik kembali.");
    } finally {
      musicStarting = false;
    }
  }
  musicButton?.addEventListener("click", toggleMusic);
  updateMusicUI();

  $("#replay-opening")?.addEventListener("click", () => {
    if (opening || !cover || !invitation) return;
    invitation.inert = true;
    invitation.setAttribute("inert", "");
    body.classList.remove("is-open", "is-opening");
    body.classList.add("is-locked");
    cover.hidden = false;
    if (openButton) {
      openButton.disabled = false;
      openButton.setAttribute("aria-expanded", "false");
      openButton.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });

  const canvas = $("#petals");
  let animationFrame;
  let particles = [];
  let canvasWidth = 0;
  let canvasHeight = 0;
  let lastFrame = 0;
  const context = canvas?.getContext("2d");

  function resizeParticles() {
    if (!canvas || !context) return;
    canvasWidth = Math.min(window.innerWidth, document.querySelector(".invitation-shell")?.clientWidth || window.innerWidth);
    canvasHeight = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(canvasWidth * scale);
    canvas.height = Math.round(canvasHeight * scale);
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(24, Math.max(10, Math.floor(canvasWidth / 45)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      size: 1 + Math.random() * 2.1,
      speed: 5 + Math.random() * 11,
      drift: Math.random() * Math.PI * 2,
      opacity: 0.12 + Math.random() * 0.3,
    }));
  }

  function renderParticles(time) {
    if (!context || motionPreference.matches || document.hidden) {
      animationFrame = undefined;
      return;
    }
    if (time - lastFrame < 32) {
      animationFrame = requestAnimationFrame(renderParticles);
      return;
    }
    const delta = Math.min((time - lastFrame) / 1000 || 0.033, 0.08);
    lastFrame = time;
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    particles.forEach((particle) => {
      particle.y -= particle.speed * delta;
      particle.x += Math.sin(time / 4500 + particle.drift) * delta * 7;
      if (particle.y < -10) { particle.y = canvasHeight + 10; particle.x = Math.random() * canvasWidth; }
      context.beginPath();
      context.fillStyle = `rgba(239, 204, 142, ${particle.opacity})`;
      context.ellipse(particle.x, particle.y, particle.size, particle.size * 0.58, time / 4000 + particle.drift, 0, Math.PI * 2);
      context.fill();
    });
    animationFrame = requestAnimationFrame(renderParticles);
  }

  function syncParticles() {
    if (!context) return;
    if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
    animationFrame = undefined;
    if (motionPreference.matches || document.hidden) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      return;
    }
    lastFrame = performance.now();
    animationFrame = requestAnimationFrame(renderParticles);
  }

  if (context) {
    resizeParticles();
    syncParticles();
    window.addEventListener("resize", resizeParticles, { passive: true });
  }
  if (motionPreference.addEventListener) motionPreference.addEventListener("change", syncParticles);
  else motionPreference.addListener(syncParticles);

  document.addEventListener("visibilitychange", () => {
    updateCountdown();
    syncParticles();
    if (!audioContext || !musicPlaying) return;
    if (document.hidden) {
      clearInterval(noteTimer);
      audioContext.suspend().catch(() => {});
    } else {
      audioContext.resume().then(() => {
        nextNoteTime = audioContext.currentTime + 0.08;
        clearInterval(noteTimer);
        noteTimer = setInterval(scheduleMusic, 120);
      }).catch(() => {});
    }
  });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$(".scene").forEach((scene) => {
      scene.addEventListener("pointermove", (event) => {
        if (motionPreference.matches) return;
        const rectangle = scene.getBoundingClientRect();
        scene.style.setProperty("--pointer-x", `${((event.clientX - rectangle.left) / rectangle.width - 0.5) * 8}px`);
        scene.style.setProperty("--pointer-y", `${((event.clientY - rectangle.top) / rectangle.height - 0.5) * 6}px`);
      }, { passive: true });
      scene.addEventListener("pointerleave", () => {
        scene.style.setProperty("--pointer-x", "0px");
        scene.style.setProperty("--pointer-y", "0px");
      });
    });
  }

  window.addEventListener("pagehide", () => {
    clearInterval(countdownTimer);
    clearInterval(noteTimer);
    if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) window.location.reload();
  });
})();


