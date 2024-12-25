import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import LoginPage from "./LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Trạng thái đăng nhập
    const [trips, setTrips] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Trạng thái hiển thị hộp thoại xác nhận xóa
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [tripToDelete, setTripToDelete] = useState(null); // Trip đang được chọn để xóa
    const [formData, setFormData] = useState({
        tripName: "",
        time: "",
        days: "",
        price: "",
        avatar: "",
        description: "",
    });

    const apiBaseUrl = "https://cloud-server-5ifq.onrender.com/api/trips";

    // Lấy danh sách trips từ API
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

    // Hiển thị modal thêm/sửa trip
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

    // Đóng modal thêm/sửa trip
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTrip(null);
    };

    // Gửi dữ liệu thêm hoặc sửa trip
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

    // Hiển thị hộp thoại xác nhận xóa trip
    const handleDeleteConfirmation = (trip) => {
        setTripToDelete(trip);
        setShowDeleteModal(true);
    };

    // Xác nhận xóa trip
    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${apiBaseUrl}/${tripToDelete._id}`);
            setTrips((prev) => prev.filter((trip) => trip._id !== tripToDelete._id));
            setShowDeleteModal(false); // Đóng hộp thoại xác nhận
            setTripToDelete(null); // Xóa trip khỏi trạng thái
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
                                            onClick={() => handleDeleteConfirmation(trip)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Modal thêm/sửa trip */}
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

                    {/* Modal xác nhận xóa */}
                    <Modal
                        show={showDeleteModal}
                        onHide={() => setShowDeleteModal(false)}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>Xác nhận xóa</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Bạn có chắc chắn muốn xóa chuyến đi{" "}
                            <strong>{tripToDelete?.tripName}</strong> không?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleConfirmDelete}
                            >
                                Xóa
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default AdminPage;
