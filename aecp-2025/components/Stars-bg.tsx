"use client";

import { useEffect, useState } from "react";

type Star = {
  id: number;
  size: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
  minOpacity: number;
};

export default function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated: Star[] = Array.from({ length: 120 }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 0.5,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 4}s`,
      delay: `${Math.random() * 6}s`,
      minOpacity: 0.05 + Math.random() * 0.2,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-lilac-mist animate-twinkle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            animationDuration: star.duration,
            animationDelay: star.delay,
            opacity: star.minOpacity,
          }}
        />
      ))}
    </div>
  );
}