import { ScanSearch, Shield } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

interface FinalCTAProps {
  onScanClick?: () => void;
}

export default function FinalCTA({ onScanClick }: FinalCTAProps) {
  return (
    <section className="relative z-10 py-24">
      <ScrollReveal>
        <div className="relative max-w-3xl mx-auto text-center">
          {/* Background glow */}
          <div
            className="absolute inset-0 -z-10 rounded-3xl"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(47,191,176,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Shield SVG behind text */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="w-16 h-16 text-cool/20" strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-8 h-8 text-cool" strokeWidth={2} />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-txt mb-4 leading-tight">
            Don&rsquo;t Trust the Message.
            <br />
            <span className="bg-gradient-to-r from-cool via-warm to-cool bg-clip-text text-transparent">
              TrustLens It.
            </span>
          </h2>

          <p className="text-lg text-txt-muted mb-8 max-w-md mx-auto">
            Check before you click.
          </p>

          <button
            onClick={onScanClick}
            className="cta-btn inline-flex items-center gap-2 text-lg px-10 py-4"
          >
            <ScanSearch className="w-5 h-5" />
            Scan Something Now
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
