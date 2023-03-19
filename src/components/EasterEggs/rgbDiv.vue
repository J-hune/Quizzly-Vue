<template>
   <div :class="{'div-rgb': rgb}">
      <slot />
   </div>
</template>

<script>
export default {
   name: "rgbDiv",
   props: { rgb: Boolean }
};
</script>

<style scoped>
.div-rgb {
   position: relative;
}

.div-rgb:before, .div-rgb:after {
   opacity: 0;
   content: '';
   position: absolute;
   left: -3px;
   top: -3px;
   border-radius: 18px;
   background-image: linear-gradient(to right, #fb0094, #0000ff, #00ff00, #ffff00, #ff0000, #fb0094,
   #0000ff, #00ff00, #ffff00, #ff0000);
   background-size: 400%;
   width: calc(100% + 6px);
   height: calc(100% + 6px);
   z-index: -1;
   animation: rotate-colors 15s linear infinite;
   animation-play-state: running;
   transition: opacity 0.3s ease-in-out;
}

.div-rgb:hover:before, .div-rgb:hover:after {
   opacity: 1;
}

@keyframes rotate-colors {
   0% {
      background-position: 0 0;
   }
   100% {
      background-position: -200% 0;
   }
}
</style>