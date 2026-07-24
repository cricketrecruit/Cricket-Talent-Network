type DobFieldsProps = {
  value: string;
  onChange: (iso: string) => void;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function DobFields({ value, onChange }: DobFieldsProps) {
  return (
    <div>
      <label className="block text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
        Date of Birth<span className="text-cricket-red ml-1">*</span>
      </label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="1900-01-01"
        max={todayIso()}
        className="w-full bg-white/5 border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red scheme-dark [&::-webkit-calendar-picker-indicator]:invert"
      />
    </div>
  );
}
