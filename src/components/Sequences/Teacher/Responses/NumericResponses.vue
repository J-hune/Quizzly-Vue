<template>
   <p v-if="studentsAnswers.length === 0">Aucune réponse n'a été envoyée</p>
   <div v-else>
      <div class="flex gap-2">

         <!-- Pour chaque réponse -->
         <span v-for="(answer, index) in studentsAnswers" :key="index" class="answer"
               :class="correction === answer.toString() && 'valid'">{{ answer }}</span>


      </div>
   </div>
   <p class="mt-3" v-if="correction">
      La bonne réponse est : <span class="answer valid">{{ correction }}</span>
      (trouvée par {{studentsAnswers.filter(e => e.toString() === correction).length}} étudiants)
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
   data: function () {
      return {
         correction: null
      }
   },
   created() {
      // Ajout des événements SocketIO
      SocketioService.socket.on("renderCorrection", this.onRenderCorrection)
   },
   methods: {
      // Fonction appelée lors de la réception de la demande de correction des réponses
      onRenderCorrection: function (correction) {
         this.correction = correction
      }
   }
}
</script>

<style scoped>
.answer {
   padding: 0 6px;
   border-radius: 6px;
   background-color: white;
}

.valid {
   background-color: #7ebf7e;
   color: black;
}
</style>