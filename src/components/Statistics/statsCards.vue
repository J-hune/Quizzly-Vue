<template>
   <div class="sm:flex sm:space-x-4 md:space-x-5">

      <!-- Total de Quiz -->
      <div class="card-widget mb-3 sm:mb-0">

         <!-- Icon de la carte -->
         <div class="card-icon" style="background-color: #a6acec;">
            <vue-feather type="activity" />
         </div>

         <!-- Texte de la carte -->
         <div class="sm:flex sm:items-start">
            <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
               <h3 class="text-sm leading-6 font-medium text-gray-400">Total des Quiz diffusés</h3>
               <p class="text-3xl font-bold text-black">
                  <count-up class="text-left" :end-val="totalQuizzes" />
               </p>
            </div>
         </div>
      </div>

      <!-- Total de Questions -->
      <div class="card-widget mb-3 sm:mb-0">

         <!-- Icon de la carte -->
         <div class="card-icon" style="background-color: #a56cc1;">
            <vue-feather type="cpu" />
         </div>

         <!-- Texte de la carte -->
         <div class="sm:flex sm:items-start">
            <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
               <h3 class="text-sm leading-6 font-medium text-gray-400">Total des Questions posées</h3>
               <p class="text-3xl font-bold text-black">
                  <count-up class="text-left" :end-val="totalQuestions" />
               </p>
            </div>
         </div>
      </div>

      <!-- Pourcentage de bonnes réponses -->
      <div class="card-widget">

         <!-- Icon de la carte -->
         <div class="card-icon" style="background-color: #18937b;">
            <vue-feather type="award" />
         </div>

         <!-- Texte de la carte -->
         <div class="sm:flex sm:items-start">
            <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
               <h3 class="text-sm leading-6 font-medium text-gray-400">Pourcentage de bonnes réponses</h3>
               <p class="flex text-3xl font-bold text-black">
                  <count-up :end-val="successRate" :duration="1.5" :options="{ suffix: '%' }" />
               </p>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import CountUp from "vue-countup-v3";

export default {
   name: "statsCards",
   components: { CountUp },
   props: {
      totalQuizzes: Number,
      totalQuestions: Number,
      successRate: Number
   }
};
</script>

<style scoped>
.card-widget {
   width: 100%;
   display: flex;
   align-items: center;
   background-color: white;
   border-radius: 15px;
   padding: 18px 30px;
   box-shadow: 0 9px 20px rgba(46, 35, 94, 0.07);
}

.card-icon {
   align-items: center;
   border-radius: 50%;
   color: #fff;
   display: flex;
   height: 42px;
   justify-content: center;
   margin-right: 18px;
   width: 42px;
   min-width: 42px;
}

.card-icon:hover {
   animation: tada 1.5s ease infinite;
}

@keyframes tada {
   0% {
      transform: scaleX(1)
   }
   10% {
      transform: scale3d(.9, .9, .9) rotate(-3deg)
   }
   20% {
      transform: scale3d(.9, .9, .9) rotate(-3deg)
   }
   30% {
      transform: scale3d(1.1, 1.1, 1.1) rotate(3deg)
   }
   50% {
      transform: scale3d(1.1, 1.1, 1.1) rotate(3deg)
   }
   70% {
      transform: scale3d(1.1, 1.1, 1.1) rotate(3deg)
   }
   90% {
      transform: scale3d(1.1, 1.1, 1.1) rotate(3deg)
   }
   40% {
      transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg)
   }
   60% {
      transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg)
   }
   80% {
      transform: scale3d(1.1, 1.1, 1.1) rotate(-3deg)
   }
   to {
      transform: scaleX(1)
   }
}
</style>