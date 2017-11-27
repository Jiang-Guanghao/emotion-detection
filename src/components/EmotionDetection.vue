<template>
    <div>
        <video id="video" width="25%" height="10%" autoplay></video>
        <canvas id="canvas" width="600" height="480" style="display: none;"></canvas>
        <button v-on:click.native='process'>Analyze</button>

        <div v-show="result" >
            <p>Anger: {{anger}}</span></p>
            <p>Blurred: {{blur}}</span></p>
            <p>Joy: {{joy}} </span> </p>
            <p>Sorrow: {{sorrow}} </span> </p>
            <p>Surprised: {{surprised}} </span> </p>
            <h4>Confidence: {{ confidence }} %</h4>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
export default {
  data () {
    return {
      loader: false,
      result: false,
      apiKey: 'AIzaSyCrRMoIORGzWf171LH-X5zvH0QruuoGtqY', // google cloud api Browser key
      anger: null,
      blur: null,
      headwear: null,
      sorrow: null,
      joy: null,
      surprised: null,
      confidence: null,
      data: {               // type vision api Request
        'requests': [{
          'features': [{
            'type': 'FACE_DETECTION'
          }],
          'image': {
            'content': null
          }
        }]
      }
    }
  },
  methods: {
    process () {
      const canvas = document.getElementById('canvas')
      const video = document.getElementById('video')
      const context = canvas.getContext('2d')
      const vm = this
      this.result = false
      this.loader = true
      context.drawImage(video, 0, 0, 640, 480)
      const base64 = canvas.toDataURL()
      const finalImage = base64.replace('data:image/png;base64,', '')
      this.data.requests[0].image.content = finalImage
      axios.post(`https://vision.googleapis.com/v1/images:annotate?key=${this.apiKey}`,
        this.data).then(response => {
          const result = response.data.responses[0].faceAnnotations[0]
          vm.anger = result.angerLikelihood
          vm.blur = result.blurredLikelihood
          vm.headwear = result.headwearLikelihood
          vm.joy = result.joyLikelihood
          vm.sorrow = result.sorrowLikelihood
          vm.surprised = result.surpriseLikelihood
          vm.confidence = this.confidenceInt(result.detectionConfidence)
          vm.result = true
        }).catch(error => {
          console.log(error)
        })
    },
    confidenceInt (num) {
      const dig = num.toFixed(2)
      if (dig === 1.0) {
        return 100
      } else {
        const str = dig.toString()
        return str.substring(2, 4)
      }
    }
  }
}

$(document).ready(function () {
  const video = document.getElementById('video')
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => {
      video.src = window.URL.createObjectURL(stream)
      video.play()
    })
  }
})
</script>

