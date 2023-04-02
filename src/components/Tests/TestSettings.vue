<template>
  <div class="mt-6">

    <!-- Pour chaque etiquette sélectionnée -->
    <div class="label-container mb-5 sm:w-3/4" v-for="label in labels" :key="label.id">

      <!-- Etiquette avec nom et couleur -->
      <a @click="removeLabel(label.id)"
         class="px-4 py-0.5 rounded-md cursor-no-drop border-2 whitespace-nowrap"
         :style="{backgroundColor: `#${label.couleur}`, borderColor: `#${label.couleur}`, color: getContrast(`#${label.couleur}`)}">
        {{ label.nom }}
      </a>

      <!-- Input type range avec min et max calculés -->
      <slider class="ml-8 sm:ml-16 w-full slider-quizzly" :min="label.range.min" :max="label.range.max"
              v-model="label.range.value" :step="1" />
    </div>

    <!-- Bouton pour ajouter de nouvelles étiquettes -->
    <a class="px-4 py-1 rounded-md add-label cursor-pointer select-none" @click="show = true">
      Ajouter une étiquette au sujet
    </a>


    <hr class="my-8">

    <!-- Paramètres du sujet -->
    <div class="2xl:flex lg:gap-8">
      <div>
        <!-- Paramètre: Mélange des questions dans le sujet -->
        <div class="flex flex-row mb-2">
          <div class="self-center mr-3">
            <label class="relative inline-flex align-middle cursor-pointer">
              <input type="checkbox" value="" class="sr-only peer outline-none"
                     v-model="groupQuestions">
              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
                             after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                             after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <h2 class="text-lg">Les questions sont regroupées par étiquettes</h2>
        </div>

        <!-- Paramètre: Conservation de l'ordre des étiquettes -->
        <div v-if="groupQuestions" class="flex flex-row mb-2">
          <div class="self-center mr-3">
            <label class="relative inline-flex align-middle cursor-pointer">
              <input type="checkbox" value="" class="sr-only peer outline-none"
                     v-model="keepLabelsOrder">
              <div class="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
                             after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5
                             after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <h2 class="text-lg">L'ordre des étiquettes est conservé</h2>
        </div>
      </div>


      <hr class="mt-8 mb-8">

      <div>
        <!-- Paramètre: Nombre de sujets à créer -->
        <div class="sm:flex mb-4">

          <h2 class="mb-2 mr-0 sm:mr-4 sm:mb-0 text-lg">Nombre de sujets à générer :</h2>
          <input type="number" :value="size" @input="updateSize"
                 class="w-full sm:w-fit text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   px-3 leading-8 transition-colors duration-150 ease-in-out"
                 placeholder="Nombre de sujets..." />
        </div>


        <!-- Paramètre: Nombre de questions dans chaque sujet -->
        <div class="sm:flex mb-6">
          <h2 class="mb-2 mr-0 sm:mr-4 sm:mb-0 text-lg">Nombre de questions dans le sujet
            :</h2>
          <input type="number" :value="questionSize" @input="updateQuestionSize"
                 class="w-full sm:w-fit text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   px-3 leading-8 transition-colors duration-150 ease-in-out"
                 placeholder="Nombre de questions..." />
        </div>

      </div>
    </div>

    <!-- "Popup" Modal permettant de selectionner et de créer des étiquettes -->
    <modal-component v-model="show">
      <template v-slot:content>
        <add-labels @add-label="addLabel" />
      </template>
    </modal-component>
  </div>
</template>

<script>
import ModalComponent from "@/components/ModalComponent.vue";
import AddLabels from "@/components/Labels/AddLabels.vue";
import { useToast } from "vue-toastification";
import { getContrast } from "@/functions/profile";
import Slider from "@vueform/slider";

export default {
   name: "TestSettings",
   components: { ModalComponent, AddLabels, Slider },
   emits: ["updateLabels", "updateSize", "updateQuestionSize", "updateLabelsOrderSetting", "updateGroupQuestionsSetting"],
   props: { labels: Array, size: Number, questions: Array, questionSize: Number },
   data: function() {
      return {
         show: false,
         keepLabelsOrder: false,
         groupQuestions: true
      };
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   methods: {
      getContrast,

      /**
       * Ajout d'une étiquette (avec modification du parent)
       *
       * @param label
       */
      addLabel: function(label) {
         this.show = false;
         if (this.labels.find(e => e.id === label.id)) return;

         // On compte le nombre de questions liées à l'étiquette
         const labelQuestionsSize = this.questions.filter(e => e.etiquettes.find(f => f.id === label.id)).length;

         // Si l'étiquette est déjà dans la liste on return, sinon on émet la nouvelle liste
         if (labelQuestionsSize < 1) return this.toast.warning("Aucune question n'est liée à cette étiquette");
         this.$emit("updateLabels", [...this.labels, {
            ...label,
            range: { min: 1, max: labelQuestionsSize, value: [1, labelQuestionsSize] }
         }]);
      },

      /**
       * Suppression d'une étiquette (avec modification du parent)
       *
       * @param label
       */
      removeLabel: function(label) {
         // On supprime l'étiquette de this.labels
         this.$emit("updateLabels", this.labels.filter(e => e.id !== label));
      },

      /**
       * Modification du nombre de sujets à générer
       *
       * @param event
       */
      updateSize: function(event) {
         this.$emit("updateSize", parseInt(event.target.value));
      },

      /**
       * Modification du nombre de questions dans le sujet
       *
       * @param event
       */
      updateQuestionSize: function(event) {
         this.$emit("updateQuestionSize", parseInt(event.target.value));
      }
   },
   watch: {
      keepLabelsOrder: function(newValue) {
         this.$emit("updateLabelsOrderSetting", newValue);
      },

      groupQuestions: function(newValue) {
         this.$emit("updateGroupQuestionsSetting", newValue);
      }
   }
};
</script>

<style src="@vueform/slider/themes/default.css"></style>
<style scoped>
.add-label {
    border: solid 2px #a56cc1;
}

.label-container {
    border: solid 2px #d0c8dd;
    padding: 36px 26px 12px 12px;
    border-radius: 10px;
    display: flex;
    align-items: baseline;
}

.slider-quizzly {
    --slider-connect-bg: #A6ACEC;
    --slider-tooltip-bg: #A56CC1;
    --slider-handle-ring-color: rgba(165, 108, 193, 0.10);
}
</style>