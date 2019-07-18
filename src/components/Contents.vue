<template>
  <v-layout column>
    <vue-element-loading :active="loading" spinner="bar-fade-scale" color="#3A8FCA" is-full-screen />
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

// TODO: [implement credential generation] Debugging. Remove on deployment
// eslint-disable-next-line no-unused-vars
import BigNumber from 'bignumber.js/bignumber.mjs'
import SHA256 from 'crypto-js/sha256'

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

      loading: false,

      countdownProgress: 100,
      timeoutId: null,

      currentStage: 1,

      currentAnswerList: Object,
      answerSheet: [],

      rnym: '',
      rynmParams: {
        gamma:
          '76082481189518171659618347271359316061974334924246135550677426868159186269917',
        g:
          '14324589826880501450566120667645878869223081658493572976099532413757027896194',
        rho:
          '14952013069126470028876872236652170302350646862625615129237430316253689',
        exp: '5088444'
      }
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
        // Set loading animations
        this.loading = true

        // TODO: certify user credentials (Change `setTimeout` to axios based http request)
        setTimeout(() => {
          this.tasks[this.currentStage - 1].status = 1
          this.submitAnswers()

          this.currentStage = this.currentStage + 1

          this.loading = false
          // Back to top
          this.$vuetify.goTo(0)
        }, 1000)
      }
    },

    /**
     * answerCollector(answerList)
     * * Collect answers from component `EvaluationTasks.vue`
     * @param answerList
     */
    answerCollector(answerList) {
      this.currentAnswerList = answerList
    },

    /**
     * submitTaskFinalConfirm()
     * * Final submit confirmation
     */
    submitTaskFinalConfirm() {
      this.$refs.evaluationTasks.getAnswers()

      clearTimeout(this.timeoutId)
      this.showCompletedAllSnackbar = false

      if (this.currentAnswerList === 'undone') {
        this.showUncompletedWarning = true
      } else {
        this.loading = true

        // TODO: certify user credentials (Change `setTimeout` to axios based http request)
        setTimeout(() => {
          this.tasks[this.currentStage - 1].status = 1

          // TODO: Submit results
          this.submitAnswers()

          this.loading = false
          this.$router.push({ path: '/success' })
        }, 1000)
      }
    },

    /**
     * submitAnswers()
     * * Submit answers to backend
     */
    submitAnswers() {
      // TODO: implement credential generation
      // eslint-disable-next-line no-unused-vars
      let credentials = this.genCredentials()

      let currentCourseId = this.tasks[this.currentStage - 1].id
      let answer = {
        rnym: 'rnym',
        result: this.currentAnswerList
      }
      // eslint-disable-next-line no-console
      console.log(currentCourseId, JSON.stringify(answer))

      // TODO: POST data to backend
      let url =
        '/api/v1/result?course_no=' +
        currentCourseId +
        '&class_no=' +
        this.studentInfo.class
      // eslint-disable-next-line no-console
      console.log(url)
    },

    closeUncompletedWarning() {
      this.showUncompletedWarning = false
    },

    // TODO: implement credential generation
    hash(val) {
      return parseInt(SHA256(String(val)), 16) % 731499577
    },

    genRandom(digit) {
      return Math.floor(Math.random() * Math.pow(2, digit))
    },

    /**
     * genCredentials()
     * * Generate credentials for backend to authenticate
     */
    genCredentials() {
      let priv = {}
      // eslint-disable-next-line no-unused-vars
      let params = {}

      // Generate randoms
      let randAttr = ['s', 'e', 'w', 'z', 'x']
      randAttr.forEach(i => {
        priv['r' + i] = this.genRandom(32)
      })

      priv['w'] = this.genRandom(32)
      priv['r'] = this.genRandom(32)
      // eslint-disable-next-line no-console
      console.log(priv)

      // Calculate C sets
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
