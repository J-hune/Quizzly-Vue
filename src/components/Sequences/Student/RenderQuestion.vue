<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">

      <!-- Mot de passe de la séquence -->
      <h2 class="text-center font-bold text-2xl leading-10">
         Mot de passe de la {{ mode === "sequence" ? "séquence" : "question" }}:
         <span class="password" v-if="sequenceId">{{ sequenceId }}</span>
         <span class="password" v-else>********</span>
      </h2>

      <div class="question-statement">

         <!-- Énoncé de la question (rendu html) -->
         <div v-for="(htmlElement, index) in TextToHtml(question.enonce)" :key="index">
            <div v-html="htmlElement" />
         </div>
      </div>

      <!-- Affichage des réponses possibles (cas QCM) -->
      <p v-if="question.type === 0" class="mt-6">Veuillez sélectionner les réponses qui sont valides. Il peut n'y avoir
         aucune réponse valide.</p>

      <div class="responses-container" v-if="question.type === 0">
         <div class="response" v-for="response in question.reponses" :key="response.id"
              @click="toggleResponse(response.id)" :class="{
                 'selected': answer.includes(response.id),
                 'valid': correction && correction.includes(response.id) === answer.includes(response.id),
                 'invalid': correction && correction.includes(response.id) !== answer.includes(response.id)
              }">
            <div v-for="(htmlResponse, indexRH) in TextToHtmMarkdownOnly(response.reponse)"
                 :key="indexRH">
               <div class="html-response" v-html="htmlResponse" />
            </div>
         </div>
      </div>

      <!-- Affichage d'un input type number (cas Numérique) -->
      <p v-if="question.type === 1" class="mt-6 mb-3">Veuillez entrer votre réponse puis l'envoyer.</p>
      <input v-if="question.type === 1" type="number" v-model="answer" step=".01"
             :class="{'valid': correction?.trim() === answer.toString(), 'invalid': correction && correction.trim() !== answer.toString() }"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-200 answer-input
             focus:border-indigo-200 focus:ring-2 outline-none py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Entrez votre réponse..." :disabled="!canSubmit" />

   </div>

   <!-- Boutons -->
   <div class="sequence-buttons mt-10 text-right sm:flex">
      <div class="sm:flex ml-auto">
         <button
           class="relative w-full sm:w-auto sm:mr-3 bg-red-500 hover:bg-red-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-40 right-0" @click="quitSequence">
            Quitter
         </button>
         <button
           class="relative w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-40 right-0"
           @click="handleClick" :disabled="!canSubmit">
            Envoyer la réponse
         </button>
      </div>
   </div>
</template>

<script>
import Swal from "sweetalert2";
import router from "@/router";
import { useToast } from "vue-toastification";
import { TextToHtml, TextToHtmMarkdownOnly } from "@/functions/textTohtml";
import SocketioService from "@/services/socketio.service";

export default {
   name: "RenderQuestion",
   data: function() {
      return {
         answer: this.question.type === 0 ? [] : "",
         correction: null
      };
   },
   props: {
      sequenceId: String,
      question: Object,
      lastQuestion: Boolean,
      canSubmit: Boolean,
      mode: String
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   created() {
      // Ajout des événements SocketIO
      SocketioService.socket.on("renderCorrection", this.onRenderCorrection);
      SocketioService.socket.on("renderQuestion", () => this.correction = null);
   },
   methods: {
      TextToHtmMarkdownOnly,
      TextToHtml,
      quitSequence: function() {
         Swal.fire({
            title: "Voulez-vous vraiment quitter ?",
            text: `Si vous quittez le quiz en cours, vous ne pourrez plus revenir.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Quitter le quiz",
            cancelButtonText: "Annuler"
         }).then(async (result) => {
            // Si l'utilisateur a confirmé
            if (result.isConfirmed) {
               await router.push("/");
            }
         });
      },
      handleClick: function() {
         SocketioService.submitAnswer(this.answer);
      },
      toggleResponse: function(id) {
         if (!this.canSubmit) return;
         if (this.answer.includes(id)) this.answer = this.answer.filter(e => e !== id);
         else this.answer = [...this.answer, id];
      },
      onRenderCorrection: function(correction) {
         this.correction = correction;
      }
   },
   watch: {
      answer(newValue, oldValue) {
         // On limite le nombre de décimales à 2
         if (this.question.type === 1 && newValue != null && !/^\d*\.?\d{0,2}$/.test(newValue)) {
            this.answer = oldValue;
         }
      },
      question() {
         // On met à jour `answer` quand on passe à la question suivante
         this.answer = this.question.type === 0 ? [] : "";
      }
   }
};
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

.responses-container {
   display: flex;
   flex-wrap: wrap;
   margin-top: 12px;
   gap: 15px;
}

.response {
   background-color: #eeebf3;
   padding: 8px 12px;
   border-radius: 6px;
   border: solid 2px #eeebf3;
   cursor: pointer;
   flex-basis: 0;
   flex-grow: 1;
   white-space: nowrap;
}

.response.selected {
   border-color: #3b82f6
}

.response.valid {
   background-color: #228B224f;
}

.response.invalid {
   background-color: #d9534f4f;
}

.sequence-buttons {
   width: 100%;
   border-top: solid 1px #eaeaea;
   padding: 20px 26px;
}

.answer-input.valid {
   border: solid 2px #228B22;
   background-color: #228B2214;
}

.answer-input.invalid {
   border: solid 2px #d9534f;
   background-color: #d9534f14;
}
</style>