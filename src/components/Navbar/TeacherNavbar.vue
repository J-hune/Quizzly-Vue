<template>
   <div class="lg:flex hidden lg:ml-auto flex flex-wrap items-center text-base justify-center">
      <nav>
         <!-- Pour chaque lien dans `links` -->
         <router-link v-for="link in links" :key="link.link" :to="link.link">
            <a class="mr-5 hover:text-black">{{ link.label }}</a>
         </router-link>
      </nav>
      <button
        class="inline-flex items-center bg-gray-100 border-0 py-1.5 px-3.5 focus:outline-none hover:bg-gray-200 rounded-lg text-base mt-4 md:mt-0"
        @click="logout">Logout
      </button>
   </div>
</template>

<script>
import router from "@/router";
import { useToast } from "vue-toastification";

export default {
   name: "TeacherNavbar",
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         links: [
            { link: "/", label: "Mes Etiquettes" },
            { link: "/students", label: "Mes Eleves" },
            { link: "/sequences", label: "Mes Séquences" },
            { link: "/newQCM", label: "Nouveau QCM" }
         ],
      };
   },
   methods: {
      logout() {
         // Suppression du cookie de session et push "/"
         this.$cookies.remove("session");
         router.push("/signin");
         this.toast.info("Vous venez d'être déconnecté");
      },
      home() {
         router.push("/");
      }
   }
};
</script>