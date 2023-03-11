<template>
   <div
     class="p-6 pb-4 rounded-lg border-2 border-gray-300 bg-white flex flex-col relative overflow-hidden cursor-pointer">

      <!-- Énoncé de la question -->
      <h2 class="text-2xl text-gray-900 mb-4 overflow-clip text-ellipsis whitespace-nowrap">
         {{ question.enonce.trim() }}
      </h2>

      <!-- Etiquettes de la question -->
      <div class="pb-4 border-b border-gray-200 flex-label">
         <a v-for="(label, labelIndex) in question.etiquettes" :key="label.nom"
            class="px-3 py-1 rounded-md mx-0.5"
            :style="{backgroundColor: `#${label.couleur}`, color: getContrast(`#${label.couleur}`)}"
            :class="{ 'ml-0': labelIndex === 0,  'mr-0': labelIndex === question.etiquettes.length -1 }">
            {{ label.nom }}</a>
      </div>

      <!-- Information supplémentaires -->
      <p v-if="question.type === 1" class="text-xs text-gray-500 mt-3 text-right">réponse numérique</p>
      <p v-else class="text-xs text-gray-500 mt-3 text-right">{{ question.reponses.length }} réponse(s)</p>
   </div>
</template>

<script>
import { getContrast } from "@/functions/profile";

export default {
   name: "QuestionCard",
   props: { question: Object },
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