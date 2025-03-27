import React, { useState, useRef } from "react";

const CameraComponent = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      {!isCameraOpen ? (
        <button onClick={() => setIsCameraOpen(true)}>📸 Mở Camera</button>
      ) : (
        <CameraScreen onClose={() => setIsCameraOpen(false)} />
      )}
    </div>
  );
};

const CameraScreen = ({ onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("⚠️ Trình duyệt không hỗ trợ camera.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setError(`❌ Không thể mở camera: ${err.message}`);
    }
  };

  const switchCamera = () => {
    setFacingMode(facingMode === "environment" ? "user" : "environment");
    startCamera();
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    setPhoto(canvas.toDataURL("image/png")); // Lưu ảnh dưới dạng Base64
  };

  React.useEffect(() => {
    startCamera();
  }, [facingMode]);

  return (
    <div style={styles.cameraContainer}>
      <video ref={videoRef} autoPlay playsInline style={styles.video} />

      {/* Nếu đã chụp ảnh thì hiển thị ảnh */}
      {photo && (
        <img src={photo} alt="Chụp" style={styles.previewImage} />
      )}

      {/* Nút điều khiển */}
      <div style={styles.controls}>
        <button onClick={switchCamera}>🔄 Đổi Camera</button>
        <button onClick={takePhoto}>📸 Chụp Ảnh</button>
        <button onClick={onClose} style={styles.closeButton}>❌ Đóng</button>
      </div>

      {/* Canvas để chụp ảnh nhưng không hiển thị */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

const styles = {
  cameraContainer: {
    position: "fixed",
    top: 0, left: 0, width: "100%", height: "100%",
    background: "black", display: "flex", flexDirection: "column",
    justifyContent: "center", alignItems: "center",
  },
  video: {
    width: "100%", maxHeight: "90vh", objectFit: "cover",
  },
  previewImage: {
    position: "absolute",
    top: "10%", left: "50%", transform: "translateX(-50%)",
    maxWidth: "80%", borderRadius: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
  },
  controls: {
    position: "absolute",
    bottom: 20, display: "flex", gap: 10,
  },
  closeButton: {
    background: "red", color: "white", padding: "10px 15px",
    border: "none", borderRadius: 5, cursor: "pointer",
  },
};

export default CameraComponent;
