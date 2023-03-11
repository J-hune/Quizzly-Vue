<template>
   <div class="px-2 sm:px-4 py-8 sm:p-12 mx-6">

      <!-- Titre de la page : Login ou Register -->
      <div class="text-center">
         <h4 class="text-5xl font-semibold mt-1 mb-12">
            {{ type }}
         </h4>
      </div>

      <!-- Formulaire login Enseignant: Prénom, nom et mot de passe -->
      <form @submit.prevent="logUser">

         <!-- Prénom -->
         <div class="mb-4">
            <input
              ref="firstname" type="text" id="prenom" maxlength="50" placeholder="Prénom"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
         </div>

         <!-- Nom -->
         <div class="mb-4">
            <input
              ref="surname" type="text" id="nom" maxlength="50" placeholder="Nom de Famille"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
         </div>

         <!-- Mot de passe -->
         <div class="mb-4">
            <input
              ref="password" type="password" id="password" maxlength="100" placeholder="Mot de passe"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
         </div>

         <!-- Bouton Submit -->
         <div class="text-center pt-1 mb-8 pb-1">
            <button
              class="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
              type="submit" data-mdb-ripple="true" data-mdb-ripple-color="light" style="background-color: #1645be"
            >
               {{ type === "Login" ? "Se connecter" : "S'enregistrer" }}
            </button>
         </div>

         <!-- Div avec redirection vers l'inscription ou le login -->
         <div class="flex items-center justify-between pb-6">
            <p class="mb-0 mr-2">
               {{ type === "Login" ? "Vous n'êtes pas inscrits ?" : "Vous êtes déjà inscrits ?" }}
               <router-link v-if="type === 'Login'" class="text-blue-500" to="/signup">Inscrivez vous !</router-link>
               <router-link v-else class="text-blue-500" to="/signin">Connectez vous !</router-link>
            </p>
         </div>
      </form>
   </div>
</template>

<script>
import { onlyAlphabetAndAccents } from "@/functions/string";
import { logUser } from "@/functions/login";
import { useToast } from "vue-toastification";
import router from "@/router";

export default {
   name: "TeacherPortal",
   setup() {
      const toast = useToast();
      return { toast };
   },
   props: {
      type: String
   },
   methods: {
      /**
       * Fonction pour connecter un enseignant.
       * @async
       */
      logUser() {
         // Récupération des champs de formulaire pour l'identification
         let userData = {
            firstname: this.$refs.firstname.value.trim(),
            surname: this.$refs.surname.value.trim(),
            password: this.$refs.password.value.trim()
         };

         // Vérification que les champs trimés sont valides
         if (!userData.firstname) return this.toast.error("Le prénom est obligatoire");
         if (!userData.surname) return this.toast.error("Le nom de famille est obligatoire");
         if (!userData.password) return this.toast.error("Le mot de passe est obligatoire");

         // Vérification que les champs ne contiennent ni caractère spécial, ni chiffre
         if (!onlyAlphabetAndAccents(userData.firstname)) return this.toast.error("Le prénom doit être uniquement constitué de lettres");
         if (!onlyAlphabetAndAccents(userData.surname)) return this.toast.error("Le nom de famille doit être uniquement constitué de lettres");

         // Fetch de l'API /api/login/signup
         logUser(userData, "teacher", this.type === "Login" ? "signin" : "signup", data => {
            if (data.success) {
               this.toast.info("Bienvenue " + data.user.firstname);

               // Stockage des données de l'utilisateur dans le store Vuex
               this.$store.commit("setUser", {
                  id: data.user.id,
                  firstname: data.user.firstname,
                  surname: data.user.surname,
                  avatar: data.user.avatar,
                  type: data.user.type
               });

               // Passage de l'état de connexion à true
               this.$store.commit("setLoggedIn", true)

               // Redirection vers la page d'accueil
               router.push("/");
            } else {
               // Message d'erreur en cas d'identification invalide
               this.toast.error("Les Identifiants que vous avez donné sont invalides");
            }
         });
      }
   }
};
</script>