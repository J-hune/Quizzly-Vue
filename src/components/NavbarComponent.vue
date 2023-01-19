<template>
   <header class="text-gray-600 body-font bg-white w-full fixed top-0">
      <div class="container mx-auto flex flex-wrap flex-col md:flex-row items-center justify-between">
         <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round"
                 stroke-linejoin="round" stroke-width="2" class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
                 viewBox="0 0 24 24">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span class="ml-3 text-xl">Quizly</span>
         </a>
         <div class="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <nav>
               <a class="mr-5 hover:text-black">Nouveau QCM</a>
               <a class="mr-5 hover:text-black">Mes Questions</a>
               <a class="mr-5 hover:text-black">Ajouter une Question</a>
            </nav>
            <button
              class="inline-flex items-center bg-gray-100 border-0 py-1.5 px-3.5 focus:outline-none hover:bg-gray-200 rounded-lg text-base mt-4 md:mt-0"
              @click="logout">Logout
            </button>
         </div>
      </div>
   </header>
</template>

<script>
import router from "@/router";
import { useToast } from "vue-toastification";

export default {
   setup() {
      const toast = useToast();
      return { toast };
   },
   name: "NavbarComponent",
   props: {
      firstname: String,
      surname: String
   },
   methods: {
      logout() {
         this.$cookies.remove("session")
         router.push("/signin")
         this.toast.info("Vous venez d'être déconnecté");
      }
   }
};
</script>
