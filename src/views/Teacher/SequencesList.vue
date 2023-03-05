<template>
   <div class="px-7 md:px-16 pt-10 pb-14 w-full">

      <!-- Titre et description Composant -->
      <div class="flex flex-col w-full mb-12 py-1">
         <h1 class="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Mes Séquences</h1>
         <p class="leading-relaxed text-base">Les séquences que vous avez déjà créées sont affichées ci-dessous.<br>
            Cliquez sur une séquence pour la modifier ou lancer la séquence pédagogique.</p>
      </div>

      <!-- input Search -->
      <input type="text" v-model="search"
             class="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 mb-5
                   focus:ring-indigo-200 focus:border-indigo-200 focus:ring-2 outline-none
                   py-1 px-3 leading-8 transition-colors duration-150 ease-in-out"
             placeholder="Filtrer par titre... (ex: Les Automates...)"/>

      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-5">

         <!-- Pour chaque séquence -->
         <div class="w-full" v-for="sequence in matchingSequences" :key="sequence.id">
            <sequence-card @click="sequenceInteraction(sequence.id)" :sequence="sequence"/>
         </div>

         <!-- Div button permettant d'ajouter une séquence (push router) -->
         <div class="w-full">
            <div class="new-sequence h-full p-6 pb-4 rounded-lg flex flex-col relative cursor-pointer"
                 @click="redirectSequenceCreation">
               <svg class="svg-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="M836 476H548V188c0-19.8-16.2-36-36-36s-36 16.2-36 36v288H188c-19.8 0-36 16.2-36 36s16.2 36 36 36h288v288c0 19.8 16.2 36 36 36s36-16.2 36-36V548h288c19.8 0 36-16.2 36-36s-16.2-36-36-36z"/>
               </svg>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import router from "@/router";
import SequenceCard from "@/components/Sequences/SequenceCard.vue";
import {sequenceInteraction} from "@/functions/sequences";
import {useToast} from "vue-toastification";
import {fetchData} from "@/functions/fetch";

export default {
   name: "SequencesList",
   components: {SequenceCard},
   setup() {
      const toast = useToast();
      return {toast};
   },
   data: function () {
      return {
         sequences: [],
         search: ""
      };
   },
   async created() {
      const { data } = await fetchData("/sequences/getAllSequences");
      this.sequences = data;
   },
   computed: {
      matchingSequences() {
         return this.sequences.filter(e => e.titre.toLowerCase().includes(this.search.trim().toLowerCase()));
      }
   },
   methods: {
      redirectSequenceCreation: function () {
         router.push("/newSequence");
      },
      sequenceInteraction: function (id) {
         sequenceInteraction(id, router, this.toast, () => {
            this.sequences = this.sequences.filter(e => e.id !== id);
         });
      }
   },
};
</script>

<style scoped>
.new-sequence {
   border-color: #a6acec;
   border-style: dashed;
   border-width: 2px;
   place-content: center;
   align-items: center;
}

.new-sequence svg {
   width: 60px;
   fill: #a6acec;
}
</style>