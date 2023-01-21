<template>
   <!-- Block Principal -->
   <div class="px-16 pt-10 w-full">
      <div class="mb-6">

         <!-- Titre de la page -->
         <div class="flex flex-col w-full mb-10 py-1">
            <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Créer un QCM</h1>
            <p class="leading-relaxed text-base">Les questions que vous avez déjà créées sont affichées sur la
               droite.<br>
               Faites les glisser sur la gauche pour les ajouter au sujet.</p>
         </div>


         <!-- Titre du QCM -->
         <h2 class="mb-2 text-xl font-medium text-gray-900">Titre du Sujet :</h2>
         <input type="text" v-model="title"
                class="w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Écrivez le titre du Sujet..." />
      </div>

      <draggable-questions :selected-questions="selectedQuestions" :all-questions="allQuestions" />
   </div>

   <!-- Bouton Impression -->
   <div class="save">
      <button
        class="relative ml-auto mt-5 mr-6 mb-5 bg-blue-500 hover:bg-blue-700 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-25 right-0" @click="print"
        :disabled="!title || selectedQuestions.length <= 0">
         Imprimer le QCM
      </button>
   </div>

   <!-- "Popup" Modal permettant de selectionner et de créer des étiquettes -->
   <modal-component v-model="show" width="60%">
      <template v-slot:content>
         <render-questions :title="title" :questions="selectedQuestions" />
      </template>
   </modal-component>
</template>

<script>
import DraggableQuestions from "@/components/draggableQuestions.vue";
import { fetchData } from "@/functions/fetch";
import RenderQuestions from "@/components/RenderQuestions.vue";
import ModalComponent from "@/components/ModalComponent.vue";

export default {
   name: "NewQcm",
   components: { ModalComponent, RenderQuestions, DraggableQuestions },
   data() {
      return {
         title: "",
         selectedQuestions: [],
         allQuestions: [],
         show: false
      };
   },
   methods: {
      print: function() {
         this.show = true;
      }
   },
   async created() {
      const { data } = await fetchData("/questions/getQuestions/");
      this.allQuestions = data;
   }
};
</script>

<style>
.markdown-body {
   padding: 0 30px 5px 30px;
}

.save {
   width: 100%;
   display: inline-flex;
   border-top: solid 1px #eaeaea;
}
</style>