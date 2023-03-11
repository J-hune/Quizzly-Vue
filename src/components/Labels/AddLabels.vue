<template>
   <span class="mr-8 text-2xl font-semibold">Ajouter une étiquette</span>
   <p>Vous pouvez ajouter une étiquette existante ou en créer une nouvelle.</p>

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

      <!-- Génération des questions avec un v-bind for -->
      <div class="custom-flex">
         <a v-for="label in labels" :key="label.id"
            class="px-4 py-1 rounded-md cursor-pointer" @click="emitEvent(label)"
            :style="{backgroundColor: `#${label.couleur}`, color: getContrast(`#${label.couleur}`)}">
            {{ label.nom }}</a>
      </div>
   </div>

   <p class="mt-3">Si vous souhaitez modifier ou supprimer une étiquette, vous pouvez aller dans
      <span class="text-blue-600 cursor-pointer" @click="redirectLabels"><strong>Mes étiquettes</strong></span>
   </p>
</template>

<script>
import { fetchData } from "@/functions/fetch";
import { useToast } from "vue-toastification";
import router from "@/router";

export default {
   name: "AddLabelsComponent",
   emits: ["addLabel"],
   data: function() {
      return {
         allowCreate: false,
         search: "",
         color: "#a56cc1",
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
      getContrast: function(hexcolor) {
         // Fonction de Brian Suda trouvée sur cet article :
         // https://24ways.org/2010/calculating-color-contrast
         let red = parseInt(hexcolor.substring(1, 3), 16);
         let green = parseInt(hexcolor.substring(3, 5), 16);
         let blue = parseInt(hexcolor.substring(5, 7), 16);
         let yiq = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
         return (yiq >= 128) ? "black" : "white";
      },
      emitEvent: function(label) {
         // On émet un event qui sera catch par le parent
         this.$emit("addLabel", label);
      },
      createLabel: async function() {
         const couleur = this.color.slice(1);

         // Fetch API pour ajouter l'étiquette en base de donnée
         const { data } = await fetchData("/labels/addLabel/" + this.search + "/" + couleur);
         if (data.success) {
            this.toast.success("L'étiquette " + this.search + " a été ajoutée");
         } else {
            this.toast.error("L'étiquette n'a pas pu être ajoutée");
         }

         // On émet un event qui sera catch par le parent
         this.$emit("addLabel", [this.search.trim(), couleur]);
         this.allLabels.push([this.search.trim(), couleur]);
         this.search = "";
      },
      redirectLabels: function() {
         router.push("/labels")
      }
   },
   watch: {
      search: function(newString) {

         // On récupère tous les labels qui correspondent à la recherche
         const correspondLabels = this.allLabels.filter(e => e.nom.toLowerCase().includes(newString.trim().toLowerCase()));

         // On met à jour labels
         this.labels = correspondLabels;

         // On active/désactive le bouton pour créer une étiquette
         this.allowCreate = correspondLabels.length === 0;
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