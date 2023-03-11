<template>
   <div class="gradient-form bg-sky-200 md:h-screen grid h-screen place-items-center">

      <!-- Conteneur principal -->
      <div class="container content-center">
         <div class="xl:w-10/12 m-auto">
            <div class="block bg-white shadow-lg sm:rounded-lg">

               <!-- Deuxième conteneur -->
               <div class="flex flex-wrap g-0">
                  <div class="col-container w-full px-4 px-0">

                     <!-- Composant pour le portail enseignant -->
                     <teacher-portal type="Signup" />
                  </div>

                  <!-- Troisième conteneur -->
                  <div
                    class="col-container flex items-center lg:rounded-r-lg sm:rounded-b-lg lg:rounded-bl-none"
                    style="background: linear-gradient(to right, #1645be, #1364ba)"
                  >

                     <!-- Titre et description de la page  -->
                     <div class="text-white px-8 py-10 md:p-12 md:mx-6">
                        <h4 class="text-4xl font-semibold mb-6">Portail Enseignant</h4>
                        <p class="text-sm">
                           <strong>Quizzly</strong> permet la création de QCM, de manière facile,
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
import TeacherPortal from "@/components/Login/TeacherPortal.vue";

export default {
   name: "RegisterView",
   components: { TeacherPortal }
};
</script>

<style scoped>
.col-container {
   width: 100%;
}

@media (min-width: 1024px) {
   .col-container:nth-of-type(1) {
      width: 48%
   }

   .col-container:nth-of-type(2) {
      width: 52%
   }
}
</style>

