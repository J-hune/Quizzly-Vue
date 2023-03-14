<template>
   <!-- Total Quiz, Total Questions, % de bonnes réponses -->
   <div class="w-full px-2 sm:px-4 md:p-0 mb-8">
      <stats-cards :totalQuizzes="totalQuizzes" :totalQuestions="totalQuestions" :successRate="successRate" />
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

         <!-- Supprimer les résultats d'un quiz -->
         <div class="search-card">

            <!-- Nom de la carte -->
            <h3 class="text-lg mb-2 font-semibold">Rechercher un quiz par titre ou ID :</h3>
            <p class="mb-3">Cliquez sur le quiz pour supprimer tous les résultats liés à ce quiz</p>

            <!-- Champ pour l'identifiant du quiz -->
            <input type="text" v-model="search"
                   class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                   placeholder="Identifiant du quiz (8 caractères alphanumériques), Titre du quiz..." maxlength="8" />

         </div>

         <!-- Accéder aux résultats d'un étudiant -->
         <search-student-stats />
      </div>
   </div>

   <!-- Affichage des quiz -->
   <div class="w-full px-2 sm:px-4 md:p-0 mb-8">
      <div class="quiz-container w-full px-2 sm:px-4 md:p-0 mb-8">
         <div v-if="archives.length && displayedArchives.length" class="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            <quiz-card class="cursor-pointer" :quiz="archive" v-for="archive in displayedArchives" :key="archive.archiveId" @click="handleClick(archive)" />
         </div>

         <p v-else-if="archives.length && !displayedArchives.length">
            Aucune archive de quiz ne correspond à votre recherche.
         </p>
         <p v-else-if="!archives.length">Vous n'avez pas encore diffusé de quiz.</p>

         <!-- Pagination -->
         <nav class="pb-0" v-if="archives.length > pageSize">
            <ul class="flex justify-center">
               <li class="mx-1">

                  <!-- Bouton page précédente -->
                  <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded" :disabled="currentPage === 1"
                          @click="currentPage--">
                     Précédent
                  </button>
               </li>
               <template v-for="page in pages" :key="page">
                  <li class="mx-1"
                      v-if="page === 1 || page === currentPage - 1 || page === currentPage || page === currentPage + 1 || page === pages">
                     <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                             :class="{'bg-blue-500 text-blue-600': page === currentPage}" @click="currentPage = page">
                        {{ page }}
                     </button>
                  </li>
                  <li v-else-if="page === currentPage - 2 || page === currentPage + 2" :key="page"
                      class="mx-1 flex items-center">
                     <span class="px-3 py-1 bg-gray-200 rounded">...</span>
                  </li>
               </template>
               <li class="mx-1">

                  <!-- Bouton page suivante -->
                  <button class="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded" :disabled="currentPage === pages"
                          @click="currentPage++">
                     Suivant
                  </button>
               </li>
            </ul>
         </nav>
      </div>
   </div>
</template>

<script>
import StatsCards from "@/components/Statistics/statsCards.vue";
import ApexChartParticipation from "@/components/Statistics/apexChartParticipation.vue";
import SearchStudentStats from "@/components/Statistics/searchStudentStats.vue";
import ApexChartSuccess from "@/components/Statistics/apexChartSuccess.vue";
import QuizCard from "@/components/Quiz/QuizCard.vue";
import { removeQuizStatistics } from "@/functions/quiz";
import { useToast } from "vue-toastification";

export default {
   name: "StatisticsView",
   components: { QuizCard, ApexChartSuccess, ApexChartParticipation, SearchStudentStats, StatsCards },
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         search: "",
         totalQuizzes: 0,
         totalQuestions: 0,
         successRate: 0,
         participationCategories: [],
         participationSeries: [],
         successCategories: [],
         successSeries: [],
         currentPage: 1,
         pageSize: 6,
         archives: []
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
            name: "Taux de réussite",
            data: [10, 25, 7, 19, 13, 22, 28, 0, 100, 26, 21, 0, 9, 12, 17, 16, 23, 14]
         }
      ];

      this.archives = [
         { archiveId: 1, title: "Séquence algorithmie", id: "Fxa4t3xr", date: 1678667302, participantCount: 15, percentCorrect: 32 },
         { archiveId: 2, title: "Les questions de sciences", id: "Gxa4t3xr", date: 1678667302, participantCount: 15, percentCorrect: 32 },
         { archiveId: 3, title: "Combien d'os contient le corps humain ?", id: "Hxa4t3xr", date: 1678667302, participantCount: 15, percentCorrect: 32 },
         { archiveId: 4, title: "Combien d'os contient le corps humain ?", id: "Hxa4t3xr", date: 1678667302, participantCount: 15, percentCorrect: 32 }
      ];
   },
   computed: {
      matchingArchives() {
         // On filtre toutes les archives correspondant à la recherche
         return this.archives.filter(e => {
            if (e.title.toLowerCase().includes(this.search.toLowerCase().trim())) return e;
            if (e.id.toLowerCase().includes(this.search.toLowerCase().trim())) return e;
         });
      },
      pages() {
         return Math.ceil(this.matchingArchives.length / this.pageSize);
      },
      displayedArchives() {
         const startIndex = (this.currentPage - 1) * this.pageSize;
         return this.matchingArchives.slice(startIndex, startIndex + this.pageSize);
      }
   },
   methods: {
      /**
       * Gère le clic sur les archives.
       */
      handleClick: function(quiz) {
         removeQuizStatistics(quiz, () => {
            this.archives = this.archives.filter(e => e.archiveId !== quiz.archiveId);
            this.toast.success("Les statistiques du quiz " + quiz.id + " ont été supprimées");
         });
      }
   }
};
</script>

<style scoped>
.quiz-container {
   width: 100%;
   background: white;
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   padding: 30px;
}

.search-card {
   width: 100%;
   background: white;
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   padding: 26px 30px;
}

@media (max-width: 640px) {
   .search-card:not(:first-child) {
      margin-top: 20px;
   }
}
</style>