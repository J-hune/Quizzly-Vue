<template>
   <wait-teacher v-if="waiting" :sequence-id="sequenceId" />
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
      onError(error) {
         this.toast.error(error);
         router.push("/");
      },
      onRenderQuestion({ question, mode, last }) {
         this.waiting = false;
         this.question = question;
         this.mode = mode;
         this.lastQuestion = last;
         this.canSubmit = true;
      },
      onRenderSubmitButton(canSubmit) {
         this.canSubmit = canSubmit;
      },
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