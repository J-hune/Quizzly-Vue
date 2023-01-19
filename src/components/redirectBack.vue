<template>
   <div class="mt-7 ml-6 flex items-center back-container" @click="redirectBack">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="svg-back">
         <g id="chevron-left">
            <line class="cls-1" x1="11" x2="20" y1="16" y2="7" />
            <line class="cls-1" x1="20" x2="11" y1="25" y2="16" />
         </g>
      </svg>
      <p class="pr-5">{{ back }}</p>
   </div>

</template>

<script>
import router from "@/router";

export default {
   name: "redirectBack",
   props: {
      back: String
   },
   methods: {
      redirectBack: function() {
         router.back()
      }
   }
}
</script>

<style scoped>
.back-container {
   padding: 1px;
   cursor: pointer;
   background-color: #DFE0F4;
   border-radius: 6px;
   user-select: none;
}

.svg-back {
   width: 40px;
   stroke: #6366f1;
   fill: none;
   stroke-linecap: round;
   stroke-linejoin: round;
   stroke-width: 2px;
}
</style>