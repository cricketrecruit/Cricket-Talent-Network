import { SIGNUP_STEP_TITLES } from "@/lib/player-signup-schema";

export function SignupStepIndicator({ step }: { step: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-white/50">
        <span>Step {step} of {SIGNUP_STEP_TITLES.length}</span>
        <span className="text-cricket-red">{SIGNUP_STEP_TITLES[step - 1]}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {SIGNUP_STEP_TITLES.map((title, index) => {
          const stepNumber = index + 1;
          const active = stepNumber === step;
          const completed = stepNumber < step;
          return (
            <div key={title} className="space-y-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  active || completed ? "bg-cricket-red" : "bg-white/15"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
