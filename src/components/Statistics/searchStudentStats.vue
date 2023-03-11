<template>
   <div class="custom-card">
      <h3 class="text-lg mb-3">Accéder aux résultats d'un étudiant :</h3>
      <input type="text" v-model="studentInput"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Numéro de l'étudiant..." maxlength="8" />
      <button @click="redirectStatsPage"
              class="mt-3 w-full sm:w-fit bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
         Accéder aux résultats
      </button>
   </div>
</template>

<script>
import router from "@/router";
import { useToast } from "vue-toastification";

export default {
   name: "searchStudentStats",
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         studentInput: ""
      };
   },
   methods: {
      redirectStatsPage: function() {

         // On teste si le numéro étudiant est bien formaté (8 chiffres)
         if (/^\d{8}$/.test(this.studentInput.trim())) {
            router.push("/statistics/" + this.studentInput.trim());
         }

         else {
            this.toast.error("Le numéro de l'étudiant n'est pas valide");
         }
      }
   }
};
</script>

<style scoped>
.custom-card {
   width: 100%;
   background: white;
   border-radius: 15px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
   padding: 26px 30px;
}

@media (max-width: 640px) {
   .custom-card:not(:first-child) {
      margin-top: 20px;
   }
}
</style>