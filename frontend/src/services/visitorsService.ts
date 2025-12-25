import api from "./api";

export const visitorService = {
  recordVisit : async () => {
    const response = await api.post("/visitors");
    return response.data;
  },

  getStats : async () => {
    const response = await api.get("/visitors/stats");
    return response.data;
  }
}