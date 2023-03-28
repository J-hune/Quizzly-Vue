<template>
   <div class="markdown-body" id="printableElement">
      <h2 class="mt-3 text-center">{{ title }}</h2>
      <div v-for="(question, index) in questions" :key="index" class="mt-6">

         <!-- Énoncé de la question (rendu html) -->
         <div v-html="renderMarkdown(question.enonce)" />

         <!-- Réponses de la question -->
         <div class="mt-3 mb-5 grid w-full grid-cols-2">

            <div v-for="(response, indexR) in question.reponses" :key="indexR">
               <div class="w-full flex pb-1" v-if="response.reponse">
                  <input type="checkbox" class="mr-2">
                  <div class="html-response" v-html="renderMarkdown(response.reponse)"/>
               </div>
            </div>
         </div>

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
}
;
</script>

<style>
.markdown-body {
   width: 100%;
   border: none;
   padding: 0 48px 48px 48px;
}

.markdown-body .html-response p {
   margin: 5px 0 5px 0;
}

.markdown-body .qcm-title {
   text-align: center;
   margin-top: 12px;
}
</style>