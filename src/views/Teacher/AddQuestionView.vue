<template>
   <!-- Router push back -->
   <redirect-back back="Liste des Questions" />

   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">
      <div class="flex flex-col xl:flex-row w-full mb-12 py-1">
         <div class="w-full xl:w-1/2 xl:pr-10 pb-14">
            <div class="mb-6">

               <!-- Titre et textArea (Question) -->
               <h2 class="mb-2 text-xl font-medium text-gray-900">Votre question :</h2>
               <textarea v-model="question.enonce" id="question" rows="3"
                         class="enonce p-2.5 w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                         focus:ring-indigo-200 focus:border-blue-500 focus:ring-2 outline-none
                         transition-colors duration-150 ease-in-out"
                         placeholder="Écrivez l'énoncé de la question..." />
            </div>

            <hr class="mb-8" />
            <!-- Switch entre Réponse unique et Réponses Multiples -->
            <!-- On utilise data: type -->
            <switch-button class="mb-6" :response-type="question.type" @update="onChildUpdate" />

            <!-- Titre et Liste d'inputs (Réponses) -->
            <div class="mb-6">
               <multiple-responses v-if="question.type === 0" :responses="question.reponses" />
               <unique-response v-else-if="question.type === 1" v-model="question.numerique" />
               <open-ended-response v-else />
            </div>

            <h2 class="text-xl font-medium text-gray-900 mb-2">Associer des étiquettes :</h2>

            <!-- Génération des étiquettes avec un v-bind for -->
            <div class="custom-flex">
               <a v-for="label in question.etiquettes" :key="label.id" @click="removeLabel(label.id)"
                  class="px-4 py-0.5 rounded-md cursor-no-drop border-2"
                  :style="{backgroundColor: `#${label.couleur}`, borderColor: `#${label.couleur}`, color: getContrast(`#${label.couleur}`)}">
                  {{ label.nom }}</a>
               <a class="px-3 py-0.5 rounded-md ajouter-etiquette cursor-pointer" @click="show = true">
                  Nouvelle Etiquette</a>
            </div>
         </div>

         <!-- "Popup" Modal permettant de selectionner et de créer des étiquettes -->
         <modal-component v-model="show">
            <template v-slot:content>
               <add-labels @add-label="addLabel" />
            </template>
         </modal-component>

         <div class="w-full xl:w-1/2 pl-10 markdown-body">
            <div v-for="(objectToRender, key) in html" :key="key">
               <div v-html="objectToRender" />
            </div>
         </div>

      </div>
   </div>

   <!-- Bouton sauvegarde -->
   <div class="save">
      <button
        class="relative ml-auto mt-5 mr-6 mb-5 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-40 right-0" @click="save"
        :disabled="!canSave()">
         Ajouter la question
      </button>
   </div>
</template>

<script>
import mermaid from "mermaid";
import { useToast } from "vue-toastification";

import { TextToHtml } from "@/functions/textTohtml";
import { addQuestion } from "@/functions/questions";
import { fetchData } from "@/functions/fetch";

import RedirectBack from "@/components/redirectBack";
import ModalComponent from "@/components/ModalComponent";
import AddLabels from "@/components/Labels/AddLabels.vue";
import SwitchButton from "@/components/SwitchButton.vue";
import MultipleResponses from "@/components/Questions/multipleResponses.vue";
import UniqueResponse from "@/components/Questions/uniqueResponse.vue";
import { getContrast } from "@/functions/profile";
import router from "@/router";
import OpenEndedResponse from "@/components/Questions/openEndedResponse.vue";

export default {
   name: "AddQuestion",
   components: {
      OpenEndedResponse,
      UniqueResponse,
      MultipleResponses,
      SwitchButton,
      AddLabels,
      ModalComponent,
      RedirectBack
   },
   data: function() {
      return {
         question: {
            enonce: "",
            etiquettes: [],
            reponses: [{
               reponse: "",
               reponseJuste: false
            }],
            type: 0,
            numerique: ""
         },
         labels: [],
         show: false,
         html: []
      };
   },

   setup() {
      const toast = useToast();
      return { toast };
   },
   async created() {
      const { data: allLabels } = await fetchData("/labels/getLabels");
      this.labels = allLabels;
   },
   mounted() {
      mermaid.initialize({});
   },
   methods: {
      getContrast,

      /**
       * Ajoute une étiquette à la liste d'étiquettes de la question.
       * @param {Object} label - L'étiquette à ajouter.
       */
      addLabel: function(label) {
         // Verification doublons et push
         if (!this.question.etiquettes.find(e => e.id === label.id)) {
            this.question.etiquettes.push(label);
         }

         this.show = false;
      },

      /**
       * Supprime une étiquette de la question.
       * @param {string} label - L'ID de l'étiquette à supprimer.
       */
      removeLabel: function(label) {
         // On supprime l'étiquette de this.question.etiquettes
         this.question.etiquettes = this.question.etiquettes.filter(e => e.id !== label);
      },

      /**
       * Vérifie si la question peut être sauvegardée
       * @returns {boolean} Vrai si la question peut être sauvegardée, faux sinon
       */
      canSave: function() {
         const Question = this.question;
         const regex = /^[-+]?\d+(\.\d{0,2}|)$/;

         if (!Question.enonce || !Question.etiquettes.length) return false;
         if (!Question.type && !Question.reponses.find(e => e.reponse)) return false;
         if (Question.type === 1 && (!Question.numerique || isNaN(parseInt(Question.numerique)))) return false;
         if (Question.type === 1 && !regex.test(Question.numerique)) return false;
         return true;
      },

      /**
       * Ajoute la question dans la base de données
       */
      save: function() {
         addQuestion(this.question, (data) => {
            if (data.success) {
               this.toast.success("La question a été ajoutée");
               router.push("/");
            } else this.toast.error("Une erreur a eu lieu lors de l'ajout de la question");
         });
      },

      /**
       * Met à jour le type de la question
       * @param {boolean} newValue La nouvelle valeur du type de la question
       */
      onChildUpdate: function(newValue) {
         this.question.type = newValue;
      }
   },
   watch: {
      "question": {
         // On met en place un watcher sur question pour ajouter ou supprimer des réponses
         handler: function(newQuestion) {

            // On met à jour html
            this.html = TextToHtml(newQuestion.enonce);

            // Si aucun contenu de réponse n'est vide
            if (!newQuestion?.reponses.find(e => !e.reponse.trim())) {
               this.question.reponses.push(
                 { "reponse": "", "reponseJuste": false }
               );
            } else {
               //S'il y a plus d'une réponse sans contenu
               if (newQuestion?.reponses.filter(e => !e.reponse.trim()).length > 1) {
                  let emptyRes = newQuestion.reponses.findIndex(e => !e.reponse);
                  this.question.reponses.splice(emptyRes, 1);
               }
            }
         },
         deep: true
      }
   }
};
</script>

<style scoped>
.enonce {
   min-height: 50px;
}

.ajouter-etiquette {
   border: solid 2px #a56cc1;
}

.custom-flex {
   display: flex;
   flex-flow: row wrap;
   gap: 8px 5px;
   user-select: none;
   align-items: center;
}

.save {
   width: 100%;
   display: inline-flex;
   border-top: solid 1px #eaeaea;
}
</style>