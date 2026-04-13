import api from "../api/axios";

const paymentService = {
  payBooking: async (bookingId) => {
    const { data } = await api.put(`/bookings/${bookingId}/pay`);
    return data;
  },
};

export default paymentService;