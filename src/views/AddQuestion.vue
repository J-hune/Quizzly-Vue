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
                         class="enonce p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                         focus:ring-indigo-200 focus:border-blue-500 focus:ring-2 outline-none
                         transition-colors duration-150 ease-in-out"
                         placeholder="Écrivez l'énoncé de la question..." />
            </div>

            <hr class="mb-8" />
            <!-- Switch entre Réponse unique et Réponses Multiples -->
            <!-- On utilise data: uniqueResponse -->
            <switch-button class="mb-6" :unique-response="uniqueResponse" @update="onChildUpdate" />

            <!-- Titre et Liste d'inputs (Réponses) -->
            <div class="mb-6">
               <multiple-responses v-if="!uniqueResponse" :responses="question.reponses" />
               <unique-response v-else v-model="question.reponse" />
            </div>

            <h2 class="text-xl font-medium text-gray-900 mb-2">Associer des étiquettes :</h2>

            <!-- Génération des étiquettes avec un v-bind for -->
            <div class="custom-flex">
               <a v-for="label in question.etiquettes" :key="label.nom" @click="removeLabel(label.nom)"
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
        class="relative ml-auto mt-5 mr-6 mb-5 bg-blue-500 hover:bg-blue-700 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-25 right-0" @click="save"
        :disabled="!canSave()">
         Ajouter la question
      </button>
   </div>
</template>

<script>
import mermaid from "mermaid";
import { toRaw } from "vue";
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

export default {
   name: "AddQuestion",
   components: { UniqueResponse, MultipleResponses, SwitchButton, AddLabels, ModalComponent, RedirectBack },
   data: function() {
      return {
         question: {
            enonce: "",
            etiquettes: [],
            reponses: [{
               reponse: "",
               reponseJuste: false
            }],
            reponse: ""
         },
         labels: [],
         show: false,
         html: [],
         uniqueResponse: false
      };
   },
   mounted() {
      mermaid.initialize({});
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   methods: {
      getContrast: function(hexcolor) {
         // Fonction de Brian Suda trouvée sur cet article :
         // https://24ways.org/2010/calculating-color-contrast
         let red = parseInt(hexcolor.substring(1, 3), 16);
         let green = parseInt(hexcolor.substring(3, 5), 16);
         let blue = parseInt(hexcolor.substring(5, 7), 16);
         let yiq = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
         return (yiq >= 128) ? "black" : "white";
      },
      addLabel: function(label) {

         // Verification doublons et push
         let labels = toRaw(this.question.etiquettes);
         if (!labels.find(e => e.nom === label[0])) {
            this.question.etiquettes.push({ couleur: label[1], nom: label[0] });
         }

         this.show = false;
      },
      removeLabel: function(label) {

         // On supprime label de this.question.etiquettes
         const labels = toRaw(this.question.etiquettes);
         this.question.etiquettes = labels.filter(e => e.nom !== label);
      },
      canSave: function() {
         const Question = toRaw(this.question);

         if (!Question.enonce || !Question.etiquettes.length) return false;
         if (!this.uniqueResponse && !Question.reponses.find(e => e.reponse)) return false;
         if (this.uniqueResponse && (!Question.reponse || isNaN(parseInt(Question.reponse)))) return false;
         return true;
      },
      save: function() {
         const question = toRaw(this.question);
         addQuestion(question, (data) => {
            if (data.success) this.toast.success("La question a été ajoutée");
            else this.toast.error("Une erreur a eu lieu lors de l'ajout de la question");
         });
      },
      onChildUpdate: function(newValue) {
         this.uniqueResponse = newValue;
      }
   },
   watch: {
      "question": {
         // On met en place un watcher sur question pour ajouter ou supprimer des réponses
         handler: function(newQuestion) {
            const question = toRaw(newQuestion);

            // On met à jour html
            this.html = TextToHtml(question.enonce);

            // Si aucun contenu de réponse n'est vide
            if (!question?.reponses.find(e => !e.reponse.trim())) {
               this.question.reponses.push(
                 { "reponse": "", "reponseJuste": false }
               );
            } else {
               //S'il y a plus d'une réponse sans contenu
               if (question?.reponses.filter(e => !e.reponse.trim()).length > 1) {
                  let emptyRes = question.reponses.findIndex(e => !e.reponse);
                  this.question.reponses.splice(emptyRes, 1);
               }
            }
         },
         deep: true
      }
   },
   async created() {
      const { data: allLabels } = await fetchData("/labels/getAllLabels");
      this.labels = allLabels;
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