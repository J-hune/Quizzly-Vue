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
            <!-- On utilise data: uniqueResponse -->
            <switch-button class="mb-6" :response-type="question.type"
                           :types="[{id: 1, name:'Réponse unique'}, {id: 0, name:'Réponses multiples'}, {id: 2, name:'Réponse libre'}]"
                           @update="onChildUpdate" />


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

         <!-- "Popup" Modal permettant de sélectionner et de créer des étiquettes -->
         <modal-component v-model="show">
            <template v-slot:content>
               <add-labels-component @add-label="addLabel" />
            </template>
         </modal-component>

         <!-- Rendu html de l'énonce -->
         <div class="w-full xl:w-1/2 pl-10 markdown-body">
            <div v-for="(objectToRender, key) in html" :key="key">
               <div v-html="objectToRender" />
            </div>
         </div>

      </div>

   </div>

   <!-- Boutons de sauvegarde et de diffusion -->
   <div class="question-buttons sm:flex">
      <div class="flex gap-2 sm:gap-3 sm:mr-6">
         <button
           class="relative w-full sm:w-fit bg-purple-400 hover:bg-purple-500 text-white
        font-bold py-2 px-7 rounded-lg" @click="startQuestion">
            Diffuser la question
         </button>
      </div>

      <div class="mt-4 sm:mt-0 sm:flex ml-auto">
         <button
           class="relative w-full sm:w-auto sm:mr-3 mt-2 sm:mt-0 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-7 rounded-lg right-0"
           @click="remove">
            Supprimer la Question
         </button>

         <button
           class="relative w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-7 rounded-lg right-0 disabled:opacity-40"
           @click="save" :disabled="!canSave()">
            Enregistrer les modifications
         </button>
      </div>
   </div>
</template>

<script>
import { useRoute } from "vue-router";
import mermaid from "mermaid";
import { useToast } from "vue-toastification";

import { fetchData } from "@/functions/fetch";
import { TextToHtml } from "@/functions/textTohtml";
import { editQuestion, removeQuestion } from "@/functions/questions";

import RedirectBack from "@/components/redirectBack";
import ModalComponent from "@/components/ModalComponent";
import AddLabelsComponent from "@/components/Labels/AddLabels.vue";
import SwitchButton from "@/components/SwitchButton.vue";
import MultipleResponses from "@/components/Questions/multipleResponses.vue";
import UniqueResponse from "@/components/Questions/uniqueResponse.vue";
import router from "@/router";
import { getContrast } from "@/functions/profile";
import OpenEndedResponse from "@/components/Questions/openEndedResponse.vue";

export default {
   name: "EditQuestion",
   components: {
      OpenEndedResponse,
      UniqueResponse,
      MultipleResponses,
      SwitchButton,
      AddLabelsComponent,
      ModalComponent,
      RedirectBack
   },
   data: function() {
      return {
         question: Object,
         labels: [],
         show: false,
         html: []
      };
   },
   mounted() {
      mermaid.initialize({});
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   async created() {
      const route = useRoute();
      const { data } = await fetchData("/questions/getQuestion/" + route.params.id);
      const { data: allLabels } = await fetchData("/labels/getLabels");
      this.labels = allLabels;
      this.question = data;
   },
   methods: {
      getContrast,

      /**
       * Ajoute une étiquette à la question courante.
       * @param {Object} label - L'étiquette à ajouter.
       */
      addLabel: function(label) {
         // Vérification des doublons et ajout de l'étiquette
         if (!this.question.etiquettes.find(e => e.id === label.id)) {
            this.question.etiquettes.push(label);
         }

         this.show = false;
      },

      /**
       * Supprime l'étiquette donnée de la question courante.
       * @param {Object} label - L'objet étiquette à supprimer.
       */
      removeLabel: function(label) {
         // On supprime l'étiquette de this.question.etiquettes
         this.question.etiquettes = this.question.etiquettes.filter(e => e.id !== label);
      },

      /**
       * Vérifie si la question courante peut être enregistrée.
       * @return {Boolean} True si la question peut être enregistrée, False sinon.
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
       * Enregistre la question courante en appelant la fonction d'ajout de question de l'API.
       * Affiche un message de succès ou d'erreur en fonction du résultat de la requête.
       */
      save: function() {
         // Appel de l'API pour ajouter la séquence
         editQuestion(this.question, (data) => {
            if (data.success) this.toast.success("La question a été modifiée");
            else this.toast.error("Une erreur a eu lieu lors de la modification de la question");
         });
      },

      /**
       * Supprime la question courante en appelant la fonction de suppression de question de l'API.
       * Affiche un message de succès ou d'erreur en fonction du résultat de la requête.
       * Redirige vers la page précédente en cas de succès.
       */
      remove: function() {
         removeQuestion(this.question, (data) => {
            if (data.success) {
               this.toast.success("La question a été supprimée");
               router.back();
            } else {
               this.toast.error("Une erreur a eu lieu lors de la suppression de la question");
            }
         });
      },

      /**
       * Redirige vers la page de démarrage de la question courante.
       */
      startQuestion: function() {
         router.push("/question/" + this.$route.params.id + "/start");
      },

      /**
       * Met à jour le type de la question courante en fonction de la nouvelle valeur.
       * @param {Boolean} newValue - La nouvelle valeur du type.
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

.question-buttons {
   width: 100%;
   padding: 20px 26px;
   text-align: right;
   margin-top: 3.5rem;
   border-top: solid 1px #eaeaea;
}
</style>