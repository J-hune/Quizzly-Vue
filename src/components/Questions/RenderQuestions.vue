<template>
   <div class="markdown-body" id="printableElement">
      <h2 class="mt-3 text-center">{{ title }}</h2>
      <div v-for="(question, index) in questions" :key="index" class="mt-6">

         <!-- Énoncé de la question (rendu html) -->
         <div v-for="(htmlElement, index) in TextToHtml(question.enonce)" :key="index">
            <div v-html="htmlElement" />
         </div>

         <!-- Réponses de la question -->
         <div class="mt-3 mb-5 grid w-full grid-cols-2">

            <div v-for="(response, indexR) in question.reponses" :key="indexR">
               <div class="w-full flex pb-1" v-if="response.reponse">
                  <input type="checkbox" class="mr-2">
                  <div v-for="(htmlResponse, indexRH) in TextToHtmMarkdownOnly(response.reponse)" :key="indexRH">
                     <div class="html-response" v-html="htmlResponse" />
                  </div>
               </div>
            </div>
         </div>

         <hr v-if="index !== questions.length -1">
      </div>
   </div>

</template>

<script>

import { TextToHtml, TextToHtmMarkdownOnly } from "@/functions/textTohtml";

export default {
   name: "RenderQuestions",
   methods: {
      TextToHtmMarkdownOnly,
      TextToHtml
   },
   props: { title: String, questions: Object },
   data: function() {
      return {
         html: []
      };
   },
   watch: {
      selectedQuestions: {
         handler: function() {
            this.html = this.selectedQuestions.map(e => TextToHtml(e.enonce));
         }
      }
   }
}
;
</script>

<style>
.save {
   width: 100%;
   display: inline-flex;
   border-top: solid 1px #eaeaea;
}

.markdown-body .html-response p {
   margin: 5px 0 5px 0;
}
</style>