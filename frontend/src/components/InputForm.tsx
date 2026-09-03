import { useState, useEffect, useRef } from "react";
import { useLang } from "../LangContext";

const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp,image/bmp";

interface SubmitData {
  text?: string;
  url?: string;
  file?: File;
}

interface InputFormProps {
  activeTab: string;
  onSubmit: (data: SubmitData) => void;
  loading: boolean;
  prefillValue?: string;
}

export default function InputForm({ activeTab, onSubmit, loading, prefillValue }: InputFormProps) {
  const { t } = useLang();
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");

  // Sync prefilled text from parent
  useEffect(() => {
    if (prefillValue && activeTab === "text") setText(prefillValue);
  }, [prefillValue, activeTab]);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  function clearFile(e?: React.MouseEvent) {
    e?.stopPropagation();
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setFile(f);
  }

  function handleFormSubmit(e: React.FormEvent) {
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

  const inputClasses =
    "w-full rounded-lg border border-line bg-base px-4 py-3.5 text-sm text-white placeholder:text-txt-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 resize-y transition-all";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
      {activeTab === "text" && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholders.text}
          rows={5}
          className={inputClasses}
        />
      )}

      {activeTab === "url" && (
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t.placeholders.url}
          className={inputClasses}
        />
      )}

      {(activeTab === "screenshot" || activeTab === "qrcode") && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 sm:p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-accent bg-accent/5"
              : "border-line hover:border-txt-dim/40 bg-base-card"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_IMAGES}
            onChange={handleFileChange}
            className="hidden"
          />
          {file ? (
            <div className="space-y-3">
              {previewUrl && (
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt={t.imagePreview}
                    className="mx-auto max-h-32 rounded-lg border border-line object-contain"
                  />
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs hover:bg-accent-light transition-colors shadow-md"
                    title={t.removeFile}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-txt-dim">
                  {(file.size / 1024).toFixed(1)} KB &middot; {t.uploadReplace}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-lg bg-base-hover flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-txt-dim">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-sm text-txt-muted">
                <span className="font-medium text-white">{t.uploadClick}</span> {t.uploadOr}
              </p>
              <p className="text-xs text-txt-dim">{t.uploadFormats}</p>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full py-3.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
          canSubmit
            ? "bg-accent text-white hover:bg-accent-light active:scale-[0.99]"
            : "bg-base-card text-txt-dim cursor-not-allowed border border-line"
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {t.analyzing}
          </span>
        ) : (
          t.analyze
        )}
      </button>
    </form>
  );
}
