<template>
   <questions-list v-if="userType === 'Enseignant'" />
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