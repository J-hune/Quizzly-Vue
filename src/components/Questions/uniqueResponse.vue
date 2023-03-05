<template>
   <h2 class="text-xl font-medium text-gray-900">Votre réponse :</h2>

   <input type="text" v-model="internalAnswer" step=".01" pattern="\d*"
          class="mt-2 w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
          placeholder="Écrivez la réponse juste..." />
</template>

<script>
export default {
   name: "uniqueResponse",
   props: { modelValue: String },
   data() {
      return {
         internalAnswer: this.modelValue
      };
   },
   watch: {
      internalAnswer(newVal, oldVal) {
         if (newVal !== "" && isNaN(newVal)) {
            this.internalAnswer = oldVal;
         } else if (!/^\d*\.?\d{0,2}$/.test(newVal)) {
            this.internalAnswer = oldVal;
         }
         this.$emit('update:modelValue', this.internalAnswer.toString());
      }
   }
};
</script>

<style scoped>

</style>