<template>
   <div class="w-full rounded-lg border-2 border-gray-300 bg-white items-center p-6">
      <div class="flex justify-between items-center mb-2">
         <div class="text-lg font-semibold overflow-clip text-ellipsis whitespace-nowrap" style="max-width: 70%">
            {{ quiz.enseignant || quiz.title }}
         </div>
         <div class="text-sm text-gray-600">#{{ quiz.code || quiz.id }}</div>
      </div>
      <div class="text-sm text-gray-600 mb-4">{{ timestampToDate(quiz.date) }}</div>
      <div class="flex flex-wrap -mx-1">
         <div class="w-1/2 px-1">
            <div class="text-sm text-gray-600 mb-1">Participants</div>
            <div class="text-xl font-semibold">{{ quiz.participants || quiz.participantCount }}</div>
         </div>
         <div class="w-1/2 px-1">
            <div class="text-sm text-gray-600 mb-1">
               {{ percent.type === 0 ? "Bonnes réponses (en %)" : "Réponse majoritaire" }}
            </div>
            <div class="text-xl font-semibold">{{ percent.type === 0 ? percent.value + "%" : percent.value }}</div>
         </div>
      </div>
   </div>
</template>

<script>
import moment from "moment/moment";
import { findMostFrequentWord } from "@/functions/worlds";

export default {
   name: "QuizCard",
   props: { quiz: Object, clickable: Boolean },
   methods: {
      /**
       * Convertit un timestamp Unix en une date formatée.
       * @param {number} date - Le timestamp Unix.
       * @returns {string} La date formatée.
       */
      timestampToDate: function(date) {
         const momentDate = moment(date * 1000).format("dddd D MMMM YYYY");

         // Pour avoir la 1ère lettre du jour en majuscule
         return momentDate.charAt(0).toUpperCase() + momentDate.slice(1);
      }
   },
   computed: {
      percent() {
         if (this.quiz.pourcentage !== undefined) {
            return {
               type: 0,
               value: this.quiz.pourcentage % 1 !== 0 ? this.quiz.pourcentage.toFixed(2) : this.quiz.pourcentage
            };
         }

         if (this.quiz.percentCorrect !== undefined) {
            return {
               type: 0,
               value: this.quiz.percentCorrect % 1 !== 0 ? this.quiz.percentCorrect.toFixed(2) : this.quiz.percentCorrect
            };
         }

         return {
            type: 1,
            value: this.quiz.reponsesOuvertes.length ? findMostFrequentWord(this.quiz.reponsesOuvertes) : "Valeur non pertinente"
         };
      }
   }
};
</script>

<style scoped>

</style>