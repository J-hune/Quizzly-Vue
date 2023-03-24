<template>
   <p v-if="studentsAnswers.length === 0">Aucune réponse n'a été envoyée</p>
   <div v-else>
      <!-- Affichage des réponses les plus populaires -->
      <div class="answer" :key="answer.id"
           v-for="answer in sortedStudentsAnswers.length <= 5 ? sortedStudentsAnswers.slice(0,5):  sortedStudentsAnswers.slice(0,4)">

         <!-- Affichage des réponses avec du markdown -->
         <div class="flex items-baseline">
            {{ answer.answer }}

            <!-- On affiche le nombre d'étudiants qui ont répondu cette réponse (avec accords) -->
            <span class="ml-2 text-sm">({{ answer.count }} {{ answer.count > 1 ? "étudiants" : "étudiant" }})</span>
         </div>

         <!-- Barre avec une taille proportionnelle -->
         <div class="bar" :class="correction === answer.answer && 'valid'" :style="{ width: answer.percent + '%'}" />
      </div>

      <!-- Affichage de la réponse "Autres" si elle est nécessaire -->
      <div class="answer" v-if="studentsAnswers.length > 5">
         <p>Autres Réponses<span class="ml-2 text-sm">({{ otherResponses.count }} étudiants)</span></p>
         <div class="bar" :class="otherResponses.values.includes(correction) && 'valid'"
              :style="{ width: otherResponses.percent + '%'}" />

      </div>
   </div>
   <p class="mt-3" v-if="correction">
      La bonne réponse est : <span class="correction">{{ correction }}</span>
      (trouvée par {{ studentsAnswers.filter(e => e.toString() === correction).length }} étudiants)
   </p>
</template>

<script>
import SocketioService from "@/services/socketio.service";

export default {
   name: "NumericResponses",
   props: {
      students: Number,
      studentsAnswers: Array
   },
   data: function() {
      return {
         correction: null
      };
   },
   created() {
      // Ajout des événements SocketIO
      SocketioService.socket.on("renderCorrection", this.onRenderCorrection);
   },
   methods: {
      /**
       * Affiche le rendu de la correction
       * @param correction
       */
      onRenderCorrection: function(correction) {
         this.correction = correction;
      }
   },
   computed: {
      // Réponses des étudiants triées par popularité et avec un pourcentage
      sortedStudentsAnswers() {
         const totalCount = this.studentsAnswers.length;

         const count = this.studentsAnswers.reduce((acc, answer) => {
            acc[answer] = acc[answer] ? acc[answer] + 1 : 1;
            acc[answer + "_stats"] = {
               count: acc[answer],
               percent: ((acc[answer] / totalCount) * 100).toFixed(1)
            };
            return acc;
         }, {});

         return Object.keys(count).filter(key => !key.endsWith("_stats")).map(answer => ({ answer, ...count[answer + "_stats"] }));
      },

      // Réponses "Autres" avec leur pourcentage et leur id
      otherResponses() {
         return this.sortedStudentsAnswers.reduce((accumulator, currentValue, currentIndex) => {
            if (currentIndex > 3) {
               accumulator.count += currentValue.count;
               accumulator.percent += parseFloat(currentValue.percent);
               accumulator.values.push(currentValue.answer);
            }
            return accumulator;
         }, { count: 0, percent: 0, values: [] });
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

.correction {
   background-color: white;
   padding: 2px 4px;
   border-radius: 6px;
}

.answer:not(:first-child) {
   margin-top: 10px;
}
</style>