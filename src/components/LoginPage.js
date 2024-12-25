import React, { useState } from "react";
import { Form, Button, Alert, Card, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import bannerImg from "../assets/images/banner-img3.png";

const LoginPage = ({ onLogin }) => {
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        const { username, password } = loginForm;
        // Kiểm tra tài khoản và mật khẩu
        if (username === "thanhtam123" && password === "123456") {
            setLoginError("");
            onLogin(true); // Gọi hàm callback để xác nhận đăng nhập thành công
        } else {
            setLoginError("Tên đăng nhập hoặc mật khẩu không đúng!");
        }
    };

    return (
        <section className="vh-100" >
            <Container className="h-100">
                <Row className="justify-content-center align-items-center h-100">
                    {/* Hình ảnh và form đăng nhập nằm cùng hàng */}
                    <Col md={6} lg={5} className="d-flex justify-content-center">
                        <img
                            alt="Banner"
                            src={bannerImg}
                            className="img-fluid rounded "
                            style={{
                                width: "100%",
                                height: "100%",
                                objectPosition: "center",
                                borderRadius: "10px",
                            }}
                        />
                    </Col>
                    <Col md={6} lg={5}>
                        <Card className="shadow-lg border-0 rounded">
                            <Card.Body className="p-4">
                                <h2 className="text-center mb-4" style={{ color: "#495057" }}>
                                    Đăng nhập Admin
                                </h2>
                                {loginError && (
                                    <Alert variant="danger" className="text-center">
                                        {loginError}
                                    </Alert>
                                )}
                                <Form onSubmit={handleLogin}>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: "bold" }}>
                                            Tên đăng nhập
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={loginForm.username}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, username: e.target.value })
                                            }
                                            placeholder="Nhập tên đăng nhập"
                                            className="p-2"
                                            style={{ borderRadius: "8px" }}
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label style={{ fontWeight: "bold" }}>
                                            Mật khẩu
                                        </Form.Label>
                                        <Form.Control
                                            type="password"
                                            value={loginForm.password}
                                            onChange={(e) =>
                                                setLoginForm({ ...loginForm, password: e.target.value })
                                            }
                                            placeholder="Nhập mật khẩu"
                                            className="p-2"
                                            style={{ borderRadius: "8px" }}
                                        />
                                    </Form.Group>
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-100 py-2"
                                        style={{
                                            borderRadius: "8px",
                                            backgroundColor: "#0d6efd",
                                            border: "none",
                                        }}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default LoginPage;
