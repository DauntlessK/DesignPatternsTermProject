import api from "../api/axios";

const bookingService = {
  create: async (payload) => {
    const { data } = await api.post("/bookings", payload);
    return data;
  },

  getMyBookings: async () => {
    const { data } = await api.get("/bookings");
    return data;
  },
};

export default bookingService;