<template>
  <v-layout>
    <v-navigation-drawer id="sidebar" class="secondary" light absolute permanent :width="340">
      <v-layout column fill-height>
        <v-toolbar flat color="transparent">
          <v-toolbar-side-icon>
            <v-img :src="require('@/assets/icon.png')" width="24px" height="24px" contain/>
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
      // Fetch task list first, then initialize `Contents.vue`
      // TODO: [implement credential generation] Debugging. Change to `false` on deployment
      initialized: true,

      // Anonymous class number and semester
      studentInfo: {
        class: this.$route.params.class,
        semester: this.$route.params.semester
      },
      // TODO: [implement credential generation] Debugging. Change to `tasks: []` on deployment
      tasks: [
        {
          id: '2018-2019-2-019',
          title: '汇编语言与接口',
          status: 0,
          questions: [
            {
              id: 1,
              description: '老师对教学科目的知识掌握如何？',
              options: [
                {
                  id: 'A',
                  description: '老师自己本身也没有很好的掌握所教科目的知识'
                },
                {
                  id: 'B',
                  description:
                    '老师基本可以讲清楚所教课程的内容，但是面对一些提问不能做出很好的回答'
                },
                {
                  id: 'C',
                  description:
                    '老师可以讲清楚所教课程的内容，并且能很好的回答同学的问题'
                },
                {
                  id: 'D',
                  description:
                    '老师可以讲清楚所教课程的内容，并且能在课本内容之上对知识进行拓展'
                }
              ]
            }
          ]
        },
        {
          id: '2018-2019-2-021',
          title: '汇编语言与接',
          status: 0,
          questions: [
            {
              id: 1,
              description: '老师对教学科目的知识掌握如何？',
              options: [
                {
                  id: 'A',
                  description: '老师自己本身也没有很好的掌握所教科目的知识'
                },
                {
                  id: 'B',
                  description:
                    '老师基本可以讲清楚所教课程的内容，但是面对一些提问不能做出很好的回答'
                },
                {
                  id: 'C',
                  description:
                    '老师可以讲清楚所教课程的内容，并且能很好的回答同学的问题'
                },
                {
                  id: 'D',
                  description:
                    '老师可以讲清楚所教课程的内容，并且能在课本内容之上对知识进行拓展'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  created() {
    // TODO: [implement credential generation] Debugging. Uncomment on deployment
    // this.fetchTaskList()
  },
  methods: {
    /**
     * fetchTaskList()
     * * Gets task list from backend on initialization
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
