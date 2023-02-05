<template>
   <div class="px-7 md:px-16 py-14 w-full">

      <!-- Titre et explications -->
      <div class="flex flex-col w-full py-1 mb-6">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Mes Etiquettes</h1>
         <p class="leading-relaxed text-base">Les étiquettes que vous avez créées ou associées à vos
            questions sont affichées ci-dessous.<br>
            Cliquez sur une étiquette pour accéder aux questions qui lui sont associées.</p>
      </div>

      <!-- Si l'utilisateur a au moins une étiquette -->
      <div class="label-flex" v-if="labels[0]">
         <div v-for="label in labels" :key="label.nom"
              class="cursor-pointer" @click.prevent="redirect($event, label[0])">
            <div class="h-full flex items-center border-l-8 border-2 py-2 px-10 rounded-lg"
                 :style="{borderColor: `#${label[1]}`}">
               <div class="flex-grow">
                  <h2 class="text-gray-900 title-font text-xl text-center">{{ label[0] }}</h2>
               </div>
            </div>
         </div>
      </div>

      <!-- Si l'utilisateur n'a pas créé d'étiquette -->
      <div v-else>
         Vous n'avez pas encore créé de question, allez dans
         <router-link to="/newQuestion">
            <a class="font-bold">Ajouter une Question</a>
         </router-link>
         pour en créer une !
      </div>
   </div>
</template>

<script>
import { fetchData } from "@/functions/fetch";
import router from "@/router";

// Fonction tri en utilisant le tri-rapide de JS
function sortArray(array) {
   return array.sort((a, b) => a[0].localeCompare(b[0]));
}

export default {
   name: "LabelsComponent",
   data: function() {
      return {
         labels: []
      };
   },
   methods: {
      redirect: function(event, label) {
         router.push("/label/" + label);
      }
   },
   async created() {
      // Récupération des étiquettes et stockage dans data
      const { data } = await fetchData("/labels/getLabels");
      this.labels = sortArray(data)
   }
};
</script>

<style scoped>
a {
   color: #6366F1;
}

.label-flex {
   display: flex;
   flex-flow: row wrap;
   gap: 8px 8px;
   -webkit-user-select: none;
   -moz-user-select: none;
   user-select: none;
   align-items: center;
}
</style>
