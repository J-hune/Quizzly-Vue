<template>
   <div class="flex gap-1.5">
      <button
        :class="responseType === 1 ? 'switch-button' : 'switch-button-activated'" @click.prevent="updateParent(1)"
        class="font-semibold py-2 px-4 border rounded">
         Réponse unique
      </button>
      <button
        :class="responseType === 0 ? 'switch-button' : 'switch-button-activated'" @click.prevent="updateParent(0)"
        class="font-semibold py-2 px-4 border rounded">
         Réponses multiples
      </button>
      <button
        :class="responseType === 2 ? 'switch-button' : 'switch-button-activated'" @click.prevent="updateParent(2)"
        class="font-semibold py-2 px-4 border rounded">
         Réponse libre
      </button>
   </div>
</template>

<script>
export default {
   name: "SwitchButton",
   props: { responseType: Number },
   methods: {
      /**
       * Met à jour la valeur de la propriété parente en émettant un événement.
       * @param {number} newValue La nouvelle valeur à affecter à la propriété parente.
       */
      updateParent: function(newValue) {
         this.$emit("update", newValue);
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