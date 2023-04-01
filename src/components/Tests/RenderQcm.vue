<template>
   <div class="display-print markdown-body" id="printableElement">
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
   name: "RenderQuestions",
   methods: {
      renderMarkdown
   },
   props: { title: String, questions: Object },
   data: function() {
      return {
         html: []
      };
   },
   watch: {
      selectedQuestions: function() {
         this.html = this.selectedQuestions.map(e => renderMarkdown(e.enonce));
      }
   }
};

</script>

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
      print-color-adjust: exact;
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