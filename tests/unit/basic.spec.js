import Vue from "vue";
import {
  shallowMount,
} from "@vue/test-utils";
import Success from "@/views/Success.vue";
import vuetify from "vuetify";
import Cookies from 'js-cookie';
import VueConfetti from 'vue-confetti'

describe("Success", () => {
  let wrapper;

  beforeEach(() => {
    Vue.use(vuetify);
    Vue.use(Cookies);

    Vue.use(VueConfetti);
    wrapper = shallowMount(Success, {
      Vue,

    });


  });


  it("should be a Vue instance", () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  })

});