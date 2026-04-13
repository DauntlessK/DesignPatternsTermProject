import api from "../api/axios";

const notificationService = {
  getAll: async () => {
    const { data } = await api.get("/notifications");
    return data;
  },
};

export default notificationService;