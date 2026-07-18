import { ReactNode } from "react";

export const QuizShell = ({ children, progress }: { children: ReactNode; progress?: number }) => (
  <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
    {typeof progress === "number" && (
      <div className="h-1 bg-white/10 w-full">
        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    )}
    <div className="flex-1 flex items-center justify-center px-4 py-8 sm:py-10">
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  </main>
);

export const QuizTitle = ({ children }: { children: ReactNode }) => (
  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mb-5 leading-tight">
    {children}
  </h1>
);

export const QuizText = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-white/80 text-base sm:text-lg mb-6 leading-relaxed">{children}</p>
);

export const QuizButton = ({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={
      (variant === "primary"
        ? "w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-5 rounded-xl transition-all text-base sm:text-lg shadow-lg"
        : "w-full border-2 border-white/20 hover:border-green-500 hover:bg-green-500/10 text-white font-semibold py-4 px-5 rounded-xl transition-all text-base sm:text-lg text-left") +
      " disabled:opacity-50 disabled:cursor-not-allowed"
    }
  >
    {children}
  </button>
);

export const QuizOptions = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-3">{children}</div>
);

export const QuizBigChoice = ({
  options,
  onSelect,
}: {
  options: { emoji: string; label: string; value: string }[];
  onSelect: (v: string) => void;
}) => (
  <div className="grid grid-cols-2 gap-3 sm:gap-4">
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onSelect(o.value)}
        className="flex flex-col items-center justify-center gap-3 bg-white/5 border-2 border-white/10 hover:border-green-500 hover:bg-green-500/10 rounded-2xl py-8 px-4 transition-all"
      >
        <span className="text-5xl sm:text-6xl">{o.emoji}</span>
        <span className="font-bold text-base sm:text-lg text-center">{o.label}</span>
      </button>
    ))}
  </div>
);

export const QuizSlider = ({
  min,
  max,
  step = 1,
  value,
  onChange,
  format,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) => (
  <div className="mb-6">
    <div className="text-center mb-4">
      <span className="text-4xl sm:text-5xl font-extrabold text-green-400">
        {format ? format(value) : value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-green-500 h-2"
    />
    <div className="flex justify-between text-xs text-white/50 mt-2">
      <span>{format ? format(min) : min}</span>
      <span>{format ? format(max) : max}+</span>
    </div>
  </div>
);
