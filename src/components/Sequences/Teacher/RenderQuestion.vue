<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">

      <!-- Mot de passe de la séquence -->
      <h2 class="text-center font-bold text-2xl leading-10">Mot de passe de la séquence:
         <span class="password" v-if="sequenceId">{{ sequenceId }}</span>
         <span class="password" v-else>********</span>
      </h2>

      <div v-if="displayQuestion" class="question-statement">

         <!-- Énoncé de la question (rendu html) -->
         <div v-for="(htmlElement, index) in TextToHtml(question.enonce)" :key="index">
            <div v-html="htmlElement"/>
         </div>
      </div>

      <!-- Affichage de la ou des réponse(s) -->
      <div v-if="displayResponses" class="question-responses">
         <multiple-responses v-if="question.type === 0" :responses="question.reponses"
                             :students="students.length" :studentsAnswers="statements"/>
         <numeric-responses v-else :students="students.length" :studentsAnswers="statements"/>
      </div>

      <div class="flex justify-between">
         <p v-if="displayResponses" class="cursor-pointer mt-3 text-blue-600 font-semibold select-none"
            @click="askCorrection">Afficher la correction</p>

         <p v-if="displayResponses" class="cursor-pointer mt-3 text-blue-600 font-semibold select-none"
            @click="askStopResponses">Stopper les réponses</p>
      </div>

   </div>

   <!-- Boutons -->
   <div class="sequence-buttons mt-10 text-right sm:flex">

      <!-- Affichage -->
      <div class="flex gap-2 sm:gap-3">
         <button
             class="relative w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-7 rounded-lg right-0"
             :class="!displayQuestion && 'bg-cyan-800'" @click="displayQuestion = !displayQuestion">
            Question
         </button>
         <button
             class="relative w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-7 rounded-lg right-0"
             :class="!displayResponses && 'bg-cyan-800'" @click="displayResponses = !displayResponses">
            Réponses
         </button>
      </div>

      <!-- Autres boutons -->
      <div class="mt-8 sm:mt-0 sm:flex ml-auto">
         <button
             class="relative w-full sm:w-auto sm:mr-3 bg-red-500 hover:bg-red-600 text-white
        font-bold py-2 px-7 rounded-lg right-0" @click="quitSequence">
            Quitter
         </button>
         <button
             class="relative w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg right-0"
             @click="handleClick">
            {{ lastQuestion ? "Terminer la Séquence" : "Question Suivante" }}
         </button>
      </div>
   </div>
</template>

<script>
import {TextToHtml} from "@/functions/textTohtml";
import MultipleResponses from "@/components/Sequences/Teacher/Responses/MultipleResponses.vue";
import Swal from "sweetalert2";
import router from "@/router";
import SocketioService from "@/services/socketio.service";
import NumericResponses from "@/components/Sequences/Teacher/Responses/NumericResponses.vue";
import {useToast} from "vue-toastification";

export default {
   name: "RenderQuestion",
   components: {NumericResponses, MultipleResponses},
   props: {
      sequenceId: String,
      question: Object,
      statements: Array,
      students: Array,
      lastQuestion: Boolean
   },
   data: function () {
      return {
         displayQuestion: true,
         displayResponses: true
      }
   },
   setup() {
      const toast = useToast();
      return {toast};
   },
   methods: {
      TextToHtml,
      quitSequence: function () {
         Swal.fire({
            title: "Voulez-vous vraiment quitter ?",
            text: `Si vous quittez la séquence en cours, vous ne pourrez plus revenir.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Quitter la séquence",
            cancelButtonText: "Annuler"
         }).then(async (result) => {
            // Si l'utilisateur a confirmé
            if (result.isConfirmed) {
               await router.push("/sequences")
            }
         })
      },
      askCorrection() {
         SocketioService.askCorrection()
      },
      askStopResponses() {
         SocketioService.askStopResponses()
         this.toast.info("Aucune nouvelle réponse ne sera acceptée")
      },
      handleClick() {
         if (this.lastQuestion) this.endOfSequence()
         else this.nextQuestion()
      },
      nextQuestion() {
         SocketioService.nextQuestion()
      },
      endOfSequence() {
         SocketioService.disconnect();
         router.push("/sequences")
         this.toast.info("La séquence #" + this.sequenceId + " est terminée")
      }
   }
}
</script>

<style scoped>
.password {
   background-color: #eeebf3;
   padding: 3px 5px;
   border-radius: 6px;
}

.question-statement {
   padding: 12px;
   border: solid 2px #d0c8dd;
   border-radius: 10px;
   margin-top: 22px;
}

.question-responses {
   padding: 14px 12px;
   border-radius: 10px;
   margin-top: 22px;
   background-color: #f2f0f6;
}

.sequence-buttons {
   width: 100%;
   border-top: solid 1px #eaeaea;
   padding: 20px 26px;
}
</style>