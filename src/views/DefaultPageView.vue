<template>
   <div>
      <LabelsComponent v-if="userType === 'Enseignant'"/>
   </div>
</template>

<script>


import LabelsComponent from "@/components/DefaultPages/LabelsList.vue";

export default {
   name: "DefaultView",
   components: { LabelsComponent },
   computed: {
      userType: function() {
         return this.$store.getters.getUserType;
      }
   },
};
</script>