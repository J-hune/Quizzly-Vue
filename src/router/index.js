import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import SignupView from "@/views/SignupView";
import SigninView from "@/views/SigninView";
import LabelsComponent from "@/components/LabelsComponent";
import QuestionsComponent from "@/components/QuestionsComponent";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    children: [
      {
        path: "",
        name: "Labels",
        component: LabelsComponent
      },
      {
        path: "/questions/:label",
        name: "questions",
        component: QuestionsComponent
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

export default router;
