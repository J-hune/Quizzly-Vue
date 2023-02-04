<template>
   <!-- Affichage des questions -->
   <div class="grid grid-cols-1 lg:grid-cols-2 w-full mb-12 py-1 gap-6">

      <!-- Container Questions Disponibles -->
      <div class="w-full flex flex-col">

         <!-- input Search -->
         <input type="text" v-model="search"
                class="w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 mb-5
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Filtrer par étiquette... (ex: javascript)" />

         <!-- Questions Disponibles -->
         <div class="w-full h-full card-list">
            <div v-if="searchQuestions.length ===0">
               Aucune Question ne correspond à votre recherche
            </div>
            <draggable
              class="list-group"
              :list="searchQuestions"
              group="questions"
              itemKey="searchQuestions"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
            >
               <template #item="{ element }">
                  <question-card :question="element" />
               </template>
            </draggable>
         </div>
      </div>

      <!-- Questions Sélectionnées -->
      <div class="w-full pb-14 card-list">
         <draggable
           class="list-group"
           :list="selectedQuestions"
           group="questions"
           itemKey="selectedQuestions"
           v-bind="dragOptions"
           @start="drag = true"
           @end="drag = false"
         >
            <template #item="{ element }">
               <question-card :question="element" />
            </template>
         </draggable>
      </div>
   </div>
</template>

<script>
import QuestionCard from "@/components/Questions/Question.vue";
import draggable from "vuedraggable";
import { toRaw } from "vue";

export default {
   name: "draggableQuestions",
   props: ["selectedQuestions", "allQuestions"],
   data: function() {
      return {
         search: "",
         drag: false
      };
   },
   components: { QuestionCard, draggable },
   computed: {
      searchQuestions: function() {
         const allQuestions = toRaw(this.allQuestions);
         return allQuestions.filter(e => e.etiquettes.find(f => f.nom.toLowerCase().includes(this.search.toLowerCase())));
      },
      dragOptions() {
         return {
            animation: 200,
            group: "description",
            disabled: false,
            ghostClass: "ghost-card"
         };
      }
   }
};
</script>

<style scoped>
.card-list {
   background-color: #eeebf3;
   border-radius: 10px;
   padding: 14px;
}

.list-group {
   display: flex;
   flex-direction: column;
   gap: 12px;
   height: 100%;
}

.ghost-card {
   opacity: 0.5;
   border-color: #a6acec;
}
</style>