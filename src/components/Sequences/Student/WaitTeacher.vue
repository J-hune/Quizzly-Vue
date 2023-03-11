<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">

      <!-- Mot de passe de la séquence -->
      <h2 class="text-center font-bold text-2xl leading-10">Mot de passe du quiz
         <span class="password" v-if="sequenceId">{{ sequenceId }}</span>
         <span class="password" v-else>********</span>
      </h2>


      <!-- Infos utiles -->
      <div class="mt-12">
         <p>Bienvenue sur <strong>Quizzly</strong>, notre plateforme de quiz.</p>
         <p>Veuillez patienter quelques instants, vous serez automatiquement redirigé(e) vers le quiz
            <strong>dès que le professeur aura commencé la diffusion.</strong></p>
         <br>
         <p>Nous vous remercions de votre patience et espérons que vous passerez un moment agréable et instructif en
            participant à ce quiz sur <strong><span class="text-blue-600">Quizzly</span></strong>.</p>
      </div>
   </div>

   <!-- Bouton pour quitter la séquence -->
   <div class="sequence-buttons mt-14 text-right">
      <button
        class="relative w-full sm:w-auto sm:mr-3 bg-red-500 hover:bg-red-600 text-white
        font-bold py-2 px-7 rounded-lg right-0" @click="quitSequence">
         Quitter le quiz
      </button>
   </div>
</template>

<script>
import Swal from "sweetalert2";
import router from "@/router";

export default {
   name: "WaitTeacher",
   props: {
      sequenceId: String
   },
   methods: {
      quitSequence: function() {
         Swal.fire({
            title: "Voulez-vous vraiment quitter ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Quitter le quiz",
            cancelButtonText: "Annuler"
         }).then(async (result) => {
            // Si l'utilisateur a confirmé
            if (result.isConfirmed) {
               await router.push("/");
            }
         });
      }
   }
};
</script>

<style scoped>
.password {
   background-color: #eeebf3;
   padding: 3px 5px;
   border-radius: 6px;
}

.sequence-buttons {
   width: 100%;
   border-top: solid 1px #eaeaea;
   padding: 20px 26px;
}
</style>