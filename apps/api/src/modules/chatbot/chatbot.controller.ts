import { Request, Response } from "express";
import { Chatbot } from "./chatbot.model";
import { ChatbotService } from "./chatbot.service";

export class ChatbotController {
    /**
     * Tạo câu hỏi mới (Admin)
     */
    static async create(req: Request, res: Response) {
        try {
            const { question, answer, keywords, category } = req.body;

            // Validate
            if (!question?.trim() || !answer?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Vui lòng nhập đầy đủ câu hỏi và câu trả lời"
                });
            }

            // Check duplicate
            const exists = await Chatbot.findOne({
                question: { $regex: `^${question}$`, $options: "i" }
            });

            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Câu hỏi này đã tồn tại"
                });
            }

            // Generate keywords from question if not provided
            let processedKeywords = keywords || [];
            if (!processedKeywords.length) {
                processedKeywords = question
                    .toLowerCase()
                    .split(' ')
                    .filter((word: string) => word.length > 2)
                    .map((word: string) => word.replace(/[^\w\s]/g, ''));
            }

            const data = await Chatbot.create({
                question: question.trim(),
                answer: answer.trim(),
                keywords: processedKeywords,
                category: category || 'general',
                usageCount: 0,
                isActive: true
            });

            res.status(201).json({
                success: true,
                message: "Tạo câu hỏi thành công",
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Tạo thất bại",
                error: error instanceof Error ? error.message : error
            });
        }
    }

    /**
     * Chat với user
     */
    static async chat(req: Request, res: Response) {
        try {
            const { message } = req.body;

            if (!message?.trim()) {
                return res.json({
                    success: true,
                    answer: "Vui lòng nhập câu hỏi để được hỗ trợ."
                });
            }

            const result = await ChatbotService.findAnswer(message);

            if (result) {
                // Update usage count
                await Chatbot.findByIdAndUpdate(result._id, {
                    $inc: { usageCount: 1 }
                });

                return res.json({
                    success: true,
                    answer: result.answer,
                    question: result.question,
                    category: result.category
                });
            }

            // No answer found
            return res.json({
                success: true,
                answer: "Xin lỗi, tôi chưa hiểu câu hỏi của bạn. Vui lòng thử hỏi cách khác hoặc liên hệ hotline 1900 1234 để được hỗ trợ trực tiếp."
            });

        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({
                success: false,
                message: "Lỗi xử lý chat",
                error: error instanceof Error ? error.message : error
            });
        }
    }

    /**
     * Lấy danh sách (Admin)
     */
    static async getAll(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 10,
                search,
                category,
                isActive
            } = req.query;

            // Build query
            const query: any = {};

            if (search) {
                query.$or = [
                    { question: { $regex: search, $options: "i" } },
                    { answer: { $regex: search, $options: "i" } },
                    { keywords: { $in: [new RegExp(search as string, 'i')] } }
                ];
            }

            if (category && category !== 'all') {
                query.category = category;
            }

            if (isActive !== undefined) {
                query.isActive = isActive === 'true';
            }

            // Execute queries
            const [data, total, stats] = await Promise.all([
                Chatbot.find(query)
                    .limit(Number(limit))
                    .skip((Number(page) - 1) * Number(limit))
                    .sort({ createdAt: -1 }),
                Chatbot.countDocuments(query),
                ChatbotService.getStats()
            ]);

            res.json({
                success: true,
                data,
                stats,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Lấy dữ liệu thất bại",
                error: error instanceof Error ? error.message : error
            });
        }
    }

    /**
     * Lấy chi tiết
     */
    static async getOne(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const data = await Chatbot.findById(id);

            if (!data) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy"
                });
            }

            res.json({ success: true, data });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error
            });
        }
    }

    /**
     * Cập nhật
     */
    static async update(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Check if exists
            const exists = await Chatbot.findById(id);
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy"
                });
            }

            // Update
            const data = await Chatbot.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );

            res.json({
                success: true,
                message: "Cập nhật thành công",
                data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error
            });
        }
    }

    /**
     * Xóa
     */
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const result = await Chatbot.findByIdAndDelete(id);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy"
                });
            }

            res.json({
                success: true,
                message: "Xóa thành công"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error
            });
        }
    }

    /**
     * Toggle trạng thái
     */
    static async toggleStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const item = await Chatbot.findById(id);
            if (!item) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy"
                });
            }

            item.isActive = !item.isActive;
            await item.save();

            res.json({
                success: true,
                message: `Đã ${item.isActive ? 'kích hoạt' : 'vô hiệu hóa'}`,
                data: item
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error
            });
        }
    }
}