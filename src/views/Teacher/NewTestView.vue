<template>
   <!-- Block Principal -->
  <div class="page-print px-7 md:px-16 pt-10 w-full">
    <div class="mb-6">

      <!-- Titre de la page -->
      <div class="flex flex-col w-full mb-10 py-1">
        <h1 class="sm:text-3xl text-2xl font-semibold title-font mb-4 text-gray-900">Créer une évaluation</h1>
        <p class="leading-relaxed text-base">Il existe deux types d'évaluations que vous pouvez créer : les quiz et
          les contrôles.<br>
          Les quiz sont des listes de questions que vous pouvez choisir et organiser dans l'ordre que vous
          souhaitez.<br>
          Les contrôles, quant à eux, sont générés de manière aléatoire en fonction des paramètres que vous
          choisissez.</p>
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

    <!-- On montre tous les types d'évaluations disponibles (pour l'instant QCM et Contrôle) -->
    <switch-button class="mb-4" :response-type="testType"
                   :types="[{id: 0, name:'Sujet de QCM'}, {id: 1, name:'Sujet de Contrôle'}, {id: 2, name:'Sujet de Contrôle Anonyme'} ]"
                   @update="(type) => testType = type" />

    <!-- Dans le cas où c'est un QCM -->
    <p v-if="testType === 0" class="mb-6">Les questions que vous avez déjà créées sont affichées sur la
      <span class="cursor-pointer" @click="openLink('gauche')">gauche.</span><br>
      Faites les glisser sur la
      <span class="cursor-pointer" @click="openLink('droite')">droite</span>
      pour les ajouter au sujet.</p>
    <draggable-questions v-if="testType === 0" :selected-questions="selectedQuestions"
                         :all-questions="allQuestions" />

    <!-- Dans le cas où c'est un Contrôle -->
    <test-settings v-else class="mt-6 mb-10" :labels="testLabels" :questions="allQuestions"
                   @updateLabels="(labels) => this.testLabels = labels" :size="testSize"
                   @updateSize="(size) => this.testSize = size"
                   @update-question-size="size => this.testQuestionSize = size" :question-size="testQuestionSize"
                   @update-group-questions-setting="setting => this.groupQuestions = setting"
                   @update-labels-order-setting="setting => this.keepLabelsOrder = setting" />
  </div>

   <!-- Bouton Impression -->
  <div class="save">
    <button
      class="relative ml-auto mt-5 mr-6 mb-5 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-40 right-0" @click="print"
      :disabled="!canSave()">
      Imprimer l'évaluation
    </button>
  </div>

   <!-- "Popup" qui apparait uniquement si on print -->
  <render-qcm v-if="testType === 0" :title="renderTitle" :questions="renderQuestions" />
  <render-test v-else :type="testType" :title="renderTitle" :tests="renderTests" />
</template>

<script>
import DraggableQuestions from "@/components/Questions/draggableQuestions.vue";
import { fetchData } from "@/functions/fetch";
import RenderQcm from "@/components/Tests/RenderQcm.vue";
import SwitchButton from "@/components/SwitchButton.vue";
import TestSettings from "@/components/Tests/TestSettings.vue";
import { nextTick } from "vue";
import RenderTest from "@/components/Tests/RenderTest.vue";
import { useToast } from "vue-toastification";

export default {
   name: "NewTest",
   components: { RenderTest, TestSettings, SwitchButton, RenderQcm, DraggableQuestions },
   setup() {
      const toast = useToast();
      return { toast };
   },
   data() {
      return {
         title: "",
         testType: 1,
         testSize: 1,
         testQuestionSize: 1,
         testLabels: [],
         selectedQuestions: [],
         allQuestions: [],
         renderTitle: "",
         renderQuestions: [],
         renderTests: [],
         keepLabelsOrder: false,
         groupQuestions: true
      };
   },
   methods: {
      /**
       * Affiche les questions sélectionnées et le titre dans la vue d'impression.
       */
      print: async function() {
         if (this.testType === 0) {
            this.renderQuestions = this.selectedQuestions;
            this.renderTitle = this.title;

            // On attend le tick suivant pour que renderQuestions et renderTitle = soient à jour
            await nextTick();
            window.print();
         } else {
            const response = await fetch(process.env.VUE_APP_API_URL + "/api/evaluations/generateEvaluations", {
               method: "POST",
               mode: "cors",
               credentials: "include",
               headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({
                  size: this.testSize,
                  questionSize: this.testQuestionSize,
                  groupQuestions: this.groupQuestions,
                  keepLabelsOrder: this.groupQuestions ? this.keepLabelsOrder : false,
                  labels: this.testLabels
               })
            });

            const data = await response.json();

            this.renderTests = data.map(e => e.map(f => this.allQuestions.find(g => g.id === f)));
            this.renderTitle = this.title;

            const rangeQuestions = this.testLabels.reduce((accumulator, currentValue) => {
               return [
                  accumulator[0] + currentValue.range.value[0],
                  accumulator[1] + currentValue.range.value[1]
               ];
            }, [0, 0]);

            if (this.testQuestionSize < rangeQuestions[0] || this.testQuestionSize > rangeQuestions[1]) {
               return this.toast.error("Le nombre de questions dans le sujet doit être entre " + rangeQuestions[0] + " et " + rangeQuestions[1]);
            }

            // On attend le tick suivant pour que renderQuestions et renderTitle = soient à jour
            nextTick(() => {
               window.print();
            });
         }
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
      },

      /**
       * Vérifie si l'évaluation peut être imprimée
       * @returns {boolean} Vrai si l'évaluation peut être imprimée, faux sinon
       */
      canSave: function() {
         if (this.testType === 0) return !!this.title && this.selectedQuestions.length > 0;
         else return !isNaN(this.testSize) && !!this.title && this.testLabels.length > 0;
      }
   },
   async created() {
      const { data } = await fetchData("/questions/getQuestions/");
      this.allQuestions = data;
   }
};
</script>

<style scoped>
@media print {
    .page-print {
        display: none;
    }
}
</style>

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