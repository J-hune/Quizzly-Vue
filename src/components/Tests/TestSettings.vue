<template>
   <div>

      <!-- Pour chaque etiquette sélectionnée -->
      <div class="flex mb-5 items-center sm:w-3/4" v-for="label in labels" :key="label.id">

         <!-- Etiquette avec nom et couleur -->
         <a @click="removeLabel(label.id)"
            class="px-4 py-0.5 rounded-md cursor-no-drop border-2"
            :style="{backgroundColor: `#${label.couleur}`, borderColor: `#${label.couleur}`, color: getContrast(`#${label.couleur}`)}">
            {{ label.nom }}
         </a>

         {{ label.range }}
         <!-- Input type range avec min et max calculés -->
         <input type="number" :min="label.range.min" :value="label.minValue">
      </div>

      <!-- Bouton pour ajouter de nouvelles étiquettes -->
      <a class="px-3 py-0.5 rounded-md add-label cursor-pointer" @click="show = true">Ajouter une Etiquette au sujet</a>

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

export default {
   name: "TestSettings",
   components: { ModalComponent, AddLabels },
   emits: ["updateLabels"],
   props: { labels: Array, questions: Array },
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
      addLabel: function(label) {
         this.show = false;
         if (this.labels.find(e => e.id === label.id)) return;

         // On compte le nombre de questions liées à l'étiquette
         const labelQuestionsSize = this.questions.filter(e => e.etiquettes.find(f => f.id === label.id)).length;

         // Si l'étiquette est déjà dans la liste on return, sinon on émet la nouvelle liste
         if (labelQuestionsSize < 1) return this.toast.warning("Aucune question n'est liée à cette étiquette");
         this.$emit("updateLabels", [...this.labels, {
            ...label,
            range: { min: 1, max: labelQuestionsSize, minValue: 1, maxValue: labelQuestionsSize }
         }]);
      },


      removeLabel: function(label) {
         // On supprime l'étiquette de this.labels
         this.$emit("updateLabels", this.labels.filter(e => e.id !== label));
      },


      editLabel: function(values, label) {

         // On cherche l'étiquette dans le tableau
         let labelObject = this.labels.find(e => e.id === label.id);

         // On modifie sa valeur et on emit le nouveau tableau
         labelObject.range.minValue = parseInt(values.minValue);
         labelObject.range.maxValue = parseInt(values.maxValue);
         this.$emit("updateLabels", this.labels);
      }
   }
};
</script>

<style scoped>
.add-label {
   border: solid 2px #a56cc1;
}

</style>