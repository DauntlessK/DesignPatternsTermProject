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

  confirmBooking: async (bookingId) => {
    const { data } = await api.put(`/bookings/${bookingId}/confirm`);
    return data;
  },

  denyBooking: async (bookingId) => {
    const { data } = await api.put(`/bookings/${bookingId}/deny`);
    return data;
  },
};

export default bookingService;