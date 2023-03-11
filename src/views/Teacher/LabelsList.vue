<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 py-12 w-full">

      <!-- Titre et explications -->
      <div class="flex flex-col w-full py-1 mb-6">
         <h1 class="sm:text-3xl text-2xl font-semibold title-font mb-4 text-gray-900">Mes Etiquettes</h1>
         <p class="leading-relaxed text-base">Les étiquettes que vous avez créées ou associées à vos
            questions sont affichées ci-dessous.<br>
            Cliquez sur une étiquette pour la modifier ou la supprimer.</p>
      </div>

      <!-- input Search -->
      <input type="text" v-model="search"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Filtrer par nom d'étiquette... (ex: Algorithmie...)" />

      <button @click="showAddLabel = true"
              class="mt-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-7 rounded-lg">
         Créer une nouvelle Etiquette
      </button>

      <hr class="mt-8 mb-8" />

      <!-- Si l'utilisateur a au moins une étiquette -->
      <div class="label-flex" v-if="labels.length">
         <div v-for="label in matchingLabels" :key="label.id"
              class="cursor-pointer" @click="labelToEdit = label; showEditLabel = true">
            <div class="h-full flex items-center border-l-8 border-2 py-2 px-10 rounded-lg"
                 :style="{borderColor: `#${label.couleur}`}">
               <div class="flex-grow">
                  <h2 class="text-gray-900 title-font text-xl text-center">{{ label.nom }}</h2>
               </div>
            </div>
         </div>
      </div>

      <!-- Si l'utilisateur n'a pas créé d'étiquette -->
      <div v-else>
         Vous n'avez pas encore créé d'étiquette, cliquez sur
         <strong><span class="text-blue-600 cursor-pointer" @click="showAddLabel = true">
            Créer une nouvelle Etiquette
         </span></strong>
         pour en créer une !
      </div>

      <div v-if="labels.length && !matchingLabels.length">
         Aucune étiquette ne correspond à votre recherche
      </div>

      <!-- "Popup" Modal permettant de créer des étiquettes -->
      <modal-component v-model="showAddLabel">
         <template v-slot:content>
            <add-labels-without-click @add-label="addLabel" />
         </template>
      </modal-component>

      <!-- "Popup" Modal permettant de modifier ou supprimer l'étiquette -->
      <modal-component v-model="showEditLabel">
         <template v-slot:content>
            <edit-label v-if="labelToEdit" :label="labelToEdit" @edit-label="editLabel" @remove-label="removeLabel" />
         </template>
      </modal-component>

   </div>
</template>

<script>
import { fetchData } from "@/functions/fetch";
import ModalComponent from "@/components/ModalComponent.vue";
import AddLabelsWithoutClick from "@/components/Labels/AddLabelsWithoutClick.vue";
import EditLabel from "@/components/Labels/EditLabel.vue";

// Fonction tri en utilisant le tri-rapide de JS
function sortArray(array) {
   return array.sort((a, b) => a.nom.localeCompare(b.nom));
}

export default {
   name: "LabelsList",
   components: { EditLabel, AddLabelsWithoutClick, ModalComponent },
   data: function() {
      return {
         labels: [],
         search: "",
         labelToEdit: null,
         showAddLabel: false,
         showEditLabel: false
      };
   },
   computed: {
      matchingLabels() {
         return this.labels.filter(e => e.nom.toLowerCase().includes(this.search.trim().toLowerCase()));
      }
   },
   methods: {
      addLabel: function(label) {

         // On ajoute l'étiquette à this.labels
         this.labels.push(label);
         this.showAddLabel = false;
      },
      editLabel: function(label) {

         // On parcourt this.labels pour modifier l'étiquette
         this.labels = this.labels.map(e => {
            if (e.id === label.id) return label;
            else return e;
         });
      },
      removeLabel: function(labelId) {

         // On parcourt this.labels pour supprimer l'étiquette
         this.labels = this.labels.filter(e => e.id !== labelId)
      }
   },
   async created() {
      // Récupération des étiquettes et stockage dans data
      const { data } = await fetchData("/labels/getLabels");
      this.labels = sortArray(data);
   }
};
</script>

<style scoped>
a {
   color: #6366F1;
}

.label-flex {
   display: flex;
   flex-flow: row wrap;
   gap: 8px 8px;
   -webkit-user-select: none;
   -moz-user-select: none;
   user-select: none;
   align-items: center;
}
</style>
