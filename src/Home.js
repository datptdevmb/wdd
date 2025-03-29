import React, { useEffect, useRef, useState } from 'react';
import './styles.css'; // File CSS chung
import { useNavigate } from 'react-router-dom';
import imageCompression from "browser-image-compression";
import HorizontalSwiper from './HorizontalSwiber';
import { db, storage, collection, addDoc, ref, uploadBytes, getDownloadURL, query, orderBy, limit, getDocs } from "./firebaseConfig";


const Homepage = () => {
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null); // Chỉ lưu một ảnh
    const [preview, setPreview] = useState(null); // Để hiển thị ảnh
    const [showModal, setShowModal] = useState(false); // Trạng thái modal
    const fileInputRef = useRef(null);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);
    const dragons = Array.from({ length: 7 }, (_, i) => i + 1);


    const compressImage = async (file) => {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error("Lỗi khi nén ảnh:", error);
            return file;
        }
    };


    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const compressedFile = await compressImage(file);
        setImage(compressedFile);
        setPreview(URL.createObjectURL(compressedFile));
        setShowModal(true);
    };

    const handleUpload = async () => {
        if (!image) return;
        setUploading(true);
        try {

            const storageRef = ref(storage, `uploads/${Date.now()}_${image.name}`);
            await uploadBytes(storageRef, image);
            const downloadURL = await getDownloadURL(storageRef);

            await addDoc(collection(db, "images"), {
                imageUrl: downloadURL,
                message: message,
                timestamp: new Date(),
            });

            alert("Tải lên thành công!");
            setShowModal(false);
            setPreview(null);
            setMessage("");
        } catch (error) {
            console.error("Lỗi upload:", error);
            alert("Lỗi khi tải lên!");
        }
        setUploading(false);
    };

    useEffect(() => {
        const fetchImages = async () => {

            const q = query(
                collection(db, "images"),
                orderBy("timestamp", "desc"),
                limit(5)
            );
            const querySnapshot = await getDocs(q);
            const imgs = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setImages(imgs);
        };
        fetchImages();
    }, []);

    return (
        <div>


            {showModal ? (
                <div className="modal-overlay" style={{
                    overflow: "hidden",
                    position: 'fixed',
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center", /* Căn ngang giữa */
                }}>
                    {preview && (
                        <div style={{ width: '100%', padding: 20 }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{ width: '100%', height: '50%', objectFit: 'cover', borderRadius: 12 }}
                                className="preview-image"
                            />
                            <input
                                type="text"
                                placeholder="Nhập thông điệp "
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                    padding: "12px",
                                    fontSize: "16px",
                                    borderRadius: "8px",
                                    border: "1px solid #ccc",
                                    outline: "none",
                                    background: "#f9f9f9",
                                    transition: "0.3s",
                                }}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onFocus={(e) => e.target.style.border = "1px solid #007bff"}
                                onBlur={(e) => e.target.style.border = "1px solid #ccc"}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
                                <button
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        fontSize: "16px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "#f1f1f1",
                                        color: "#333",  
                                        cursor: "pointer",
                                        marginRight: "10px",
                                        transition: "0.3s",
                                    }}
                                    onClick={() => setShowModal(false)}
                                    onMouseOver={(e) => e.target.style.background = "#ddd"}
                                    onMouseOut={(e) => e.target.style.background = "#f1f1f1"}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    style={{
                                        flex: 1,
                                        padding: "12px",
                                        fontSize: "16px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "#007bff",
                                        color: "#fff",
                                        cursor: "pointer",
                                        transition: "0.3s",
                                    }}
                                    onMouseOver={(e) => e.target.style.background = "#0056b3"}
                                    onMouseOut={(e) => e.target.style.background = "#007bff"}
                                >
                                    Upload
                                </button>
                            </div>

                        </div>
                    )
                    }
                </div>
            ) :
                <div>
                    <div className="banner">
                        <h3> Xuyên &  My</h3>

                        <div className="slider" style={{ '--quantity': 7 }}>
                            {dragons.map((position) => (
                                <div key={position} className="item" style={{ '--position': position }}>
                                    <img src={require(`./assets/images/wdd${position}.jpg`)} alt={`Dragon ${position}`} />
                                </div>
                            ))}
                        </div>

                        <div className="content">
                            <h3>Blow up our phones</h3>
                            <div className="author">
                                <p>Hãy chia sẻ khoảnh khắc cùng vợ chồng mình nhoaaa</p>
                            </div>

                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                />
                                <button className="pink-button" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                                    Gửi thông điệp
                                </button>
                            </div>
                            {
                                images.length > 0 &&
                                <div style={{ marginTop: 30, width: '100%', height: 100 }}>
                                    <HorizontalSwiper items={images} />
                                </div>
                            }
                        </div>
                    </div>


                </div>

            }
        </div>

    );
};

export default Homepage;
