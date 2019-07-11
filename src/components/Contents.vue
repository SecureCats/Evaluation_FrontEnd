<template>
  <v-layout column fill-height>
    <EvaluationTitle procedure="1" />

    <EvaluationTasks msg="Hello world" />

    <v-layout id="nav-buttons" row>
      <v-spacer/>
      <v-btn id="next-item-btn">
        <v-icon left>navigate_before</v-icon>
        <span>上一步</span>
      </v-btn>
      <v-btn id="next-item-btn" color="primary">
        <span>下一步</span>
        <v-icon dark right>navigate_next</v-icon>
      </v-btn>
    </v-layout>
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
    return {};
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
</style>
