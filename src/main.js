import { createApp } from "vue";
import App from "./App.vue";
import { Quasar } from "quasar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "vue-loading-overlay/dist/css/index.css";
import quasarUserOptions from "./quasar-user-options";
import router from "./router";

createApp(App).use(Quasar, quasarUserOptions).use(router).mount("#app");
