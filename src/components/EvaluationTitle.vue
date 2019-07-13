<template>
  <v-layout column>
    <v-toolbar flat color="transparent">
      <v-toolbar-title class="headline text-uppercase" id="toolbar-title">请认真评价你的课程</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="primary" text-color="white" v-on="on">
            <span v-if="semester[2] === '1'">学年：{{ semester[0] }} - {{ semester[1] }} 秋季学期</span>
            <span v-else>学年：{{ semester[0] }} - {{ semester[1] }} 春季学期</span>
            <v-icon right>schedule</v-icon>
          </v-chip>
        </template>
        <span>你正在参加 {{ studentInfo.semester }} 学年的评教任务</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-chip color="success" text-color="white" v-on="on">
            班级：{{ classNum }}
            <v-icon right>face</v-icon>
          </v-chip>
        </template>
        <span>欢迎 {{ classNum }} 教学班的同学</span>
      </v-tooltip>
    </v-toolbar>
    <v-layout id="stage-container" row>
      <v-icon color="#a9a9a9" size="17px">apps</v-icon>
      <span id="stage-indicator">第 {{ stage }} 项：{{ tasks[stage - 1].title }}</span>
    </v-layout>
  </v-layout>
</template>

<script>
export default {
  name: 'EvaluationTitle',
  props: {
    stage: Number,
    tasks: Array,
    studentInfo: Object
  },
  data() {
    return {
      // Class number: 1901, stands for Major 19 - Class 01
      classNum: this.studentInfo.class,
      // Semester: 2018-2019-1 -> ['2018', '2019', '1']
      //  means: fall semester of 2018-2019
      semester: this.studentInfo.semester.split('-')
    }
  }
}
</script>

<style scoped>
#toolbar-title {
  font-family: 'Noto Serif SC', serif !important;
  font-weight: 700;
}
#stage-container {
  padding: 0 0 24px 24px;
}
#stage-indicator {
  margin-left: 8px;
  color: #a9a9a9;
}
</style>
