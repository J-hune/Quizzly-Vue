<template>
   <!-- Si l'utilisateur est un enseignant, on affiche la liste des questions -->
   <questions-list v-if="userType === 'Enseignant'" />

   <!-- Si l'utilisateur est un étudiant, on affiche les 3 dernières séquences -->
   <last-sequences v-else />
</template>

<script>
import LastSequences from "@/components/DefaultPages/LastSequences.vue";
import QuestionsList from "@/components/DefaultPages/QuestionsList.vue";

export default {
   name: "DefaultView",
   components: { QuestionsList, LastSequences },
   computed: {
      userType: function() {
         return this.$store.getters.getUserType;
      }
   }
};
</script>