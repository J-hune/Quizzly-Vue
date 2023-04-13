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
         <div v-html="renderMarkdown(question.enonce)" />
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
            <div class="html-response" v-html="renderLightMarkdown(response.reponse)" />
         </div>
      </div>

      <!-- Affichage d'un input type number (cas Numérique) -->
      <p v-if="question.type === 1" class="mt-6 mb-3">Veuillez entrer votre réponse puis l'envoyer.</p>
      <input v-if="question.type === 1" type="number" v-model="answer" step=".01" @keyup.enter="handleClick"
             :class="{'valid': correction?.trim() === answer.toString(), 'invalid': correction && correction.trim() !== answer.toString() }"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-200 answer-input
             focus:border-indigo-200 focus:ring-2 outline-none py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Entrez votre réponse..." :disabled="!canSubmit" />

      <!-- Affichage d'un input type text (cas Réponse ouverte) -->
      <p v-if="question.type === 2" class="mt-6 mb-3">Veuillez entrer votre réponse puis l'envoyer.</p>
      <input v-if="question.type === 2" type="text" v-model="answer" @keyup.enter="handleClick"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 focus:ring-indigo-200 answer-input
             focus:border-indigo-200 focus:ring-2 outline-none py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Entrez votre réponse..." :disabled="!canSubmit" maxlength="100" />

   </div>

   <!-- Boutons -->
   <div class="sequence-buttons mt-10 text-right sm:flex">

      <!-- Son -->
      <div class="flex gap-2 sm:gap-3">
         <div class="flex items-center">
            <button
              class="relative flex items-center justify-center h-full w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-3 rounded-lg right-0"
              @click="toggleSound">
               <vue-feather size="20" class="w-max" :type="!sound ? 'volume-x': 'volume-2'" />
            </button>
         </div>
      </div>

      <!-- Autres boutons -->
      <div class="mt-8 sm:mt-0 sm:flex ml-auto">
         <button
           class="relative w-full sm:w-auto sm:mr-3 bg-red-500 hover:bg-red-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-40 right-0" @click="quitSequence">
            Quitter
         </button>
         <button
           class="relative w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-40 right-0"
           @click="handleClick" :disabled="!canSubmit || !answer">
            Envoyer la réponse
         </button>
      </div>
   </div>
</template>

<script>
import Swal from "sweetalert2";
import router from "@/router";
import { useToast } from "vue-toastification";
import { renderLightMarkdown, renderMarkdown } from "@/functions/textTohtml";
import SocketioService from "@/services/socketio.service";
import student_waiting_start from "@/assets/sounds/student_waiting_start.mp3";
import student_waiting_loop from "@/assets/sounds/student_waiting_loop.mp3";
import student_answer_sent from "@/assets/sounds/student_answer_sent.mp3";
import student_answer_valid from "@/assets/sounds/student_answer_valid.mp3";
import student_answer_invalid from "@/assets/sounds/student_answer_invalid.mp3";
import { Gapless5 } from "@regosen/gapless-5";

function reduceTexte(text) {
   if (text.length <= 100) {
      return text; // Retourne le texte tel quel s'il est déjà inférieur ou égal à 100 caractères
   } else {
      return text.slice(0, 97) + "..."; // Retourne les 97 premiers caractères suivis de "..." pour atteindre un total de 100 caractères
   }
}

export default {
   name: "RenderQuestion",
   data: function() {
      return {
         answer: this.question.type === 0 ? [] : "",
         correction: null,

         gapless: null,
         gaplessLoop: null,
         sound: localStorage.getItem("soundTLMVPSP") !== null ? JSON.parse(localStorage.soundTLMVPSP) : true
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
   mounted() {
      this.startLoop();
   },
   unmounted() {
      if (this.gapless) this.gapless.stop();
      if (this.gaplessLoop) this.gaplessLoop.stop();
   },
   methods: {
      renderLightMarkdown,
      renderMarkdown,

      /**
       * Affiche une boîte de dialogue demandant confirmation avant de quitter le quiz.
       * Si l'utilisateur confirme, il est redirigé vers la page d'accueil.
       */
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

      /**
       * Soumet la réponse de l'utilisateur à l'aide du service Socket.io.
       */
      handleClick: function() {

         // On prépare le son, quand il sera joué, il coupera tous les autres
         const studentAnswerSent = new Gapless5({
            exclusive: true,
            volume: this.sound ? 0.5 : 0
         });
         studentAnswerSent.addTrack(student_answer_sent);

         SocketioService.submitAnswer(reduceTexte(this.answer));

         // On joue le son
         studentAnswerSent.play();
      },

      /**
       * Bascule l'état de la réponse de l'utilisateur pour l'option avec l'ID donné.
       * Si l'option est déjà sélectionnée, elle est désélectionnée.
       * Sinon, elle est sélectionnée.
       * @param {number} id - L'ID de l'option à basculer.
       */
      toggleResponse: function(id) {
         if (!this.canSubmit) return;
         if (this.answer.includes(id)) this.answer = this.answer.filter(e => e !== id);
         else this.answer = [...this.answer, id];
      },

      /**
       * Met à jour l'état de la correction avec les données fournies.
       * @param {object} correction - Les données de la correction.
       */
      onRenderCorrection: function(correction) {
         const studentAnswerCheck = new Gapless5({
            exclusive: true,
            volume: this.sound ? 0.5 : 0
         });

         // Si c'était une question numérique
         if (this.question.type === 1) {
            if (correction?.trim() === this.answer.toString()) {
               studentAnswerCheck.addTrack(student_answer_valid);
            } else {
               studentAnswerCheck.addTrack(student_answer_invalid);
            }
         }

         // Si c'était une question à choix multiples
         else if (this.question.type === 0) {
            if (JSON.stringify(this.answer) === JSON.stringify(correction)) {
               studentAnswerCheck.addTrack(student_answer_valid);
            } else {
               studentAnswerCheck.addTrack(student_answer_invalid);
            }
         }

         this.correction = correction;
         studentAnswerCheck.play();
      },

      /**
       * Cette méthode arrête la boucle audio en cours (s'il y en a une) et prépare une nouvelle boucle audio
       * Le son est en deux parties, la première partie est jouée une seule fois et la deuxième parti est jouée en boucle.
       *
       */
      startLoop() {
         // On stoppe la loop actuelle
         if (this.gaplessLoop) this.gaplessLoop.stop();

         // On prépare la nouvelle loop
         const studentWaitingStart = new Gapless5({ volume: this.sound ? 0.5 : 0 });
         studentWaitingStart.addTrack(student_waiting_start);

         // On lance la première partie du son
         studentWaitingStart.play();
         this.gapless = studentWaitingStart;

         // Dès que la première partie du son est finie on lance la deuxième en boucle
         // On garde aussi l'objet pour pouvoir le stopper (unmounted)
         studentWaitingStart.onfinishedall = () => {

            // On lance la deuxième partie du son
            const studentWaitingLoop = new Gapless5({ loop: true, volume: this.sound ? 0.5 : 0 });
            studentWaitingLoop.addTrack(student_waiting_loop);

            studentWaitingLoop.play();
            this.gaplessLoop = studentWaitingLoop;
         };
      },

      /**
       * Cette méthode permet de basculer le son ON/OFF.
       * Si le son est désactivé, le volume de la boucle audio actuelle (s'il y en a une) est réduit à 0.
       * Si le son est réactivé, le volume de la boucle audio actuelle (s'il y en a une) est remis à 0.5.
       *
       */
      toggleSound() {
         // On désactive le lancement de nouveaux sons
         this.sound = !this.sound;
         localStorage.soundTLMVPSP = this.sound;

         // Si la loop est en cours, on réduit son volume
         if (!this.sound) {
            if (this.gaplessLoop) this.gaplessLoop.setVolume(0);
            if (this.gapless) this.gapless.setVolume(0);
         } else {
            if (this.gaplessLoop) this.gaplessLoop.setVolume(0.5);
            if (this.gapless) this.gapless.setVolume(0.5);
         }
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
         this.startLoop();
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