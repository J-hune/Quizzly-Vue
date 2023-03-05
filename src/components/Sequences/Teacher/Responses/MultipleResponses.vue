<template>
   <!-- Affichage des réponses les plus populaires -->
   <div class="answer" v-for="answer in sortedStudentsAnswers.slice(0,4)" :key="answer.id">

      <!-- Affichage des réponses avec du markdown -->
      <div class="flex items-baseline">
         <div v-for="(htmlResponse, indexRH) in TextToHtmMarkdownOnly(responses.find(e => e.id === answer.id).reponse)"
              :key="indexRH">
            <div class="html-response" v-html="htmlResponse"/>
         </div>
         <span class="ml-2 text-sm">({{ answer.count }} étudiants)</span>
      </div>


      <!-- Barre avec une taille proportionnelle -->
      <div class="bar" :class="correction.includes(answer.id) && 'valid'" :style="{ width: answer.percent + '%'}"/>
   </div>

   <!-- Affichage de la réponse "Autres" si elle est nécessaire -->
   <div class="answer" v-if="studentsAnswers.length > 5">
      <p>Autres Réponses<span class="ml-2 text-sm">({{ otherResponses.count }} étudiants)</span></p>
      <div class="bar" :class="correction.some(e => otherResponses.ids.includes(e)) && 'valid'"
           :style="{ width: otherResponses.percent + '%'}"/>

   </div>
</template>

<script>
import {TextToHtmMarkdownOnly} from "@/functions/textTohtml";
import SocketioService from "@/services/socketio.service";
import {toRaw} from "vue";

export default {
   props: {
      responses: Array,
      students: Number,
      studentsAnswers: Array
   },
   data: function () {
      return {
         correction: []
      }
   },
   computed: {
      // Réponses des étudiants triées par popularité et avec un pourcentage
      sortedStudentsAnswers() {
         const deepCopy = JSON.parse(JSON.stringify(toRaw(this.studentsAnswers)))
         return deepCopy.sort((a, b) => b.count - a.count).map(e => ({
            ...e,
            percent: ((e.count / this.students) * 100).toFixed(1)
         }))
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
         }, {count: 0, percent: 0, ids: []});

      },
      // Nombre total de réponses
      totalAnswersCount() {
         return this.studentsAnswers.reduce((total, answer) => total + answer.count, 0);
      }
   },
   created() {
      // Ajout des événements SocketIO
      SocketioService.socket.on("renderCorrection", this.onRenderCorrection)
   },
   methods: {
      TextToHtmMarkdownOnly,
      // Fonction appelée lors de la réception de la demande de correction des réponses
      onRenderCorrection: function (correction) {
         this.correction = correction
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
   background-color: green;
}

.answer:not(:first-child) {
   margin-top: 10px;
}
</style>