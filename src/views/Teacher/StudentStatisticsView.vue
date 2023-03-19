<template>
   <div class="w-full flex flex-col md:flex-row items-center gap-4 md:gap-5 mb-8 px-2 sm:px-4 md:p-0">

      <!-- Redirection et profil de l'utilisateur -->
      <div class="custom-card w-full md:w-1/2 xl:w-3/5 px-4">
         <redirect-back class="w-fit md:mb-0" back="Statistiques Générales" />

         <!-- Profil de l'utilisateur -->
         <div class="mt-8 w-full text-center">
            <img class="avatar mx-auto" :src="student.avatar" alt="student avatar" />
            <div class="mt-4 mb-6">
               <h2 class="font-bold text-2xl mb-1">{{ student.name }}</h2>
               <p class="text-gray-500">#{{ student.id }}</p>
            </div>
         </div>
      </div>

      <!-- Total Quiz, Total Questions, % de bonnes réponses -->
      <div class="w-full md:w-1/2 xl:w-2/5">
         <student-stats-cards :totalQuizzes="totalQuizzes" :totalQuestions="totalQuestions"
                              :successRate="successRate" />
      </div>
   </div>

   <!-- Graphique du taux de réussite en fonction du temps -->
   <div class="w-full px-2 sm:px-4 md:p-0 mb-10">
      <apex-student-chart-success :categories="successCategories" :series="successSeries" />
   </div>


</template>

<script>
import { useToast } from "vue-toastification";
import RedirectBack from "@/components/redirectBack.vue";
import StudentStatsCards from "@/components/StudentStatistics/studentStatsCards.vue";
import image from "@/assets/img/f2.png";
import ApexStudentChartSuccess from "@/components/StudentStatistics/apexStudentChartSuccess.vue";

export default {
   name: "StudentStatisticsView.vue",
   components: { ApexStudentChartSuccess, StudentStatsCards, RedirectBack },
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         totalQuizzes: 0,
         totalQuestions: 0,
         successRate: 0,
         successCategories: [1646697600, 1646737200, 1646900400, 1646904000, 1646986800, 1647069600, 1647156000],
         successSeries: [
            { name: "Questions", data: [10, 25, 7, 19, 13, 22, 28] },
            { name: "Sequences", data: [4, 3, 10, 9, 29, 19, 22] }
         ],
         student: { avatar: image, name: "Donovann Zassot", id: "22100000" }
      }
   },
   async created() {
      //TODO Fetch les données
   }
};
</script>

<style scoped>
.custom-card {
   height: 100%;
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   background: white;
}

.avatar {
   border-radius: 50%;
   cursor: pointer;
   transition: all 0.1s;
   width: 100px;
   height: 100px;
}
</style>