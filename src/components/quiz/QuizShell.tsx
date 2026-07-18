import { ReactNode } from "react";

export const QuizShell = ({ children, progress }: { children: ReactNode; progress?: number }) => (
  <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
    {typeof progress === "number" && (
      <div className="h-1 bg-white/10 w-full">
        <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    )}
    <div className="flex-1 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  </main>
);

export const QuizTitle = ({ children }: { children: ReactNode }) => (
  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mb-6 leading-tight">
    {children}
  </h1>
);

export const QuizText = ({ children }: { children: ReactNode }) => (
  <p className="text-center text-white/80 text-base sm:text-lg mb-8">{children}</p>
);

export const QuizButton = ({
  children,
  onClick,
  variant = "primary",
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: "primary" | "outline";
}) => (
  <button
    onClick={onClick}
    className={
      variant === "primary"
        ? "w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg"
        : "w-full border-2 border-white/20 hover:border-green-500 hover:bg-green-500/10 text-white font-semibold py-4 px-6 rounded-xl transition-all text-lg"
    }
  >
    {children}
  </button>
);

export const QuizOptions = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col gap-3">{children}</div>
);
