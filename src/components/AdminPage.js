import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import LoginPage from "./LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
    const [trips, setTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [formData, setFormData] = useState({
        tripName: "",
        time: "",
        days: "",
        price: "",
        avatar: "",
        description: "",
    });

    const apiBaseUrl = "https://cloud-server-5ifq.onrender.com/api/trips";

    // Lấy danh sách trips
    useEffect(() => {
        if (isLoggedIn) {
            const fetchTrips = async () => {
                try {
                    const { data } = await axios.get(apiBaseUrl);
                    setTrips(data);
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu trips:", error);
                }
            };
            fetchTrips();
        }
    }, [isLoggedIn]);

    // Hiển thị modal
    const handleShowModal = (trip = null) => {
        setSelectedTrip(trip);
        setFormData(
            trip || {
                tripName: "",
                time: "",
                days: "",
                price: "",
                avatar: "",
                description: "",
            }
        );
        setShowModal(true);
    };

    // Đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTrip(null);
    };

    // Gửi dữ liệu (thêm hoặc sửa)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.tripName ||
            !formData.time ||
            !formData.days ||
            !formData.price ||
            !formData.avatar ||
            !formData.description
        ) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        try {
            if (selectedTrip) {
                // Sửa trip
                const { data } = await axios.put(`${apiBaseUrl}/${selectedTrip._id}`, formData);
                setTrips((prev) =>
                    prev.map((trip) => (trip._id === selectedTrip._id ? { ...trip, ...data } : trip))
                );
            } else {
                // Thêm trip mới
                const { data } = await axios.post(apiBaseUrl, formData);
                setTrips((prev) => [...prev, data]);
            }
            handleCloseModal();
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    };

    // Xóa trip
    const handleDelete = async (tripId) => {
        try {
            await axios.delete(`${apiBaseUrl}/${tripId}`);
            setTrips((prev) => prev.filter((trip) => trip._id !== tripId));
        } catch (error) {
            console.error("Lỗi khi xóa trip:", error);
        }
    };

    return (
        <div className="container mt-5">
            {!isLoggedIn ? (
                <LoginPage onLogin={setIsLoggedIn} />
            ) : (
                <>
                    <h1 className="text-center mb-4">Quản lý Trips</h1>
                    <Button variant="primary" onClick={() => handleShowModal()} className="mb-3">
                        Thêm Trip
                    </Button>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Trip Name</th>
                                <th>Time</th>
                                <th>Days</th>
                                <th>Price</th>
                                <th>Avatar</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trips.map((trip, index) => (
                                <tr key={trip._id}>
                                    <td>{index + 1}</td>
                                    <td>{trip.tripName}</td>
                                    <td>{new Date(trip.time).toLocaleString()}</td>
                                    <td>{trip.days}</td>
                                    <td>{trip.price}</td>
                                    <td>
                                        <img
                                            src={trip.avatar}
                                            alt={trip.tripName}
                                            style={{ width: "100px" }}
                                        />
                                    </td>
                                    <td>{trip.description}</td>
                                    <td>
                                        <Button
                                            variant="warning"
                                            className="me-2"
                                            onClick={() => handleShowModal(trip)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDelete(trip._id)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Modal */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {selectedTrip ? "Cập nhật Trip" : "Thêm Trip mới"}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Trip Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.tripName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, tripName: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        value={formData.time}
                                        onChange={(e) =>
                                            setFormData({ ...formData, time: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Days</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.days}
                                        onChange={(e) =>
                                            setFormData({ ...formData, days: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Avatar URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.avatar}
                                        onChange={(e) =>
                                            setFormData({ ...formData, avatar: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit" className="w-100">
                                    {selectedTrip ? "Cập nhật" : "Thêm"}
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default AdminPage;
