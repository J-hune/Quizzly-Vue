<template>
   <redirect-back back="Liste des Etiquettes"/>
   <div class="px-16 pt-10 pb-14 w-full">
      <div class="flex flex-col w-full mb-12 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Vos Questions</h1>
         <p class="leading-relaxed text-base">Les questions que vous avez déjà créées sont affichées ci-dessous.<br>
            Cliquez sur une question pour la modifier et/ou modifier les réponses qui lui sont associées.</p>
      </div>


      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-5">
         <div class="w-full" v-for="question in questions" :key="question.id">
            <div
              class="h-full p-6 pb-4 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden cursor-pointer"
              @click="redirectEdit(question.id)">
               <h2 class="text-2xl text-gray-900 mb-4 leading-none overflow-clip text-ellipsis whitespace-nowrap">
                  {{ question.enonce }}</h2>
               <div class="pb-4 border-b border-gray-200 grid-label">
                  <a v-for="(label, labelIndex) in question.etiquette" :key="label.nom"
                     class="px-3 py-1 rounded-md mx-0.5"
                     :style="{backgroundColor: `#${label.couleur}`}"
                     :class="{ 'ml-0': labelIndex === 0,  'mr-0': labelIndex === question.etiquette.length -1 }">
                     {{ label.nom }}</a>
               </div>
               <p class="text-xs text-gray-500 mt-3 text-right">{{ question.reponses?.length }} réponse(s)</p>
            </div>
         </div>
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

export default {
   name: "QuestionsView",
   components: { RedirectBack },
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
         questions: []
      };
   },
   async created() {
      const route = useRoute();
      const { data } = await fetchData("/questions/getQuestions/" + route.params.label);
      for (let question of data) {
         this.questions.push(question);
      }
   }
};
</script>

<style scoped>
.new-question {
   border-color: #9698F6;
   border-style: dashed;
   border-width: 2px;
   place-content: center;
   align-items: center;
}

.new-question svg {
   width: 60px;
   fill: #9698f6;
}

.grid-label {
   display: grid;
   grid-template-columns: fit-content(100%) fit-content(100%) 1fr;
}
</style>