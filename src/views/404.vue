<template>
  <v-layout column fill-height>
    <v-toolbar flat color="transparent">
      <v-toolbar-side-icon>
        <v-img :src="require('@/assets/icon.png')" width="24px" height="24px" contain/>
      </v-toolbar-side-icon>
      <v-toolbar-title class="headline text-uppercase">
        <span id="title">评教系统</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-layout align-center justify-center row fill-height>
      <v-layout id="tips-container" column align-start class="headline">
        <span id="title">啊哦，你访问的页面并不存在哦。</span>
        <span id="subtitle">Oops, the page you're visiting doesn't exist.</span>
        <v-layout row>
          <v-btn id="backBtn" large color="#EB7E44" round outline>
            <v-icon left small>arrow_back</v-icon>返回教务处
          </v-btn>
          <v-btn id="backBtn" large color="#EB7E44" round outline>
            <v-icon left small>feedback</v-icon>继续评教
          </v-btn>
        </v-layout>
      </v-layout>
      <v-img :src="require('@/assets/not_found.png')" min-height="300px" min-width="400px" contain />
    </v-layout>
    <Footer />
  </v-layout>
</template>

<script>
import Footer from '@/components/Footer'

export default {
  components: {
    Footer
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
