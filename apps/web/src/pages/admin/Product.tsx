import { Card, Col, Empty, Row, Spin, Tag, Typography } from "antd";
import { useProducts } from "@web/hooks/useProduct";

const { Title, Text } = Typography;

const Product = () => {
  const { products, isLoading, isError } = useProducts();

  if (isLoading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ padding: 24 }}>
        <Text type="danger">Không tải được danh sách sản phẩm</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Danh sách sản phẩm</Title>

      {!products.length ? (
        <Empty description="Chưa có dữ liệu sản phẩm" />
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <Card
                hoverable
                cover={
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: 220,
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Title level={5}>{item.name}</Title>

                <div style={{ marginBottom: 8 }}>
                  <Text delete style={{ marginRight: 8 }}>
                    {item.originalPrice?.toLocaleString("vi-VN")}đ
                  </Text>
                  <Text strong style={{ color: "#cf1322" }}>
                    {item.price?.toLocaleString("vi-VN")}đ
                  </Text>
                </div>

                <div style={{ marginBottom: 8 }}>
                  <Tag color={item.isActive ? "green" : "red"}>
                    {item.isActive ? "Đang bán" : "Ẩn"}
                  </Tag>

                  <Tag color={item.isCombo ? "blue" : "default"}>
                    {item.isCombo ? "Combo" : "Lẻ"}
                  </Tag>
                </div>

                <Text type="secondary">{item.description || "Không có mô tả"}</Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Product;