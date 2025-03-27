import React, { useState, useRef, useEffect } from "react";

const ImageUploader = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const fileInputRef = useRef(null);

    const handleOpenGallery = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        const fileArray = Array.from(files);
        
        setSelectedImages((prevImages) => [
            ...prevImages,
            ...fileArray.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
                loaded: false,  // Biến để kiểm tra ảnh đã tải chưa
            })),
        ]);
    };

    const handleRemoveImage = (fileName) => {
        setSelectedImages((prevImages) =>
            prevImages.filter((image) => image.file.name !== fileName)
        );
    };

    const handleImageLoad = (index) => {
        setSelectedImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages[index].loaded = true;  // Đánh dấu ảnh đã tải
            return updatedImages;
        });
    };

    useEffect(() => {
        // Tạo Intersection Observer để lazy load ảnh
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Khi ảnh vào viewport, load ảnh đó
                    const index = entry.target.dataset.index;
                    handleImageLoad(index);
                    observerInstance.unobserve(entry.target);  // Ngừng theo dõi ảnh đó
                }
            });
        }, { threshold: 0.1 });

        // Lấy tất cả các ảnh trong danh sách và theo dõi chúng
        const images = document.querySelectorAll(".lazy-load");
        images.forEach((image) => observer.observe(image));

        return () => {
            observer.disconnect();
        };
    }, [selectedImages]);

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <button onClick={handleOpenGallery}>📷 Chọn ảnh từ thư viện</button>

            {/* Hiển thị danh sách hình ảnh đã chọn */}
            {selectedImages.length > 0 && (
                <div>
                    <h3>Danh sách hình ảnh đã chọn:</h3>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {selectedImages.map(({ file, preview, loaded }, index) => (
                            <div key={file.name} style={{ margin: "10px" }}>
                                <img
                                    src={loaded ? preview : ""}
                                    alt={file.name}
                                    className="lazy-load"
                                    data-index={index}
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        objectFit: "cover",
                                        filter: loaded ? "none" : "blur(10px)",
                                    }}
                                />
                                <div>{file.name}</div>
                                <button onClick={() => handleRemoveImage(file.name)}>
                                    Xóa
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
