<template>
   <!-- Affichage des réponses les plus populaires -->
   <div class="answer" v-for="answer in sortedStudentsAnswers.slice(0,4)" :key="answer.id">

      <!-- Affichage des réponses avec du markdown -->
      <div class="flex items-baseline">
         <div v-for="(htmlResponse, indexRH) in TextToHtmMarkdownOnly(responses.find(e => e.id === answer.id).reponse)"
              :key="indexRH">
            <div class="html-response" v-html="htmlResponse" />
         </div>

         <!-- On affiche le nombre d'étudiants qui ont répondu cette réponse (avec accords) -->
         <span class="ml-2 text-sm">({{ answer.count }} {{ answer.count > 1 ? "étudiants" : "étudiant" }})</span>
      </div>


      <!-- Barre avec une taille proportionnelle -->
      <div class="bar" :class="correction.includes(answer.id) && 'valid'" :style="{ width: answer.percent + '%'}" />
   </div>

   <!-- Affichage de la réponse "Autres" si elle est nécessaire -->
   <div class="answer" v-if="studentsAnswers.length > 5">
      <p>Autres Réponses<span class="ml-2 text-sm">({{ otherResponses.count }} étudiants)</span></p>
      <div class="bar" :class="correction.some(e => otherResponses.ids.includes(e)) && 'valid'"
           :style="{ width: otherResponses.percent + '%'}" />

   </div>
</template>

<script>
import { TextToHtmMarkdownOnly } from "@/functions/textTohtml";
import SocketioService from "@/services/socketio.service";

export default {
   props: {
      responses: Array,
      students: Number,
      studentsAnswers: Array
   },
   data: function() {
      return {
         correction: []
      };
   },
   computed: {
      // Réponses des étudiants triées par popularité et avec un pourcentage
      sortedStudentsAnswers() {
         const deepCopy = JSON.parse(JSON.stringify(this.studentsAnswers));
         return deepCopy.sort((a, b) => b.count - a.count).map(e => ({
            ...e,
            percent: ((e.count / this.students) * 100).toFixed(1)
         }));
      },

      // Réponses "Autres" avec leur pourcentage et leur id
      otherResponses() {
         return this.sortedStudentsAnswers.reduce((accumulator, currentValue, currentIndex) => {
            if (currentIndex > 4) {
               accumulator.count += currentValue.count;
               accumulator.percent += parseFloat(currentValue.percent);
               accumulator.ids.push(currentValue.id);
            }
            return accumulator;
         }, { count: 0, percent: 0, ids: [] });

      }
   },
   created() {
      // Ajout des événements SocketIO
      SocketioService.socket.on("renderCorrection", this.onRenderCorrection);
   },
   methods: {
      TextToHtmMarkdownOnly,
      // Fonction appelée lors de la réception de la demande de correction des réponses
      onRenderCorrection: function(correction) {
         this.correction = correction;
      }
   }
};
</script>

<style scoped>
.bar {
   background-color: #a56cc1;
   height: 14px;
   border-radius: 0 6px 6px 0;
   display: flex;
   align-items: center;
   min-width: 20px;
   transition: all 0.2s;
}

.valid {
   background-color: #18937b;
}

.answer:not(:first-child) {
   margin-top: 10px;
}
</style>