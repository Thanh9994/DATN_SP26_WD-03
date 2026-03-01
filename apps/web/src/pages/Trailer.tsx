import { useState } from "react";
import { Modal } from "antd";
import ReactPlayer from "react-player";
import { PlayCircleOutlined } from "@ant-design/icons";

export const DemoTrailer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const testYoutubeUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  const getYTThumbnail = (url: string) => {
    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";
  };

  const thumb = getYTThumbnail(testYoutubeUrl);

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col items-center">
      {/* - max-w-[600px]: Giới hạn chiều rộng
         - h-[600px]: Cố định chiều cao 600px theo ý bạn
         - flex flex-col: Để chia không gian giữa ảnh và phần text nội dung
      */}
      <div className="w-full h-2/3 overflow-hidden shadow-2xl animate-fade-in-down flex flex-col">
        {/* Phần ảnh chiếm phần lớn chiều cao (ví dụ 75-80%) */}
        <div
          className="relative group cursor-pointer flex-1 overflow-hidden"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={thumb}
            alt="Trailer Thumbnail"
            // h-full và object-cover để ảnh lấp đầy phần flex-1 mà không bị méo
            className="w-full h-full object-cover  transition-transform duration-700"
          />

          {/* Overlay trung tâm */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/20 backdrop-blur-md p-5 rounded-full">
              <PlayCircleOutlined className="text-5xl text-white" />
            </div>
          </div>
        </div>

        {/* Phần thông tin cố định ở dưới đáy (khoảng 120-150px còn lại) */}
      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1100}
        centered
        styles={{ body: { padding: 0, backgroundColor: "black" } }}
        destroyOnHidden
      >
        <div className="aspect-video">
          <ReactPlayer
            src={testYoutubeUrl}
            width="100%"
            height="100%"
            playing={true}
            controls
          />
        </div>
      </Modal>

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
