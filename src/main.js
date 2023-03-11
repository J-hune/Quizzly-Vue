import { createApp } from "vue";
import VueCookies from "vue-cookies";
import Toast from "vue-toastification";
import { vfmPlugin } from "vue-final-modal";
import VueFeather from "vue-feather";
import VueApexCharts from "vue3-apexcharts";

import "vue-toastification/dist/index.css";
import clickOutside from "@/Methods/click-outside";
import store from "@/store";

import App from "./App.vue";
import router from "./router";

import "./assets/tailwind.css";
import "./assets/markdown.css";
import "./assets/font.css";
import "highlight.js/styles/default.css";

const options = {
   position: "top-right",
   timeout: 5000,
   closeOnClick: true,
   pauseOnFocusLoss: false,
   pauseOnHover: true,
   draggable: true,
   draggablePercent: 0.6,
   showCloseButtonOnHover: false,
   hideProgressBar: false,
   closeButton: "button",
   icon: true,
   rtl: false
};


const app = createApp(App);
app.component(VueFeather.name, VueFeather);

app.use(router);
app.use(VueCookies);
app.use(Toast, options);
app.use(store);
app.use(VueApexCharts);

app.use(vfmPlugin({
   key: "$vfm",
   componentName: "VueFinalModal",
   dynamicContainerName: "ModalsContainer"
}));

app.directive("click-outside", clickOutside);

app.mount("#app");