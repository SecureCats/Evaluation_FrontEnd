<template>
  <v-layout column fill-height>
    <div id="task-content">
      {{ tasks }}
    </div>
  </v-layout>
</template>

<script>
export default {
  name: "EvaluationTasks",
  props: {
    tasks: Array
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
#task-content {
  padding: 0 0 0 24px;
}
</style>
