<template>
   <!-- Si le quiz n'est pas démarré, on affiche une page d'attente -->
   <wait-teacher v-if="waiting" :sequence-id="sequenceId" />

   <!-- Si le quiz est démarré, la question est affichée -->
   <render-question v-else :sequence-id="sequenceId" :question="question" :last-question="lastQuestion"
                    :can-submit="canSubmit" :mode="mode" />
</template>

<script>
import { useRoute } from "vue-router";
import SocketioService from "@/services/socketio.service";
import router from "@/router";
import { useToast } from "vue-toastification";
import WaitTeacher from "@/components/Sequences/Student/WaitTeacher.vue";
import RenderQuestion from "@/components/Sequences/Student/RenderQuestion.vue";

export default {
   name: "JoinSequenceView",
   components: { RenderQuestion, WaitTeacher },
   setup() {
      const toast = useToast();
      return { toast };
   },
   created() {
      const route = useRoute();

      // Connexion au socket
      SocketioService.setupSocketConnection();

      // Creation de la room
      SocketioService.joinRoom(route.params.id);

      // Ajouts des events
      SocketioService.socket.on("error", this.onError);
      SocketioService.socket.on("renderQuestion", this.onRenderQuestion);
      SocketioService.socket.on("renderSubmitButton", this.onRenderSubmitButton);
      SocketioService.socket.on("renderSequenceEnd", this.onRenderSequenceEnd);
   },
   data: function() {
      return {
         waiting: true,
         question: null,
         mode: "sequence",
         lastQuestion: false,
         canSubmit: true
      };
   },
   computed: {
      sequenceId: function() {
         return this.$route.params.id.toString();
      }
   },
   methods: {
      /**
       * Gère les erreurs en affichant un message d'erreur et en redirigeant l'utilisateur vers la page d'accueil.
       * @param {string} error - Le message d'erreur à afficher.
       * @returns {void}
       */
      onError(error) {
         this.toast.error(error);
         router.push("/");
      },

      /**
       * Met à jour les données de l'interface utilisateur en fonction de la question rendue.
       * @param {object} params - Les paramètres contenant la question à afficher, le mode d'affichage et un indicateur indiquant si c'est la dernière question.
       * @param {string} params.question - La question à afficher.
       * @param {string} params.mode - Le mode d'affichage de la question.
       * @param {boolean} params.last - Un indicateur indiquant si c'est la dernière question.
       * @returns {void}
       */
      onRenderQuestion({ question, mode, last }) {
         this.waiting = false;
         this.question = question;
         this.mode = mode;
         this.lastQuestion = last;
         this.canSubmit = true;
      },

      /**
       * Met à jour l'état du bouton de soumission en fonction de la possibilité de soumettre la réponse.
       * @param {boolean} canSubmit - Un indicateur indiquant si l'utilisateur peut soumettre sa réponse.
       * @returns {void}
       */
      onRenderSubmitButton(canSubmit) {
         this.canSubmit = canSubmit;
      },

      /**
       * Gère la fin d'une séquence ou d'une question en affichant un message d'information et en redirigeant l'utilisateur vers la page d'accueil.
       * @returns {void}
       */
      onRenderSequenceEnd() {
         this.toast.info("La " + (this.mode === "sequence" ? "séquence" : "question") + " #" + this.$route.params.id + " est terminée");
         router.push("/");
      }
   },
   unmounted() {
      // Déconnexion du socket
      SocketioService.disconnect();
   }
};
</script>

<style scoped>

</style>