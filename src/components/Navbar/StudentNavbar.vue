<template>
   <div class="lg:flex hidden lg:ml-auto flex flex-wrap items-center text-base justify-center">
      <nav>
         <!-- Pour chaque lien dans `links` -->
         <router-link v-for="link in links" :key="link.link" :to="link.link">
            <a class="mr-5 hover:text-black">{{ link.label }}</a>
         </router-link>
      </nav>

      <!-- Avatar avec un bouton -->
      <img class="w-10 h-10 avatar" :src="userAvatar" alt="student avatar" @click="displayDropdown = !displayDropdown"
           v-click-outside="() => displayDropdown = false" />

      <!-- Dropdown lié au bouton de l'avatar -->
      <div class="dropdown-container" :style="{display: displayDropdown ? 'block': 'none'}">
         <div class="dropdown">
            <div class="user-name">
               <span>{{ userName }}</span>
            </div>
            <ul class="dropdown-list cursor-pointer" aria-labelledby="dropdownDefaultButton">
               <router-link to="/profile">
                  <li>Mon profil</li>
               </router-link>
               <router-link to="/">
                  <li>Rejoindre une séquence</li>
               </router-link>
               <li @click="logout">Déconnexion</li>
            </ul>
         </div>
      </div>
   </div>
</template>

<script>
import router from "@/router";
import { useToast } from "vue-toastification";
import { mapGetters } from "vuex";

export default {
   name: "StudentNavbar",
   setup() {
      const toast = useToast();
      return { toast };
   },
   data: function() {
      return {
         links: [
            { link: "/", label: "Rejoindre une sequence" }
         ],
         displayDropdown: false
      };
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
      }
   },
   computed: {
      ...mapGetters(["getUserAvatar", "getUserName"]),
      userAvatar() {
         return this.getUserAvatar;
      },
      userName() {
         return this.getUserName;
      }

   }
};
</script>

<style scoped>
.avatar {
   border-radius: 10px;
   cursor: pointer;
   transition: all 0.1s;
}

.avatar:hover {
   filter: brightness(95%);
}

.dropdown-container {
   position: relative;
}

.dropdown {
   position: absolute;
   width: max-content;
   background-color: white;
   padding: 0 12px;
   border-radius: 6px;
   box-shadow: 0 0 20px rgba(89, 102, 122, .1);
   top: 30px;
   left: auto;
   right: 0;
}

.dropdown-list {
   color: #24292f;
   font-size: 15px;
   margin-top: 10px;
   border-top: 1px solid #f5f5f5;
}

.dropdown-list li {
   padding: 10px 16px;
}

.dropdown-list li:not(:first-child) {
   border-top: 1px solid #f5f5f5;
}

.user-name {
   margin-top: 10px;
   padding: 8px 16px;
   background-color: #eeebf3;
   border-radius: 6px;
   border-bottom: 1px solid #f5f5f5;
}
</style>