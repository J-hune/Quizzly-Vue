import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

import HomeView from "../views/HomeView.vue";
import SignupView from "@/views/SignupView";
import SigninView from "@/views/SigninView";
import NewTest from "@/views/Teacher/NewTestView.vue";
import AddQuestion from "@/views/Teacher/AddQuestionView.vue";
import EditQuestion from "@/views/Teacher/EditQuestionView.vue";
import StudentsList from "@/views/Teacher/StudentsList.vue";
import DefaultPage from "@/views/DefaultPageView.vue";
import { checkUserLogged } from "@/functions/login";
import ProfileView from "@/views/Student/ProfileView.vue";
import AddSequenceView from "@/views/Teacher/AddSequenceView.vue";
import SequencesList from "@/views/Teacher/SequencesList.vue";
import EditSequenceView from "@/views/Teacher/EditSequenceView.vue";
import StartSequenceView from "@/views/Teacher/StartSequenceView.vue";
import JoinSequenceView from "@/views/Student/JoinSequenceView.vue";
import LabelsList from "@/views/Teacher/LabelsList.vue";
import StartQuestionView from "@/views/Teacher/StartQuestionView.vue";
import StatisticsView from "@/views/Teacher/StatisticsView.vue";
import StudentStatisticsView from "@/views/Teacher/StudentStatisticsView.vue";

const routes = [
   {
      path: "/",
      name: "home",
      component: HomeView,
      children: [
         {
            path: "",
            name: "DefaultPage",
            component: DefaultPage,
            meta: { requiresAuth: true }
         },
         {
            path: "/labels",
            name: "labels",
            component: LabelsList,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/newQuestion",
            name: "newQuestion",
            component: AddQuestion,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/question/:id/edit",
            name: "editQuestion",
            component: EditQuestion,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/question/:id/start",
            name: "startQuestion",
            component: StartQuestionView,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/sequences",
            name: "sequences",
            component: SequencesList,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/newSequence",
            name: "newSequence",
            component: AddSequenceView,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/sequence/:id/edit",
            name: "editSequence",
            component: EditSequenceView,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/sequence/:id/start",
            name: "startSequence",
            component: StartSequenceView,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/sequence/:id/join",
            name: "joinSequence",
            component: JoinSequenceView,
            meta: { requiresAuth: true, userType: ["Etudiant"] }
         },
         {
            path: "/statistics",
            name: "statistics",
            component: StatisticsView,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/statistics/:id",
            name: "studentStatistics",
            component: StudentStatisticsView,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/newTest",
            name: "newTest",
            component: NewTest,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/students",
            name: "students",
            component: StudentsList,
            meta: { requiresAuth: true, userType: ["Enseignant"] }
         },
         {
            path: "/profile",
            name: "profile",
            component: ProfileView,
            meta: { requiresAuth: true, userType: ["Etudiant"] }
         }
      ]
   },
   {
      path: "/signup",
      name: "signup",
      component: SignupView
   },
   {
      path: "/signin",
      name: "signin ",
      component: SigninView
   }
];

const router = createRouter({
   history: createWebHistory(process.env.BASE_URL),
   routes
});


router.beforeEach(async (to, from, next) => {

   // Si l'utilisateur doit être auth mais ne l'est pas, il est redirigé
   if (to.meta.requiresAuth && !store.getters.isLoggedIn) {
      const userData = await checkUserLogged();

      // On stocke les données de l'utilisateur
      if (userData.firstname) {
         store.commit("setUser", {
            id: userData.id,
            firstname: userData.firstname,
            surname: userData.surname,
            avatar: userData.avatar,
            type: userData.type
         });

         store.commit("setLoggedIn", true);
      } else {
         return next("/signin");
      }
   }

   // Si l'utilisateur n'a pas le bon type, on le redirige vers "/"
   if (to.meta.userType && !to.meta.userType.includes(store.getters.getUserType)) {
      // Afficher un message d'erreur si l'utilisateur n'a pas les autorisations nécessaires
      alert("Vous n'avez pas les autorisations nécessaires pour accéder à cette page.");

      return next("/");
   }

   // Sinon, il peut continuer
   else {
      next();
   }
});

export default router;
