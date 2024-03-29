<template>
   <div class="px-7 md:px-16 pt-10 pb-14 w-full">

      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-12 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Mes Questions</h1>
         <p class="leading-relaxed text-base">Les questions que vous avez déjà créées sont affichées ci-dessous.<br>
            Cliquez sur une question pour la modifier et/ou modifier les réponses qui lui sont associées.</p>
      </div>

      <!-- Champ de recherche par étiquette ou par énoncé -->
      <input type="text" v-model="search"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Filtrer par étiquette ou par énoncé... (ex: Quelle est...)" />

      <!-- Bouton pour créer une question (redirection) -->
      <button @click="redirectQuestionCreation"
              class="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-7 rounded-lg">
         Créer une nouvelle Question
      </button>

      <hr class="mt-8 mb-8" />
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
import QuestionCard from "@/components/Questions/QuestionCard.vue";

export default {
   name: "QuestionsList",
   components: { QuestionCard },
   methods: {
      /**
       * Redirige vers la page de création d'une nouvelle question.
       */
      redirectQuestionCreation: function() {
         router.push("/newQuestion");
      },

      /**
       * Redirige vers la page d'édition d'une question existante.
       * @param {number} id - L'identifiant de la question à éditer.
       */
      redirectEdit: function(id) {
         // On utilise l'identifiant de la question pour construire l'URL de la page d'édition correspondante.
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
      const { data } = await fetchData("/questions/getQuestions/");
      this.questions = data;
   },
   computed: {
      matchingQuestions() {
         const search = this.search.trim().toLowerCase()
         return this.questions.filter(obj => obj.etiquettes.some(etiq => etiq.nom.toLowerCase().includes(search)) || obj.enonce.toLowerCase().includes(search));
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