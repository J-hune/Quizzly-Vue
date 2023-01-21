<template>
   <span class="mr-8 text-2xl font-bold">Ajouter une étiquette</span>
   <p>Vous pouvez ajouter une étiquette existante ou en créer une nouvelle.</p>

   <div class="mt-4 mb-2">

      <div class="mb-4 flex flex-row">

         <!-- Input de recherche (avec vmodel et watch) -->
         <input type="text" v-model="search"
                class="w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Rerchercher ou créer une étiquette..." />

         <!-- Input de Couleur (avec vmodel) -->
         <div class="ml-1 input-color-container">
            <input type="color" class="input-color" v-model="color" />
         </div>
         <button
           class="ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-25"
           :disabled="!allowCreate" @click="createLabel">
            Créer
         </button>
      </div>

      <!-- Génération des questions avec un v-bind for -->
      <div class="custom-flex">
         <a v-for="(label, labelIndex) in labels" :key="labelIndex"
            class="px-4 py-1 rounded-md cursor-pointer" @click="emitEvent(label)"
            :style="{backgroundColor: `#${label[1]}`, color: getConstrast(`#${label[1]}`)}">
            {{ label[0] }}</a>
      </div>
   </div>
</template>

<script>
import { fetchData } from "@/functions/fetch";
import { toRaw } from "vue";
import { useToast } from "vue-toastification";

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
      const { data } = await fetchData("/labels/getAllLabels");
      this.labels = data;
      this.allLabels = data;
   },
   methods: {
      getConstrast: function(hexcolor) {
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
         this.$emit("addLabel", toRaw(label));
      },
      createLabel: async function() {
         const couleur = toRaw(this.color).slice(1);
         const nom = toRaw(this.search);

         // Fetch API pour ajouter l'étiquette en base de donnée
         const { data } = await fetchData("/labels/addLabel/" + nom + "/" + couleur);
         if (data.success) {
            this.toast.success("L'étiquette " + nom + " a été ajoutée");
         } else {
            this.toast.error("L'étiquette n'a pas pu être ajoutée");
         }

         // On émet un event qui sera catch par le parent
         this.$emit("addLabel", [nom.trim(), couleur]);
         this.allLabels.push([nom.trim(), couleur]);
         this.search = "";
      }
   },
   watch: {
      "search": {
         handler: function(newString) {
            const searchString = toRaw(newString);
            const allLabels = toRaw(this.allLabels);

            // On récupère tous les labels qui correspondent à la recherche
            const correspondLabels = allLabels.filter(e => e[0].includes(searchString.trim()));

            // On met à jour labels
            this.labels = correspondLabels;

            // On active/désactive le bouton pour créer une étiquette
            this.allowCreate = correspondLabels.length === 0;
         }
      }
   }
};
</script>

<style>
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