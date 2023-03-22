<template>
   <header class="custom-nav text-gray-600 body-font bg-white w-full fixed top-0">
      <div class="container mx-auto flex flex-wrap items-center justify-between">

         <!-- Partie gauche de la navbar -->
         <a class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">

            <!-- Logo Créé par une IA -->
            <svg xmlns="http://www.w3.org/2000/svg" width="183" height="37.6" viewBox="0 0 366.41368078175896 94"
                 class="cursor-pointer" @click="home">
               <g transform="matrix(6.407754898071289,0,0,6.407754898071289,1.7961234519371727,-34.28325814906235)"
                  fill="#a6acec">
                  <path
                    d="M11.58 20.02 l-5.96 -0.000039062 c-0.34666 0 -0.68666 -0.03666 -1.02 -0.11 s-0.66 -0.17668 -0.98 -0.31002 c-0.61334 -0.24 -1.16 -0.61334 -1.64 -1.12 c-0.22666 -0.22666 -0.43 -0.47332 -0.61 -0.73998 s-0.33666 -0.55332 -0.47 -0.85998 c-0.26666 -0.61334 -0.4 -1.2933 -0.4 -2.04 c0 -0.34666 0.03 -0.68666 0.09 -1.02 s0.16334 -0.66 0.31 -0.98 c0.13334 -0.30666 0.29 -0.59666 0.47 -0.87 s0.38334 -0.53 0.61 -0.77 c0.50666 -0.46666 1.0533 -0.82666 1.64 -1.08 c0.32 -0.14666 0.64666 -0.25 0.98 -0.31 s0.67334 -0.09 1.02 -0.09 c0.74666 0 1.4267 0.13334 2.04 0.4 c0.30666 0.13334 0.59332 0.29 0.85998 0.47 s0.52 0.38334 0.76 0.61 c0.49334 0.49334 0.86 1.04 1.1 1.64 c0.13334 0.32 0.23668 0.64666 0.31002 0.98 s0.11 0.67334 0.11 1.02 c0 0.46666 -0.06 0.91666 -0.18 1.35 s-0.28666 0.85668 -0.5 1.27 z"></path>
               </g>
               <g transform="matrix(3.6692473888397217,0,0,3.6692473888397217,88.35814169133835,7.837738210534816)"
                  fill="#a56cc1">
                  <path
                    d="M8.7 22.08 l-2.04 -1.78 q-1.38 0 -2.48 -0.47 t-1.87 -1.38 t-1.18 -2.23 t-0.41 -3.04 q0 -1.7 0.39 -3.02 t1.16 -2.24 t1.88 -1.4 t2.55 -0.48 t2.56 0.49 t1.88 1.41 t1.15 2.24 t0.39 3 q0 1.14 -0.19 2.15 t-0.56 1.82 t-0.9 1.37 t-1.21 0.8 l0.52 0.36 q1.36 0.94 2.52 0.94 q-0.04 1.02 -0.61 1.65 t-1.59 0.63 q-0.98 0 -1.96 -0.82 z M6.7 8.5 q-2.7 0 -2.7 4.68 q0 4.66 2.7 4.66 q2.66 0 2.66 -4.66 q0 -4.68 -2.66 -4.68 z M25.560000000000002 6.34 l0 8.62 q0 2.56 -1.4 3.95 t-4 1.39 t-4.01 -1.39 t-1.41 -3.95 l0 -8.62 l0.14 -0.14 l1.18 0 q1.9 0 1.9 2.04 l0 6.76 q0 1.4 0.5 2.08 t1.7 0.68 t1.7 -0.68 t0.5 -2.08 l0 -8.66 q0.62 -0.12 1.6 -0.12 q0.96 0 1.6 0.12 z M28.44 20 l0 -13.66 q0.62 -0.12 1.6 -0.12 t1.62 0.12 l0 13.66 q-0.64 0.12 -1.62 0.12 t-1.6 -0.12 z M34.36 16.9 l4.44 -6.1 q0.68 -0.98 1.62 -1.98 l-0.06 -0.06 q-1.42 0.18 -3.1 0.18 l-2.86 0 q-0.12 -0.46 -0.12 -1.11 t0.22 -1.49 l8.86 0 q0.44 1.66 0.44 2.11 t-0.36 0.97 l-4.46 6.12 q-0.68 0.96 -1.56 1.88 l0.06 0.06 q2 -0.14 3 -0.14 l1.12 0 q1.2 0 2.24 -0.46 q0.22 0.7 0.22 1.48 t-0.57 1.21 t-1.53 0.43 l-7.64 0 q-0.36 -1.6 -0.36 -2.07 t0.4 -1.03 z M45.96 16.9 l4.44 -6.1 q0.68 -0.98 1.62 -1.98 l-0.06 -0.06 q-1.42 0.18 -3.1 0.18 l-2.86 0 q-0.12 -0.46 -0.12 -1.11 t0.22 -1.49 l8.86 0 q0.44 1.66 0.44 2.11 t-0.36 0.97 l-4.46 6.12 q-0.68 0.96 -1.56 1.88 l0.06 0.06 q2 -0.14 3 -0.14 l1.12 0 q1.2 0 2.24 -0.46 q0.22 0.7 0.22 1.48 t-0.57 1.21 t-1.53 0.43 l-7.64 0 q-0.36 -1.6 -0.36 -2.07 t0.4 -1.03 z M63 17.3 l3.46 0 q0 0.8 -0.1 1.37 t-0.64 0.98 t-1.42 0.41 l-4.52 0 q-0.86 0 -1.36 -0.5 t-0.5 -1.36 l0 -11.86 l0.14 -0.14 l1.18 0 q1.88 0 1.88 2.04 l0 9.14 q0.88 -0.08 1.88 -0.08 z M71.44 9.72 l1.34 -3.38 q0.52 -0.12 1.34 -0.12 q0.88 0 1.52 0.24 l0.14 0.16 l-3.88 9.18 l0 4.2 q-0.62 0.12 -1.6 0.12 t-1.6 -0.12 l0 -4.28 l-3.86 -9 q0.92 -0.54 1.76 -0.54 t1.21 0.29 t0.65 0.99 l0.96 2.38 q0.52 1.28 0.9 2.86 l0.12 0 q0.32 -1.26 1 -2.98 z"></path>
               </g>
            </svg>
         </a>

         <!-- NavBar Partie droite: Enseignant -->
         <teacher-navbar v-if="userType === 'Enseignant'" />

         <!-- NavBar Partie droite: Etudiant -->
         <student-navbar v-else />
      </div>

      <!-- Bouton Burger (format md) -->
      <div class="block lg:hidden navbar-burger" @click="navbarOpen = !navbarOpen">
         <button class="navbar-burger flex items-center text-blue-600 p-3">
            <svg class="block h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <title>Mobile menu</title>
               <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
         </button>
      </div>
   </header>

   <!-- Navbar phone format md -->
   <header :style="{display: navbarOpen ? 'block' : 'none'}" class="hide-content md:none"
           @click.prevent="navbarOpen = false">
      <nav class="phone-navbar flex flex-col w-5/6 max-w-sm pt-5 pb-4 px-6 bg-white border-r overflow-y-auto">

         <!-- Liste des Liens de la navbar -->
         <ul>
            <li v-for="link in userType === 'Enseignant' ? links.teacher : links.student" :key="link.link" class="mb-1">
               <router-link :to="link.link">
                  <a class="block p-4 text-md font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded">
                     {{ link.label }}
                  </a>
               </router-link>
            </li>
         </ul>

         <!-- Bouton en bas (logout) -->
         <div class="mt-auto">
            <div class="pt-6">
               <button @click.prevent="logout"
                       class="bg-gray-100 block px-4 py-3 w-full mb-2 leading-loose text-sm text-center font-semibold hover:bg-gray-200 rounded-xl">
                  Déconnexion
               </button>
            </div>

            <!-- ce dont on ne doit pas prononcer le nom -->
            <div class="w-full text-xs text-center pt-1">
                  <span class="text-blue-600 cursor-pointer no-underline" @click="redirect">
                     FAQ - CONTACT
                  </span>
            </div>
         </div>
      </nav>
   </header>
</template>

<script>
import router from "@/router";
import { useToast } from "vue-toastification";
import image from "../../assets/img/f2.png";
import TeacherNavbar from "@/components/Navbar/TeacherNavbar.vue";
import StudentNavbar from "@/components/Navbar/StudentNavbar.vue";

export default {
   name: "NavbarComponent",
   components: { StudentNavbar, TeacherNavbar },
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         image: image,
         links: {
            teacher: [
               { link: "/", label: "Mes Questions" },
               { link: "/labels", label: "Mes Etiquettes" },
               { link: "/students", label: "Mes Etudiants" },
               { link: "/sequences", label: "Mes Séquences" },
               { link: "/statistics", label: "Statistiques" },
               { link: "/newQCM", label: "Nouveau QCM" }
            ],
            student: [
               { link: "/profile", label: "Mon profil" },
               { link: "/", label: "Rejoindre une séquence" }
            ]
         },
         navbarOpen: false
      };
   },
   computed: {
      userType: function() {
         return this.$store.getters.getUserType;
      }
   },
   methods: {
      /**
       * Déconnexion de l'utilisateur
       */
      logout() {
         // Suppression du cookie de session et push "/"
         this.$cookies.remove("session");
         router.push("/signin");
         this.toast.info("Vous venez d'être déconnecté");
      },

      /**
       * Redirection de l'utilisateur vers la page principale
       */
      home() {
         router.push("/");
      },

      /**
       * Redirection de l'utilisateur vers une certaine page
       * Pour "ce dont on ne doit pas prononcer le nom"
       */
      redirect() {
         window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      }
   }
};
</script>

<style scoped>
.custom-nav {
   display: flex;
   align-items: center;
   z-index: 5;
   box-shadow: 0 6px 2px -2px #bfbfbf1c;
   height: 84px;
}

.navbar-burger {
   margin-right: 10px;
}

.navbar-burger svg {
   height: 25px;
   width: 25px;
   fill: #A56CC1;
}

.hide-content {
   z-index: 4;
   display: block;
   position: fixed;
   background-color: #00000017;
   height: 100%;
   width: 100%;
}

.phone-navbar {
   position: fixed;
   top: 84px;
   bottom: 0;
   left: 0;
   box-shadow: 6px 0 2px -2px #bfbfbf1c;
}
</style>