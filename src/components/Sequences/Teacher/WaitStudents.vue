<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">

      <!-- Mot de passe de la séquence -->
      <h2 class="text-center font-bold text-2xl leading-10">Mot de passe de la {{ mode === "sequence" ? "séquence" : "question"
         }}:
         <span class="password" v-if="sequenceId">{{ sequenceId }}</span>
         <span class="password" v-else>********</span>
      </h2>

      <!-- Infos utiles -->
      <div class="mt-12 md:flex">
         <div class="md:w-1/2 md:pr-8">
            <p><strong>Partagez le mot de passe</strong> à vos élèves pour qu'ils puissent rejoindre le quiz.</p>
            <p class="mt-4">Vous pouvez inscrire vos élèves dans la section
               <router-link to="/students" class="text-blue-600"><strong>Mes Eleves</strong></router-link>
               .
            </p>
         </div>

         <div class="mt-6 md:mt-0 md:w-1/2 md:pl-8">
            <h3 class="text-xl">Nombre d'élèves connectés : {{ students.length }}</h3>
            <div class="flex flex-wrap mt-2 gap-2">
               <span class="student-name" v-for="(student, index) in students.slice(0, 10)" :key="index">
                  {{ student }}
               </span>
               <span v-if="students.length > 10">et {{ students.length - 10 }} autre(s)...</span>
            </div>
         </div>
      </div>
   </div>

   <!-- Bouton pour lancer la séquence -->
   <div class="sequence-buttons mt-14 text-right">
      <button
        class="relative w-full sm:w-auto sm:mr-3 bg-red-500 hover:bg-red-600 text-white
        font-bold py-2 px-7 rounded-lg right-0" @click="quitSequence">
         Quitter le quiz
      </button>
      <button
        class="relative w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg right-0" @click="$emit('startSequence')">
         {{ mode === "sequence" ? "Démarrer la séquence" : "Diffuser la question" }}
      </button>
   </div>
</template>

<script>
import Swal from "sweetalert2";
import router from "@/router";

export default {
   name: "WaitStudents",
   props: {
      sequenceId: String,
      students: {},
      mode: String
   },
   emits: ["startSequence"],
   methods: {
      quitSequence: function() {
         Swal.fire({
            title: "Voulez-vous vraiment quitter ?",
            text: `Si vous quittez le quiz en cours, vous ne pourrez plus revenir.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Quitter le quiz",
            cancelButtonText: "Annuler"
         }).then(async (result) => {
            // Si l'utilisateur a confirmé
            if (result.isConfirmed) {
               await router.push(this.mode === "sequence" ? "/sequences" : "/");
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

.student-name {
   background-color: #F7F5F9;
   padding: 0 6px;
   border-radius: 6px;
}

.sequence-buttons {
   width: 100%;
   border-top: solid 1px #eaeaea;
   padding: 20px 26px;
}
</style>