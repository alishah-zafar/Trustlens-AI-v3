import { Shield } from "lucide-react";
import { useLang } from "../../LangContext";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative z-10 border-t border-line bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" strokeWidth={2.2} />
            </div>
            <span className="text-base font-bold text-txt tracking-tight">
              Trust<span className="text-accent">Lens</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-txt-dim">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-line text-center">
          <p className="text-xs text-txt-dim">
            &copy; {new Date().getFullYear()} TrustLens AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
