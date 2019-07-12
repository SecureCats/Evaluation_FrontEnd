<template>
  <v-app id="app">
    <v-navigation-drawer class="secondary" light absolute permanent :width="340">
      <v-layout column fill-height>
        <v-toolbar flat color="transparent">
          <v-toolbar-side-icon>
            <v-icon>school</v-icon>
          </v-toolbar-side-icon>
          <v-toolbar-title class="headline text-uppercase">
            <span id="title">评教系统</span>
          </v-toolbar-title>
        </v-toolbar>
        <v-spacer></v-spacer>
        <v-toolbar-title id="progress-title" class="text-uppercase">
          <span id="title">进度：</span>
        </v-toolbar-title>
        <v-list>
          <v-list-tile v-for="item in items" :key="item.title">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.id + ". " + item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon v-if="item.status" color="success" size="20">check_circle</v-icon>
              <v-icon v-else color="error" size="20">remove_circle</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-spacer></v-spacer>
        <img src="./assets/background.png" width="340" height="119.5" />
      </v-layout>
    </v-navigation-drawer>

    <v-content id="main-contents">
      <Contents />
    </v-content>
  </v-app>
</template>

<script>
import Contents from "./components/Contents";

export default {
  name: "App",
  components: {
    Contents
  },
  data() {
    return {
      items: [
        { id: "1", title: "课程任务 1", status: 1 },
        { id: "2", title: "课程任务 2", status: 0 },
        { id: "3", title: "课程任务 3", status: 0 },
        { id: "4", title: "课程任务 4", status: 0 },
        { id: "5", title: "课程任务 5", status: 0 }
      ]
    };
  }
};
</script>

<style>
#app {
  font-family: "Noto Sans SC", sans-serif;
  background-color: #ffffff;
}
#title {
  font-family: "Noto Serif SC", serif;
  font-weight: 700;
}
#main-contents {
  margin-left: 360px;
}
</style>
