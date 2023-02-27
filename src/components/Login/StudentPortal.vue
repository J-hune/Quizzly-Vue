<template>
   <div class="px-4 py-8 sm:p-12 mx-6">

      <!-- Titre de la page : Login ou Register -->
      <div class="text-center">
         <h4 class="text-5xl font-semibold mt-1 mb-12">
            {{ type }}
         </h4>
      </div>

      <!-- Form Étudiant: numéro etu et mot de passe -->
      <form @submit.prevent="logUser">
         <div class="mb-4">
            <input
              ref="id" type="number" id="id" placeholder="Numéro Étudiant"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
         </div>
         <div class="mb-4">
            <input
              ref="password" type="password" id="password" maxlength="100" placeholder="Mot de passe"
              class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            />
         </div>
         <div class="text-center pt-1 mb-8 pb-1">
            <button
              class="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
              type="submit" data-mdb-ripple="true" data-mdb-ripple-color="light" style="background-color: #1645be"
            >
               {{ type === "Login" ? "Se connecter" : "S'enregistrer" }}
            </button>
         </div>
      </form>
   </div>
</template>

<script>
import { logUser } from "@/functions/login";
import { useToast } from "vue-toastification";
import router from "@/router";
import index from "@/store";

export default {
   name: "StudentPortal",
   setup() {
      const toast = useToast();
      return { toast };
   },
   props: {
      type: String
   },
   methods: {
      logUser() {
         let userData = {
            id: this.$refs.id.value.trim(),
            password: this.$refs.password.value.trim()
         };

         // Vérification que les champs trimés sont valides
         if (!userData.id) return this.toast.error("Le numéro Étudiant est obligatoire");
         if (!userData.password) return this.toast.error("Le mot de passe est obligatoire");

         if (isNaN(parseInt(userData.id)) || userData.id.toString().length !== 8) return this.toast.error("Le numéro Étudiant doit être constitué de 8 chiffres");

         // Fetch de l'API /api/login/signup
         logUser(userData, "student", this.type === "Login" ? "signin" : "signup", data => {
            if (data.success) {
               this.toast.info("Bienvenue " + data.user.firstname);

               // On stocke les données de l'utilisateur
               index.commit("setUser", {
                  id: data.user.id,
                  firstname: data.user.firstname,
                  surname: data.user.surname,
                  type: data.user.type
               });

               index.commit("setLoggedIn", true);
               router.push("/");
            } else {
               this.toast.error("Les Identifiants que vous avez donné sont invalides");
            }
         });
      }
   }
};
</script>