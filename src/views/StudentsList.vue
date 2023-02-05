<template>
   <div class="px-7 md:px-16 pt-10 pb-14 w-full">

      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-12 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Mes Etudiants</h1>
         <p class="leading-relaxed text-base">Les comptes étudiants de l'établissement sont affichées ci-dessous.<br>
            Cliquez sur une question pour la modifier et/ou modifier les réponses qui lui sont associées.</p>
      </div>

      <!-- input Search -->
      <input type="text" v-model="search"
             class="w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 mb-5
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Filtrer par numéro étudiant, nom, prénom..." />
   </div>
</template>

<script>
export default {
   name: "StudentsList",
   data: function() {
      return {
         search: ""
      };
   },
};
</script>

<style scoped>

</style>