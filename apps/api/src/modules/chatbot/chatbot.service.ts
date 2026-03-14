import { Chatbot } from "./chatbot.model";

export class ChatbotService {
    // Tìm kiếm nâng cao
    static async findAnswer(message: string) {
        const words = message.toLowerCase().split(' ').filter(w => w.length > 2);

        // Tìm chính xác
        let result = await Chatbot.findOne({
            $or: [
                { keywords: { $in: words } },
                { question: { $regex: message, $options: "i" } }
            ]
        });

        if (result) return result;

        // Tìm gần đúng - sử dụng text search nếu có index
        if (words.length > 0) {
            result = await Chatbot.findOne({
                $or: words.map(word => ({
                    keywords: { $regex: word, $options: "i" }
                }))
            });
        }

        return result;
    }

    // Thống kê
    static async getStats() {
        const total = await Chatbot.countDocuments();
        const recent = await Chatbot.find().sort({ createdAt: -1 }).limit(5);
        return { total, recent };
    }
}