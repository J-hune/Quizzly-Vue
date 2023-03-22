<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">
      <div class="mb-6">

         <!-- Titre de la page -->
         <div class="flex flex-col w-full mb-10 py-1">
            <h1 class="sm:text-3xl text-2xl font-semibold title-font mb-4 text-gray-900">Créer un QCM</h1>
            <p class="leading-relaxed text-base">Les questions que vous avez déjà créées sont affichées sur la
               <span class="cursor-pointer" @click="openLink('gauche')">gauche.</span>.<br>
               Faites les glisser sur la
               <span class="cursor-pointer" @click="openLink('droite')">droite</span>
               pour les ajouter au sujet.</p>
         </div>


         <!-- Titre du QCM -->
         <h2 class="mb-2 text-xl font-medium text-gray-900">Titre du Sujet :</h2>
         <input type="text" v-model="title" @keyup.enter="print"
                class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Écrivez le titre du Sujet..." />
      </div>

      <hr class="mt-7 mb-8" />

      <draggable-questions :selected-questions="selectedQuestions" :all-questions="allQuestions" />
   </div>

   <!-- Bouton Impression -->
   <div class="save">
      <button
        class="relative ml-auto mt-5 mr-6 mb-5 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-40 right-0" @click="print"
        :disabled="!title || selectedQuestions.length <= 0">
         Imprimer le QCM
      </button>
   </div>

   <!-- "Popup" Modal permettant de selectionner et de créer des étiquettes -->
   <modal-component v-model="show" classes="w-10/12 md:w-5/6 lg:w-2/3 xl:w-1/2">
      <template v-slot:content>
         <render-questions :title="renderTitle" :questions="renderQuestions" />
      </template>
   </modal-component>
</template>

<script>
import DraggableQuestions from "@/components/Questions/draggableQuestions.vue";
import { fetchData } from "@/functions/fetch";
import RenderQuestions from "@/components/Questions/RenderQuestions.vue";
import ModalComponent from "@/components/ModalComponent.vue";

export default {
   name: "NewQcm",
   components: { ModalComponent, RenderQuestions, DraggableQuestions },
   data() {
      return {
         title: "",
         selectedQuestions: [],
         allQuestions: [],
         show: false,
         renderTitle: "",
         renderQuestions: []
      };
   },
   methods: {
      /**
       * Affiche les questions sélectionnées et le titre dans la vue d'impression.
       */
      print: function() {
         if (!this.title || this.selectedQuestions.length <= 0) return;
         this.show = true;
         this.renderQuestions = this.selectedQuestions;
         this.renderTitle = this.title;
      },

      /**
       * Ouvre un lien aléatoire depuis une liste de liens en fonction du côté choisi.
       * Il s'agit d'un "on ne doit pas prononcer le nom"
       * @param {string} side - Le côté du lien (gauche ou droite).
       */
      openLink: function(side) {
         // Liste des liens à choisir aléatoirement
         const links = {
            droite: [
               "https://fr.wikipedia.org/wiki/Droite_(math%C3%A9matiques)",
               "https://fr.wikipedia.org/wiki/Droite_(politique)"
            ],
            gauche: ["https://fr.wikipedia.org/wiki/Gauche_(politique)"]
         };

         // Générer un nombre aléatoire entre 0 et la longueur de la liste des liens
         let randomIndex = Math.floor(Math.random() * links[side].length);

         // Ouvrir une nouvelle fenêtre avec l'URL aléatoire
         window.open(links[side][randomIndex], "_blank");
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

@media (max-width: 1280px) {
   .markdown-body {
      min-height: 72px;
   }
}

.save {
   width: 100%;
   display: inline-flex;
   border-top: solid 1px #eaeaea;
}
</style>