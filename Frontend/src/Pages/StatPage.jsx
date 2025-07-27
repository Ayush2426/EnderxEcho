import StatsCard from "../Components/Stats"; // We will rename Stats.jsx to StatsCard.jsx
import { useThemeStore } from "../Store/useThemeStore";

const StatsPage = () => {
  const { theme } = useThemeStore();

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-base-200 flex items-center justify-center"
    >
      <StatsCard />
    </div>
  );
};

export default StatsPage;
