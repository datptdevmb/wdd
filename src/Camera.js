import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage, db } from "./firebaseConfig";  // Đảm bảo bạn import đúng
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import './styles.css';
import imageCompression from "browser-image-compression"; // Import thư viện nén ảnh

const MessageUpload = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);

    // Hàm nén ảnh
    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 1, // Giới hạn kích thước tối đa là 1MB
            maxWidthOrHeight: 1024, // Giới hạn chiều rộng hoặc chiều cao tối đa
            useWebWorker: true, // Sử dụng web worker để nén
        };
        try {
            const compressedFile = await imageCompression(file, options);
            return compressedFile;
        } catch (error) {
            console.error("Lỗi khi nén ảnh:", error);
            return file;
        }
    };

    // Xử lý chọn nhiều ảnh
    const handleFileChange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        const compressedFiles = await Promise.all(
            selectedFiles.map(file => compressImage(file))
        );
        setImages(prevImages => [...prevImages, ...compressedFiles]);
    };

    // Xử lý thay đổi thông điệp
    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    // Upload ảnh lên Firebase Storage
    const uploadImages = async (files) => {
        const uploadPromises = files.map(file => {
            const storageRef = ref(storage, `wedding-photos/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on("state_changed",
                    (snapshot) => {
                      
                    },
                    (error) => reject(error),
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(url => resolve(url));
                    }
                );
            });
        });

        const downloadUrls = await Promise.all(uploadPromises);
        return downloadUrls;
    };

    // Xử lý gửi thông điệp và ảnh
    const handleSubmit = async () => {
        if (!message || images.length === 0) {
            alert("Vui lòng nhập thông điệp và chọn ít nhất một ảnh.");
            return;
        }

        setUploading(true);

        try {
            // Upload các ảnh đã nén lên Firebase
            const imageUrls = await uploadImages(images);

            // Lưu thông điệp và ảnh vào Firestore
            await addDoc(collection(db, "messages"), {
                message: message,
                imageUrls: imageUrls,
                timestamp: new Date(),
            });

            alert("Thông điệp và ảnh đã được gửi!");
            navigate("/"); // Quay lại trang chính
        } catch (error) {
            console.error("Lỗi khi gửi thông điệp và ảnh:", error);
            alert("Đã xảy ra lỗi khi gửi thông điệp và ảnh.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="message-container">
           
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                id="file-input"
                multiple
            />
         

            <div className="selected-images">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={URL.createObjectURL(image)}
                        alt={`Ảnh chọn ${index + 1}`}
                        style={{ maxWidth: "100px", margin: "10px", borderRadius: "8px" }}
                    />
                ))}
            </div>

            <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Nhập thông điệp gửi đến cô dâu chú rể vd : Hết đi massage rồi huhu 😜😜😜\=!"
                rows="4" />



            <button onClick={handleSubmit} disabled={uploading}>
                {uploading ? "Đang gửi..." : "Gửi thông điệp"}
            </button>
            <h1> BUỒN NGỦ RỒI HUHU</h1>
        </div>
    );
};

export default MessageUpload;
