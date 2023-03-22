<template>
   <span class="mr-8 text-2xl font-semibold">Ajouter une étiquette</span>
   <p>Vous pouvez créer une nouvelle étiquette. Celle-ci doit avoir un nom unique.</p>

   <div class="mt-4 mb-2">

      <div class="mb-6 sm:mb-4 sm:flex sm:flex-row">
         <div class="w-full flex flex-row">
            <!-- Input de recherche (avec vmodel et watch) -->
            <input type="text" v-model="search"
                   class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                   placeholder="Rerchercher ou créer une étiquette..." />

            <!-- Input de Couleur (avec vmodel) -->
            <div class="ml-1 input-color-container">
               <input type="color" class="input-color" v-model="color" />
            </div>
         </div>
         <button
           class="sm:ml-4 mt-2 sm:mt-0 w-full sm:w-min bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-25"
           :disabled="!allowCreate" @click="createLabel">
            Créer
         </button>
      </div>

      <!-- Génération des étiquettes avec un v-bind for -->
      <div class="custom-flex">
         <a v-for="label in labels" :key="label.id"
            class="px-4 py-1 rounded-md"
            :style="{backgroundColor: `#${label.couleur}`, color: getContrast(`#${label.couleur}`)}">
            {{ label.nom }}</a>
      </div>
   </div>
</template>

<script>
import { fetchData } from "@/functions/fetch";
import { useToast } from "vue-toastification";
import { getContrast } from "@/functions/profile";

export default {
   name: "AddLabelsWithoutClick",
   emits: ["addLabel"],
   props: { allLabels: Array },
   data: function() {
      return {
         allowCreate: false,
         search: "",
         color: "#a56cc1",
         labels: this.allLabels
      };
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   methods: {
      getContrast,

      /**
       * Ajoute une nouvelle étiquette dans la base de données via une requête asynchrone
       * @async
       * @function createLabel
       * @returns {void}
       */
      createLabel: async function() {
         // Récupère la couleur de l'étiquette (sans le "#" initial)
         const couleur = this.color.slice(1);

         // Requête pour ajouter l'étiquette en base de données
         const { data } = await fetchData("/labels/addLabel/" + this.search + "/" + couleur);

         if (data.success) {
            this.toast.success("L'étiquette " + this.search + " a été ajoutée");

            // On émet un événement avec l'étiquette ajoutée qui sera capté par le parent
            this.$emit("addLabel", { nom: this.search.trim(), couleur: couleur, id: data.id });
         } else {
            this.toast.error("L'étiquette n'a pas pu être ajoutée");
         }

         this.search = "";
      }
   },
   watch: {
      search: function(newString) {

         // On récupère tous les labels qui correspondent à la recherche
         // On met à jour labels
         this.labels = this.allLabels.filter(e => e.nom.toLowerCase().includes(newString.trim().toLowerCase()));

         // On active/désactive le bouton pour créer une étiquette
         this.allowCreate = !this.allLabels.find(e => e.nom.toLowerCase() === newString.trim().toLowerCase());
      },
      allLabels: function() {
         // On récupère tous les labels qui correspondent à la recherche
         // On met à jour labels
         this.labels = this.allLabels.filter(e => e.nom.toLowerCase().includes(this.search.trim().toLowerCase()));

         // On active/désactive le bouton pour créer une étiquette
         this.allowCreate = !this.allLabels.find(e => e.nom.toLowerCase() === this.search.trim().toLowerCase());
      }
   }
};
</script>

<style scoped>
.custom-flex {
   display: flex;
   flex-flow: row wrap;
   gap: 8px 5px;
   user-select: none;
}

.input-color-container {
   position: relative;
   overflow: hidden;
   width: 50px;
   border: solid 2px #e5e7f9;
   border-radius: 10px;
}

.input-color {
   position: absolute;
   right: -8px;
   top: -8px;
   width: 56px;
   height: 56px;
   border: none;
}
</style>