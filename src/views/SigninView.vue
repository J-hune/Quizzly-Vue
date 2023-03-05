<template>
   <div class="gradient-form bg-sky-200 md:h-screen grid h-screen place-items-center">
      <div class="container content-center">
         <div class="xl:w-10/12 m-auto">
            <div class="block bg-white shadow-lg sm:rounded-lg">
               <div class="flex flex-wrap g-0">
                  <div class="col-container w-full px-4 px-0">
                     <teacher-portal v-if="portailEnseignant" type="Login" />
                     <student-portal v-else type="Login" />
                  </div>
                  <div
                    class="col-container flex items-center lg:rounded-r-lg sm:rounded-b-lg lg:rounded-bl-none"
                    style="background: linear-gradient(to right, #1645be, #1364ba)"
                  >
                     <div class="lg:mt-8 text-white px-8 py-10 md:p-12 md:mx-6">
                        <h4 class="text-4xl font-semibold mb-6">
                           {{ portailEnseignant ? "Portail Enseignant" : "Portail Etudiant" }}</h4>
                        <p class="text-sm">
                           <strong>Quizzly</strong> permet la création de QCM, de manière facile,
                           intuitive et efficace pour vos élèves quels que soient les thèmes
                           étudiés (Python, C, C++, Java, Latex, Markdown, Graphe)
                        </p>

                        <!-- Bouton permettant de changer de portail : Enseignant - Etudiant -->
                        <button type="button" @click="portailEnseignant = !portailEnseignant"
                                class="flex items-center mt-8 inline-block px-5 py-2 border-2 border-white text-white font-medium text-sm leading-tight rounded
                                uppercase hover:bg-white hover:text-gray-700 focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                           {{ portailEnseignant ? "Portail Etudiant" : "Portail Enseignant" }}

                           <svg viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 ml-2 -mr-1" style="">
                              <path fill-rule="evenodd"
                                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clip-rule="evenodd"></path>
                           </svg>

                        </button>

                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import TeacherPortal from "@/components/Login/TeacherPortal.vue";
import StudentPortal from "@/components/Login/StudentPortal.vue";

export default {
   name: "RegisterView",
   data() {
      return {
         portailEnseignant: true
      };
   },
   components: { StudentPortal, TeacherPortal }
};
</script>

<style scoped>
.col-container {
   width: 100%;
}

@media (min-width: 1024px) {
   .col-container:nth-of-type(1) {
      width: 45%
   }

   .col-container:nth-of-type(2) {
      width: 55%
   }
}
</style>
