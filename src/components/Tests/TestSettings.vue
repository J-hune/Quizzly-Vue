<template>
   <div class="mt-6">
      <div class="sm:flex mb-6">

         <h2 class="mb-2 mr-0 sm:mr-4 sm:mb-0 text-xl font-medium text-gray-900">Nombre de sujets à générer :</h2>
         <input type="number" :value="size" @input="updateSize"
                class="w-full sm:w-fit text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Nombre de sujets..."/>
      </div>
      <hr class="mb-6">

      <!-- Pour chaque etiquette sélectionnée -->
      <div class="label-container mt-2 mb-5 sm:w-3/4" v-for="label in labels" :key="label.id">

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
      <a class="px-4 py-1 rounded-md add-label cursor-pointer" @click="show = true">Ajouter une étiquette au sujet</a>

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
   emits: ["updateLabels", "updateSize"],
   props: { labels: Array, size: Number, questions: Array },
   data: function() {
      return {
         show: false
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


      updateSize: function(event) {
         this.$emit("updateSize", parseInt(event.target.value));
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