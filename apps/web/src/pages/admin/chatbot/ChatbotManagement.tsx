import React, { useState, useEffect } from 'react';

import './ChatbotManagement.css';
import { chatbotService } from '@web/pages/services/chatbot.service';

const ChatbotManagement = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        keywords: '',
        category: 'general'
    });
    const [stats, setStats] = useState({
        total: 0,
        byCategory: [],
        mostUsed: []
    });
   // Luồng xử lý dữ liệu 
    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const res = await chatbotService.getAllQuestions();
            setQuestions(res.data);
            setStats(res.stats);
        } catch (error) {
            console.error('Lỗi tải dữ liệu:', error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                keywords: formData.keywords.split(',').map(k => k.trim())
            };

            if (editingId) {
                await chatbotService.updateQuestion(editingId, dataToSend);
            } else {
                await chatbotService.createQuestion(dataToSend);
            }

            setShowModal(false);
            resetForm();
            loadQuestions();
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc muốn xóa?')) {
            try {
                await chatbotService.deleteQuestion(id);
                loadQuestions();
            } catch (error) {
                console.error('Lỗi xóa:', error);
            }
        }
    };

    const resetForm = () => {
        setFormData({ question: '', answer: '', keywords: '', category: 'general' });
        setEditingId(null);
    };

    const openEditModal = (item: any) => {
        setFormData({
            question: item.question,
            answer: item.answer,
            keywords: item.keywords.join(', '),
            category: item.category
        });
        setEditingId(item._id);
        setShowModal(true);
    };

    return (
        <div className="chatbot-management">
            <div className="header">
                <h2>Quản lý Chatbot</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    + Thêm câu hỏi
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Tổng số câu hỏi</h3>
                    <p>{stats.total}</p>
                </div>
                {stats.byCategory.map((cat: any) => (
                    <div className="stat-card" key={cat._id}>
                        <h3>{cat._id}</h3>
                        <p>{cat.count}</p>
                    </div>
                ))}
            </div>

            {/* Questions Table */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Câu hỏi</th>
                            <th>Câu trả lời</th>
                            <th>Danh mục</th>
                            <th>Lượt dùng</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q: any) => (
                            <tr key={q._id}>
                                <td>{q.question}</td>
                                <td>{q.answer.substring(0, 50)}...</td>
                                <td>
                                    <span className="category-badge">{q.category}</span>
                                </td>
                                <td>{q.usageCount || 0}</td>
                                <td>
                                    <button onClick={() => openEditModal(q)}>Sửa</button>
                                    <button onClick={() => handleDelete(q._id)}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal thêm/sửa */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>{editingId ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Câu hỏi:</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Câu trả lời:</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Từ khóa (cách nhau bằng dấu phẩy):</label>
                                <input
                                    type="text"
                                    value={formData.keywords}
                                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                    placeholder="phim, vé, giá, ..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Danh mục:</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="general">Chung</option>
                                    <option value="movie">Phim</option>
                                    <option value="ticket">Vé</option>
                                    <option value="food">Đồ ăn</option>
                                    <option value="contact">Liên hệ</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="btn-primary">
                                    {editingId ? 'Cập nhật' : 'Thêm'}
                                </button>
                                <button type="button" onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}>
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatbotManagement;