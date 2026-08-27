import { useState, useRef } from "react";

const TAB_DESCRIPTIONS = {
  text: "Paste the suspicious message, email, or SMS content below.",
  url: "Enter the URL you want to check for phishing or scam indicators.",
  screenshot: "Upload a screenshot of the suspicious message or webpage.",
  qrcode: "Upload an image of a QR code to decode and analyze the embedded link.",
};

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp,image/bmp";

export default function InputForm({ activeTab, onSubmit, loading }) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setFile(f);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    if (loading) return;

    switch (activeTab) {
      case "text":
        if (text.trim()) onSubmit({ text: text.trim() });
        break;
      case "url":
        if (url.trim()) onSubmit({ url: url.trim() });
        break;
      case "screenshot":
      case "qrcode":
        if (file) onSubmit({ file });
        break;
    }
  }

  const canSubmit =
    !loading &&
    ((activeTab === "text" && text.trim()) ||
      (activeTab === "url" && url.trim()) ||
      ((activeTab === "screenshot" || activeTab === "qrcode") && file));

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {/* Description */}
      <p className="text-sm text-slate-500">{TAB_DESCRIPTIONS[activeTab]}</p>

      {/* Text input */}
      {activeTab === "text" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the suspicious message here..."
          rows={8}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500
                     focus:border-transparent resize-y"
        />
      )}

      {/* URL input */}
      {activeTab === "url" && (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://suspicious-site.com/..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500
                     focus:border-transparent"
        />
      )}

      {/* File upload (screenshot or QR code) */}
      {(activeTab === "screenshot" || activeTab === "qrcode") && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
            ${dragOver ? "border-brand-400 bg-brand-50" : "border-slate-200 bg-white hover:border-slate-300"}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGES}
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-lg bg-brand-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-brand-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700">{file.name}</p>
              <p className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} KB &middot; Click or drop to replace
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-lg bg-slate-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-slate-400">PNG, JPG, WebP, or BMP (max 10 MB)</p>
            </div>
          )}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`
          w-full py-3 px-4 rounded-xl text-sm font-semibold transition-all
          ${
            canSubmit
              ? "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }
        `}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </form>
  );
}
