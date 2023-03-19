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

<style>
.div-rgb {
   position: relative;
   transform-style: preserve-3d;
   background: white;
   border-radius: 15px;
}

.div-rgb:before {
   content: '';
   position: absolute;
   transform: translateZ(-1px);
   left: -6px;
   top: -6px;
   border-radius: 18px 18px 0 0;
   background: linear-gradient(90deg, #ff2400, #e81d1d, #e8b71d,
   #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3, #ff2400, #e81d1d,
   #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);
   background-size: 200%;
   width: calc(100% + 12px);
   height: calc(50% + 6px);
   filter: blur(5px);

   animation: rotate-colors 20s linear infinite;
   animation-play-state: running;
   transition: opacity 0.3s ease-in-out;
}

.div-rgb:after {
   content: '';
   position: absolute;
   transform: translateZ(-1px);
   left: -6px;
   top: calc(50% - 2px);

   border-radius: 0 0 18px 18px;
   background: linear-gradient(90deg, #dd00f3, #dd00f3, #2b1de8, #1ddde8,
   #1de840, #e3e81d, #e8b71d, #e81d1d, #ff2400, #dd00f3, #dd00f3, #2b1de8,
   #1ddde8, #1de840, #e3e81d, #e8b71d, #e81d1d, #ff2400);
   background-size: 200%;
   width: calc(100% + 12px);
   height: calc(50% + 8px);
   filter: blur(5px);

   animation: rotate-colors-reverse 20s linear infinite;
   animation-play-state: running;
   transition: opacity 0.3s ease-in-out;
}

@keyframes rotate-colors {
   0% {
      background-position: 0 0;
   }
   100% {
      background-position: 400% 0;
   }
}

@keyframes rotate-colors-reverse {
   0% {
      background-position: 400% 0;

   }
   100% {
      background-position: 0 0;
   }
}
</style>