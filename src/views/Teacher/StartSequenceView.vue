<template>
   <wait-students v-if="waiting" :sequence-id="sequenceId" :students="students" @startSequence="startSequence" />
   <render-question v-if="question" :students="students" :question="question" :statements="statements"
                    :sequence-id="sequenceId" :lastQuestion="lastQuestion" />
</template>

<script>
import SocketioService from "@/services/socketio.service";
import { useRoute } from "vue-router";
import WaitStudents from "@/components/Sequences/Teacher/WaitStudents.vue";
import RenderQuestion from "@/components/Sequences/Teacher/RenderQuestion.vue";
import router from "@/router";
import { useToast } from "vue-toastification";

export default {
   name: "StartSequenceView",
   components: { RenderQuestion, WaitStudents },
   data: function() {
      return {
         waiting: true,
         sequenceId: null,
         question: null,
         students: [],
         statements: [],
         lastQuestion: false
      };
   },
   watch: {
      question: {
         immediate: true,
         handler(val) {
            if (!val || !this.question) return;

            // À chaque question, on prépare les réponses des étudiants
            if (this.question.type === 0) this.statements = val.reponses.map(response => ({
               id: response.id,
               count: 0
            }));
            else this.statements = [];
         }
      }
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   created() {
      const route = useRoute();

      // Connexion au socket
      SocketioService.setupSocketConnection();

      // Creation de la room
      SocketioService.createRoom(route.params.id);

      // Ajouts des events
      SocketioService.socket.on("error", this.onError);
      SocketioService.socket.on("renderSequenceInit", this.onRenderSequenceInit);
      SocketioService.socket.on("renderQuestion", this.onRenderQuestion);
      SocketioService.socket.on("renderNewResponse", this.onRenderNewResponse);
      SocketioService.socket.on("renderStudentList", this.onRenderStudentList);
   },
   methods: {
      onError(error) {
         this.toast.error(error);
         router.push("/sequences");
      },
      onRenderSequenceInit(sequenceId) {
         this.sequenceId = sequenceId;
      },
      onRenderStudentList(studentList) {
         this.students = studentList.map(e => e.nom);
      },
      onRenderQuestion({ question, last }) {
         this.waiting = false;
         this.question = question;
         this.lastQuestion = last;
      },
      onRenderNewResponse(answer) {
         if (this.question.type === 0) {
            const statement = this.statements.find((el) => el.id === answer);
            statement.count++;
         } else {
            this.statements.push(answer);
         }
      },
      startSequence() {
         SocketioService.nextQuestion();
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