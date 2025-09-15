"use client";

import { useState, useEffect } from "react";

interface SocialProofData {
  viewers: number;
  lastUpdate: string;
}

export function useSocialProof(): SocialProofData {
  const [data, setData] = useState<SocialProofData>({
    viewers: 0,
    lastUpdate: "",
  });

  useEffect(() => {
    // Simula dados iniciais com intervalo consistente
    const initialViewers = Math.floor(Math.random() * 44) + 24; // 24-67 pessoas
    setData({
      viewers: initialViewers,
      lastUpdate: "nas últimas horas",
    });

    // Atualiza os dados a cada 45-75 segundos para simular dinamismo
    const updateInterval = setInterval(() => {
      const variation = Math.floor(Math.random() * 8) - 4; // -4 a +4
      
      setData(prev => {
        const newViewers = Math.max(24, Math.min(67, prev.viewers + variation));
        return {
          viewers: newViewers,
          lastUpdate: "nas últimas horas",
        };
      });
    }, Math.random() * 30000 + 45000); // 45-75 segundos

    return () => clearInterval(updateInterval);
  }, []); // Array de dependências vazio - executa apenas uma vez

  return data;
}
