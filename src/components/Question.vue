<template>
   <div
     class="p-6 pb-4 rounded-lg border-2 border-gray-300 bg-white flex flex-col relative overflow-hidden cursor-pointer">
      <h2 class="text-2xl text-gray-900 mb-4 overflow-clip text-ellipsis whitespace-nowrap">
         {{ question.enonce.trim() }}</h2>
      <div class="pb-4 border-b border-gray-200 flex-label">
         <a v-for="(label, labelIndex) in question.etiquettes" :key="label.nom"
            class="px-3 py-1 rounded-md mx-0.5"
            :style="{backgroundColor: `#${label.couleur}`, color: getConstrast(`#${label.couleur}`)}"
            :class="{ 'ml-0': labelIndex === 0,  'mr-0': labelIndex === question.etiquettes.length -1 }">
            {{ label.nom }}</a>
      </div>
      <p class="text-xs text-gray-500 mt-3 text-right">{{ question.reponses.length }} réponse(s)</p>
   </div>
</template>

<script>
export default {
   name: "QuestionCard",
   props: ["question"],
   methods: {
      getConstrast: function(hexcolor) {
         // Fonction de Brian Suda trouvée sur cet article :
         // https://24ways.org/2010/calculating-color-contrast
         let red = parseInt(hexcolor.substring(1, 3), 16);
         let green = parseInt(hexcolor.substring(3, 5), 16);
         let blue = parseInt(hexcolor.substring(5, 7), 16);
         let yiq = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
         return (yiq >= 128) ? "black" : "white";
      }
   }
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