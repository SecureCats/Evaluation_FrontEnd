<template>
  <v-layout id="task-content" column>
    <template v-for="question in task.questions">
      <v-layout column :key="question.id">
        <v-layout row>
          <v-icon size="18">thumb_up</v-icon>
          <span id="question-title">{{ question.description }}</span>
        </v-layout>
        <v-radio-group column>
          <template v-for="option in question.options">
            <v-radio
              :key="option.value"
              :label="option.description"
              color="primary"
              :value="option.value"
            />
          </template>
        </v-radio-group>
      </v-layout>
    </template>
  </v-layout>
</template>

<script>
export default {
  name: "EvaluationTasks",
  props: {
    stage: Number,
    task: Object
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
#task-content {
  padding: 24px 0 24px 24px;
}
#question-title {
  padding: 0 0 0 12px;
  font-size: 16px;
  font-weight: 700;
}
#question-options {
  font-size: 14px !important;
}
</style>
