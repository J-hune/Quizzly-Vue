<template>
   <div class="w-full flex flex-col md:flex-row items-center gap-4 md:gap-5 mb-8 px-2 sm:px-4 md:p-0">

      <!-- Redirection et profil de l'utilisateur -->
      <div class="custom-card w-full md:w-1/2 xl:w-3/5 px-4">
         <redirect-back class="w-fit md:mb-0" back="Statistiques Générales" />

         <!-- Profil de l'utilisateur -->
         <div class="mt-8 w-full text-center">
            <img class="avatar mx-auto" :src="student.avatar" alt="student avatar" />
            <div class="mt-4 mb-6">
               <h2 class="font-bold text-2xl mb-1">{{ student.name + " " + student.surname }}</h2>
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
   <div class="w-full px-2 sm:px-4 md:p-0 mb-8">
      <apex-student-chart-success :categories="successCategories" :series="successSeries" />
   </div>

   <!-- Chercher un quiz par id ou par titre -->
   <div class="w-full search-card px-2 sm:px-4 md:p-0 mb-8">

      <!-- Nom de la carte -->
      <h3 class="text-lg mb-2 font-semibold">Rechercher un quiz par titre ou ID :</h3>

      <!-- Champ pour l'identifiant du quiz -->
      <input type="text" v-model="search"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Identifiant du quiz (8 caractères alphanumériques), Titre du quiz..." maxlength="8" />
   </div>

   <!-- Affichage des quiz -->
   <div class="w-full px-2 sm:px-4 md:p-0 mb-8">
      <div class="quiz-container w-full px-2 sm:px-4 md:p-0 mb-8">
         <div v-if="archives.length && displayedArchives.length"
              class="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-4">
            <quiz-card :quiz="archive" v-for="archive in displayedArchives" :key="archive.archiveId" />
         </div>

         <p v-else-if="archives.length && !displayedArchives.length">
            Aucune archive de quiz ne correspond à votre recherche.
         </p>
         <p v-else-if="!archives.length">L'étudiant n'a pas encore participé à un quiz.</p>

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
import { useToast } from "vue-toastification";
import RedirectBack from "@/components/redirectBack.vue";
import StudentStatsCards from "@/components/StudentStatistics/studentStatsCards.vue";
import image from "@/assets/img/f2.png";
import ApexStudentChartSuccess from "@/components/StudentStatistics/apexStudentChartSuccess.vue";
import QuizCard from "@/components/Quiz/QuizCard.vue";
import { fetchData } from "@/functions/fetch";
import router from "@/router";

export default {
   name: "StudentStatisticsView.vue",
   components: { QuizCard, ApexStudentChartSuccess, StudentStatsCards, RedirectBack },
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
         successCategories: [],
         successSeries: [
            { name: "Questions", data: [] },
            { name: "Sequences", data: [] }
         ],
         student: { avatar: image, name: "*****", surname: "***", id: "********" },
         currentPage: 1,
         pageSize: 6,
         archives: []
      };
   },
   async created() {
      const { data } = await fetchData("/statistics/teachers/getStatsByStudent/" + this.$route.params.id);

      // Vérification que l'étudiant existe
      if (data.reason) {
         this.toast.error("L'étudiant #" + this.$route.params.id + " n'existe pas");
         return await router.push("/statistics");
      }

      this.totalQuizzes = data.totalQuizzes;
      this.totalQuestions = data.totalQuestions;
      this.successRate = data.successRate;
      this.successCategories = data.success.days;
      this.successSeries = [
         { name: "Questions", data: data.success.questions },
         { name: "Sequences", data: data.success.sequences }
      ];
      this.archives = data.archives;
      this.student.name = data.etudiant.prenom;
      this.student.surname = data.etudiant.nom;
      this.student.id = data.etudiant.id;
      if (data.etudiant.avatar) this.student.avatar = data.etudiant.avatar;
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

.search-card {
   background: white;
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   padding: 26px 30px;
}

.quiz-container {
   width: 100%;
   background: white;
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   padding: 30px;
}
</style>