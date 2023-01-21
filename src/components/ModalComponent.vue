<template>
   <vue-final-modal
     v-bind="$attrs"
     classes="flex justify-center items-center"
     content-class="relative flex flex-col mx-4 p-6 block bg-white shadow-lg w-1/2 rounded-lg custom-pop-up"
     :content-style="{width: width}"
   >

      <slot name="content"></slot>
   </vue-final-modal>
</template>

<script>
export default {
   name: "ModalComponent",
   inheritAttrs: false,
   props: ["width"]
};
</script>

<style>
.custom-pop-up {
   max-height: 90%;
   overflow-y: scroll;
}
</style>