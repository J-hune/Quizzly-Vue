<template>
   <h2 class="text-xl font-medium text-gray-900">Votre réponse :</h2>

   <input type="number" v-model="inputVal" @keydown="onlyNumbers($event)"
          class="mt-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
          placeholder="Écrivez la réponse juste..." />
</template>

<script>
export default {
   name: "uniqueResponse",
   props: { modelValue: String },
   computed: {
      inputVal: {
         get() {
            return this.modelValue;
         },
         set(val) {
            this.$emit("update:modelValue", val.toString());
         }
      }
   },
   methods: {
      onlyNumbers(e) {
         // Pour éviter les "e" dans le champ
         if (e.keyCode === 69) e.preventDefault();
      }
   }
};
</script>

<style scoped>

</style>