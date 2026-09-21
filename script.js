/**
 * Centralized Sleepover & Pizza Party Configuration
 * Note: month is 0-indexed (9 = October)
 */
const PARTY_CONFIG = {
  year: 2026,
  month: 9, // October
  day: 17,
  hour: 17,
  minute: 0,
  durationHours: 18, // Lördag 17:00 till Söndag 11:00
  dateStringSwedish: "17–18 Oktober 2026",
  dateWithDaySwedish: "Lördag 17 – Söndag 18 Okt",
  timeSwedish: "Kl. 17:00 (lör) – 11:00 (sön)",
  rsvpDeadlineSwedish: "10 oktober",
  addressSwedish: "Kvarnbogatan 36, Uppsala",
  phoneSwedish: "[Telefonnummer]",
  descriptionSwedish:
    "Du är varmt välkommen till Alices Sleepover och pizzakväll! Vi bakar egna pizzor, utmanar varandra i Just Dance och avslutar med filmmys och övernattning den 17–18 oktober."
};

document.addEventListener("DOMContentLoaded", () => {
  initCentralizedData();
  initAmbientParticles();
  initCountdown();
  initPackingList();
  initSuggestionChips();
  initRSVP();
});

/**
 * 1. Populate dynamic dates & text from configuration
 */
function initCentralizedData() {
  document.title = `Alices Sleepover — ${PARTY_CONFIG.dateStringSwedish}`;

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute("content", PARTY_CONFIG.descriptionSwedish);
  }

  const heroSubtitle = document.getElementById("heroSubtitle");
  if (heroSubtitle) {
    heroSubtitle.textContent = `Lördag 17 oktober (kl. 17:00) – Söndag 18 oktober (kl. 11:00)`;
  }

  const detailsDate = document.getElementById("detailsDate");
  if (detailsDate) {
    detailsDate.textContent = PARTY_CONFIG.dateWithDaySwedish;
  }

  const detailsTime = document.getElementById("detailsTime");
  if (detailsTime) {
    detailsTime.textContent = PARTY_CONFIG.timeSwedish;
  }

  const detailsRsvp = document.getElementById("detailsRsvpDeadline");
  if (detailsRsvp) {
    detailsRsvp.textContent = `Senast ${PARTY_CONFIG.rsvpDeadlineSwedish}`;
  }

  const rsvpDeadline = document.getElementById("rsvpDeadline");
  if (rsvpDeadline) {
    rsvpDeadline.textContent = PARTY_CONFIG.rsvpDeadlineSwedish;
  }

  const rsvpPhone = document.getElementById("rsvpPhone");
  if (rsvpPhone) {
    rsvpPhone.textContent = PARTY_CONFIG.phoneSwedish;
  }

  const footerDate = document.getElementById("footerDate");
  if (footerDate) {
    footerDate.textContent = `Lördag 17 okt kl. 17:00 – Söndag 18 okt kl. 11:00`;
  }
}

/**
 * 2. Floating refined starlight particles
 */
function initAmbientParticles() {
  const container = document.getElementById("starsContainer");
  if (!container) return;

  const symbols = ["✦", "✧", "⋆", "·"];
  const count = 16;

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "particle";
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    el.style.left = `${Math.random() * 100}vw`;
    el.style.fontSize = `${10 + Math.random() * 14}px`;
    el.style.animationDelay = `${Math.random() * 14}s`;
    el.style.animationDuration = `${16 + Math.random() * 18}s`;

    container.appendChild(el);

    el.addEventListener("animationiteration", () => {
      el.style.left = `${Math.random() * 100}vw`;
    });
  }
}

/**
 * 3. Countdown targeting Saturday 17 October 17:00 to Sunday 18 October 11:00
 */
function initCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const timerEl = document.getElementById("countdownTimer");
  const heading = document.querySelector(".countdown-section .section-heading");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const target = new Date(
    PARTY_CONFIG.year,
    PARTY_CONFIG.month,
    PARTY_CONFIG.day,
    PARTY_CONFIG.hour,
    PARTY_CONFIG.minute,
    0
  );
  const end = new Date(target.getTime() + PARTY_CONFIG.durationHours * 3600 * 1000);

  function tick() {
    const now = new Date();
    const remaining = target - now;
    const tillEnd = end - now;

    if (remaining > 0) {
      const d = Math.floor(remaining / 864e5);
      const h = Math.floor((remaining % 864e5) / 36e5);
      const m = Math.floor((remaining % 36e5) / 6e4);
      const s = Math.floor((remaining % 6e4) / 1e3);

      daysEl.textContent = String(d).padStart(2, "0");
      hoursEl.textContent = String(h).padStart(2, "0");
      minutesEl.textContent = String(m).padStart(2, "0");
      secondsEl.textContent = String(s).padStart(2, "0");
    } else if (tillEnd > 0) {
      if (heading) heading.textContent = "Sleepovern pågår just nu!";
      if (timerEl) {
        timerEl.innerHTML = `
          <p style="font-family:'Cormorant Garamond',serif;font-size:24px;font-style:italic;color:#facc15;text-align:center;padding:16px 0;">
            Välkommen in — pizzorna gräddas, Just Dance är igång och filmmyset väntar!
          </p>`;
      }
      clearInterval(interval);
    } else {
      if (heading) heading.textContent = "Sleepovern är avslutad";
      if (timerEl) {
        timerEl.innerHTML = `
          <p style="font-family:'Cormorant Garamond',serif;font-size:20px;font-style:italic;color:#cbd5e1;text-align:center;padding:16px 0;">
            Tack alla för en helt magisk sleepover och filmmys!
          </p>`;
      }
      clearInterval(interval);
    }
  }

  tick();
  const interval = setInterval(tick, 1000);
}

/**
 * 4. Interactive Packing Checklist with LocalStorage Persistence
 */
function initPackingList() {
  const checklist = document.getElementById("packingChecklist");
  const counter = document.getElementById("packingProgress");
  if (!checklist || !counter) return;

  const STORAGE_KEY = "alice_sleepover_packing_2026";
  let packedState = {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) packedState = JSON.parse(saved);
  } catch (e) {
    console.error("Error reading packing list from localStorage", e);
  }

  const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');

  function updateCounter() {
    let checkedCount = 0;
    checkboxes.forEach((cb) => {
      const id = cb.getAttribute("data-item");
      if (packedState[id]) {
        cb.checked = true;
        checkedCount++;
      } else {
        cb.checked = false;
      }
    });

    if (checkedCount === checkboxes.length) {
      counter.textContent = `Allt packat och klart! (${checkedCount} av ${checkboxes.length})`;
      counter.style.color = "#15803d";
    } else {
      counter.textContent = `Packat: ${checkedCount} av ${checkboxes.length} saker`;
      counter.style.color = "#9a3412";
    }
  }

  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const id = cb.getAttribute("data-item");
      packedState[id] = cb.checked;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(packedState));
      } catch (e) {
        console.error("Error saving packing list", e);
      }
      updateCounter();
    });
  });

  updateCounter();
}

/**
 * 5. Quick-select suggestion chips for Pizza & Breakfast inputs
 */
function initSuggestionChips() {
  const chips = document.querySelectorAll(".chip-btn");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const targetId = chip.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      const chipText = chip.textContent.trim();
      let currentValues = input.value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      const existsIndex = currentValues.findIndex(
        (v) => v.toLowerCase() === chipText.toLowerCase()
      );
      if (existsIndex >= 0) {
        currentValues.splice(existsIndex, 1);
        chip.classList.remove("active");
      } else {
        currentValues.push(chipText);
        chip.classList.add("active");
      }

      input.value = currentValues.join(", ");
      input.dispatchEvent(new Event("input"));
    });
  });

  // Keep chips synced if user types manually
  ["pizzaTopping", "breakfastChoice"].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("input", () => {
      const currentValues = input.value
        .toLowerCase()
        .split(",")
        .map((v) => v.trim());
      const relatedChips = document.querySelectorAll(`.chip-btn[data-target="${id}"]`);
      relatedChips.forEach((chip) => {
        const text = chip.textContent.trim().toLowerCase();
        if (currentValues.includes(text)) {
          chip.classList.add("active");
        } else {
          chip.classList.remove("active");
        }
      });
    });
  });
}

/**
 * 6. RSVP submission handling with LocalStorage & Google Apps Script sync
 */
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwZ29DYASooO_mD4zc3qN74ytUgHtsvFQ471pj0TbC5udJPm-GY0pWs2_p07cAgIPtc7Q/exec";

function initRSVP() {
  const form = document.getElementById("rsvpForm");
  const success = document.getElementById("successMessage");
  const summary = document.getElementById("rsvpSummary");
  const reset = document.getElementById("resetBtn");
  const submitBtn = document.getElementById("submitBtn");
  const errorBox = document.getElementById("rsvpError");

  if (!form || !success || !summary || !reset) return;

  const STORAGE_KEY = "alice_sleepover_rsvp_2026";

  // Restore existing submission if stored
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      showSuccess(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const pizzaTopping = document.getElementById("pizzaTopping").value.trim();
    const breakfastChoice = document.getElementById("breakfastChoice").value.trim();
    const allergies = document.getElementById("guestAllergies").value.trim();
    const message = document.getElementById("guestMessage").value.trim();

    if (!name) return;

    const data = {
      name: name,
      count: 1,
      pizzaTopping: pizzaTopping || "Valfritt",
      breakfastChoice: breakfastChoice || "Alltätare",
      allergies: allergies || "Inga",
      message: message || "",
      // Backward-compatible compound field for Google Sheets:
      notes: `Pizza: ${pizzaTopping || "Valfritt"} | Frukost: ${breakfastChoice || "Alltätare"} | Allergier: ${allergies || "Inga"} | Hälsning: ${message || "-"}`,
      timestamp: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")
    };

    setLoading(true);
    if (errorBox) errorBox.style.display = "none";

    const configured = APPS_SCRIPT_URL && APPS_SCRIPT_URL !== "PASTE_YOUR_APPS_SCRIPT_URL_HERE";

    if (configured) {
      try {
        await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(data)
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showSuccess(data);
      } catch (err) {
        console.error("RSVP submission error:", err);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showSuccess(data);
      } finally {
        setLoading(false);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLoading(false);
      showSuccess(data);
    }
  });

  reset.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    success.style.display = "none";
    form.style.display = "flex";
    if (errorBox) errorBox.style.display = "none";
    form.reset();

    // Reset chips active state
    document.querySelectorAll(".chip-btn").forEach((c) => c.classList.remove("active"));
  });

  function setLoading(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.textContent = on ? "Skickar in…" : "Skicka anmälan";
    submitBtn.style.opacity = on ? "0.7" : "1";
  }

  function showSuccess(data) {
    form.style.display = "none";
    success.style.display = "block";
    summary.innerHTML = `
      <p><strong>Namn:</strong> ${esc(data.name)}</p>
      <p><strong>Pizzatoppings:</strong> ${esc(data.pizzaTopping || "Valfritt")}</p>
      <p><strong>Frukost:</strong> ${esc(data.breakfastChoice || "Alltätare")}</p>
      <p><strong>Allergier / Specialkost:</strong> ${esc(data.allergies || "Inga")}</p>
      ${data.message ? `<p><strong>Hälsning:</strong> ${esc(data.message)}</p>` : ""}
    `;
  }
}

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
