<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 pb-14 w-full">

      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-12 py-1">
         <h1 class="sm:text-3xl text-2xl font-semibold title-font mb-4 text-gray-900">Mes Etudiants</h1>
         <p class="leading-relaxed text-base">Les comptes étudiants de l'établissement sont affichées ci-dessous.<br>
            Cliquez sur un étudiant pour le supprimer.</p>
      </div>

      <!-- input Search -->
      <input type="text" v-model="search"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Filtrer par numéro étudiant, nom, prénom..." />

      <!-- Boutons "Ajouter une liste d'étudiants" et "Supprimer tous les étudiants" -->
      <div class="flex mt-3 mb-8">
         <button @click="addStudents"
                 class="mr-3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-7 rounded-lg">
            Ajouter une liste d'étudiants
         </button>
         <input type="file" ref="fileInput" @change="uploadFile" class="h-0 w-0 hidden" />

         <button @click="removeAllStudents"
                 class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-7 rounded-lg">
            Supprimer tous les étudiants
         </button>
      </div>

      <hr class="mb-8" />

      <!-- Grille d'étudiants (avec avatar, nom, prénom et id) -->
      <div class="grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 gap-3 2xl:grid-cols-4 lg:gap-5">
         <div class="w-full p-4 rounded-lg border-2 border-gray-300 bg-white flex items-center cursor-pointer"
              v-for="student in searchStudents" :key="student.id" @click="removeStudent(student)">
            <img class="w-12 h-12 rounded-full mr-4" :src="student.avatar || image" alt="student avatar">
            <div class="flex flex-col overflow-hidden">
               <span
                 class="card-font text-black font-medium overflow-hidden text-ellipsis whitespace-nowrap">{{ student.prenom
                  }} {{ student.nom
                  }}</span>
               <span class="text-sm text-slate-600">#{{ student.id }}</span>
            </div>
         </div>

         <div v-if="students.length && !searchStudents.length">
            Aucune étudiant ne correspond à votre recherche
         </div>

      </div>
   </div>
</template>

<script>
import image from "../../assets/img/f2.png";
import { addStudentsFromCSV } from "@/functions/csv";
import { useToast } from "vue-toastification";
import { fetchData } from "@/functions/fetch";
import { removeAllStudents, removeStudent } from "@/functions/students";

export default {
   name: "StudentsList",
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         search: "",
         image: image,
         students: []
      };
   },
   async created() {
      const { data } = await fetchData("/students/getAllStudents");
      this.students = data;
   },
   methods: {
      /**
       * Charge un fichier CSV contenant des étudiants et les ajoute à la base de données
       */
      uploadFile() {
         // Récupération de l'input file
         let input = this.$refs.fileInput;
         let file = input.files[0];

         // Si aucun fichier n'a été sélectionné, on sort de la fonction
         if (!file) {
            return;
         }

         // On lit le contenu du fichier CSV
         let reader = new FileReader();
         reader.readAsText(file);

         // Une fois que le contenu a été chargé
         reader.onload = async (e) => {
            let csvData = e.target.result;
            // On ajoute les étudiants à la base de données
            await addStudentsFromCSV(csvData, this.toast);

            // On récupère tous les étudiants à jour depuis l'API
            const { data } = await fetchData("/students/getAllStudents");
            // On met à jour la liste des étudiants affichés sur le front-end
            this.students = data;
         };
      },


      /**
       * Ouvre la boîte de dialogue pour sélectionner un fichier CSV contenant des étudiants
       */
      addStudents() {
         this.$refs.fileInput.click();
      },

      /**
       * Supprime tous les étudiants de la base de données
       */
      removeAllStudents() {
         // Appelle la méthode dans le fichier students.js pour supprimer tous les étudiants
         removeAllStudents(this.toast, () => {
            // On modifie les données du front en faisant confiance au back-end
            // (On pourrait aussi récupérer les données une nouvelle fois avec un nouvel appel à l'api)
            this.students = [];
         });
      },

      /**
       * Supprime un étudiant de la base de données
       * @param {Object} student - L'étudiant à supprimer
       */
      removeStudent(student) {
         // Appelle la méthode dans le fichier students.js pour supprimer un étudiant
         removeStudent(student, this.toast, () => {
            // On modifie les données du front en faisant confiance au back-end
            // (On pourrait aussi récupérer les données une nouvelle fois avec un nouvel appel à l'api)
            this.students = this.students.filter(e => e.id !== student.id);
         });
      }
   },
   computed: {
      searchStudents: function() {
         return this.students.filter(e => {
            let nom = e.nom.toLowerCase().includes(this.search.toLowerCase());
            let prenom = e.prenom.toLowerCase().includes(this.search.toLowerCase());
            let id = e.id.toString().includes(this.search);

            return nom || prenom || id;
         });
      }
   }
};
</script>

<style scoped>
.card-font {
   font-size: 18px;
}
</style>