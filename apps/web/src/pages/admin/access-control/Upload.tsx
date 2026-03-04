import { useUpload } from "@web/hooks/useUploads";
import { useState } from "react";
import {
  Input,
  Upload as AntUpload,
  Button,
  Card,
  Row,
  Col,
  Image,
  message,
  Spin,
  Popconfirm,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  CopyOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";

export const Upload = () => {
  const { upload, isUploading, images, deleteImage, isDeleting, reloadImages } =
    useUpload();
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = () => {
    if (!selectedFile || !fileName) {
      return message.warning("Vui lòng nhập tên và chọn ảnh!");
    }

    upload({ file: selectedFile, customName: fileName });
    setFileName("");
    setSelectedFile(null);
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setSelectedFile(file);
      return false; // ❌ chặn auto upload
    },
    maxCount: 1,
  };

  return (
    <div style={{ padding: 24 }}>
      <Card title="📷 Upload ảnh lên Cloudinary" style={{ maxWidth: 600 }}>
        <Input
          placeholder="Nhập tên ảnh..."
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <AntUpload {...props}>
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </AntUpload>

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <Button type="primary" loading={isUploading} onClick={handleUpload}>
            {isUploading ? "Đang upload..." : "Bắt đầu Upload"}
          </Button>
          <Button icon={<ReloadOutlined />} onClick={() => reloadImages()}>
            Reload ảnh
          </Button>
        </div>
      </Card>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {images?.map((img) => (
          <Col xs={24} sm={12} md={8} lg={6} key={img.public_id}>
            <Card
              hoverable
              cover={
                <Image
                  src={img.url}
                  height={220}
                  style={{ objectFit: "cover" }}
                />
              }
              actions={[
                <Popconfirm
                  title="Xóa ảnh này?"
                  description="Hành động này không thể hoàn tác."
                  onConfirm={() => deleteImage(img.public_id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
                    Xóa
                  </Button>
                </Popconfirm>,
              ]}
            >
              <p
                style={{
                  fontSize: 10,
                  wordBreak: "break-all",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                {`https://res.cloudinary.com/dcyzkqb1r/image/upload/${img.public_id}`}
                <CopyOutlined
                  style={{ cursor: "pointer", color: "#1677ff" }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `https://res.cloudinary.com/dcyzkqb1r/image/upload/${img.public_id}`,
                    );
                    message.success("Đã copy link ảnh!");
                  }}
                />
              </p>
            </Card>
          </Col>
        ))}
      </Row>

      {(isUploading || isDeleting) && <Spin fullscreen tip="Đang xử lý..." />}
    </div>
  );
};
