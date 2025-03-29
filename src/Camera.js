import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

const MessageUpload = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const fileInputRef = useRef(null);

    // Xử lý chọn ảnh
    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        const compressedFiles = await Promise.all(
            selectedFiles.map(file => compressImage(file))
        );
        setImages(prevImages => [...prevImages, ...compressedFiles]);
    };

    // Hàm nén ảnh
    const compressImage = async (file) => {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error("Lỗi khi nén ảnh:", error);
            return file;
        }
    };

    // Tự động mở hộp thoại khi nhấn vào màn hình
    const handleOpenFileDialog = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Khi component render lần đầu, yêu cầu người dùng nhấn để mở hộp thoại
    useEffect(() => {
        setTimeout(() => {
            handleOpenFileDialog();
        }, 500); // Tránh chặn do trình duyệt
    }, []);

    return (
        <div className="message-container">
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                multiple
                style={{ display: "none" }} // Ẩn input file
            />

            {/* Hiển thị nút giả để mở hộp thoại nếu bị chặn */}
            <div
                onClick={handleOpenFileDialog}
                style={{
                    padding: "20px",
                    // backgroundColor: "#007bff",
                    color: "red",
                    textAlign: "center",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "20px"
                }}
            >
                +
            </div>
        </div>
    );
};

export default MessageUpload;
