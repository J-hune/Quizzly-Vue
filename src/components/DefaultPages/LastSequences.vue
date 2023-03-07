<template>
   <div class="px-7 md:px-16 pt-10 pb-14 w-full">

      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-10 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Mes dernières Séquences</h1>
         <p class="leading-relaxed text-base">Vos dernières séquences sont affichées ci-dessous.<br>
            Un <span class="cursor-pointer" @click="carouselShow = true">champ</span> vous permet d'en rejoindre une
            nouvelle.</p>
      </div>

      <!-- Liste des 3 dernières Sessions -->
      <div v-if="sequences.length" class="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-2 gap-3 2xl:grid-cols-3 lg:gap-5 mb-6">
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

      <p class="mb-6" v-else>Actuellement, vous n'avez pas encore participé à une séquence pédagogique.</p>

      <!-- Bouton pour rejoindre une séquence -->
      <div class="flex flex-col sm:flex-row gap-3">
         <!-- input Id séquence -->
         <input type="text" v-model="sequenceModel"
                class="text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Identifiant de la séquence..." maxlength="8" />

         <!-- Bouton "rejoindre" -->
         <button @click="joinSequence"
                 class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-7 rounded-lg">
            Rejoindre la séquence
         </button>
      </div>
   </div>

   <modal-component v-model="carouselShow" classes="p-3 sm:p-6 w-11/12 sm:w-2/3 lg:w-1/2 xl:w-2/5">
      <template v-slot:content>
         <carousel-champ v-if="carouselShow" />
      </template>
   </modal-component>
</template>

<script>
import moment from "moment";
import { useToast } from "vue-toastification";
import router from "@/router";
import CarouselChamp from "@/components/Sequences/Student/CarouselChamp.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import { fetchData } from "@/functions/fetch";

moment.locale("fr");

// TODO fetch les données
export default {
   name: "LastSequences",
   components: { ModalComponent, CarouselChamp },
   setup() {
      const toast = useToast();
      return { toast };
   },
   async created() {
      const { data } = await fetchData("/students/getLastSequences");
      this.sequences = data;
   },
   data: function() {
      return {
         sequenceModel: "",
         sequences: [],
         carouselShow: false
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
         router.push(`sequence/${sequenceId}/join`);
      }
   }
};
</script>

<style scoped>

</style>