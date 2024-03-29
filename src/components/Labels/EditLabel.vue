<template>
   <span class="mr-8 text-2xl font-semibold">Modifier une étiquette</span>
   <p>Vous pouvez modifier l'étiquette ou la supprimer. Celle-ci doit avoir un nom unique.</p>

   <div class="mt-4 mb-2">

      <div class="mb-6 sm:mb-4 sm:flex sm:flex-row">
         <div class="w-full flex flex-row">
            <!-- Input de recherche (avec vmodel et watch) -->
            <input type="text" v-model="search"
                   class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                   placeholder="Nouveau nom de l'étiquette..." />

            <!-- Input de Couleur (avec vmodel) -->
            <div class="ml-1 input-color-container">
               <input type="color" class="input-color" v-model="color" />
            </div>
         </div>
         <button
           class="sm:ml-4 mt-2 sm:mt-0 w-full sm:w-min bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-25"
           :disabled="!allowCreate" @click="editLabel">
            Modifier
         </button>
      </div>

      <!-- Génération des labels avec un v-bind for -->
      <div class="custom-flex">
         <a v-for="label in labels" :key="label.id"
            class="px-4 py-1 rounded-md"
            :style="{backgroundColor: `#${label.couleur}`, color: getContrast(`#${label.couleur}`)}">
            {{ label.nom }}</a>
      </div>


   </div>
   <hr class="mt-6 mb-6">
   <div>
      <button @click="removeLabel"
              class="w-full sm:w-fit float-right bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-7 rounded-lg">
         Supprimer l'étiquette
      </button>
   </div>
</template>

<script>
import { fetchData } from "@/functions/fetch";
import { useToast } from "vue-toastification";
import { deleteLabel, editLabel } from "@/functions/labels";
import { getContrast } from "@/functions/profile";

export default {
   name: "EditLabel",
   emits: ["editLabel", "removeLabel"],
   props: {
      label: Object
   },
   data: function() {
      return {
         allowCreate: true,
         search: this.label.nom,
         color: "#" + this.label.couleur,
         allLabels: [],
         labels: []
      };
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   async created() {
      const { data } = await fetchData("/labels/getLabels");
      this.labels = data;
      this.allLabels = data;
   },
   methods: {
      getContrast,

      /**
       * Edite une étiquette existante.
       */
      editLabel: async function() {
         // Récupère la couleur de l'étiquette (sans le "#" initial)
         const couleur = this.color.slice(1);

         // Appelle l'API pour modifier l'étiquette en base de donnée
         await editLabel({ id: this.label.id, nom: this.search.trim(), couleur: couleur }, data => {

            if (data.success) {
               this.toast.success("L'étiquette " + this.search + " a été modifié");

               // Émet un événement pour notifier le parent que l'étiquette a été modifiée
               this.$emit("editLabel", { id: this.label.id, nom: this.search.trim(), couleur: couleur });

               // Met à jour la liste des étiquettes avec la nouvelle étiquette modifiée
               this.allLabels = this.allLabels.map(e => {
                  if (e.id === this.label.id) return { nom: this.search.trim(), couleur: couleur, id: data.id };
                  else return e;
               });
            } else {
               this.toast.error("L'étiquette n'a pas pu être modifiée");
            }
         });
      },

      /**
       * Supprime l'étiquette sélectionnée.
       */
      removeLabel: function() {

         // Appelle l'API pour supprimer l'étiquette de la base de données
         deleteLabel(this.label, this.toast, () => {
            // Émet un événement pour notifier le parent que l'étiquette a été supprimée
            this.$emit("removeLabel", this.label.id);

            // Met à jour la liste des étiquettes en retirant l'étiquette supprimée
            this.allLabels = this.allLabels.filter(e => e.id !== this.label.id);
         });
      }
   },
   watch: {
      label: function(newLabel) {
         this.search = newLabel.nom;
         this.color = "#" + newLabel.couleur;

         this.labels = this.allLabels.filter(e => e.id !== newLabel.id);
      },
      search: function(newString) {
         // On active/désactive le bouton pour créer une étiquette si le nom est déjà pris
         this.allowCreate = !this.allLabels.find(e => e.nom === newString) || newString === this.label.nom;
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