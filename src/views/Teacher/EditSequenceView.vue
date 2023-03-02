<template>
   <redirect-back back="Liste des séquences"/>

   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">
      <div class="mb-6">

         <!-- Titre du QCM -->
         <h2 class="mb-2 text-xl font-medium text-gray-900">Titre de la Séquence :</h2>
         <input type="text" v-model="title"
                class="w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-500 focus:ring-2 outline-none
                   text-gray-900 py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
                placeholder="Écrivez le titre de la Séquene..."/>
      </div>

      <hr class="mt-7 mb-8"/>

      <draggable-questions :selected-questions="selectedQuestions" :all-questions="allQuestions"/>
   </div>

   <!-- Bouton Impression -->
   <div class="save">
      <button
          class="relative ml-auto mt-5 mr-6 mb-5 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-25 right-0" @click="save"
          :disabled="!title || selectedQuestions.length <= 0">
         Enregistrer les modifications
      </button>
   </div>
</template>

<script>
import DraggableQuestions from "@/components/Questions/draggableQuestions.vue";
import {fetchData} from "@/functions/fetch";
import {toRaw} from "vue";
import {editSequence} from "@/functions/sequences";
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
      save: async function () {
         const sequence = toRaw(this.selectedQuestions).map(e => e.id);

         // On appelle l'api pour modifier la séquence
         await editSequence({title: this.title, questions: sequence}, this.id, (data) => {
            if (data.success) {
               this.toast.success("La séquence a été modifiée")
            } else {
               this.toast.error("La séquence n'a pas pu être modifiée")
            }
         })
      }
   },
   async created() {
      const route = useRoute();

      // On récupère toutes les questions de l'enseignant
      const {data} = await fetchData("/questions/getQuestions/");
      this.allQuestions = data;

      // TODO modifier quand Hugo aura fait la route /sequences/getSequence/<id>
      //const {data: sequence} = await fetchData("/sequences/getSequence/" + route.params.id);
      this.id = route.params.id
      //this.title = sequence.titre
      //this.selectedQuestions = data.filter(e => sequence.questions.includes(e.id))
   }
};
</script>

<style>
.save {
   width: 100%;
   display: inline-flex;
   border-top: solid 1px #eaeaea;
}
</style>