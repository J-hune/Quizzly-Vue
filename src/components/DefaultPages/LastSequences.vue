<template>
   <rgb-div :rgb="rgbShow" class="px-7 md:px-16 pt-10 pb-14 w-full">
      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-10 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Mes dernières Séquences</h1>
         <p class="leading-relaxed text-base">Vos dernières séquences sont affichées ci-dessous.<br>
            Un <span class="cursor-pointer" @click="carouselShow = true">champ</span> vous permet d'en rejoindre une
            nouvelle.</p>
      </div>

      <!-- Liste des 3 dernières Sessions -->
      <div v-if="sequences.length"
           class="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-2 gap-3 2xl:grid-cols-3 lg:gap-5 mb-6">
         <quiz-card v-for="(sequence) in sequences" :key="sequence.id" :quiz="sequence" />

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
   </rgb-div>

   <!-- Popup avec le composant pour "ce dont on ne doit pas prononcer le nom" -->
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
import QuizCard from "@/components/Quiz/QuizCard.vue";
import RgbDiv from "@/components/EasterEggs/rgbDiv.vue";

moment.locale("fr");

export default {
   name: "LastSequences",
   components: { RgbDiv, QuizCard, ModalComponent, CarouselChamp },
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
         carouselShow: false,
         rgbShow: false
      };
   },
   methods: {
      /**
       * Redirige vers la page de jointure de la séquence spécifiée.
       * Affiche un message d'erreur si l'id de séquence est invalide.
       */
      joinSequence: function() {
         this.rgbShow = false
         const sequenceId = this.sequenceModel;
         if (["anais", "anaïs"].includes(sequenceId.toLowerCase())) {
            this.rgbShow = true
            return this.toast("♫ Somewhere Over the Rainbow ! ♫");
         }
         if (sequenceId.length !== 8) return this.toast.error("L'id de séquence n'est pas valide");
         router.push(`sequence/${sequenceId}/join`);
      }
   }
};
</script>

<style scoped>

</style>