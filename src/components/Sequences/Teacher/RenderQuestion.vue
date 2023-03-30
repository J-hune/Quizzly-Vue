<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">

      <!-- Mot de passe de la séquence -->
      <h2 class="text-center font-bold text-2xl leading-10">
         Mot de passe de la {{ mode === "sequence" ? "séquence" : "question" }}:
         <span class="password" v-if="sequenceId">{{ sequenceId }}</span>
         <span class="password" v-else>********</span>
      </h2>

      <div v-if="displayQuestion" class="question-statement">

         <!-- Énoncé de la question (rendu html) -->
         <div v-html="renderMarkdown(question.enonce)" />
      </div>

      <!-- Affichage de la ou des réponse(s) -->
      <div v-if="displayResponses" class="question-responses">
         <multiple-responses v-if="question.type === 0" :responses="question.reponses"
                             :students="students.length" :studentsAnswers="statements" />
         <numeric-responses v-else-if="question.type === 1" :students="students.length" :studentsAnswers="statements" />
         <open-ended-responses v-else-if="question.type === 2" :studentsAnswers="statements" />
      </div>

      <div class="flex justify-between">
         <p v-if="displayResponses" class="cursor-pointer mt-3 text-blue-600 font-semibold select-none"
            :class="{ 'cursor-no-drop opacity-40': question.type === 2}"
            @click="askCorrection">Afficher la correction</p>

         <p v-if="displayResponses" class="cursor-pointer mt-3 text-blue-600 font-semibold select-none"
            @click="askStopResponses">Stopper les réponses</p>
      </div>

   </div>

   <!-- Boutons -->
   <div class="sequence-buttons mt-10 text-right sm:flex">

      <!-- Affichage et son -->
      <div class="flex gap-2 sm:gap-3">
         <button
           class="relative w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 sm:px-7 rounded-lg right-0"
           :class="!displayQuestion && 'bg-cyan-800'" @click="displayQuestion = !displayQuestion">
            Question
         </button>
         <button
           class="relative w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 sm:px-7 rounded-lg right-0"
           :class="!displayResponses && 'bg-cyan-800'" @click="displayResponses = !displayResponses">
            Réponses
         </button>
         <div class="flex items-center">
            <button
              class="relative flex items-center justify-center h-full w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-3 rounded-lg right-0"
              @click="toggleSound">
               <vue-feather size="20" class="w-max" :type="sound ? 'volume-x': 'volume-2'" />
            </button>
         </div>
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
import { renderMarkdown } from "@/functions/textTohtml";
import MultipleResponses from "@/components/Sequences/Teacher/Responses/MultipleResponses.vue";
import Swal from "sweetalert2";
import router from "@/router";
import SocketioService from "@/services/socketio.service";
import NumericResponses from "@/components/Sequences/Teacher/Responses/NumericResponses.vue";
import { useToast } from "vue-toastification";
import OpenEndedResponses from "@/components/Sequences/Teacher/Responses/OpenEndedResponses.vue";
import teacher_answer_stop from "@/assets/sounds/teacher_answer_stop.mp3";
import teacher_waiting_start from "@/assets/sounds/teacher_waiting_start.mp3";
import teacher_waiting_loop from "@/assets/sounds/teacher_waiting_loop.mp3";
import { Gapless5 } from "@regosen/gapless-5";

export default {
   name: "RenderQuestion",
   components: { OpenEndedResponses, NumericResponses, MultipleResponses },
   props: {
      sequenceId: String,
      question: Object,
      statements: Array,
      students: Array,
      lastQuestion: Boolean,
      mode: String
   },
   data: function() {
      return {
         displayQuestion: true,
         displayResponses: true,

         gapless: null,
         gaplessLoop: null,
         sound: true
      };
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   mounted() {
      this.startLoop();
   },
   unmounted() {
      if (this.gapless) this.gapless.stop();
      if (this.gaplessLoop) this.gaplessLoop.stop();
   },
   methods: {
      renderMarkdown,

      /**
       * Affiche une boîte de dialogue demandant confirmation avant de quitter le quiz.
       * Si l'utilisateur confirme, il est redirigé vers la page des séquences.
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
               await router.push(this.mode === "sequence" ? "/sequences" : "/");
            }
         });
      },

      /**
       * Demande au service Socket.io de demander la correction de la question en cours.
       */
      askCorrection() {
         // On prépare le son, quand il sera joué, il coupera tous les autres
         const teacherAnswerStop = new Gapless5({
            exclusive: true,
            volume: this.sound ? 0.5 : 0
         });
         teacherAnswerStop.addTrack(teacher_answer_stop);

         if (this.question.type === 2) return;
         SocketioService.askCorrection();

         // On joue le son
         teacherAnswerStop.play();
         this.gapless = teacherAnswerStop;

      },

      /**
       * Demande au service Socket.io de stopper les réponses et affiche une notification.
       */
      askStopResponses() {
         // On prépare le son, quand il sera joué, il coupera tous les autres
         const teacherAnswerStop = new Gapless5({
            exclusive: true,
            volume: this.sound ? 0.5 : 0
         });
         teacherAnswerStop.addTrack(teacher_answer_stop);

         SocketioService.askStopResponses();
         this.toast.info("Aucune nouvelle réponse ne sera acceptée");

         // On joue le son
         teacherAnswerStop.play();
         this.gapless = teacherAnswerStop;
      },

      /**
       * Gère le clic sur le bouton de réponse.
       * Si la question en cours est la dernière question, appelle endOfSequence().
       * Sinon, appelle nextQuestion().
       */
      handleClick() {
         if (this.lastQuestion) this.endOfSequence();
         else this.nextQuestion();
      },

      /**
       * Demande au service Socket.io de passer à la question suivante.
       */
      nextQuestion() {
         SocketioService.nextQuestion();
         this.startLoop();
      },

      /**
       * Termine la séquence en cours en déconnectant le service Socket.io, en redirigeant l'utilisateur
       * vers la page des séquences et en affichant une notification.
       */
      endOfSequence() {
         SocketioService.disconnect();
         router.push("/sequences");
         this.toast.info("La séquence #" + this.sequenceId + " est terminée");
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

         // Si la loop est en cours, on réduit son volume

         if (!this.sound) {
            if (this.gaplessLoop) this.gaplessLoop.setVolume(0);
            if (this.gapless) this.gapless.setVolume(0);
         } else {
            if (this.gaplessLoop) this.gaplessLoop.setVolume(0.5);
            if (this.gapless) this.gapless.setVolume(0.5);
         }
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
         const teacherWaitingStart = new Gapless5({ volume: this.sound ? 0.5 : 0 });
         const teacherWaitingLoop = new Gapless5({ loop: true, volume: this.sound ? 0.5 : 0 });

         teacherWaitingStart.addTrack(teacher_waiting_start);
         teacherWaitingLoop.addTrack(teacher_waiting_loop);

         // On lance la première partie du son
         teacherWaitingStart.play();
         this.gapless = teacherWaitingStart;

         // Dès que la première partie du son est finie on lance la deuxième en boucle
         // On garde aussi l'objet pour pouvoir le stopper (unmounted)
         teacherWaitingStart.onfinishedall = () => {
            teacherWaitingLoop.play();
            this.gaplessLoop = teacherWaitingLoop;
         };
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