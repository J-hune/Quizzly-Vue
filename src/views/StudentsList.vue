<template>
   <div class="px-7 md:px-16 pt-10 pb-14 w-full">

      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-12 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Mes Etudiants</h1>
         <p class="leading-relaxed text-base">Les comptes étudiants de l'établissement sont affichées ci-dessous.<br>
            Cliquez sur un étudiant pour le supprimer.</p>
      </div>

      <!-- input Search -->
      <input type="text" v-model="search"
             class="w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
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
               <span class="card-font text-black overflow-hidden text-ellipsis whitespace-nowrap">{{ student.prenom }} {{ student.nom
                  }}</span>
               <span class="text-sm text-slate-600">#{{ student.id }}</span>
            </div>
         </div>

      </div>
   </div>
</template>

<script>
import Swal from "sweetalert2";
import { toRaw } from "vue";
import image from "../assets/img/f2.png";
import { addStudentsFromCSV } from "@/functions/csv";
import { useToast } from "vue-toastification";
import { fetchData } from "@/functions/fetch";

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
         students: [
            {
               avatar: "https://cdn.discordapp.com/avatars/641642174085070848/80fc91a8a8a59d3ef068fc7fb60246ea.webp?size=320",
               nom: "Leclere",
               prenom: "Michel",
               id: "22102687"
            },
            {
               avatar: "https://cdn.discordapp.com/avatars/429652389256232962/58c40826c30b05f3b4a3ba2f212d439d.webp?size=320",
               nom: "Zassot",
               prenom: "Donovann",
               id: "22102688"
            },
            {
               avatar: "",
               nom: "Zassot",
               prenom: "Donovann",
               id: "22102689"
            }
         ]
      };
   },
   async created() {
      //TODO Fetch les données et modifier data
   },
   methods: {
      uploadFile() {
         let input = this.$refs.fileInput;
         let file = input.files[0];

         if (!file) {
            return;
         }

         let reader = new FileReader();
         reader.readAsText(file);

         reader.onload = (e) => {
            let csvData = e.target.result;
            addStudentsFromCSV(csvData, this.toast);
         };
      },
      addStudents() {
         this.$refs.fileInput.click();
      },
      removeAllStudents() {
         Swal.fire({
            title: "Confirmer la suppression ?",
            text: `Voulez vous supprimer tous les étudiants ? Attention, cette action est irréversible`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Supprimer tous les étudiants",
            cancelButtonText: "Annuler"
         }).then(async (result) => {
            // Si l'utilisateur a confirmé
            if (result.isConfirmed) {

               // On appelle l'api pour supprimer tous les étudiants
               const { data } = await fetchData("/students/removeAllStudent/");
               if (data.success) {
                  this.toast.success("Tous les étudiants ont été supprimés");
               } else {
                  this.toast.error("Les étudiants n'ont pas pu être supprimés");
               }
               //TODO reFetch les données
            }
         });
      },
      removeStudent(student) {
         Swal.fire({
            title: "Confirmer la suppression ?",
            text: `Voulez vous supprimer l'étudiant ${student.id}: ${student.prenom} ${student.nom} ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Supprimer cet étudiant",
            cancelButtonText: "Annuler"
         }).then(async (result) => {
            // Si l'utilisateur a confirmé
            if (result.isConfirmed) {

               // On appelle l'api pour supprimer tous les étudiants
               const { data } = await fetchData("/students/removeStudent/" + student.id);
               if (data.success) {
                  this.toast.success("L'étudiant #" + student.id + " a été supprimé");
               } else {
                  this.toast.error("L'étudiant n'a pas pu être supprimé");
               }
               //TODO reFetch les données
            }
         });
      }
   },
   computed: {
      searchStudents: function() {
         const allStudents = toRaw(this.students);
         return allStudents.filter(e => {
            let nom = e.nom.toLowerCase().includes(this.search.toLowerCase());
            let prenom = e.prenom.toLowerCase().includes(this.search.toLowerCase());
            let id = e.id.includes(this.search);

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