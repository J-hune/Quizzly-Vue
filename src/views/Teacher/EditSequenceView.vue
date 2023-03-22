<template>
   <!-- Router push back -->
   <redirect-back back="Liste des séquences"/>

   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">
      <div class="mb-6">

         <!-- Titre du QCM -->
         <h2 class="mb-2 text-xl font-medium text-gray-900">Titre de la Séquence :</h2>
         <input type="text" v-model="title"
                class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Écrivez le titre de la Séquence..."/>
      </div>

      <hr class="mt-7 mb-8"/>

      <draggable-questions :selected-questions="selectedQuestions" :all-questions="allQuestions"/>
   </div>

   <!-- Bouton Impression -->
   <div class="save">
      <button
          class="relative mt-5 mr-5 sm:mr-6 mb-5 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-40" @click="save"
          :disabled="!title || selectedQuestions.length <= 0">
         Enregistrer les modifications
      </button>

      <button
          class="relative mt-5 ml-5 sm:ml-6 mr-3 mb-5 bg-red-500 hover:bg-red-600 text-white
        font-bold py-2 px-7 rounded-lg" @click="remove">
         Supprimer la Séquence
      </button>
   </div>
</template>

<script>
import DraggableQuestions from "@/components/Questions/draggableQuestions.vue";
import {fetchData} from "@/functions/fetch";
import {deleteSequence, editSequence} from "@/functions/sequences";
import {useToast} from "vue-toastification";
import RedirectBack from "@/components/redirectBack.vue";
import {useRoute} from "vue-router";

export default {
   name: "EditSequence",
   components: {RedirectBack, DraggableQuestions},
   setup() {
      const toast = useToast();
      return {toast};
   },
   data() {
      return {
         id: "Rz3dx334",
         title: "",
         selectedQuestions: [],
         allQuestions: [],
      };
   },
   methods: {
      /**
       * Enregistre les modifications apportées à la séquence
       * @async
       * @returns {Promise<void>}
       */
      save: async function () {
         const sequence = this.selectedQuestions.map(e => e.id);

         // On appelle l'api pour modifier la séquence
         await editSequence({title: this.title, questions: sequence}, this.id, (data) => {
            if (data.success) {
               this.toast.success("La séquence a été modifiée")
            } else {
               this.toast.error("La séquence n'a pas pu être modifiée")
            }
         })
      },

      /**
       * Supprime la séquence en cours
       * @returns {void}
       */
      remove: function () {
         deleteSequence(this.id, this.toast)
      }
   },
   async created() {
      const route = useRoute();

      // On récupère toutes les questions de l'enseignant
      const {data} = await fetchData("/questions/getQuestions/");
      this.allQuestions = data;

      const {data: sequence} = await fetchData("/sequences/getSequence/" + route.params.id);
      this.id = route.params.id
      this.title = sequence.titre
      this.selectedQuestions = data.filter(e => sequence.questions.includes(e.id))
   }
};
</script>

<style scoped>
.save {
   display: flex;
   flex-direction: row-reverse;
   margin-top: 5px;
   border-top: solid 1px #eaeaea;
}
</style>