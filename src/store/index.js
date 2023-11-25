import { createStore } from "vuex";
import { auth } from "./auth.module";
import { user } from "./user.module";
import { admin } from "./admin.module";
import { chat } from "./chat.module";

const store = createStore({
  modules: {
    auth,
    user,
    admin,
    chat,
  },
});

export default store;
