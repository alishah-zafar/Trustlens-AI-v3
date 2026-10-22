importScripts("config.js");

async function callApi(path, body) {
  const res = await fetch(`${TRUSTLENS_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }
  return res.json();
}

async function getLang() {
  const { lang } = await chrome.storage.sync.get("lang");
  return lang || "en";
}

function setBadge(tabId, score) {
  const color = score >= 70 ? "#E53E3E" : score >= 35 ? "#ECC94B" : "#48BB78";
  const opts = tabId ? { tabId } : {};
  chrome.action.setBadgeText({ text: String(score), ...opts });
  chrome.action.setBadgeBackgroundColor({ color, ...opts });
}

async function analyze(kind, value, tabId) {
  const lang = await getLang();
  const result = kind === "url"
    ? await callApi("/analyze/url", { url: value, lang })
    : await callApi("/analyze/text", { text: value, lang });
  setBadge(tabId, result.riskScore);
  await chrome.storage.session.set({ lastResult: { kind, value, result, at: Date.now() } });
  return result;
}

async function analyzeImage(kind, dataUrl, tabId) {
  const lang = await getLang();
  const blob = await (await fetch(dataUrl)).blob();
  const ext = blob.type === "image/jpeg" ? "jpg" : (blob.type.split("/")[1] || "png");
  const form = new FormData();
  form.append("image", blob, `${kind}.${ext}`);
  form.append("lang", lang);
  const res = await fetch(`${TRUSTLENS_API}/analyze/${kind}`, { method: "POST", body: form });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Server error: ${res.status}`);
  }
  const result = await res.json();
  setBadge(tabId, result.riskScore);
  await chrome.storage.session.set({ lastResult: { kind, result, at: Date.now() } });
  return result;
}

// Popup <-> background messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === "analyze") {
        sendResponse({ ok: true, result: await analyze(msg.kind, msg.value, msg.tabId) });
      } else if (msg.type === "analyzeImage") {
        sendResponse({ ok: true, result: await analyzeImage(msg.kind, msg.dataUrl, msg.tabId) });
      } else if (msg.type === "trace") {
        sendResponse({ ok: true, result: await callApi("/analyze/trace-link", { url: msg.value }) });
      }
    } catch (e) {
      sendResponse({ ok: false, error: e.message });
    }
  })();
  return true; // async response
});

// Right-click menu: check selected text or a link
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "tl-selection", title: "Check selected text with TrustLens", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "tl-link", title: "Check this link with TrustLens", contexts: ["link"] });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const isLink = info.menuItemId === "tl-link";
  const value = isLink ? info.linkUrl : info.selectionText;
  if (!value) return;
  chrome.action.setBadgeText({ text: "…", tabId: tab.id });
  chrome.action.setBadgeBackgroundColor({ color: "#6B6B6B", tabId: tab.id });
  try {
    await analyze(isLink ? "url" : "text", value, tab.id);
    // Flag that the popup should show this result when opened
    await chrome.storage.session.set({ showLast: true });
    if (chrome.action.openPopup) await chrome.action.openPopup().catch(() => {});
  } catch (e) {
    chrome.action.setBadgeText({ text: "!", tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: "#9B2C2C", tabId: tab.id });
  }
});
