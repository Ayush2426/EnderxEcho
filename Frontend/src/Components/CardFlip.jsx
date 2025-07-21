import { useState } from "react";
import { ArrowRight, Repeat2 } from "lucide-react";
import { cn } from "../Lib/utils.js"; // Helper for combining class names
import { SocialButton } from "../Components/SocialButton.jsx"; // Importing the SocialButton component
import "../Components/CardFlip.css"; // Imports the keyframes for the animation

/**
 * A card component that flips on hover to reveal more details.
 * @param {object} props - The component props.
 * @param {string} [props.title="Design Systems"] - The main title on the card.
 * @param {string} [props.subtitle="Explore the fundamentals"] - The subtitle on the front of the card.
 * @param {string} [props.description="Dive deep..."] - The description on the back of the card.
 * @param {string[]} [props.features=["UI/UX", ...]] - A list of features for the back of the card.
 */
export default function CardFlip({
  title = "Ender World",
  subtitle = "Explore Ayush's Dungeon",
  description = "Dive deep into the dungeon of modern Tech in Ayush's Ender World.",
  features = ["UI/UX", "Modern Design", "Tailwind CSS", "Kokonut UI"],
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full max-w-[280px] h-[320px] group [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          "relative w-full h-full [transform-style:preserve-3d] transition-all duration-700",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]"
        )}
      >
        {/* Front of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(0deg)]",
            "overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900",
            "border border-zinc-200 dark:border-zinc-800/50 shadow-xs dark:shadow-lg",
            "transition-all duration-700 group-hover:shadow-lg dark:group-hover:shadow-xl",
            isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black">
            <div className="absolute inset-0 flex items-start justify-center pt-24">
              <div className="relative w-[200px] h-[100px] flex items-center justify-center">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "absolute w-[50px] h-[50px] rounded-[140px] opacity-0 shadow-[0_0_50px_rgba(255,165,0,0.5)]",
                      "animate-[scale_3s_linear_infinite] group-hover:animate-[scale_2s_linear_infinite]"
                    )}
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug tracking-tighter transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-200 line-clamp-2 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-4px] delay-[50ms]">
                  {subtitle}
                </p>
              </div>
              <div className="relative group/icon">
                <div className="absolute inset-[-8px] rounded-lg transition-opacity duration-300 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent" />
                <Repeat2 className="relative z-10 w-4 h-4 text-violet-700 transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]",
            "p-6 rounded-2xl flex flex-col bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black",
            "border border-zinc-200 dark:border-zinc-800 shadow-xs dark:shadow-lg",
            "transition-all duration-700 group-hover:shadow-lg dark:group-hover:shadow-xl",
            !isFlipped ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px]">
                {title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 tracking-tight transition-all duration-500 ease-out-expo group-hover:translate-y-[-2px] line-clamp-2">
                {description}
              </p>
            </div>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 transition-all duration-500"
                  style={{
                    transform: isFlipped
                      ? "translateX(0)"
                      : "translateX(-10px)",
                    opacity: isFlipped ? 1 : 0,
                    transitionDelay: `${index * 100 + 200}ms`,
                  }}
                >
                  <ArrowRight className="w-3 h-3 text-purple-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6 mt-6 pb-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-center">
              <SocialButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
