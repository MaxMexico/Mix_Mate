import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const CocktailList = ({ cocktails }) => {
  return (
    <div style={{ padding: "1rem" }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
        spaceBetween={20}
        slidesPerView={3} // 3 cocktails visibles
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 1700, disableOnInteraction: false }} // Défile toutes les 2.5 secondes
        effect="coverflow" // Appliquer l'effet Coverflow
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 50,
          modifier: 1,
          slideShadows: false, // Ombres sur les slides
        }}
        style={{ width: "80%", margin: "0 auto" }}
      >
        {cocktails.map((cocktail) => (
          <SwiperSlide key={cocktail.id}>
            <div style={{ textAlign: "center", paddingBottom: "1.5rem" }}>
              <img
                src={cocktail.image}
                alt={cocktail.name}
                style={{ width: "100%", maxWidth: "200px", borderRadius: "10px" }}
              />
              <h3 style={{ marginTop: "0.5rem" }}>{cocktail.name}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CocktailList;
