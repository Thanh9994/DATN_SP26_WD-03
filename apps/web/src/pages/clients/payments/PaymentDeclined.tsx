import React from 'react';
import { Card, Typography, Button, Divider } from 'antd';
import { CloseCircleOutlined, AppleOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const PaymentDeclined: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Card
            style={{
                maxWidth: 500,
                margin: '0 auto',
                background: '#0f1219',
                border: '1px solid #2a2f3f',
                borderRadius: 24
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
                <Title level={3} style={{ color: '#fff', marginTop: 16 }}>Payment Declined</Title>
            </div>

            <Card style={{ background: '#1a1e2b', border: 'none', marginBottom: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Tickets (2x)</Text>
                        <Text style={{ color: '#fff' }}>$44.00</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Mega Movie Corbo</Text>
                        <Text style={{ color: '#fff' }}>$25.00</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text type="secondary">Service Fee</Text>
                        <Text style={{ color: '#fff' }}>$2.50</Text>
                    </div>
                    <Divider style={{ borderColor: '#2f3545', margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ color: '#fff' }}>Total</Text>
                        <Text strong style={{ color: '#fff', fontSize: 18 }}>$71.50</Text>
                    </div>
                </div>
            </Card>

            <Card style={{ background: '#3f1f2b', border: 'none', marginBottom: 24 }}>
                <Text style={{ color: '#ffa7a7', display: 'block', textAlign: 'center' }}>
                    ⚠️ Payment Declined! We couldn't process your transaction. Please check your card details or try a different payment method.
                </Text>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button
                    danger
                    icon={<AppleOutlined />}
                    block
                    style={{ height: 48 }}
                    onClick={() => navigate('/payments/checkout?method=apple')}
                >
                    Try Apple
                </Button>
                <Button
                    type="primary"
                    icon={<CreditCardOutlined />}
                    block
                    style={{ height: 48 }}
                    onClick={() => navigate('/payments/checkout')}
                >
                    Change Payment Method
                </Button>
            </div>

            <Divider style={{ borderColor: '#2f3545', margin: '24px 0 16px' }} />
            <Text type="secondary" style={{ display: 'block', textAlign: 'right' }}>
                Dune Part Two · GAMING CITY, UAE
            </Text>
        </Card>
    );
};

export default PaymentDeclined;