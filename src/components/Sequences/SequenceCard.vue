<template>
   <div
     class="p-6 pb-4 rounded-lg border-2 border-gray-300 bg-white flex flex-col relative overflow-hidden cursor-pointer">

      <!-- Titre de la séquence -->
      <h2 class="text-2xl text-gray-900 mb-4 overflow-clip text-ellipsis whitespace-nowrap">
         {{ sequence.titre.trim() }}
      </h2>

      <!-- Liste des étiquettes présentes dans la séquence -->
      <div class="pb-4 border-b border-gray-200 flex-label">
         <a v-for="(label, labelIndex) in sequence.listeEtiquettes" :key="label.nom"
            class="px-3 py-1 rounded-md mx-0.5"
            :style="{backgroundColor: `#${label.couleur}`, color: getContrast(`#${label.couleur}`)}"
            :class="{ 'ml-0': labelIndex === 0,  'mr-0': labelIndex === sequence.listeEtiquettes.length -1 }">
            {{ label.nom }}</a>
      </div>

      <!-- Nombre de questions dans la séquence -->
      <p class="text-xs text-gray-500 mt-3 text-right">{{ sequence.questions.length }} question(s)</p>
   </div>
</template>

<script>
import { getContrast } from "@/functions/profile";

export default {
   name: "SequenceCard",
   props: { sequence: Object },
   methods: { getContrast }
};
</script>

<style scoped>
.flex-label {
   display: flex;
   flex-flow: row wrap;
   gap: 8px 1px;
   -webkit-user-select: none;
   -moz-user-select: none;
   user-select: none;
   align-items: center;
}
</style>