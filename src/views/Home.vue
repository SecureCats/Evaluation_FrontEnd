<template>
  <v-layout>
    <v-navigation-drawer id="sidebar" class="secondary" light absolute permanent :width="340">
      <v-layout column fill-height>
        <v-toolbar flat color="transparent">
          <v-toolbar-side-icon>
            <v-img :src="require('@/assets/icon.png')" width="24px" height="24px" contain />
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
      <iframe id="f1" src="http://localhost:8001" frameborder="5" style="height:0;width:0;"></iframe>
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
      // Fetch task list first, then initialize `Contents.vue`
      initialized: false,

      // Anonymous class number and semester
      studentInfo: {
        class: this.$route.params.class,
        semester: this.$route.params.semester,
        AIP_url: process.env.VUE_APP_AIP_url
      },
      tasks: []
    }
  },
  mounted: function() {
    // for cross-origon communication
    window.addEventListener('message', function(evt) {
      if (typeof evt.data !== 'string' || evt.data.startsWith('on')) return
      // console.log(evt.origin)
      localStorage.setItem('seed', evt.data)
      let f = document.getElementById('f1')
      let p = f.parentElement
      p.removeChild(f)
      // console.log('saved')
    })
  },
  created() {
    this.fetchTaskList()
  },
  methods: {
    /**
     * fetchTaskList()
     * * Gets task list from backend on initialization
     */
    fetchTaskList() {
      let api = '/api/v1/init'
      this.$http
        .get(api, {
          params: {
            classno: this.$route.params.class,
            semester: this.$route.params.semester
          }
        })
        .then(resp => {
          // Tell `Contents.vue` to render
          this.initialized = true

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
