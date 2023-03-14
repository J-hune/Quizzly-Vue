<template>
   <!-- Total Quiz, Total Questions, % de bonnes réponses -->
   <div class="w-full px-2 sm:px-4 md:p-0 mb-8">
      <stats-cards :totalQuizzes="totalQuizzes" :totalQuestions="totalQuestions"
                   :successRate="successRate" />
   </div>

   <!-- Graphique de la présence en fonction du temps -->
   <div class="w-full px-2 sm:px-4 md:p-0 mb-10">
      <apex-chart-participation :categories="participationCategories" :series="participationSeries" />
   </div>

   <!-- Graphique du taux de réussite en fonction du temps -->
   <div class="w-full px-2 sm:px-4 md:p-0 mb-10">
      <apex-chart-success :categories="successCategories" :series="successSeries" />
   </div>

   <div class="w-full px-2 sm:px-4 md:p-0 mb-8">
      <div class="sm:flex sm:space-x-4 md:space-x-5">

         <!-- Accéder aux résultats d'un étudiant -->
         <search-student-stats />

         <!-- Supprimer les résultats d'un quiz -->
         <remove-stats />
      </div>
   </div>
</template>

<script>
import StatsCards from "@/components/Statistics/statsCards.vue";
import ApexChartParticipation from "@/components/Statistics/apexChartParticipation.vue";
import RemoveStats from "@/components/Statistics/removeStats.vue";
import SearchStudentStats from "@/components/Statistics/searchStudentStats.vue";
import ApexChartSuccess from "@/components/Statistics/apexChartSuccess.vue";

export default {
   name: "StatisticsView",
   components: { ApexChartSuccess, ApexChartParticipation, SearchStudentStats, RemoveStats, StatsCards },
   data: function() {
      return {
         totalQuizzes: 0,
         totalQuestions: 0,
         successRate: 0,
         participationCategories: [],
         participationSeries: [],
         successCategories: [],
         successSeries: []

      };
   },
   async created() {

      //TODO fetch les statistiques
      //const { data } = await fetchData("/nomàtrouver/");
      //this.questions = data;
      this.totalQuizzes = 157;
      this.totalQuestions = 684;
      this.successRate = 69;
      this.participationCategories = [1646697600, 1646737200, 1646900400, 1646904000, 1646986800, 1647069600, 1647156000, 1647199200, 1647285600, 1647372000, 1647462000, 1647526800, 1647613200, 1647699600, 1647782400, 1647872400, 1647944400, 1648030800];
      this.successCategories = [1646697600, 1646737200, 1646900400, 1646904000, 1646986800, 1647069600, 1647156000, 1647199200, 1647285600, 1647372000, 1647462000, 1647526800, 1647613200, 1647699600, 1647782400, 1647872400, 1647944400, 1648030800];
      this.participationSeries = [
         {
            name: "Questions",
            data: [10, 25, 7, 19, 13, 22, 28, 15, 18, 26, 21, 0, 9, 12, 17, 16, 23, 14]
         },
         {
            name: "Sequences",
            data: [4, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5, 13, 9, 17, 2, 7, 5]
         }
      ];
      this.successSeries = [
         {
            name: "Taux de succès",
            data: [10, 25, 7, 19, 13, 22, 28, 0, 100, 26, 21, 0, 9, 12, 17, 16, 23, 14]
         }
      ];
   }
};
</script>

<style scoped>

</style>