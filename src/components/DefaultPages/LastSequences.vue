<template>
   <div class="px-7 md:px-16 pt-10 pb-14 w-full">

      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-10 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Mes dernières Séquences</h1>
         <p class="leading-relaxed text-base">Vos dernières séquences sont affichées ci-dessous.<br>
            Un champ vous permet d'en rejoindre une nouvelle.</p>
      </div>

      <!-- Liste des 3 dernières Sessions -->
      <div class="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-2 gap-3 2xl:grid-cols-3 lg:gap-5 mb-6">
         <div class="w-full rounded-lg border-2 border-gray-300 bg-white items-center cursor-pointer p-6"
              v-for="(sequence) in sequences" :key="sequence.id">
            <div class="flex justify-between items-center mb-2">
               <div class="text-lg font-semibold">{{ sequence.teacherName }}</div>
               <div class="text-sm text-gray-600">#{{ sequence.id }}</div>
            </div>
            <div class="text-sm text-gray-600 mb-4">{{ timestampToDate(sequence.date) }}</div>
            <div class="flex flex-wrap -mx-1">
               <div class="w-1/2 px-1">
                  <div class="text-sm text-gray-600 mb-1">Participants</div>
                  <div class="text-xl font-semibold">{{ sequence.participantCount }}</div>
               </div>
               <div class="w-1/2 px-1">
                  <div class="text-sm text-gray-600 mb-1">Bonnes réponses (en %)</div>
                  <div class="text-xl font-semibold">{{ sequence.percentCorrect }}%</div>
               </div>
            </div>
         </div>
      </div>

      <!-- Bouton pour rejoindre une séquence -->
      <div class="flex flex-col sm:flex-row gap-3">
         <!-- input Id séquence -->
         <input type="text" v-model="sequenceModel"
                class="text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Identifiant de la séquence..." maxlength="8" />

         <!-- Bouton "rejoindre" -->
         <button @click="joinSequence"
                 class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-7 rounded-lg">
            Rejoindre la séquence
         </button>
      </div>
   </div>
</template>

<script>
import moment from "moment";
import { useToast } from "vue-toastification";
import router from "@/router";

moment.locale("fr");

// TODO fetch les données
export default {
   name: "LastSequences",
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         sequenceModel: "",
         sequences: [
            {
               teacherName: "Michel Meynard",
               participantCount: 25,
               percentCorrect: 80,
               date: "1677582727",
               id: "AB12CD34"
            },
            {
               teacherName: "Laura Jones",
               participantCount: 30,
               percentCorrect: 75,
               date: "1677582750",
               id: "EF56GH78"
            },
            {
               teacherName: "Kim Lee",
               participantCount: 15,
               percentCorrect: 90,
               date: "1677582783",
               id: "IJ90KL12"
            }
         ]
      };
   },
   methods: {
      timestampToDate: function(date) {
         const momentDate = moment(date * 1000).format("dddd D MMMM YYYY");

         // Pour avoir la 1ère lettre du jour en majuscule
         return momentDate.charAt(0).toUpperCase() + momentDate.slice(1);
      },
      joinSequence: function() {
         const sequenceId = this.sequenceModel;
         if (sequenceId.length !== 8) return this.toast.error("L'id de séquence n'est pas valide");
         router.push(`sequence/${sequenceId}/join`)
      }
   }
};
</script>

<style scoped>

</style>