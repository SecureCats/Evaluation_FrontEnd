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
<<<<<<< HEAD
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
  beforeMount() {
    // TODO: fetching task list requires attention
    // this.fetchTaskList()
    this.tasks = [
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
          },
          {
            id: 2,
            description: '老师的教学方式如何？',
            options: [
              {
                id: 'A',
                description: '念PPT我也会'
              },
              {
                id: 'B',
                description: '正常的上课，偶尔有提问或者课堂小测'
              },
              {
                id: 'C',
                description: '有活跃的课堂气氛，热烈的与同学们探讨问题'
              }
            ]
          },
          {
            id: 3,
            description: '老师对知识的讲解能力如何？',
            options: [
              {
                id: 'A',
                description: '不知所云，不如看书'
              },
              {
                id: 'B',
                description:
                  '上课能听懂整体知识的架构，细节之处还要看PPT和课本才能完全搞懂'
              },
              {
                id: 'C',
                description: '老师讲课内容生动形象，深入浅出，通俗易懂'
              }
            ]
          },
          {
            id: 4,
            description:
              '老师在课堂上是否有接打电话，迟到早退，辱骂学生等不当行为？',
            options: [
              {
                id: 'A',
                description: '出现过'
              },
              {
                id: 'B',
                description: '从来没有出现过'
              }
            ]
          }
        ]
      },
      {
        id: '2018-2019-2-208',
        title: '计算机网络',
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
          },
          {
            id: 2,
            description: '老师的教学方式如何？',
            options: [
              {
                id: 'A',
                description: '念PPT我也会'
              },
              {
                id: 'B',
                description: '正常的上课，偶尔有提问或者课堂小测'
              },
              {
                id: 'C',
                description: '有活跃的课堂气氛，热烈的与同学们探讨问题'
              }
            ]
          },
          {
            id: 3,
            description: '老师对知识的讲解能力如何？',
            options: [
              {
                id: 'A',
                description: '不知所云，不如看书'
              },
              {
                id: 'B',
                description:
                  '上课能听懂整体知识的架构，细节之处还要看PPT和课本才能完全搞懂'
              },
              {
                id: 'C',
                description: '老师讲课内容生动形象，深入浅出，通俗易懂'
              }
            ]
          },
          {
            id: 4,
            description:
              '老师在课堂上是否有接打电话，迟到早退，辱骂学生等不当行为？',
            options: [
              {
                id: 'A',
                description: '出现过'
              },
              {
                id: 'B',
                description: '从来没有出现过'
              }
            ]
          }
        ]
      },
      {
        id: '2018-2019-2-201',
        title: '计算机组成原理',
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
          },
          {
            id: 2,
            description: '老师的教学方式如何？',
            options: [
              {
                id: 'A',
                description: '念PPT我也会'
              },
              {
                id: 'B',
                description: '正常的上课，偶尔有提问或者课堂小测'
              },
              {
                id: 'C',
                description: '有活跃的课堂气氛，热烈的与同学们探讨问题'
              }
            ]
          },
          {
            id: 3,
            description: '老师对知识的讲解能力如何？',
            options: [
              {
                id: 'A',
                description: '不知所云，不如看书'
              },
              {
                id: 'B',
                description:
                  '上课能听懂整体知识的架构，细节之处还要看PPT和课本才能完全搞懂'
              },
              {
                id: 'C',
                description: '老师讲课内容生动形象，深入浅出，通俗易懂'
              }
            ]
          },
          {
            id: 4,
            description:
              '老师在课堂上是否有接打电话，迟到早退，辱骂学生等不当行为？',
            options: [
              {
                id: 'A',
                description: '出现过'
              },
              {
                id: 'B',
                description: '从来没有出现过'
              }
            ]
          }
        ]
      }
    ]
=======
  created() {
    this.fetchTaskList()
>>>>>>> 2c86a669c139cf840faad5a6b88412cdb166f7d3
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
