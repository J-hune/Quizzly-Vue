<template>
   <!-- Block Principal -->
   <div class="px-7 md:px-16 pt-10 w-full">

      <!-- Mot de passe de la séquence -->
      <h2 class="text-center font-bold text-2xl leading-10">Mot de passe de la séquence:
         <span class="password" v-if="sequenceId">{{ sequenceId }}</span>
         <span class="password" v-else>********</span>
      </h2>

      <div class="question-statement">

         <!-- Énoncé de la question (rendu html) -->
         <div v-for="(htmlElement, index) in TextToHtml(question.enonce)" :key="index">
            <div v-html="htmlElement"/>
         </div>
      </div>

      <!-- Affichage des réponses possibles (cas QCM) -->
      <p v-if="question.type === 0" class="mt-6">Veuillez sélectionner les réponses qui sont valides. Il peut n'y avoir aucune réponse valide.</p>

      <div class="responses-container" v-if="question.type === 0">
         <div class="response" v-for="response in question.reponses" :key="response.id"
              @click="toggleResponse(response.id)" :class="selected.includes(response.id) && 'selected'">
            <div v-for="(htmlResponse, indexRH) in TextToHtmMarkdownOnly(response.reponse)"
                 :key="indexRH">
               <div class="html-response" v-html="htmlResponse"/>
            </div>
         </div>
      </div>
   </div>

   <!-- Boutons -->
   <div class="sequence-buttons mt-10 text-right sm:flex">
      <div class="sm:flex ml-auto">
         <button
             class="relative w-full sm:w-auto sm:mr-3 bg-red-500 hover:bg-red-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-25 right-0" @click="quitSequence">
            Quitter
         </button>
         <button
             class="relative w-full sm:w-auto mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-600 text-white
        font-bold py-2 px-7 rounded-lg disabled:opacity-25 right-0"
             @click="handleClick" :disabled="!canSubmit">
            Envoyer la réponse
         </button>
      </div>
   </div>
</template>

<script>
import Swal from "sweetalert2";
import router from "@/router";
import {useToast} from "vue-toastification";
import {TextToHtml, TextToHtmMarkdownOnly} from "@/functions/textTohtml";

export default {
   name: "RenderQuestion",
   data: function () {
      return {
         selected: []
      }
   },
   props: {
      sequenceId: String,
      question: Object,
      lastQuestion: Boolean,
      canSubmit: Boolean
   },
   setup() {
      const toast = useToast();
      return {toast};
   },
   methods: {
      TextToHtmMarkdownOnly,
      TextToHtml,
      quitSequence: function () {
         Swal.fire({
            title: "Voulez-vous vraiment quitter ?",
            text: `Si vous quittez la séquence en cours, vous ne pourrez plus revenir.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Quitter la séquence",
            cancelButtonText: "Annuler"
         }).then(async (result) => {
            // Si l'utilisateur a confirmé
            if (result.isConfirmed) {
               await router.push("/")
            }
         })
      },
      handleClick: function () {
         // TODO
      },
      toggleResponse: function (id) {
         if (this.selected.includes(id)) this.selected = this.selected.filter(e => e !== id)
         else this.selected = [...this.selected, id]
      }
   }
}
</script>

<style scoped>
.password {
   background-color: #eeebf3;
   padding: 3px 5px;
   border-radius: 6px;
}

.question-statement {
   padding: 12px;
   border: solid 2px #d0c8dd;
   border-radius: 10px;
   margin-top: 22px;
}

.responses-container {
   display: flex;
   flex-wrap: wrap;
   margin-top: 12px;
   gap: 15px;
}

.response {
   background-color: #eeebf3;
   padding: 8px 12px;
   border-radius: 6px;
   border: solid 2px #eeebf3;
   cursor: pointer;
   flex-basis: 0;
   flex-grow: 1;
   white-space: nowrap;
}

.response.selected {
   border-color: #3b82f6
}

.sequence-buttons {
   width: 100%;
   border-top: solid 1px #eaeaea;
   padding: 20px 26px;
}
</style>