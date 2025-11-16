import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PointsContextType {
  points: number;
  addPoints: (amount: number) => void;
  subtractPoints: (amount: number) => void;
  resetPoints: () => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

const POINTS_STORAGE_KEY = "ecoShopPoints";

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [points, setPoints] = useState<number>(0);

  // Load points from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(POINTS_STORAGE_KEY);
    if (saved) {
      try {
        const savedPoints = parseInt(saved, 10);
        if (!isNaN(savedPoints)) {
          setPoints(savedPoints);
        }
      } catch (error) {
        console.error("Failed to load points from localStorage:", error);
      }
    }
    // If no saved points, start at 0 (default)
  }, []);

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(POINTS_STORAGE_KEY, points.toString());
  }, [points]);

  const addPoints = (amount: number) => {
    setPoints((prev) => {
      const newTotal = prev + amount;
      return newTotal;
    });
  };

  const subtractPoints = (amount: number) => {
    setPoints((prev) => {
      const newTotal = Math.max(0, prev - amount);
      return newTotal;
    });
  };

  const resetPoints = () => {
    setPoints(0);
    localStorage.removeItem(POINTS_STORAGE_KEY);
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        addPoints,
        subtractPoints,
        resetPoints,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
};

