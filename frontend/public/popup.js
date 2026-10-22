const $ = (id) => document.getElementById(id);
let activeTab = null;
let currentTab = "page";
const images = {}; // kind -> data URL

function esc(s) { const d = document.createElement("div"); d.textContent = s ?? ""; return d.innerHTML; }
function list(title, items) {
  return items && items.length ? `<h4>${title}</h4><ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "";
}
function setStatus(msg, isError) {
  const s = $("status");
  if (!msg) return s.classList.add("hidden");
  s.textContent = msg; s.className = "status" + (isError ? " error" : "");
}
function send(msg) { return chrome.runtime.sendMessage(msg); }

function render(r) {
  const cls = r.riskScore >= 70 ? "v-high" : r.riskScore >= 35 ? "v-sus" : "v-safe";
  const label = r.riskScore >= 70 ? "High risk" : r.riskScore >= 35 ? "Suspicious" : "Looks safe";
  const rtl = $("lang").value === "urdu" ? ' dir="rtl"' : "";
  const u = r.urlDetails;
  const c = r.extractedContacts || {};
  const extracted =
    (r.extractedUrl ? `<h4>Link found</h4><div class="ex">${esc(r.extractedUrl)}</div>` : "") +
    list("Contacts found", [...(c.phones || []), ...(c.emails || []), ...(c.urls || [])].slice(0, 6)) +
    (r.extractedText ? `<h4>Text read from image</h4><div class="ex"><small>${esc(r.extractedText.slice(0, 300))}${r.extractedText.length > 300 ? "…" : ""}</small></div>` : "");
  const urlInfo = u ? list("Domain details", [
    `Domain: ${u.domain}`,
    u.domainAgeDays != null ? `Domain age: ${u.domainAgeDays} days` : null,
    u.isTyposquat ? `Possible look-alike of ${u.typosquatTarget}` : null,
    u.isShortener ? "Link shortener" : null,
  ].filter(Boolean)) : "";
  $("result").innerHTML = `<div${rtl}>
    <div class="verdict"><div class="score ${cls}">${r.riskScore}</div>
      <div><div class="vlabel ${cls}">${label}</div>
      <div class="vsub">${esc(r.scamCategory || "")} ${r.confidence ? "· " + esc(r.confidence) + " confidence" : ""}</div></div></div>
    <p class="explain">${esc(r.explanation)}</p>
    ${list("Red flags", r.redFlags)}${list("Tactics", r.tactics)}${urlInfo}${extracted}${list("What to do", r.recommendations)}
  </div>`;
  $("result").classList.remove("hidden");
}

async function run(kind, value, btn) {
  if (!value || !value.trim()) return setStatus("Nothing to analyze.", true);
  btn.disabled = true; $("result").classList.add("hidden");
  setStatus("Analyzing… the server can take a few seconds to wake up.");
  const res = await send({ type: "analyze", kind, value: value.trim(), tabId: activeTab?.id });
  btn.disabled = false;
  if (!res?.ok) return setStatus(res?.error || "Request failed.", true);
  setStatus(""); render(res.result);
}

async function trace() {
  const value = $("linkInput").value.trim();
  if (!value) return setStatus("Enter a link first.", true);
  $("traceLink").disabled = true; $("result").classList.add("hidden");
  setStatus("Following redirects…");
  const res = await send({ type: "trace", value });
  $("traceLink").disabled = false;
  if (!res?.ok) return setStatus(res?.error || "Request failed.", true);
  setStatus("");
  const t = res.result;
  $("result").innerHTML = `<h4>${t.totalHops} hop(s) · ${t.isSuspicious ? "suspicious chain" : "no red flags"}</h4>` +
    t.hops.map((h) => `<div class="hop ${h.isSuspicious ? "sus" : ""}">${esc(h.url)}${h.flags?.length ? "<br><small>" + esc(h.flags.join(", ")) + "</small>" : ""}</div>`).join("") +
    `<h4>Final destination</h4><div class="hop">${esc(t.finalDestination)}</div>`;
  $("result").classList.remove("hidden");
}

document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("active", x === b));
  currentTab = b.dataset.tab;
  ["page", "text", "link", "screenshot", "qrcode"].forEach((t) => $("pane-" + t).classList.toggle("hidden", t !== currentTab));
  $("result").classList.add("hidden"); setStatus("");
}));

(async () => {
  const { lang } = await chrome.storage.sync.get("lang");
  $("lang").value = lang || "en";
  $("lang").addEventListener("change", () => chrome.storage.sync.set({ lang: $("lang").value }));

  [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const url = activeTab?.url || "";
  const scannable = /^https?:\/\//i.test(url);
  $("pageUrl").textContent = scannable ? url : "This page can't be scanned (browser or internal page).";
  $("scanPage").disabled = !scannable;

  $("scanPage").addEventListener("click", () => run("url", url, $("scanPage")));
  $("scanText").addEventListener("click", () => run("text", $("textInput").value, $("scanText")));
  $("scanLink").addEventListener("click", () => run("url", $("linkInput").value, $("scanLink")));
  $("traceLink").addEventListener("click", trace);
  $("openWeb").addEventListener("click", (e) => { e.preventDefault(); chrome.tabs.create({ url: TRUSTLENS_WEB }); });

  // Show a result produced by the right-click menu
  const { showLast, lastResult } = await chrome.storage.session.get(["showLast", "lastResult"]);
  if (showLast && lastResult) {
    await chrome.storage.session.remove("showLast");
    render(lastResult.result);
  }
})();


// ---------- Screenshot / QR panes ----------
function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error("Could not read the image."));
    r.readAsDataURL(file);
  });
}

// Backend limit is 10 MB: re-encode big images as JPEG
async function shrinkIfNeeded(dataUrl) {
  if (dataUrl.length < 9_000_000) return dataUrl;
  const img = new Image();
  await new Promise((ok, bad) => { img.onload = ok; img.onerror = bad; img.src = dataUrl; });
  const scale = Math.min(1, 2000 / Math.max(img.width, img.height));
  const cv = document.createElement("canvas");
  cv.width = Math.round(img.width * scale); cv.height = Math.round(img.height * scale);
  cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
  return cv.toDataURL("image/jpeg", 0.85);
}

document.querySelectorAll(".imgpane").forEach((pane) => {
  const kind = pane.dataset.kind;
  const drop = pane.querySelector(".drop");
  const fileInput = pane.querySelector(".file");
  const preview = pane.querySelector(".preview");
  const scan = pane.querySelector(".scan");

  async function setImage(dataUrl) {
    try { dataUrl = await shrinkIfNeeded(dataUrl); } catch { /* keep original */ }
    images[kind] = dataUrl;
    preview.src = dataUrl; preview.classList.remove("hidden");
    pane.querySelector(".drop-hint").classList.add("hidden");
    scan.disabled = false; setStatus(""); $("result").classList.add("hidden");
  }
  async function setFile(file) {
    if (!file || !file.type.startsWith("image/")) return setStatus("Please choose an image file.", true);
    setImage(await readAsDataUrl(file));
  }

  pane._setFile = setFile;
  drop.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => setFile(fileInput.files[0]));
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => setFile(e.dataTransfer.files[0]));

  pane.querySelector(".capture").addEventListener("click", async () => {
    try {
      setImage(await chrome.tabs.captureVisibleTab(activeTab?.windowId, { format: "png" }));
    } catch (e) {
      setStatus("Can't capture this tab (browser pages are protected).", true);
    }
  });

  scan.addEventListener("click", async () => {
    scan.disabled = true; $("result").classList.add("hidden");
    setStatus(kind === "qrcode" ? "Decoding QR code…" : "Reading text from the image… this can take a few seconds.");
    const res = await send({ type: "analyzeImage", kind, dataUrl: images[kind], tabId: activeTab?.id });
    scan.disabled = false;
    if (!res?.ok) return setStatus(res?.error || "Request failed.", true);
    setStatus(""); render(res.result);
  });
});

// Ctrl+V pastes an image into whichever image tab is open
document.addEventListener("paste", (e) => {
  if (currentTab !== "screenshot" && currentTab !== "qrcode") return;
  const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
  if (item) { e.preventDefault(); $("pane-" + currentTab)._setFile(item.getAsFile()); }
});
