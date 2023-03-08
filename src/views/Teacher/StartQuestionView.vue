<template>
   <wait-students v-if="waiting" :sequence-id="questionId" :students="students" :mode="mode" @startSequence="startSequence" />
   <render-question v-if="question" :students="students" :question="question" :statements="statements"
                    :sequence-id="questionId" :lastQuestion="lastQuestion" :mode="mode" />
</template>

<script>
import SocketioService from "@/services/socketio.service";
import { useRoute } from "vue-router";
import WaitStudents from "@/components/Sequences/Teacher/WaitStudents.vue";
import RenderQuestion from "@/components/Sequences/Teacher/RenderQuestion.vue";
import router from "@/router";
import { useToast } from "vue-toastification";

export default {
   name: "StartQuestionView",
   components: { RenderQuestion, WaitStudents },
   data: function() {
      return {
         waiting: true,
         questionId: null,
         question: null,
         students: [],
         statements: [],
         lastQuestion: false,
         mode: "question"
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
      SocketioService.createRoomQuestion(route.params.id);

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
         router.push("/");
      },
      onRenderSequenceInit(questionId) {
         this.questionId = questionId;
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