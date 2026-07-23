const COUNTRIES = [
  "USA", "Canada", "Australia", "England", "New Zealand",
  "Sri Lanka", "Nepal", "Bangladesh", "Pakistan",
  "South Africa", "West Indies", "Afghanistan", "India",
];

export function CountryRibbon() {
  const list = [...COUNTRIES, ...COUNTRIES];
  return (
    <div className="bg-navy text-white border-b border-white/10 overflow-hidden">
      <div className="flex items-center">
        <span className="shrink-0 bg-cricket-red text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2.5">
          Playing Nations
        </span>
        <div className="overflow-hidden flex-1">
          <div className="flex gap-8 whitespace-nowrap animate-marquee py-2.5 pl-8 text-[11px] font-bold uppercase tracking-widest">
            {list.map((c, i) => (
              <span key={i} className="flex items-center gap-8 text-white/70">
                {c}
                <span className="text-cricket-red/60">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
