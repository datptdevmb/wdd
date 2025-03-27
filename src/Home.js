import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import { storage } from "./firebaseConfig";
import { ref, listAll, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import wdImage from "./assets/wd.jpg";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

const Home = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadedImages, setUploadedImages] = useState([]);

    // Hàm mở thư viện ảnh
    const handleOpenGallery = () => {
        fileInputRef.current.click();
    };

    // Hàm nén ảnh
    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
        };

        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Error compressing image:", error);
            return file;
        }
    };

    // Hàm lấy danh sách ảnh từ Firebase
    const fetchUploadedImages = async () => {
        const storageRef = ref(storage, "wedding-photos");
        const result = await listAll(storageRef);
        const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
        setUploadedImages(urls);
    };

    // Xử lý khi chọn file
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const uploadPromises = files.map(async (file) => {
            const compressedFile = await compressImage(file);

            return new Promise((resolve, reject) => {
                const storageRef = ref(storage, `wedding-photos/${compressedFile.name}`);
                const uploadTask = uploadBytesResumable(storageRef, compressedFile);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadProgress((prev) => ({ ...prev, [compressedFile.name]: progress }));
                    },
                    (error) => {
                        console.error("Upload failed:", error);
                        reject(error);
                    },
                    async () => {
                        resolve();
                    }
                );
            });
        });

        // Chờ tất cả ảnh upload xong rồi mới cập nhật danh sách ảnh
        await Promise.all(uploadPromises);
        fetchUploadedImages();
        setUploadComplete(true);
    };

    useEffect(() => {
        fetchUploadedImages();
    }, []);

    return (
        <div className="container">
            <div className="main-content">
                {/* Hình nền */}
                <div className="image-container">
                    <img className="animated-bg" src={wdImage} alt="Ảnh cưới" width="300" />
                    <div className="overlay"></div>
                    <div className="smoke-container">
                        <div className="smoke smoke1"></div>
                        <div className="smoke smoke2"></div>
                        <div className="smoke smoke3"></div>
                    </div>
                </div>

                {/* Nội dung chính */}
                <div className="content-box animated-text">
                    <h2>VĂN XUYÊN & DIỄM MY</h2>
                </div>
                <div className="animated-text">
                    <h6>💖 LỜI CẢM ƠN TỪ GIA ĐÌNH 💖 <br/>

                        Gia đình chúng tôi xin gửi lời cảm ơn chân thành đến tất cả quý quan khách, họ hàng và bạn bè đã tham gia chung vui trong ngày trọng đại này. Sự hiện diện của các bạn chính là món quà quý giá nhất dành cho chúng tôi! 🎁🎉

                        Cảm ơn những lời chúc, món quà và tình cảm chân thành! Để lưu giữ những khoảnh khắc đẹp, xin mời mọi người chia sẻ ảnh kỷ niệm tại: [🔗 Link Upload Ảnh] hoặc gửi vào nhóm gia đình nhé! 📸

                        Mỗi bức ảnh sẽ là một kỷ niệm quý giá, và ai biết được, có thể sau đám cưới này, những “tình yêu bất ngờ” sẽ nở rộ nhờ một bức ảnh selfie dễ thương hay một khoảnh khắc thú vị nào đó đấy! 😜

                        Nhớ bấm "Gửi thông điệp" nha, vì những lời chúc và ảnh đẹp của các bạn sẽ làm ngày vui này thêm trọn vẹn! 💌✨

                        Cảm ơn mọi người đã cùng chúng tôi làm nên một ngày tuyệt vời và đầy kỷ niệm! 💍✨
                    </h6>
                </div>

                {/* Chọn ảnh từ thư viện */}
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        multiple
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                    <button onClick={() => navigate("/camera")}> Gửi thông điệp </button>

                    {!uploadComplete && Object.keys(uploadProgress).length > 0 && (
                        <div>
                            <h3>Đang tải lên...</h3>
                            {Object.entries(uploadProgress).map(([fileName, progress]) => (
                                <p key={fileName}>{fileName}: {Math.round(progress)}%</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Hiển thị danh sách ảnh đã tải lên */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "10px",
                marginTop: "20px"
            }}>
                {uploadedImages.length > 0 ? (
                    uploadedImages.map((url, index) => (
                        <div key={index}>
                            <img
                                src={url}
                                alt={`Ảnh ${index + 1}`}
                                style={{
                                    width: "100%",
                                    height: "200px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                }}
                            />
                        </div>
                    ))
                ) : (
                    <p>Không có ảnh nào!</p>
                )}
            </div>
        </div>
    );
};

export default Home;
