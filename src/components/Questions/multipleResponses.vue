<template>
   <h2 class="text-xl font-medium text-gray-900">Mes réponses :</h2>

   <!-- Génération des questions avec un v-bind for -->
   <div class="flex flex-row mt-2" v-for="response in responses" :key="response.id">
      <div class="self-center mr-3">
         <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" class="sr-only peer outline-none"
                   v-model="response.reponseJuste">
            <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
                             after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                             after:transition-all peer-checked:bg-blue-600" />
         </label>
      </div>
      <input type="text" v-model="response.reponse"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Écrivez une des réponses possibles..." />
   </div>
</template>

<script>
export default {
   name: "multipleResponses",
   props: {
      responses: Object
   }
};
</script>

<style scoped>

</style>