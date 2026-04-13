import api from "../api/axios";

const listingService = {
  create: async (payload) => {
    const { data } = await api.post("/listings", payload);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get("/listings");
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/listings/${id}`);
    return data;
  },
};

export default listingService;