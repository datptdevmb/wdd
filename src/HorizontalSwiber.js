import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HorizontalSwiper = ({ items }) => {
  return (
    <Swiper
      slidesPerView={2}
      spaceBetween={10}
      modules={[Navigation, Pagination]}
      pagination={{ clickable: true }}
    >
      {items.map((item, index) => (
        <SwiperSlide key={index}>
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              background: '#f0f0f0',
              border: '1px solid #ddd',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <img 
              src={item?.imageUrl} 
              alt={`Image ${index}`} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {item?.message && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'red',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 2,
                  fontSize: '18px',
                  textAlign: 'center',
                  padding: '0 10px'
                }}
              >
                {item.message}
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HorizontalSwiper;
