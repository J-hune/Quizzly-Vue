<template>
   <div class="display-print markdown-body" id="printableElement">

      <!-- Si c'est un sujet avec identification -->
      <div v-if="type === 1" class="mb-8">
         <div class="information-container mb-2">
            <p>Nom : <span class="text-gray-600 text-xs">...........................................................</span></p>
            <p>Numéro étudiant : <span class="text-gray-600 text-xs">...............................................</span></p>
         </div>
         <p>Prénom : <span class="text-gray-600 text-xs">...................................................</span></p>
      </div>


      <!-- Sinon si c'est un sujet anonyme -->
      <div v-else-if="type === 2" class="mb-8">
         <div class="flex">
            <div class="anonymous-information-container">
               <p>Épreuve de : <span v-for="index in 300" :key="index" class="text-gray-600 text-sm">.</span></p>
               <p>Date de l'Épreuve : <span v-for="index in 300" :key="index" class="text-gray-600 text-sm">.</span></p>
               <p>Mention : <span v-for="index in 300" :key="index" class="text-gray-600 text-sm">.</span></p>
               <p>Numéro Étudiant : <span v-for="index in 300" :key="index" class="text-gray-600 text-sm">.</span></p>
               <p>Numéro Salle/Amphi : <span v-for="index in 300" :key="index" class="text-gray-600 text-sm">.</span>
               </p>
            </div>

            <!-- Tableau pour que l'étudiant puisse "coder" son numéro étudiant -->
            <div class="student-id-container">
               <table>
                  <tr v-for="index in 6" :key="index">
                     <td v-for="number in 10" :key="number" :class="{'bg-gray-200': number % 2 === 0}">
                        <div class="check-container">
                           <span class="text-gray-700 text-xs">{{ number - 1 }}</span>
                           <span class="check-case" />
                        </div>
                     </td>
                  </tr>
               </table>
            </div>
         </div>
      </div>

      <h2 class="text-center">{{ title }}</h2>
      <div v-for="(question, index) in questions" :key="index" class="question-print mt-6">

         <!-- Énoncé de la question (rendu html) -->
         <div v-html="renderMarkdown(question.enonce)" />

         <!-- Réponses de la question si c'est un QCM -->
         <div v-if="question.type === 0" class="mt-3 mb-5 grid w-full grid-cols-2">

            <div v-for="(response, indexR) in question.reponses" :key="indexR">
               <div class="w-full flex pb-1" v-if="response.reponse">
                  <input type="checkbox" class="mr-2">
                  <div class="html-response" v-html="renderMarkdown(response.reponse)" />
               </div>
            </div>
         </div>

         <!-- Réponse si c'est un numérique ou une question ouverte -->
         <input v-else type="text"
                class="w-full mb-8 text-gray-700 bg-gray-50 rounded-md border border-gray-300
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out" />

         <hr v-if="index !== questions.length -1">
      </div>
   </div>

</template>

<script>
import { renderMarkdown } from "@/functions/textTohtml";

export default {
   name: "RenderTest",
   methods: {
      renderMarkdown
   },
   props: { title: String, questions: Object, type: Number },
   data: function() {
      return {
         html: []
      };
   },
   watch: {
      selectedQuestions: function() {
         console.log(12);
         this.html = this.selectedQuestions.map(e => renderMarkdown(e.enonce));
      }
   }
};
</script>

<style scoped>
.check-container {
   display: flex;
   flex-direction: column;
   text-align: center;
   padding: 0 1px;
}

.check-case {
   padding: 2px 8px;
   border-radius: 10px;
   border: solid 1px black;
   background-color: white;
}

.student-id-container {
   margin-left: 20px;
   padding-left: 20px;
   border-left: solid 2px #9f9f9f;
}

.information-container {
   display: flex;
   place-content: space-between;
}

.anonymous-information-container {
   display: flex;
   flex-direction: column;
   white-space: nowrap;
   overflow: hidden;
}

.information-container p, .anonymous-information-container p {
   margin: 2px 0;
}
</style>

<style>
@media screen {
   .display-print {
      display: none;
   }
}

@media print {
   @page {
      size: auto;
      margin: 40px 60px;
   }

   .display-print {
      display: block;
      position: absolute;
      background: white !important;
      top: 0;
      left: 0;
      width: 100%;
      min-height: 100% !important;
      z-index: 9999;
   }

   hr {
      border-top-width: 2px !important;
   }

   .question-print {
      break-inside: avoid;
   }

   .markdown-body {
      border: none !important;
      padding: 0 !important;
   }

   .markdown-body .html-response p {
      margin: 5px 0 5px 0;
   }
}


.markdown-body .qcm-title {
   text-align: center;
   margin-top: 12px;
}
</style>