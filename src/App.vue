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
        <v-list id="tasks-list">
          <v-list-tile v-for="task in tasks" :key="task.title">
            <v-list-tile-content>
              <v-list-tile-title>{{ task.id + ". " + task.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon v-if="task.status" color="success" size="20">check_circle</v-icon>
              <v-icon v-else color="error" size="20">remove_circle</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-spacer></v-spacer>
        <img src="./assets/background.png" width="340" height="119.5" />
      </v-layout>
    </v-navigation-drawer>

    <v-content id="main-contents">
      <Contents :tasks="tasks" v-on:proceedToNextTask="nextTaskHandler" />
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
      tasks: [
        {
          id: 1,
          title: "课程任务 1",
          status: 0,
          questions: [
            {
              id: 1,
              description: "任务一的标题 1 是这个呀！",
              options: [
                { description: "满意！", value: 3 },
                { description: "可以忍一手...", value: 2 },
                { description: "不满意！", value: 1 }
              ]
            },
            {
              id: 2,
              description: "任务一的标题 2 是这个呀！",
              options: [
                { description: "满意！", value: 3 },
                { description: "可以忍一手...", value: 2 },
                { description: "不满意！", value: 1 }
              ]
            }
          ]
        },
        {
          id: 2,
          title: "课程任务 2",
          status: 0,
          questions: [
            {
              id: 1,
              description: "任务二的标题 1 是这个呀！",
              options: [
                { description: "满意！", value: 3 },
                { description: "可以忍一手...", value: 2 },
                { description: "不满意！", value: 1 }
              ]
            },
            {
              id: 2,
              description: "任务二的标题 2 是这个呀！",
              options: [
                { description: "满意！", value: 3 },
                { description: "可以忍一手...", value: 2 },
                { description: "不满意！", value: 1 }
              ]
            }
          ]
        },
        { id: 3, title: "课程任务 3", status: 0 },
        { id: 4, title: "课程任务 4", status: 0 },
        { id: 5, title: "课程任务 5", status: 0 }
      ]
    };
  },
  methods: {
    /**
     * *nextTaskHandler(stage)
     * !Updates progress on the sidebar
     */
    nextTaskHandler(stage) {
      // eslint-disable-next-line no-console
      console.log(stage);
      // ? Seems inessential ...
      // if (stage - 1 < this.tasks.length) {
      //   let completedStage = stage - 2
      //   this.tasks[completedStage].status = 1
      // } else {
      //   // You have completed all tasks.
      // }
    }
  }
};
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", "Noto Sans SC", sans-serif;
  background-color: #ffffff;
}
#title {
  font-family: "Noto Serif SC", serif;
  font-weight: 700;
}
#main-contents {
  margin-left: 360px;
}
#tasks-list {
  font-family: "Noto Serif SC", serif;
}
</style>
