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
         <p>Nous vous remercions de votre
            <strong><span class="text-blue-600" @click="showMemoryGame = true">patience</span></strong>
            et espérons que vous passerez un moment agréable et instructif en
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

   <!-- "Popup" Modal permettant de selectionner et de créer des étiquettes -->
   <modal-component v-model="showMemoryGame" classes="p-3 sm:p-6 w-full max-w-3xl bg-slate-700 memory-container">
      <template v-slot:content>
         <memory-game />
      </template>
   </modal-component>
</template>

<script>
import Swal from "sweetalert2";
import router from "@/router";
import ModalComponent from "@/components/ModalComponent.vue";
import MemoryGame from "@/components/Memory/MemoryGame.vue";
import { Gapless5 } from "@regosen/gapless-5";
import tlmvpsp_easter_egg from "@/assets/sounds/tlmvpsp_easter_egg.mp3";
import { useToast } from "vue-toastification";

export default {
   name: "WaitTeacher",
   components: { MemoryGame, ModalComponent },
   props: { sequenceId: String },
   data: function() {
      return {
         showMemoryGame: false,
         keyInput: "",
         gapless: null,
         keyupListener: null
      };
   },
   setup() {
      const toast = useToast();
      return { toast };
   },
   mounted() {
      this.keyupListener = this.handleKeyUp.bind(this);
      window.addEventListener("keyup", this.keyupListener);
   },
   beforeUnmount() {
      if (this.gapless) this.gapless.stop();
      this.gapless = null;

      // On supprime l'event keyup
      window.removeEventListener("keyup", this.keyupListener);
   },
   methods: {
      /**
       * Affiche une boîte de dialogue demandant confirmation avant de quitter le quiz.
       * Si l'utilisateur confirme, il est redirigé vers la page d'accueil.
       */
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
      },


      /**
       * Gère l'événement keyup et ajoute la touche appuyée à la chaîne keyInput.
       * Si la chaîne keyInput contient la chaîne "tlmvpsp", on lance un 'ce dont on ne doit pas prononcer le nom'.
       *
       * @param {KeyboardEvent} event - L'événement keyup.
       */
      handleKeyUp: function(event) {
         this.keyInput += (event.key);

         // Ce don't on ne doit pas prononcer le nom
         if (this.keyInput.toLowerCase().includes("tlmvpsp")) {
            const tlmvpspJingle = new Gapless5({
               exclusive: true,
               volume: 0.5
            });

            tlmvpspJingle.addTrack(tlmvpsp_easter_egg);
            this.toast.info("Tout le monde veut prendre sa place!");

            // On joue le son
            tlmvpspJingle.play();
            this.gapless = tlmvpspJingle;
            this.keyInput = "";
         }
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

.custom-container {
   max-width: 100px;
}
</style>

<style>
.memory-container {
   background-color: #212a46 !important;
}
</style>