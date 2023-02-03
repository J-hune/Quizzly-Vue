<template>
   <div class="gradient-form bg-sky-200 md:h-screen grid h-screen place-items-center">
      <div class="container content-center">
         <div class="xl:w-10/12 m-auto">
            <div class="block bg-white shadow-lg rounded-lg">
               <div class="flex flex-wrap g-0">
                  <div class="lg:w-6/12 w-full px-4 px-0">
                     <div class="px-4 py-8 sm:p-12 mx-6">
                        <div class="text-center">
                           <h4 class="text-5xl font-semibold mt-1 mb-12">
                              Login
                           </h4>
                        </div>
                        <form @submit.prevent="logUser">
                           <div class="mb-4">
                              <input
                                ref="firstname"
                                type="text"
                                id="prenom"
                                maxlength="50"
                                placeholder="Prénom"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                              />
                           </div>
                           <div class="mb-4">
                              <input
                                ref="surname"
                                type="text"
                                id="nom"
                                maxlength="50"
                                placeholder="Nom de Famille"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                              />
                           </div>
                           <div class="mb-4">
                              <input
                                ref="password"
                                type="password"
                                id="password"
                                maxlength="100"
                                placeholder="Mot de passe"
                                class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                              />
                           </div>
                           <div class="text-center pt-1 mb-8 pb-1">
                              <button
                                class="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                                type="submit"
                                data-mdb-ripple="true"
                                data-mdb-ripple-color="light"
                                style="background-color: #1645be"
                              >
                                 Se connecter
                              </button>
                           </div>
                           <div class="flex items-center justify-between pb-6">
                              <p class="mb-0 mr-2">
                                 Vous n'êtes pas inscrits ?
                                 <router-link class="text-blue-500" to="/signup">Inscrivez vous !</router-link>
                              </p>
                           </div>
                        </form>
                     </div>
                  </div>
                  <div
                    class="lg:w-6/12 flex items-center lg:rounded-r-lg rounded-b-lg lg:rounded-bl-none"
                    style="background: linear-gradient(to right, #1645be, #1364ba)"
                  >
                     <div class="text-white px-8 py-10 md:p-12 md:mx-6">
                        <h4 class="text-4xl font-semibold mb-6">Quizzly</h4>
                        <p class="text-sm">
                           Ce site permet la création de QCM, de manière facile,
                           intuitive et efficace pour vos élèves quels que soient les thèmes
                           étudiés (Python, C, C++, Java, Latex, Markdown, Graphe)
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import { useToast } from "vue-toastification";
import { onlyAlphabetAndAccents } from "@/functions/string";
import { logUser } from "@/functions/login";
import router from "@/router";

export default {

   setup() {
      const toast = useToast();
      return { toast };
   },

   name: "RegisterView",
   methods: {
      logUser() {
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
         logUser(userData, data => {
            if (data.success) {
               this.toast.info("Bienvenue " + userData.firstname);
               router.push("/");
            } else {
               this.toast.error("Les Identifiants que vous avez donné sont invalides");
            }
         });
      }
   }
};
</script>
