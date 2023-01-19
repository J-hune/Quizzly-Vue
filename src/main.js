import { createApp } from "vue";
import VueCookies from "vue-cookies";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css"


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
app.use(router);
app.use(VueCookies);

app.mount("#app");
app.use(Toast, options);

