import api from "../api/axios";

const watchService = {
  createWatch: async (payload) => {
    const { data } = await api.post("/watch", payload);
    return data;
  },
};

export default watchService;