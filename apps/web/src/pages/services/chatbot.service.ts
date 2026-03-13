import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chatbot';

export const chatbotService = {
    // Gửi tin nhắn
    async sendMessage(message: string) {
        const response = await axios.post(`${API_URL}/chat`, { message });
        return response.data;
    },

    // Admin: Lấy tất cả câu hỏi
    async getAllQuestions(params?: { page?: number; limit?: number; search?: string; category?: string }) {
        const response = await axios.get(API_URL, { params });
        return response.data;
    },

    // Admin: Tạo câu hỏi mới
    async createQuestion(data: { question: string; answer: string; keywords?: string[]; category?: string }) {
        const response = await axios.post(`${API_URL}/create`, data);
        return response.data;
    },

    // Admin: Cập nhật câu hỏi
    async updateQuestion(id: string, data: any) {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    },

    // Admin: Xóa câu hỏi
    async deleteQuestion(id: string) {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    },

    // Admin: Lấy chi tiết câu hỏi
    async getQuestion(id: string) {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
};