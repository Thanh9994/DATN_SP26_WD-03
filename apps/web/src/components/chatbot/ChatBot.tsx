import { useState } from "react";
import axios from "axios";
import "./ChatBot.css"; // Tạo file CSS riêng

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false); // true để test, sau đổi lại false
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;

        // Thêm tin nhắn user vào chat
        const userMessage = {
            sender: "user",
            text: message,
            time: new Date().toLocaleTimeString()
        };
        setChat(prev => [...prev, userMessage]);

        const currentMessage = message;
        setMessage("");
        setIsLoading(true);

        try {
            console.log("📤 Sending message:", currentMessage);

            // Gọi API
            const res = await axios.post("http://localhost:5000/api/chatbot/chat", {
                message: currentMessage
            });

            console.log("📥 Response:", res.data);

            // Thêm tin nhắn bot vào chat
            const botMessage = {
                sender: "bot",
                text: res.data.answer || "Xin lỗi, tôi chưa hiểu câu hỏi",
                time: new Date().toLocaleTimeString()
            };
            setChat(prev => [...prev, botMessage]);

        } catch (error) {
            console.error("❌ Error:", error);

            // Thêm tin nhắn lỗi
            setChat(prev => [...prev, {
                sender: "bot",
                text: "Lỗi kết nối đến server. Vui lòng thử lại!",
                time: new Date().toLocaleTimeString(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Test gọi API danh sách câu hỏi
    const testAPI = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/chatbot");
            console.log("📋 Danh sách câu hỏi:", res.data);
            alert(`API OK! Có ${res.data.data?.length || 0} câu hỏi`);
        } catch (error) {
            console.error("❌ Test API failed:", error);
            alert("Lỗi kết nối API!");
        }
    };

    return (
        <>
            {/* Nút chat */}
            <div
                className="chat-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </div>

            {/* Cửa sổ chat */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <h4>🎬 Chatbot</h4>
                        <div>
                            <button onClick={testAPI} style={{ marginRight: 5 }}>Test API</button>
                            <button onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                    </div>

                    <div className="chat-messages">
                        {chat.map((msg, i) => (
                            <div key={i} className={`message ${msg.sender}`}>
                                <b>{msg.sender === 'user' ? '👤' : '🤖'}:</b> {msg.text}
                                <div style={{ fontSize: 10, color: '#999' }}>{msg.time}</div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot">
                                <b>🤖:</b> Đang suy nghĩ...
                            </div>
                        )}
                    </div>

                    <div className="chat-input">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Nhập câu hỏi..."
                        />
                        <button onClick={sendMessage} disabled={!message.trim()}>
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;