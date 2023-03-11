<template>
   <!-- Composant utile uniquement pour "ce dont on ne doit pas prononcer le nom" -->
   <div class="carousel-container">
      <Carousel>
         <Slide v-for="image in images" :key="image.id">
            <div>
               <img class="rounded-md" :src="image.url" :alt="image.alt" />
               <h2 class="text-xl mt-3">{{ image.alt }}</h2>
            </div>
         </Slide>

         <template #addons>
            <Navigation />
            <Pagination />
         </template>
      </Carousel>
   </div>
</template>

<script>
import { defineComponent } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";

import "vue3-carousel/dist/carousel.css";
import champ from "@/assets/img/champ.jpg";
import didierDeschamps from "@/assets/img/didier-deschamps.jpg";
import longchamp from "@/assets/img/longchamp.jpg";
import airMechant from "@/assets/img/air-mechant.png";
import allInOne from "@/assets/img/all-in-one.jpg";


export default defineComponent({
   name: "BasicTest",
   components: {
      Carousel,
      Slide,
      Pagination,
      Navigation
   },
   data() {
      return {
         images: [
            { id: 1, url: champ, alt: "Un champ" },
            { id: 2, url: didierDeschamps, alt: "Didier Deschamps" },
            { id: 3, url: longchamp, alt: "Un sac Longchamp" },
            { id: 4, url: airMechant, alt: "Un air méchant"},
            { id: 5, url: allInOne, alt: "Didier Deschamps dans un champ, l'air méchant, portant un sac Longchamp"}
         ]
      };
   }
});
</script>

<style scoped>
.carousel-container {
   width: 100%;
}

.carousel__item {
   min-height: 200px;
   width: 100%;
   background-color: blue;
   color: black;
   font-size: 20px;
   border-radius: 8px;
   display: flex;
   justify-content: center;
   align-items: center;
}

.carousel__slide {
   padding: 10px;
}

</style>
