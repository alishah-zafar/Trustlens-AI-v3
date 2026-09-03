import {
  MessageSquare,
  Mail,
  Globe,
  Image,
  QrCode,
  Brain,
} from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Message Analysis",
    desc: "Paste any suspicious text, SMS, or chat message. Our AI examines urgency, impersonation, emotional manipulation, and more.",
    gradient: "from-cool/20 to-cool/5",
    iconColor: "text-cool",
  },
  {
    icon: Mail,
    title: "Email Protection",
    desc: "Detect phishing emails with spoofed senders, malicious attachments, and social engineering tactics.",
    gradient: "from-warm/20 to-warm/5",
    iconColor: "text-warm",
  },
  {
    icon: Globe,
    title: "Website Scanner",
    desc: "Analyze URLs for typosquatting, suspicious TLDs, IP-based domains, and DNS anomalies.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Image,
    title: "Screenshot Analysis",
    desc: "Upload screenshots and our OCR extracts text, URLs, and phone numbers for deep analysis.",
    gradient: "from-pink-500/20 to-pink-500/5",
    iconColor: "text-pink-400",
  },
  {
    icon: QrCode,
    title: "QR Code Detection",
    desc: "Decode QR codes and analyze embedded URLs for phishing and malicious redirects.",
    gradient: "from-amber-500/20 to-amber-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Brain,
    title: "AI Risk Explanation",
    desc: "Get a clear, human-readable explanation of why something is risky — in your language.",
    gradient: "from-sky-500/20 to-sky-500/5",
    iconColor: "text-sky-400",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative z-10 py-20">
      <ScrollReveal>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-txt mb-3">
            Comprehensive{" "}
            <span className="bg-gradient-to-r from-cool to-warm bg-clip-text text-transparent">
              Protection
            </span>
          </h2>
          <p className="text-txt-muted max-w-lg mx-auto">
            Six powerful analysis tools working together to keep you safe from every type of digital scam.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f, i) => (
          <ScrollReveal key={f.title} delay={i * 0.08}>
            <div className="glass-card p-6 h-full group cursor-default">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="text-base font-semibold text-txt mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-txt-dim leading-relaxed">{f.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
