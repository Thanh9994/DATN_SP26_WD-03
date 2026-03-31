import { Button, Space, Popconfirm, Modal, Input, Form, List, Card } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { IGenre } from '@shared/src/schemas';
import { useGenres } from '@web/hooks/useGenre';

export const Genre = () => {
  const { genres, addGenre, updateGenre, deleteGenre } = useGenres();
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<string | null>(null);

  const onSave = (values: IGenre) => {
    editId && editId !== 'new' ? updateGenre({ id: editId, genre: values }) : addGenre(values);
    setEditId(null);
  };

  return (
    <div style={{ padding: 10 }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditId('new');
          form.resetFields();
        }}
        style={{ marginBottom: 15 }}
      >
        Thêm
      </Button>

      <List
        grid={{ gutter: 8, xs: 1, sm: 2, md: 3, lg: 4 }} 
        dataSource={genres}
        pagination={false}
        renderItem={(item) => (
          <List.Item>
            <Card size="small" className="transition-all hover:border-blue-500">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{item.name}</span>
                <Space>
                  <Button
                    icon={<EditOutlined className="text-blue-500" />}
                    onClick={() => {
                      setEditId(item.name);
                      form.setFieldsValue(item);
                    }}
                  />
                  <Popconfirm title="Xóa?" onConfirm={() => deleteGenre(item.name)}>
                    <Button type="text" size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editId === 'new' ? 'Thêm mới' : 'Chỉnh sửa'}
        open={!!editId}
        onOk={() => form.submit()}
        onCancel={() => setEditId(null)}
      >
        <Form form={form} onFinish={onSave} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thể loại"
            rules={[{ required: true, message: 'Cần nhập tên' }]}
          >
            <Input placeholder="Ví dụ: Hành động, Viễn tưởng..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
