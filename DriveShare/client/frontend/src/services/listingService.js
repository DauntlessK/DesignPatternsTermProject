import api from "../api/axios";

const listingService = {
  create: async (payload) => {
    const { data } = await api.post("/listings", payload);
    return data;
  },

  getAll: async (includeInactive = false) => {
    const { data } = await api.get("/listings", {
      params: { includeInactive },
    });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/listings/${id}`);
    return data;
  },

  toggleActive: async (id) => {
    const { data } = await api.put(`/listings/${id}/toggle-active`);
    return data;
  },
};

export default listingService;