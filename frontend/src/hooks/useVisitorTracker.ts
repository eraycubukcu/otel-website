import { useEffect } from "react";
import { visitorService } from "../services/visitorsService"; // Yeni service'i import et

export const useVisitorTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const today = new Date().toDateString();
        const lastVisitDate = localStorage.getItem("lastVisitDate");

        if (lastVisitDate === today) {
          return;
        }

        await visitorService.recordVisit();

        localStorage.setItem("lastVisitDate", today);
      } catch (error) {
        console.error("Ziyaret kaydedilemedi:", error);
      }
    };

    trackVisit();
  }, []);
};
