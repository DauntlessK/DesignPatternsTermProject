import api from "../api/axios";

const messageService = {
  sendBookingMessage: async (bookingId, messageText) => {
    const { data } = await api.post(`/bookings/${bookingId}/message`, {
      messageText,
    });
    return data;
  },
};

export default messageService;