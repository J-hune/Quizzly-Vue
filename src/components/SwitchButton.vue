<template>
   <div class="flex gap-1.5">
      <button
        :class="!uniqueResponse ? 'switch-button' : 'switch-button-activated'" @click.prevent="updateParent(true)"
        class="font-semibold py-2 px-4 border rounded">
         Réponse unique
      </button>
      <button
        :class="uniqueResponse ? 'switch-button' : 'switch-button-activated'" @click.prevent="updateParent(false)"
        class="font-semibold py-2 px-4 border rounded">
         Réponses multiples
      </button>
   </div>
</template>

<script>
export default {
   name: "SwitchButton",
   props: {
      uniqueResponse: Boolean
   },
   methods: {
      updateParent: function(newValue) {
         this.$emit("update", newValue)
      }
   }
};
</script>

<style scoped>
.switch-button {
   color: #A56CC1;
   border-color: #A56CC1;
   background-color: transparent;
   transition: all 0.1s ease-out;
}

.switch-button:hover {
   background-color: #925cab;
   border-color: transparent;
   color: white;
}

.switch-button-activated {
   color: white;
   border-color: transparent;
   background-color: #A56CC1;
   transition: all 0.1s ease-out;
}

.switch-button-activated:hover {
   background-color: #925cab;
}
</style>