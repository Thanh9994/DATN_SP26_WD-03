import { Table, Button, Space, Popconfirm, Modal, Input, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import { IGenre } from "@shared/schemas";
import { useGenres } from "@web/hooks/useGenre";


export const Genre = () => {
  const { genres, isLoading, addGenre, updateGenre, deleteGenre } = useGenres();
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<string | null>(null);

  const onSave = (values: IGenre) => {
    editId && editId !== "new" 
      ? updateGenre({ id: editId, genre: values }) 
      : addGenre(values);
    setEditId(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => { setEditId("new"); form.resetFields(); }}
        style={{ marginBottom: 15}}
      >
        Thêm
      </Button>
      
      <Table 
        dataSource={genres} 
        loading={isLoading} 
        rowKey="_id" 
        columns={[
          { title: "Tên", dataIndex: "name" },
          { title: "Thao tác", render: (_, record: any) => (
            <Space>
              <Button onClick={() => { setEditId(record._id); form.setFieldsValue(record); }}>Sửa</Button>
              <Popconfirm title="Xóa?" onConfirm={() => deleteGenre(record._id)}>
                <Button danger>Xóa</Button>
              </Popconfirm>
            </Space>
          )}
        ]} 
      />

      <Modal 
        title={editId === "new" ? "Thêm mới" : "Chỉnh sửa"}
        open={!!editId} 
        onOk={() => form.submit()} 
        onCancel={() => setEditId(null)}
      >
        <Form form={form} onFinish={onSave} layout="vertical">
          <Form.Item name="name" label="Tên thể loại" rules={[{ required: true, message: 'Cần nhập tên' }]}>
            <Input placeholder="Ví dụ: Hành động, Viễn tưởng..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};