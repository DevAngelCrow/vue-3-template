import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Nora from "@primeuix/themes/nora";

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Nora,
    options: { cssLayer: { name: "primevue", order: "theme, base, primevue" } },
  },
});
app.mount("#app");
