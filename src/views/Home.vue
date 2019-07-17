<template>
  <v-layout>
    <v-navigation-drawer id="sidebar" class="secondary" light absolute permanent :width="340">
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
          <v-list-tile v-for="(task, index) in tasks" :key="task.title">
            <v-list-tile-content>
              <v-list-tile-title>{{ (index + 1) + ". " + task.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon v-if="task.status" color="success" size="20">check_circle</v-icon>
              <v-icon v-else color="error" size="20">remove_circle</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
        <v-spacer></v-spacer>
        <img src="@/assets/background.png" width="340" height="119.5" />
      </v-layout>
    </v-navigation-drawer>

    <v-content id="main-contents" v-if="initialized">
      <Contents :tasks="tasks" :studentInfo="studentInfo" />
    </v-content>
  </v-layout>
</template>

<script>
import Contents from '@/components/Contents'

export default {
  name: 'Home',
  components: {
    Contents
  },
  data() {
    return {
      studentInfo: {
        class: this.$route.params.class,
        semester: this.$route.params.semester
      },
      initialized: false,
      tasks: []
    }
  },
  created() {
    // TODO: fetching task list requires attention
    this.fetchTaskList()
  },
  methods: {
    /**
     * fetchTaskList()
     * * Gets task list from backend on initialization
     * TODO: Requires CORS?
     */
    fetchTaskList() {
      let baseApiUrl = '/api/v1/'
      this.$http
        .get(baseApiUrl + 'init', {
          params: {
            classno: this.$route.params.class,
            semester: this.$route.params.semester
          }
        })
        .then(resp => {
          this.initialized = true
          // eslint-disable-next-line no-console
          console.log(resp.data.tasks)
          this.tasks = resp.data.tasks
        })
        .catch(() => {
          // Class number and/or semester key invalid
          this.$router.push({ path: '/404' })
        })
    }
  }
}
</script>

<style scoped>
#title {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
}
#main-contents {
  margin-left: 360px;
}
#tasks-list {
  font-family: 'Noto Serif SC', serif;
}
#sidebar {
  position: fixed;
}
</style>
