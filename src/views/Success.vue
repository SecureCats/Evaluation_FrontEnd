<template>
  <v-layout column fill-height>
    <v-toolbar flat color="transparent">
      <v-toolbar-side-icon>
        <v-icon>school</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span id="title">评教系统</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-layout align-center justify-center row fill-height>
      <v-layout id="tips-container" column align-start class="headline">
        <span id="title">耶，你的评教任务已经提交成功！</span>
        <span id="subtitle">Congratulations! Your answers have been received.</span>
        <v-btn id="backBtn" large color="#EB7E44" round outline>
          <v-icon left small>arrow_back</v-icon>返回教务处
        </v-btn>
      </v-layout>
      <v-img :src="require('@/assets/success.png')" min-height="300px" min-width="400px" contain />
    </v-layout>
    <Footer />
  </v-layout>
</template>

<script>
import Footer from '@/components/Footer'

export default {
  name: 'Success',
  components: {
    Footer
  },
  mounted() {
    this.$confetti.start({
      particles: [
        {
          type: 'heart'
        },
        {
          type: 'circle'
        }
      ],
      particlesPerFrame: 0.5
    })
    setTimeout(() => {
      this.$confetti.stop()
    }, 3000)
  }
}
</script>

<style scoped>
#title {
  font-family: 'Noto Serif SC', serif;
  font-weight: 700;
}
#subtitle {
  font-family: 'Noto Serif SC', serif;
}
#tips-container {
  padding: 80px;
}
#backBtn {
  margin-top: 80px;
  margin-left: -1px;
}
</style>
