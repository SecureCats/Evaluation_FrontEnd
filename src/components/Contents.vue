<template>
  <v-layout column>
    <EvaluationTitle :stage="currentStage" :tasks="tasks" :studentInfo="studentInfo" />

    <EvaluationTasks
      :stage="currentStage"
      :task="tasks[currentStage - 1]"
      v-on:collectAnswers="answerCollector"
      ref="evaluationTasks"
    />

    <v-layout id="nav-buttons">
      <v-spacer />
      <v-btn id="next-item-btn" color="primary" round large depressed @click="nextTaskOnClick">
        <span>下一步</span>
        <v-icon dark right>navigate_next</v-icon>
      </v-btn>
    </v-layout>

    <v-snackbar v-model="showNextTaskSnackbar" top color="primary">
      <v-progress-circular :size="20" v-model="countdownProgress"></v-progress-circular>
      <span id="snackbarInfo">你确定要进行下一项评教吗？</span>
      <v-btn flat @click="nextTaskFinalConfirm">是的</v-btn>
    </v-snackbar>

    <v-snackbar v-model="showUncompletedWarning" top color="error">
      <v-icon dark :size="20">error</v-icon>
      <span id="snackbarInfo">你有未回答的题目，请将全部问题回答完整。</span>
      <v-btn flat @click="closeUncompletedWarning">好的</v-btn>
    </v-snackbar>

    <v-snackbar v-model="showCompletedAllSnackbar" top color="success">
      <v-progress-circular :size="20" v-model="countdownProgress"></v-progress-circular>
      <span id="snackbarInfo">全部评教任务已经完成，确认提交结果？</span>
      <v-btn flat @click="submitTaskFinalConfirm">确认</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import EvaluationTitle from '@/components/EvaluationTitle'
import EvaluationTasks from '@/components/EvaluationTasks'

export default {
  name: 'Contents',
  components: {
    EvaluationTitle,
    EvaluationTasks
  },
  props: {
    tasks: Array,
    studentInfo: Object
  },
  data() {
    return {
      showNextTaskSnackbar: false,
      showCompletedAllSnackbar: false,
      showUncompletedWarning: false,

      countdownProgress: 100,
      timeoutId: null,

      currentStage: 1,

      currentAnswerList: Object,
      answerSheet: []
    }
  },
  methods: {
    /**
     * setSnackbarCountdown
     * * Count down for snackbar notification, 6 seconds
     */
    setSnackbarCountdown(timeLeft, timeTotal) {
      this.countdownProgress = (timeLeft * 100) / timeTotal
      if (timeLeft > 0) {
        this.timeoutId = setTimeout(() => {
          this.setSnackbarCountdown(timeLeft - 300, timeTotal)
        }, 300) //! Update progress every 0.3 seconds.
      }
    },

    /**
     * nextTaskOnClick()
     * * Show snackbar and double confirmation button
     */
    nextTaskOnClick() {
      let totalTasks = this.tasks.length

      if (this.currentStage < totalTasks) {
        this.showNextTaskSnackbar = true
      } else {
        this.showCompletedAllSnackbar = true
      }
      let countdownTime = 6 * 1000 // 6 seconds
      this.setSnackbarCountdown(countdownTime, countdownTime)
    },

    /**
     * nextTaskFinalConfirm()
     * * Final confirmation button, authenticates and proceed to next task
     */
    nextTaskFinalConfirm() {
      this.$refs.evaluationTasks.getAnswers()

      clearTimeout(this.timeoutId)
      this.showNextTaskSnackbar = false

      if (this.currentAnswerList === 'undone') {
        this.showUncompletedWarning = true
      } else {
        this.tasks[this.currentStage - 1].status = 1
        this.currentStage = this.currentStage + 1
        this.$emit('proceedToNextTask', this.currentStage)
      }
    },

    /**
     * answerCollector(answerList)
     * * Collect answers from compenent `EvaluationTasks.vue` and then appends them to answerList
     * @param answerList
     */
    answerCollector(answerList) {
      this.currentAnswerList = answerList
      if (answerList !== 'undone') {
        this.answerSheet.push(answerList)
      }
    },

    /**
     * submitTaskFinalConfirm()
     * * Submit answers to backend
     */
    submitTaskFinalConfirm() {
      this.$refs.evaluationTasks.getAnswers()

      clearTimeout(this.timeoutId)
      this.showCompletedAllSnackbar = false

      if (this.currentAnswerList === 'undone') {
        this.showUncompletedWarning = true
      } else {
        this.tasks[this.currentStage - 1].status = 1

        // TODO: Submit results
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(this.answerSheet))
        this.$router.push({ path: '/success' })
      }
    },

    closeUncompletedWarning() {
      this.showUncompletedWarning = false
    }
  }
}
</script>

<style>
#next-item-btn {
  font-weight: 700;
}
#nav-buttons {
  margin-right: 30px;
  margin-bottom: 30px;
}
#snackbarInfo {
  margin-left: 20px;
}
</style>
