<template>
   <highcharts-vue style="border-radius: 10px" :options="chartOptions" />
</template>

<script>
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import wordcloud from "highcharts/modules/wordcloud";
import { findInArray } from "@/functions/worlds";

wordcloud(Highcharts);

export default {
   name: "OpenEndedResponses",
   props: { studentsAnswers: Array },
   components: {
      HighchartsVue: Chart
   },
   computed: {
      chartOptions() {
         return {
            title: null,
            credits: {
               enabled: false
            },
            accessibility: {
               enabled: false
            },
            series: [{
               type: "wordcloud",
               data: this.wordCloudData,
               name: "Réponses",
               rotation: 0
            }],
            plotOptions: {
               wordcloud: {
                  center: ["50%", "50%"]
               }
            }
         };
      },


      /**
       * Crée un nuage de mots à partir d'un tableau de mots donné en entrée.
       *
       * @returns {Array<Object>} Le nuage de mots sous la forme d'un tableau d'objets.
       */
      wordCloudData() {
         // Calcul du poids maximum (nombre d'occurrences) de tous les mots dans le tableau
         const maxWeight = Math.max(...this.studentsAnswers.map(word => this.studentsAnswers.filter(w => w === word).length));

         // Réduction du tableau de mots en un nuage de mots
         return this.studentsAnswers.reduce((cloud, word) => {
            // On recherche le mot dans le tableau en ignorant les accents et la casse
            const foundWord = findInArray(word, this.studentsAnswers);

            // Si le mot est trouvé, on met à jour son poids dans le nuage de mots
            if (foundWord) {
               // On trouve l'élément correspondant dans le nuage de mots
               let existingWord = cloud.find(w => w.name === foundWord);

               // Si l'élément existe, on met à jour son poids et sa couleur
               if (existingWord) {
                  existingWord.weight++;
                  const weightRatio = existingWord.weight / maxWeight;
                  existingWord.color = `rgba(13,82,66,${0.3 + weightRatio * 0.7})`;
               }

               // Sinon, on crée un nouvel élément avec un poids initial de 1 et une couleur dépendant du poids relatif du mot dans le tableau
               else {
                  const weightRatio = this.studentsAnswers.filter(w => w === foundWord).length / maxWeight;
                  const color = `rgba(13,82,66,${0.3 + weightRatio * 0.7})`;
                  existingWord = { name: foundWord, weight: 1, color };
                  cloud.push(existingWord);
               }
            }

            return cloud;
         }, []);
      }
   }
};
</script>

<style scoped>

</style>