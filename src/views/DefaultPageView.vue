<template>
   <LabelsComponent v-if="userType === 'Enseignant'" />
   <LastSequences v-else />
</template>

<script>


import LabelsComponent from "@/components/DefaultPages/LabelsList.vue";
import LastSequences from "@/components/DefaultPages/LastSequences.vue";

export default {
   name: "DefaultView",
   components: { LastSequences, LabelsComponent },
   computed: {
      userType: function() {
         return this.$store.getters.getUserType;
      }
   }
};
</script>