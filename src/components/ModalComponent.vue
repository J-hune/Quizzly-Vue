<template>
   <vue-final-modal
     v-bind="$attrs"
     classes="flex justify-center items-center"
     content-class="relative flex flex-col mx-4 p-6 block bg-white shadow-lg rounded-lg custom-pop-up"
     :content-style="{width: width}"
   >

      <slot name="content"></slot>
   </vue-final-modal>
</template>

<script>
export default {
   name: "ModalComponent",
   inheritAttrs: false,
   props: { width: String }
};
</script>

<style scoped>
.custom-pop-up {
   max-height: 90%;
   overflow-y: scroll;
   width: 50%;
   min-width: 560px;
}

@media (min-width: 640px) {
   .custom-pop-up {
      width: 100%;
      min-width: 100%;
   }
}
</style>