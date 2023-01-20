<template>
   <vue-final-modal
     v-slot="{ }"
     v-bind="$attrs"
     classes="flex justify-center items-center"
     content-class="relative flex flex-col max-h-full mx-4 p-6 block bg-white shadow-lg w-1/2 rounded-lg"
   >

      <slot name="content"></slot>
   </vue-final-modal>
</template>

<script>
export default {
   name: "ModalComponent",
   inheritAttrs: false,
   emits: ["cancel", "confirm"]
};
</script>
