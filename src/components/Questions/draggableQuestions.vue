<template>
   <!-- Affichage des questions -->
   <div class="grid grid-cols-1 lg:grid-cols-2 w-full mb-12 py-1 gap-6">

      <!-- Container Questions Disponibles -->
      <div class="w-full flex flex-col">

         <!-- Champ de recherche par étiquette -->
         <input type="text" v-model="search"
                class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 mb-5
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   text-gray-700 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Filtrer par étiquette... (ex: javascript)" />

         <!-- Questions Disponibles -->
         <div class="w-full h-full card-list">
            <div class="m-3" v-if="searchQuestions.length ===0">
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
                  <question-card style="min-height: 169px" :question="element" />
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
               <question-card style="min-height: 169px" :question="element" />
            </template>
         </draggable>
      </div>
   </div>
</template>

<script>
import QuestionCard from "@/components/Questions/QuestionCard.vue";
import draggable from "vuedraggable";

export default {
   name: "draggableQuestions",
   components: { QuestionCard, draggable },
   props: { selectedQuestions: Object, allQuestions: Object },
   data: function() {
      return {
         search: "",
         drag: false
      };
   },
   computed: {
      searchQuestions: function() {
         const allQuestions = this.allQuestions;
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
   min-height: 50px;
}

.list-group {
   display: flex;
   flex-direction: column;
   gap: 12px;
   height: 100%;
   max-height: 532px;
   overflow-y: auto;
   margin: 14px;
   padding-right: 6px;
   scrollbar-width: thin;
   scrollbar-color: #CDCDCD #f9f9f9;
}

.list-group::-webkit-scrollbar {
   width: 8px;
}

/* Track */
.list-group::-webkit-scrollbar-track {
   background: #f9f9f9;
}

/* Handle */
.list-group::-webkit-scrollbar-thumb {
   background: #CDCDCD;
}

/* Handle on hover */
.list-group::-webkit-scrollbar-thumb:hover {
   background: #A6A6A6;
}

.ghost-card {
   opacity: 0.5;
   border-color: #a6acec;
}
</style>