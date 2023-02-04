<template>
   <redirect-back back="Liste des Etiquettes" />

   <div class="px-7 md:px-16 pt-10 pb-14 w-full">

      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-12 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Vos Questions</h1>
         <p class="leading-relaxed text-base">Les questions que vous avez déjà créées sont affichées ci-dessous.<br>
            Cliquez sur une question pour la modifier et/ou modifier les réponses qui lui sont associées.</p>
      </div>

      <!-- input Search -->
      <input type="text" v-model="search"
             class="w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 mb-5
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Filtrer par énoncé... (ex: Quelle est...)" />

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-5">

         <!-- Pour chaque question -->
         <div class="w-full" v-for="question in matchingQuestions" :key="question.id">
            <question-card @click="redirectEdit(question.id)" :question="question" />
         </div>

         <!-- Div button permettant d'ajouter une question (push router) -->
         <div class="w-full">
            <div class="new-question h-full p-6 pb-4 rounded-lg flex flex-col relative cursor-pointer"
                 @click="redirectQuestionCreation">
               <svg class="svg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M836 476H548V188c0-19.8-16.2-36-36-36s-36 16.2-36 36v288H188c-19.8 0-36 16.2-36 36s16.2 36 36 36h288v288c0 19.8 16.2 36 36 36s36-16.2 36-36V548h288c19.8 0 36-16.2 36-36s-16.2-36-36-36z" />
               </svg>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import router from "@/router";
import { fetchData } from "@/functions/fetch";
import { useRoute } from "vue-router";
import RedirectBack from "@/components/redirectBack";
import QuestionCard from "@/components/Questions/Question.vue";

export default {
   name: "ListeQuestions",
   components: { QuestionCard, RedirectBack },
   methods: {
      redirectQuestionCreation: function() {
         router.push("/newQuestion");
      },
      redirectEdit: function(id) {
         router.push(`/question/${id}/edit`);
      }
   },
   data: function() {
      return {
         questions: [],
         search: ""
      };
   },
   async created() {
      const route = useRoute();
      const { data } = await fetchData("/questions/getQuestions/" + route.params.label);
      this.questions = data;
   },
   computed: {
      matchingQuestions() {
         return this.questions.filter(e => e.enonce.toLowerCase().includes(this.search.trim().toLowerCase()));
      }
   }
};
</script>

<style scoped>
.new-question {
   border-color: #a6acec;
   border-style: dashed;
   border-width: 2px;
   place-content: center;
   align-items: center;
}

.new-question svg {
   width: 60px;
   fill: #a6acec;
}
</style>