/** Minimal dark background — solid black with a subtle red vignette */
export default function HeroBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-base" />
      {/* Subtle red vignette at top */}
      <div
        className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[80%] h-[60%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(229,62,62,0.04) 0%, transparent 70%)",
        }}
      />
      {/* Depth gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-base to-transparent" />
    </div>
  );
}
