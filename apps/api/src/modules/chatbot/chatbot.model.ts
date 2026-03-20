import mongoose from "mongoose";

const ChatbotSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "Câu hỏi không được để trống"],
            trim: true,
        },
        answer: {
            type: String,
            required: [true, "Câu trả lời không được để trống"],
            trim: true,
        },
        keywords: {
            type: [String],
            default: [],
            index: true,
        },
        category: {
            type: String,
            default: 'general',
            enum: ['general', 'showtime', 'pricing', 'booking', 'cinema', 'support', 'food', 'payment', 'policy', 'movies'],
            index: true,
        },
        sessionId: {
            type: String,
            default: null,
            index: true,
        },
        role:{
            type: String,
            enum:["user","admin"],
            default: null,
        },
        type: {
            type: String,
            enum:["faq", "history"],
            default: "faq",
             index: true,
        },
        
        usageCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Create text index for search
ChatbotSchema.index({
    question: 'text',
    answer: 'text',
    keywords: 'text'
}, {
    weights: {
        question: 10,
        keywords: 5,
        answer: 1
    },
    name: "text_search_index"
});

// Compound index for frequently queried fields
ChatbotSchema.index({ category: 1, usageCount: -1 });
ChatbotSchema.index({ createdAt: -1 });

export const Chatbot = mongoose.model("Chatbot", ChatbotSchema, "chatbot");