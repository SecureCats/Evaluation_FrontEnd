<template>
  <v-layout id="task-content" column>
    <template v-for="question in task.questions">
      <v-layout column :key="question.id">
        <v-layout row>
          <v-icon size="18">thumb_up</v-icon>
          <span id="question-title">{{ question.description }}</span>
        </v-layout>
        <v-radio-group column v-model="answerList[question.id]" :mandatory="true">
          <template v-for="option in question.options">
            <v-radio
              :key="option.id"
              :label="option.description"
              color="primary"
              :value="option.id"
            />
          </template>
        </v-radio-group>
      </v-layout>
    </template>
  </v-layout>
</template>

<script>
export default {
  name: 'EvaluationTasks',
  props: {
    stage: Number,
    task: Object
  },
  data() {
    return {
      answerList: {}
    }
  },
  // mounted() {
  //   // let questionsCount = this.task.questions.length
  //   this.task.questions.forEach(question => {
  //     this.answerList[question.id] = null;
  //   });
  // },
  methods: {
    getAnswers() {
      // The number of questions in task
      let questionsCount = this.task.questions.length
      // The number of answers collected
      let answersCount = Object.keys(this.answerList).length

      if (questionsCount === answersCount) {
        // eslint-disable-next-line no-console
        console.log(this.answerList)
        this.$emit('collectAnswers', this.answerList)
        this.answerList = {}
      } else {
        this.$emit('collectAnswers', 'undone')
      }
    }
  }
}
</script>

<style scoped>
#task-content {
  padding: 24px;
}
#question-title {
  padding: 0 0 0 12px;
  font-size: 16px;
  /* font-weight: 700; */
}
#question-options {
  font-size: 14px !important;
}
</style>
