<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand">Navbar</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        v-if="isLoggedIn"
        class="collapse navbar-collapse"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" v-on:click="toHome"
              >Home</a
            >
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              id="navbarDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Menu
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
              <li>
                <a class="dropdown-item" v-on:click="toProfile">Profile</a>
              </li>
              <li>
                <a class="dropdown-item" v-on:click="toPublicChat"
                  >Public Chat (Beta)</a
                >
              </li>
              <li>
                <a class="dropdown-item" v-on:click="toPrivateChat"
                  >Private Chat (Beta)</a
                >
              </li>
              <li>
                <a class="dropdown-item" v-on:click="toGroupChat"
                  >Group Chat (Beta)</a
                >
              </li>
              <li v-if="isAdmin">
                <a class="dropdown-item" v-on:click="toAdmin">Admin</a>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" v-on:click="toPasswordChange"
                  >Change Password</a
                >
              </li>
              <li>
                <a class="dropdown-item" v-on:click="logout">Logout</a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import store from "../../store/index";

export default {
  name: "Navbar",
  methods: {
    logout() {
      store
        .dispatch("auth/logout")
        .then(() => {
          this.$router.push({ name: "Login" });
        })
        .catch((error) => {
          if (error.message) {
            this.errorMsg = error.message;
          }
          this.$router.push({ name: "Login" });
        });
    },
    toProfile() {
      this.$router.push({ name: "Profile" });
    },
    toHome() {
      this.$router.push({ name: "Home" });
    },
    toAdmin() {
      this.$router.push({ name: "Admin" });
    },
    toPasswordChange() {
      this.$router.push({ name: "PasswordChange" });
    },
    toPublicChat() {
      this.$router.push({ name: "PublicChannel" });
    },
    toPrivateChat() {
      this.$router.push({ name: "PrivateChannel" });
    },
    toGroupChat() {
      this.$router.push({ name: "GroupChannel" });
    },
  },
  computed: {
    /*
      to make a Vuex state property behaving reactively 
      you need to set it as a computed property.
    */
    isLoggedIn() {
      return store.state.auth.status.loggedIn;
    },
    isAdmin() {
      return store.state.auth.user.role == "ADMIN";
    },
  },
};
</script>

<style scoped></style>
