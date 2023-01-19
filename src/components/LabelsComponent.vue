<template>
   <div class="px-16 py-14 w-full">
      <div class="flex flex-col w-full mb-12 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Vos Etiquettes</h1>
         <p class="leading-relaxed text-base">Les étiquettes que vous avez créées ou associées à vos
            questions sont affichées ci-dessous.<br>
            Cliquez sur une étiquette pour accéder aux questions qui lui sont associées.</p>
      </div>
      <div class="flex flex-wrap -m-2" v-if="labels[0]">
         <div v-for="label in labels" :key="label.nom"
              class="p-2 lg:w-1/5 md:w-1/2 w-full cursor-pointer" @click.prevent="redirect($event, label[0])">
            <div class="h-full flex items-center border-l-8 border-2 p-3 rounded-lg"
                 :style="{borderColor: `#${label[1]}`}">
               <div class="flex-grow">
                  <h2 class="text-gray-900 title-font text-xl text-center">{{ label[0] }}</h2>
               </div>
            </div>
         </div>
      </div>
      <div v-else>
         Vous n'avez pas encore créé de question, allez dans <a href="/nouvelleQuestion" class="font-bold">Ajouter
         une Question</a> pour en créer une !
      </div>
   </div>
</template>

<script>
import { fetchData } from "@/functions/fetch";
import router from "@/router";

export default {
   name: "LabelsComponent",
   data: function() {
      return {
         labels: []
      };
   },
   methods: {
      redirect: function(event, label) {
         router.push("/questions/" + label);
      }
   },
   async created() {
      const { data } = await fetchData("/labels/getLabels");
      for (let etiquette of data) {
         this.labels.push(etiquette);
      }
   }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

a {
   color: #6366F1;
}
</style>
