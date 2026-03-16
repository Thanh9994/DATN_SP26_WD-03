import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    Typography,
    Tabs,
    Input,
    Button,
    Row,
    Col,
    Divider,
    message,
    Modal,
    QRCode,
    Alert,
    Descriptions,
    Statistic,
    Space,
    Tag,
} from "antd";
import {
    CreditCardOutlined,
    AppleOutlined,
    ArrowLeftOutlined,
    AndroidOutlined,
    QrcodeOutlined,
    WalletOutlined,
    CameraOutlined,
    CheckCircleOutlined,
    DollarOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

const { Title, Text } = Typography;

// Types for Google Pay
declare global {
    interface Window {
        google?: {
            payments?: {
                api?: {
                    PaymentsClient: new (config: any) => any;
                };
            };
        };
        ApplePaySession?: {
            new (version: number, request: any): ApplePaySession;
            canMakePayments(): boolean;
            STATUS_SUCCESS: number;
        };
    }
}

// Interface for Apple Pay Session
interface ApplePaySession {
    begin(): void;
    onpaymentauthorized: (event: any) => void;
    completePayment(status: number): void;
}

// Interface for Payment Info
interface PaymentInfo {
    amount: number;
    orderId: string;
    bankCode?: string;
    transactionId?: string;
    description?: string;
}

// Interface for Seat Info
interface SeatInfo {
    id: string;
    row: string;
    number: number;
    price: number;
    type: string;
}

// Interface for Booking Data
interface BookingData {
    movieId: string;
    movieName: string;
    theater: string;
    showTime: string;
    showDate: string;
    selectedSeats: SeatInfo[];
    totalAmount: number;
    ticketCount: number;
    cinemaId?: string;
    room?: string;
    bookingId?: string;
}

// Interface for QR Scanner Config
interface QrBox {
    width: number;
    height: number;
}

interface ScannerConfig {
    fps: number;
    qrbox: QrBox;
    aspectRatio: number;
    showTorchButtonIfSupported: boolean;
    showZoomSliderIfSupported: boolean;
    defaultZoomValueIfSupported: number;
}

// Hàm xử lý tiếng Việt (bỏ dấu)
const removeVietnameseTones = (str: string): string => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .trim();
};

// Hàm tính CRC16 cho VietQR
const calculateCRC16 = (data: string): string => {
    let crc = 0xffff;
    for (let i = 0; i < data.length; i++) {
        crc ^= data.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
        }
    }
    crc &= 0xffff;
    return crc.toString(16).toUpperCase().padStart(4, "0");
};

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State management
    const [paymentMethod, setPaymentMethod] = useState<string>("vnpay");
    const [loading, setLoading] = useState<boolean>(false);
    const [qrVisible, setQrVisible] = useState<boolean>(false);
    const [scanMode, setScanMode] = useState<boolean>(false);
    const [isLandscape, setIsLandscape] = useState<boolean>(false);
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [scanError, setScanError] = useState<string | null>(null);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [processingPayment, setProcessingPayment] = useState<boolean>(false);

    // Bank info
    const [selectedBank] = useState<string>("970436"); // Vietcombank
    const [accountNumber] = useState<string>("0881000458086");
    const [accountName] = useState<string>("CINEMA COMPANY");

    // Booking data
    const [bookingData, setBookingData] = useState<BookingData | null>(null);
    const [loadingBooking, setLoadingBooking] = useState<boolean>(true);

    // QR Scanner reference
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const qrCodeIdRef = useRef<string>(`qr-scanner-${Date.now()}`);

    // Lấy dữ liệu từ location state khi component mount
    useEffect(() => {
        const loadBookingData = () => {
            try {
                if (location.state) {
                    const data = location.state as BookingData;
                    setBookingData(data);
                    console.log("Booking data from state:", data);
                    setLoadingBooking(false);
                    return;
                }

                const savedData = sessionStorage.getItem("bookingData");
                if (savedData) {
                    const data = JSON.parse(savedData) as BookingData;
                    setBookingData(data);
                    console.log("Booking data from sessionStorage:", data);
                    setLoadingBooking(false);
                    return;
                }

                const mockData: BookingData = {
                    movieId: "movie1",
                    movieName: "Dune: Part Two",
                    theater: "CGV Vincom Center",
                    showTime: "20:30",
                    showDate: "12/03/2026",
                    selectedSeats: [
                        { id: "A1", row: "A", number: 1, price: 65000, type: "standard" },
                        { id: "A2", row: "A", number: 2, price: 65000, type: "standard" },
                        { id: "A3", row: "A", number: 3, price: 65000, type: "standard" },
                    ],
                    totalAmount: 195000,
                    ticketCount: 3,
                    room: "Screen 4",
                };

                setBookingData(mockData);
                setLoadingBooking(false);
                message.info("Đang sử dụng dữ liệu mẫu để test");
            } catch (error) {
                console.error("Error loading booking data:", error);
                message.error("Có lỗi khi tải thông tin đặt vé");
                setLoadingBooking(false);
            }
        };

        loadBookingData();
    }, [location.state]);

    // Check orientation
    useEffect(() => {
        const checkOrientation = (): void => {
            setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
        };

        checkOrientation();
        window.addEventListener("resize", checkOrientation);

        return () => {
            window.removeEventListener("resize", checkOrientation);
        };
    }, []);

    // Cleanup scanner on unmount
    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {});
                scannerRef.current = null;
            }
        };
    }, []);

    // Initialize scanner when scan mode is enabled
    useEffect(() => {
        if (scanMode && qrVisible) {
            initScanner();
        } else {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {});
                scannerRef.current = null;
            }
        }
    }, [scanMode, qrVisible]);

    // Initialize QR Scanner
    const initScanner = (): void => {
        setScanError(null);
        setPaymentInfo(null);

        setTimeout(() => {
            const scannerElement = document.getElementById(qrCodeIdRef.current);
            if (!scannerElement) return;

            const config: ScannerConfig = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                defaultZoomValueIfSupported: 2,
            };

            if (scannerRef.current) {
                scannerRef.current.clear().catch(() => {});
                scannerRef.current = null;
            }

            scannerRef.current = new Html5QrcodeScanner(
                qrCodeIdRef.current,
                config,
                false
            );

            scannerRef.current.render(
                (decodedText: string) => handleScanSuccess(decodedText),
                (errorMessage: string) => {
                    console.log("QR Scan error:", errorMessage);
                }
            );
        }, 500);
    };

    // Tạo VietQR payload
    const generateVietQRPayload = (): string => {
        try {
            if (!bookingData) {
                throw new Error("No booking data");
            }

            const totalAmount = bookingData.totalAmount;
            const seatList = bookingData.selectedSeats.map((s) => s.id).join(",");

            let payload = "000201";
            payload += "010212";

            const napasGUID = "0010A000000727";
            const serviceCode = "0208QRIBFTTA";
            const bankInfo = `0126${selectedBank}0110${accountNumber}`;

            const merchantInfoContent = napasGUID + bankInfo + serviceCode;
            const merchantInfoLength = merchantInfoContent.length.toString().padStart(2, "0");

            payload += `38${merchantInfoLength}${merchantInfoContent}`;
            payload += "52045411";
            payload += "5303704";

            const amountStr = totalAmount.toString();
            payload += `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;

            payload += "5802VN";

            const merchantName = removeVietnameseTones(accountName).substring(0, 25);
            payload += `59${merchantName.length.toString().padStart(2, "0")}${merchantName}`;

            payload += "6002";

            const content = removeVietnameseTones(
                `Thanh toan ${bookingData.ticketCount} ve ${bookingData.movieName} ${seatList}`
            ).substring(0, 25);

            const contentLength = content.length.toString().padStart(2, "0");
            payload += `62${(contentLength.length + contentLength + content).length
                .toString()
                .padStart(2, "0")}08${contentLength}${content}`;

            const crcData = payload + "6304";
            const crc = calculateCRC16(crcData);
            payload += `6304${crc}`;

            console.log("Generated VietQR:", payload);
            return payload;
        } catch (error) {
            console.error("Error generating VietQR:", error);
            return "ERROR";
        }
    };

    // Parse QR code data
    const parseQRData = (qrData: string): PaymentInfo | null => {
        try {
            if (qrData.startsWith("000201")) {
                const amountMatch = qrData.match(/54(\d{2})(\d+)/);
                const amount = amountMatch
                    ? parseInt(amountMatch[2], 10)
                    : bookingData?.totalAmount || 0;

                const contentMatch = qrData.match(/08(\d{2})([A-Z0-9 ]+)/);
                const content = contentMatch ? contentMatch[2] : "Thanh toan ve phim";

                return {
                    amount,
                    orderId: `VIETQR${Date.now()}`,
                    bankCode: "VietQR",
                    description: content,
                };
            }

            if (qrData.startsWith("https://payment.demo/")) {
                const url = new URL(qrData);
                const amount = url.searchParams.get("amount");
                const pathParts = url.pathname.split("/");
                const orderId = pathParts[pathParts.length - 1];

                return {
                    amount: amount ? parseInt(amount, 10) : bookingData?.totalAmount || 0,
                    orderId: orderId || `ORDER${Date.now()}`,
                    description: "Thanh toán trực tuyến",
                };
            }

            return null;
        } catch (error) {
            console.error("Parse QR error:", error);
            return null;
        }
    };

    // Handle successful QR scan
    const handleScanSuccess = (decodedText: string): void => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(() => {});
        }

        const parsedInfo = parseQRData(decodedText);

        if (parsedInfo && bookingData) {
            setScanResult(decodedText);
            setPaymentInfo(parsedInfo);

            if (parsedInfo.amount !== bookingData.totalAmount) {
                message.warning({
                    content: `Số tiền QR (${formatMoney(parsedInfo.amount)}) không khớp với đơn hàng (${formatMoney(
                        bookingData.totalAmount
                    )})`,
                    duration: 5,
                });
            } else {
                message.success({
                    content: "Quét mã QR thành công! Đang xử lý thanh toán...",
                    duration: 2,
                });

                setTimeout(() => {
                    handleProcessPayment(parsedInfo);
                }, 1500);
            }
        } else {
            setScanError("Mã QR không hợp lệ hoặc không phải mã thanh toán");
            message.error({
                content: "Mã QR không hợp lệ cho thanh toán",
                duration: 3,
            });
        }
    };

    // Process payment
    const handleProcessPayment = async (info: PaymentInfo): Promise<void> => {
        setProcessingPayment(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            if (bookingData && info.amount !== bookingData.totalAmount) {
                throw new Error("Số tiền không khớp");
            }

            message.open({
                type: "success",
                content: `Thanh toán thành công! Số tiền: ${formatMoney(info.amount)}`,
                icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                duration: 3,
            });

            sessionStorage.removeItem("bookingData");

            setTimeout(() => {
                setQrVisible(false);
                setScanMode(false);
                setProcessingPayment(false);
                navigate("/payments/success", {
                    state: {
                        amount: info.amount,
                        orderId: info.orderId,
                        transactionId: `TXN${Date.now()}`,
                        paymentMethod,
                        bookingData,
                    },
                });
            }, 1000);
        } catch (error) {
            message.error({
                content: "Thanh toán thất bại. Vui lòng thử lại.",
                duration: 3,
            });
            setProcessingPayment(false);
        }
    };

    // Format money
    const formatMoney = (amount: number): string => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Stop scanner
    const stopScanner = (): void => {
        if (scannerRef.current) {
            scannerRef.current.clear().catch(() => {});
            scannerRef.current = null;
        }
        setScanMode(false);
    };

    // Handle card payment
    const handleCardPayment = (): void => {
        if (!bookingData) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success({
                content: `Payment successful! Amount: ${formatMoney(bookingData.totalAmount)}`,
                duration: 2,
            });
            navigate("/payments/success");
        }, 2000);
    };

    // Handle Apple Pay
    const handleApplePay = (): void => {
        if (!bookingData) return;

        setLoading(true);

        if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
            const amountUSD = (bookingData.totalAmount / 23000).toFixed(2);

            const session = new window.ApplePaySession(6, {
                countryCode: "US",
                currencyCode: "USD",
                supportedNetworks: ["visa", "masterCard", "amex"],
                merchantCapabilities: ["supports3DS"],
                total: {
                    label: `${bookingData.movieName} - ${bookingData.ticketCount} tickets`,
                    amount: amountUSD,
                },
            });

            session.onpaymentauthorized = (): void => {
                if (window.ApplePaySession) {
                    session.completePayment(window.ApplePaySession.STATUS_SUCCESS);
                }

                setLoading(false);
                message.success({
                    content: `Apple Pay successful! Amount: $${amountUSD}`,
                    duration: 2,
                });
                navigate("/payments/success");
            };

            session.begin();
        } else {
            setLoading(false);
            message.warning({
                content: "Apple Pay not supported",
                duration: 2,
            });
            setQrVisible(true);
        }
    };

    // Handle Google Pay
    const handleGooglePay = (): void => {
        if (!bookingData) return;

        setLoading(true);

        if (window.google?.payments?.api?.PaymentsClient) {
            const client = new window.google.payments.api.PaymentsClient({
                environment: "TEST",
            });

            const amountUSD = (bookingData.totalAmount / 23000).toFixed(2);

            const paymentDataRequest = {
                apiVersion: 2,
                apiVersionMinor: 0,
                allowedPaymentMethods: [
                    {
                        type: "CARD",
                        parameters: {
                            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                            allowedCardNetworks: ["MASTERCARD", "VISA"],
                        },
                        tokenizationSpecification: {
                            type: "PAYMENT_GATEWAY",
                            parameters: {
                                gateway: "example",
                                gatewayMerchantId: "exampleGatewayMerchantId",
                            },
                        },
                    },
                ],
                merchantInfo: {
                    merchantId: "12345678901234567890",
                    merchantName: "Cinema Booking",
                },
                transactionInfo: {
                    totalPriceStatus: "FINAL",
                    totalPriceLabel: "Total",
                    totalPrice: amountUSD,
                    currencyCode: "USD",
                    countryCode: "US",
                },
            };

            client
                .loadPaymentData(paymentDataRequest)
                .then((): void => {
                    setLoading(false);
                    message.success({
                        content: `Google Pay successful! Amount: $${amountUSD}`,
                        duration: 2,
                    });
                    navigate("/payments/success");
                })
                .catch((): void => {
                    setLoading(false);
                    message.error({
                        content: "Google Pay failed",
                        duration: 2,
                    });
                    setQrVisible(true);
                });
        } else {
            setLoading(false);
            message.warning({
                content: "Google Pay not supported",
                duration: 2,
            });
            setQrVisible(true);
        }
    };

    // Handle wallet payment
    const handleWalletPayment = (_wallet: string): void => {
        if (!bookingData) return;

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setQrVisible(true);
            setScanMode(false);
            setPaymentInfo(null);
        }, 1000);
    };

    // Main payment handler
    const handlePayment = (): void => {
        if (!bookingData) {
            message.warning({
                content: "Không tìm thấy thông tin đặt vé",
                duration: 2,
            });
            return;
        }

        if (bookingData.selectedSeats.length === 0) {
            message.warning({
                content: "Vui lòng chọn ít nhất 1 ghế",
                duration: 2,
            });
            return;
        }

        switch (paymentMethod) {
            case "card":
                handleCardPayment();
                break;
            case "apple":
                handleApplePay();
                break;
            case "google":
                handleGooglePay();
                break;
            case "vnpay":
                handleWalletPayment("VNPay");
                break;
            case "momo":
                handleWalletPayment("Momo");
                break;
            default:
                message.warning({
                    content: "Select payment method",
                    duration: 2,
                });
        }
    };

    // Handle modal close
    const handleModalClose = (): void => {
        setQrVisible(false);
        setScanMode(false);
        setScanResult(null);
        setPaymentInfo(null);
        setScanError(null);
        stopScanner();
    };

    // Get order reference
    const getOrderReference = (): string => {
        if (!bookingData) return "";
        return bookingData.bookingId || `DH${Date.now()}`;
    };

    // Calculate total amount by seat type
    const getSeatTypeSummary = (): { type: string; count: number; total: number }[] => {
        if (!bookingData) return [];

        const summary = new Map<string, { count: number; total: number }>();

        bookingData.selectedSeats.forEach((seat) => {
            const type = seat.type || "standard";
            const current = summary.get(type) || { count: 0, total: 0 };

            summary.set(type, {
                count: current.count + 1,
                total: current.total + seat.price,
            });
        });

        return Array.from(summary.entries()).map(([type, data]) => ({
            type,
            count: data.count,
            total: data.total,
        }));
    };

    if (loadingBooking) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    background: "#0f1219",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 24, color: "#3e80e4", marginBottom: 16 }}>⏳</div>
                    <Text style={{ color: "#fff" }}>Đang tải thông tin đặt vé...</Text>
                </div>
            </div>
        );
    }

    if (!bookingData) {
        return (
            <Card
                style={{
                    maxWidth: 500,
                    margin: "50px auto",
                    background: "#0f1219",
                    border: "1px solid #2a2f3f",
                    borderRadius: 24,
                    textAlign: "center",
                    padding: 40,
                }}
            >
                <Title level={3} style={{ color: "#fff" }}>
                    Không tìm thấy thông tin đặt vé
                </Title>
                <Text type="secondary" style={{ display: "block", marginBottom: 20 }}>
                    Vui lòng chọn ghế trước khi thanh toán
                </Text>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/select-seats")}
                >
                    Chọn ghế ngay
                </Button>
            </Card>
        );
    }

    return (
        <>
            <Card
                style={{
                    maxWidth: 500,
                    margin: "0 auto",
                    background: "#0f1219",
                    border: "1px solid #2a2f3f",
                    borderRadius: 24,
                }}
            >
                <Title level={2} style={{ color: "#fff" }}>
                    Thanh toán
                </Title>

                <Card
                    size="small"
                    style={{
                        marginBottom: 24,
                        background: "linear-gradient(135deg, #1a1f2e 0%, #2a2f3f 100%)",
                        borderColor: "#3e80e4",
                        borderRadius: 16,
                    }}
                >
                    <Descriptions
                        column={1}
                        labelStyle={{ color: "#8c8c8c" }}
                        contentStyle={{ color: "#fff" }}
                    >
                        <Descriptions.Item label="Phim">
                            <Text strong style={{ color: "#fff" }}>
                                {bookingData.movieName}
                            </Text>
                        </Descriptions.Item>

                        <Descriptions.Item label="Suất chiếu">
                            {bookingData.showDate} - {bookingData.showTime}
                        </Descriptions.Item>

                        <Descriptions.Item label="Rạp">
                            {bookingData.theater} {bookingData.room ? `• ${bookingData.room}` : ""}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ghế đã chọn">
                            <Space wrap>
                                {bookingData.selectedSeats.map((seat) => (
                                    <Tag key={seat.id} color="#3e80e4" style={{ padding: "4px 8px" }}>
                                        {seat.id} ({formatMoney(seat.price)})
                                    </Tag>
                                ))}
                            </Space>
                        </Descriptions.Item>

                        <Descriptions.Item label="Chi tiết giá">
                            {getSeatTypeSummary().map((item) => (
                                <div key={item.type} style={{ marginBottom: 4 }}>
                                    <Text type="secondary">{item.type.toUpperCase()}: </Text>
                                    <Text style={{ color: "#fff" }}>
                                        {item.count} ghế × {formatMoney(item.total / item.count)} ={" "}
                                        {formatMoney(item.total)}
                                    </Text>
                                </div>
                            ))}
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider style={{ borderColor: "#3e80e4", margin: "16px 0" }} />

                    <Row justify="space-between" align="middle">
                        <Col>
                            <Text style={{ color: "#8c8c8c", fontSize: 16 }}>Tổng tiền:</Text>
                            <br />
                            <Text type="secondary">{bookingData.ticketCount} vé</Text>
                        </Col>
                        <Col>
                            <Title level={2} style={{ color: "#3e80e4", margin: 0 }}>
                                {formatMoney(bookingData.totalAmount)}
                            </Title>
                        </Col>
                    </Row>
                </Card>

                <Tabs
                    activeKey={paymentMethod}
                    onChange={(key: string) => setPaymentMethod(key)}
                    items={[
                        {
                            key: "card",
                            label: (
                                <span>
                                    <CreditCardOutlined /> CARD
                                </span>
                            ),
                            children: (
                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    <Input placeholder="Cardholder Name" size="large" />
                                    <Input placeholder="Card Number" size="large" />
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Input placeholder="MM/YY" size="large" />
                                        </Col>
                                        <Col span={12}>
                                            <Input.Password placeholder="CVV" size="large" />
                                        </Col>
                                    </Row>
                                </div>
                            ),
                        },
                        {
                            key: "apple",
                            label: (
                                <span>
                                    <AppleOutlined /> APPLE PAY
                                </span>
                            ),
                            children: (
                                <div style={{ textAlign: "center", padding: 40 }}>
                                    <AppleOutlined style={{ fontSize: 48 }} />
                                    <Title level={4} style={{ color: "#fff" }}>
                                        Apple Pay
                                    </Title>
                                    <Text type="secondary">
                                        Thanh toán {formatMoney(bookingData.totalAmount)} (
                                        {bookingData.ticketCount} vé)
                                    </Text>
                                </div>
                            ),
                        },
                        {
                            key: "google",
                            label: (
                                <span>
                                    <AndroidOutlined /> GOOGLE PAY
                                </span>
                            ),
                            children: (
                                <div style={{ textAlign: "center", padding: 40 }}>
                                    <AndroidOutlined style={{ fontSize: 48 }} />
                                    <Title level={4} style={{ color: "#fff" }}>
                                        Google Pay
                                    </Title>
                                    <Text type="secondary">
                                        Thanh toán {formatMoney(bookingData.totalAmount)} (
                                        {bookingData.ticketCount} vé)
                                    </Text>
                                </div>
                            ),
                        },
                        {
                            key: "vnpay",
                            label: (
                                <span>
                                    <QrcodeOutlined /> VNPAY
                                </span>
                            ),
                            children: (
                                <div style={{ textAlign: "center", padding: 20 }}>
                                    <Title level={4} style={{ color: "#fff" }}>
                                        Quét mã VietQR
                                    </Title>
                                    <Alert
                                        message="Thông tin thanh toán"
                                        description={
                                            <div style={{ textAlign: "left" }}>
                                                <p>
                                                    <strong>Số tiền:</strong>{" "}
                                                    {formatMoney(bookingData.totalAmount)}
                                                </p>
                                                <p>
                                                    <strong>Số vé:</strong> {bookingData.ticketCount}
                                                </p>
                                                <p>
                                                    <strong>Ghế:</strong>{" "}
                                                    {bookingData.selectedSeats.map((s) => s.id).join(", ")}
                                                </p>
                                                <p>
                                                    <strong>Nội dung:</strong> Thanh toan{" "}
                                                    {bookingData.ticketCount} ve {bookingData.movieName}
                                                </p>
                                            </div>
                                        }
                                        type="info"
                                        showIcon
                                        style={{ marginTop: 16 }}
                                    />
                                </div>
                            ),
                        },
                        {
                            key: "momo",
                            label: (
                                <span>
                                    <WalletOutlined /> MOMO
                                </span>
                            ),
                            children: (
                                <div style={{ textAlign: "center", padding: 40 }}>
                                    <Title level={4} style={{ color: "#fff" }}>
                                        Momo QR
                                    </Title>
                                    <Text type="secondary">
                                        Quét mã để thanh toán {formatMoney(bookingData.totalAmount)} (
                                        {bookingData.ticketCount} vé)
                                    </Text>
                                </div>
                            ),
                        },
                    ]}
                />

                <Divider />

                <Space direction="vertical" style={{ width: "100%" }} size="small">
                    <Button
                        type="link"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                    >
                        Quay lại
                    </Button>

                    <Button
                        type="primary"
                        size="large"
                        block
                        loading={loading}
                        onClick={handlePayment}
                        style={{ height: 50, fontSize: 16 }}
                    >
                        {paymentMethod === "vnpay" || paymentMethod === "momo"
                            ? `Hiển thị mã QR - ${formatMoney(bookingData.totalAmount)}`
                            : `Thanh toán - ${formatMoney(bookingData.totalAmount)}`}
                    </Button>
                </Space>
            </Card>

            <Modal
                title={
                    <div style={{ textAlign: "center" }}>
                        {scanMode ? "Quét mã QR thanh toán" : "Mã VietQR thanh toán"}
                        {!isLandscape && scanMode && (
                            <div style={{ fontSize: 14, color: "#faad14", marginTop: 8 }}>
                                ⚠️ Vui lòng xoay ngang màn hình để quét QR dễ dàng hơn
                            </div>
                        )}
                    </div>
                }
                open={qrVisible}
                footer={null}
                onCancel={handleModalClose}
                centered
                width={isLandscape ? "80%" : 500}
                style={{ maxWidth: isLandscape ? "80%" : 500 }}
            >
                <div style={{ padding: isLandscape ? "20px 40px" : "20px" }}>
                    <Card
                        size="small"
                        style={{
                            marginBottom: 20,
                            background: "#f0f5ff",
                            borderColor: "#3e80e4",
                            textAlign: "center",
                        }}
                    >
                        <Statistic
                            title="Số tiền thanh toán"
                            value={formatMoney(paymentInfo?.amount || bookingData.totalAmount)}
                            valueStyle={{ color: "#3e80e4", fontSize: 28 }}
                            prefix={<DollarOutlined />}
                        />

                        {bookingData && (
                            <div style={{ marginTop: 8 }}>
                                <Text type="secondary">
                                    {bookingData.ticketCount} vé - Ghế:{" "}
                                    {bookingData.selectedSeats.map((s) => s.id).join(", ")}
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Mã ĐH: {getOrderReference()}
                                </Text>
                            </div>
                        )}
                    </Card>

                    <div
                        style={{
                            marginBottom: 20,
                            display: "flex",
                            gap: 10,
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            type={!scanMode ? "primary" : "default"}
                            onClick={() => {
                                setScanMode(false);
                                setScanResult(null);
                                setPaymentInfo(null);
                                setScanError(null);
                            }}
                            icon={<QrcodeOutlined />}
                        >
                            Hiển thị QR
                        </Button>

                        <Button
                            type={scanMode ? "primary" : "default"}
                            onClick={() => {
                                setScanMode(true);
                                setScanResult(null);
                                setPaymentInfo(null);
                                setScanError(null);
                            }}
                            icon={<CameraOutlined />}
                        >
                            Quét QR
                        </Button>
                    </div>

                    {scanMode ? (
                        <div>
                            {scanError && (
                                <Alert
                                    message="Lỗi quét QR"
                                    description={scanError}
                                    type="error"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />
                            )}

                            {processingPayment && (
                                <Alert
                                    message="Đang xử lý thanh toán..."
                                    description="Vui lòng đợi trong giây lát"
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />
                            )}

                            <div
                                id={qrCodeIdRef.current}
                                style={{
                                    width: "100%",
                                    minHeight: 300,
                                    background: "#f0f2f5",
                                    borderRadius: 8,
                                    overflow: "hidden",
                                }}
                            />

                            <div style={{ marginTop: 16 }}>
                                <Text type="secondary">
                                    Đưa mã QR vào khung hình để quét tự động
                                </Text>
                            </div>

                            {scanResult && paymentInfo && !processingPayment && (
                                <Alert
                                    message="Đã quét thành công!"
                                    description={
                                        <div>
                                            <p>Số tiền: {formatMoney(paymentInfo.amount)}</p>
                                            <p>Mã đơn hàng: {paymentInfo.orderId}</p>
                                            <p>Nội dung: {paymentInfo.description}</p>
                                        </div>
                                    }
                                    type="success"
                                    showIcon
                                    style={{ marginTop: 16 }}
                                />
                            )}
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: isLandscape ? "row" : "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: isLandscape ? 40 : 20,
                            }}
                        >
                            <div>
                                <QRCode
                                    value={
                                        paymentMethod === "vnpay"
                                            ? generateVietQRPayload()
                                            : `https://payment.demo/order/${getOrderReference()}?amount=${bookingData.totalAmount}`
                                    }
                                    size={isLandscape ? 300 : 250}
                                    bordered
                                    icon={
                                        paymentMethod === "vnpay"
                                            ? "https://vietqr.net/logo.png"
                                            : undefined
                                    }
                                    iconSize={40}
                                />
                                <Text
                                    type="secondary"
                                    style={{
                                        display: "block",
                                        marginTop: 8,
                                        textAlign: "center",
                                    }}
                                >
                                    Mã đơn hàng: {getOrderReference()}
                                </Text>
                            </div>

                            <div style={{ textAlign: "center", maxWidth: 300 }}>
                                <Title
                                    level={isLandscape ? 3 : 4}
                                    style={{ marginTop: 0, color: "#3e80e4" }}
                                >
                                    {formatMoney(bookingData.totalAmount)}
                                </Title>

                                <div
                                    style={{
                                        background: "#f5f5f5",
                                        padding: 12,
                                        borderRadius: 8,
                                        marginBottom: 12,
                                    }}
                                >
                                    <Text strong>{bookingData.movieName}</Text>
                                    <br />
                                    <Text>
                                        {bookingData.showDate} - {bookingData.showTime}
                                    </Text>
                                    <br />
                                    <Text>
                                        Ghế: {bookingData.selectedSeats.map((s) => s.id).join(", ")}
                                    </Text>
                                    <br />
                                    <Text type="success">{bookingData.ticketCount} vé</Text>
                                </div>

                                <Text>
                                    {paymentMethod === "vnpay"
                                        ? "Dùng app ngân hàng quét mã VietQR"
                                        : "Dùng app Momo quét mã QR"}
                                </Text>

                                {isLandscape && (
                                    <div style={{ marginTop: 20 }}>
                                        <Button
                                            type="primary"
                                            size="large"
                                            onClick={() => setScanMode(true)}
                                            icon={<CameraOutlined />}
                                        >
                                            Quét QR thanh toán
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {!scanMode && !isLandscape && (
                        <div style={{ marginTop: 20, textAlign: "center" }}>
                            <Button
                                type="primary"
                                size="large"
                                onClick={() => setScanMode(true)}
                                icon={<CameraOutlined />}
                                block
                            >
                                Quét QR thanh toán
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Checkout;