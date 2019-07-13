<template>
  <v-app id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/404">404</router-link>
    </div>
    <router-view />
  </v-app>
</template>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', 'Noto Sans SC', sans-serif;
  background-color: #ffffff;
}
</style>
