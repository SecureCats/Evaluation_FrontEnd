<template>
  <v-layout column fill-height>
    <EvaluationTitle stage="1" />

    <EvaluationTasks tasks="Hello world" />

    <v-layout id="nav-buttons" row>
      <v-spacer />
      <v-btn id="next-item-btn" color="primary" depressed @click="nextTaskFirstConfirm">
        <span>下一步</span>
        <v-icon dark right>navigate_next</v-icon>
      </v-btn>
    </v-layout>

    <v-snackbar v-model="showSnackbar" top>
      <v-progress-circular :size="20" v-model="countdownProgress"></v-progress-circular>
      <span id="snackbarInfo">{{ snackbarText }}</span>
      <v-btn flat color="pink" @click="nextTaskFinalConfirm">是的</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import EvaluationTitle from "@/components/EvaluationTitle";
import EvaluationTasks from "@/components/EvaluationTasks";

export default {
  name: "Contents",
  components: {
    EvaluationTitle,
    EvaluationTasks
  },
  data() {
    return {
      showSnackbar: false,
      snackbarText: "你确定要进行下一项评教吗？",
      countdownProgress: 100,
      timeoutId: null,
    };
  },
  methods: {
    /**
     * *setSnackbarCountdown(timeLeft, timeTotal)
     * !Count down for snackbar notification, 6 seconds
     */
    setSnackbarCountdown(timeLeft, timeTotal) {
      this.countdownProgress = (timeLeft * 100) / timeTotal;
      if (timeLeft > 0) {
        this.timeoutId = setTimeout(() => {
          this.setSnackbarCountdown(timeLeft - 300, timeTotal);
        }, 300); // Update progress every 0.3 seconds.
      }
    },
    /**
     * *nextTaskFirstConfirm()
     * !Show snackbar and double confirmation button
     */
    nextTaskFirstConfirm() {
      this.showSnackbar = true;
      let countdownTime = 6 * 1000; // 6 seconds
      this.setSnackbarCountdown(countdownTime, countdownTime);
    },
    /**
     * *nextTaskFinalConfirm()
     * !Final confirmation button, authenticates and proceed to next task
     */
    nextTaskFinalConfirm() {
      clearTimeout(this.timeoutId)
      this.showSnackbar = false;
      alert("test");
    }
  }
};
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
