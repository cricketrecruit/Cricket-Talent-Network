import { PLAYER_LABELS } from "@/lib/player-profile-fields";

type PhoneFieldsProps = {
  countryCode: string;
  phoneNumber: string;
  onChange: (next: { countryCode: string; phoneNumber: string }) => void;
};

export function PhoneFields({ countryCode, phoneNumber, onChange }: PhoneFieldsProps) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-white/60 mb-2 font-bold">
        {PLAYER_LABELS.phone}<span className="text-cricket-red ml-1">*</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-2">
            Country Code (e.g. +1)<span className="text-cricket-red ml-1">*</span>
          </label>
          <input
            type="text"
            value={countryCode}
            onChange={(e) => onChange({ countryCode: e.target.value, phoneNumber })}
            className="w-full bg-white/5 border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-widest text-white/50 mb-2">
            Phone Number<span className="text-cricket-red ml-1">*</span>
          </label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => onChange({ countryCode, phoneNumber: e.target.value })}
            className="w-full bg-white/5 border border-white/20 text-white px-3 py-2.5 text-sm focus:outline-none focus:border-cricket-red"
          />
        </div>
      </div>
    </div>
  );
}
