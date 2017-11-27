import Vue from 'vue'
import Router from 'vue-router'
import EmotionDetection from '@/components/EmotionDetection'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'EmotionDetection',
      component: EmotionDetection
    }
  ]
})
