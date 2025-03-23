import React from "react";
// import { FaHeart, FaComment, FaPaperPlane } from "react-icons/fa";
import "./styles.css";
import wdImage from "./assets/wd.jpg";

const App = () => {
  return (
    <div className="container">
      {/* Navbar */}
      {/* <div className="navbar">
        <span>17:27</span>
        <span>Reels</span>
      </div> */}

      {/* Main Content */}
      <div className="main-content">
        <div className="image-container">
          <img src={wdImage} alt="/wd.jpg" />
        </div>
        <div className="content-box">
          <h2>VĂN XUYÊN & DIỄM MY</h2>
          <div className="buttons">
            <button>Upload</button>
            {/* <button>Chat</button>
            <button>Planning</button> */}
          </div>
          <div className="grid-container">
            {/* <img src="/image1.jpg" className="grid-item" alt="img1" />
            <img src="/image2.jpg" className="grid-item" alt="img2" />
            <img src="/image3.jpg" className="grid-item" alt="img3" /> */}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="footer">
        <div className="icons">
          <FaHeart className="icon" /> <span>42.5K</span>
          <FaComment className="icon" /> <span>109</span>
          <FaPaperPlane className="icon" />
        </div>
      </div> */}
    </div>
  );
};

export default App;
