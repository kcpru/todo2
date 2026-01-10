import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useDopamine } from "../DopamineContext";

export function useCoinsSystem() {
  const { user, earnCoins } = useAuth();
  const { isDopamineMode } = useDopamine();
  const [coins, setCoins] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [completedCount, setCompletedCount] = useState(0);

  // Initialize coins from user
  useEffect(() => {
    if (user?.coins !== undefined) {
      setCoins(user.coins);
    }
  }, [user?.coins]);

  // Calculate multiplier based on completed tasks
  const updateCompletedCount = (count) => {
    setCompletedCount(count);
    // Multiplier: 1x for 0-2 tasks, 1.5x for 3-5 tasks, 2x for 6+ tasks
    if (count >= 6) {
      setMultiplier(2);
    } else if (count >= 3) {
      setMultiplier(1.5);
    } else {
      setMultiplier(1);
    }
  };

  // Earn coins when task is completed
  const onTaskComplete = async (baseAmount = 10) => {
    if (!isDopamineMode) return;

    const amount = Math.floor(baseAmount * multiplier);
    try {
      const result = await earnCoins(amount);
      setCoins(result.coins);
      return result;
    } catch (err) {
      console.error("Failed to earn coins:", err);
    }
  };

  return {
    coins,
    multiplier,
    completedCount,
    updateCompletedCount,
    onTaskComplete,
  };
}
