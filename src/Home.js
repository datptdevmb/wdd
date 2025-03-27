import React from 'react';
import './styles.css'; // File CSS chung
import { useNavigate } from 'react-router-dom';
// CSS riêng cho component


// import dragonImages from './assets/images' 

const Banner = () => {
    const navigate = useNavigate();
    const dragons = Array.from({ length: 10 }, (_, i) => i + 1);

    const handleClick =()=>{
        console.log('kkkkkk')
        navigate('/camera')
    }

    return (
        <div className="banner">
            <h3>Welcome to wedding</h3>
            <div className="slider" style={{ '--quantity': 7 }}>
                {dragons.map((position) => (
                    <div
                        key={position}
                        className="item"
                        style={{ '--position': position }}
                    >
                        <img
                            src={require(`./assets/images/wdd${position}.jpg`)}
                            alt={`Dragon ${position}`}
                        />
                    </div>
                ))}
            </div>

            <div className="content">
                <h1>Văn Xuyên & Diễm My</h1>

                <div className="author">
                    <h2>29-03-25</h2>
                    {/* <p><b>Web Design</b></p> */}
                    <p>Cám ơn sự hiện diện của mọi người</p>
                </div>
                <div className="model"></div>
                <button
                    className="pink-button"
                    onClick={handleClick}>
                    Gửi thông điệp
                </button>
            </div>

        </div>
    );
};

export default Banner;