import { Star } from "lucide-react";

const AVATARS = [
  { initials: "AK", bg: "bg-cool/20 text-cool" },
  { initials: "SR", bg: "bg-warm/20 text-warm" },
  { initials: "MJ", bg: "bg-emerald-500/20 text-emerald-400" },
  { initials: "PL", bg: "bg-pink-500/20 text-pink-400" },
  { initials: "TC", bg: "bg-amber-500/20 text-amber-400" },
];

/** Avatar stack + rating display */
export default function TrustIndicator() {
  return (
    <div className="flex items-center gap-3 mt-6">
      {/* Avatar stack */}
      <div className="flex -space-x-2">
        {AVATARS.map((a, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full ${a.bg} border-2 border-base flex items-center justify-center text-[10px] font-bold`}
          >
            {a.initials}
          </div>
        ))}
      </div>

      {/* Rating */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
            />
          ))}
          <span className="text-sm font-semibold text-txt ml-1">4.9</span>
        </div>
        <span className="text-xs text-txt-dim">from 2,500+ users</span>
      </div>
    </div>
  );
}
