<template>
    <div id="stereo-panner-node">
        <h1> Hello, Web Audio API </h1>
        <button @click="clickHandler"> Play / Pause </button>
        <button @click="reset"> Reset</button>
        <div id="config">
            <div class ="audio-note">
                <h3><span>音源</span></h3>
                <div class="item">
                    <label for="waveType"> type: <span> {{ waveType }} </span></label>
                    <select id="waveType" v-model="waveType" @change="changeHandler">
                        <option value="sine" selectd> sine </option>
                        <option value="square"> square </option>
                        <option value="sawtooth"> sawtooth </option>
                        <option value="triangle"> triangle </option>
                    </select>
                </div>
                <div class="item">
                    <label for="frequency">frequency : <span>{{frequency}}</span> </label>
                    <input type="range" min="0" max="4000" step="1" id="frequencyRange" v-model="frequency" @input="changeHandler">
                </div>
                <div class="item">
                    <label for="detune">detune : <span>{{detune}}</span> </label>
                    <input type="range" min="-2000" max="2000" step="1" vid="detuneRange" v-model="detune" @input="changeHandler">
                </div>
            </div>
            <div class="audio-note">
                <h3>增益節點(音量控制)</h3>
                <div class="item">
                    <label for="volume">volume : <span>{{volume}}</span> </label>
                    <input type="range" min="0" max="5" step="0.1" id="volumeRange" v-model="volume" @input="changeHandler">
                </div>
            </div>
            <div class="audio-note">
                <h3><span>雙聲道節點</span></h3>
                <div class="item">
                <label for="pan">pan : <span>{{pan}}</span> </label>
                <input type="range" min="-1" max="1" step="0.01" id="pan" v-model="pan" @input="changeHandler">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import audioUnlock from '../lib/audioUnlock'
export default {
    data(){
        const AudioContext = window.AudioContext || window.webkitAudioContext //跨瀏覽器
        const audioCtx = new AudioContext() //主控台
        const oscillator = audioCtx.createOscillator() //振盪器 (音源)
        const gainNode = audioCtx.createGain() //增益節點 (控制音量)
        // const filter = audioCtx.createBiquadFilter() //濾波器
        const stereoPanner = audioCtx.createStereoPanner() //雙聲道節點
        var first_play = true
        return{
            isPlaying: false,
            first_play,
            audioCtx,
            oscillator,
            gainNode,
            // filter,
            stereoPanner,
            waveType: 'sine', // sine, square, sawtooth, triangle
            frequency: 440, //音頻: A4
            detune: 0, //解諧(做和聲)
            volume: 1, //音量
            filterType: 'allpass', // lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch
            pan: 0, //左右聲道平衡
        }
    },
    methods: {
        clickHandler(){
            if(this.first_play){
                this.oscillator.start()
                this.first_play = false
            }
            if(this.isPlaying){
                this.stop()
            } else{
                this.play()
            }
            this.isPlaying = !this.isPlaying  
        },
        changeHandler(){
            this.setNoteConfig()
        },
        reset(){
            this.waveType = 'sine'
            this.frequency = 440
            this.detune = 0
            this.volume = 1
            this.pan = 0
            this.setNoteConfig()
        },
        play() {
            // this.filter.connect(this.audioCtx.destination)
            this.stereoPanner.connect(this.audioCtx.destination)
        },
        stop() {
            // this.filter.disconnect(this.audioCtx.destination)
            this.stereoPanner.disconnect(this.audioCtx.destination)
        },
        setNoteConfig() {
            this.oscillator.type = this.waveType
            this.oscillator.frequency.value = this.frequency
            this.oscillator.detune.value = this.detune
            this.gainNode.gain.value = this.volume
            // this.filter.type = this.filterType
            this.stereoPanner.pan.value = this.pan
        }
    },
    mounted(){
        audioUnlock(this.audioCtx)
        this.setNoteConfig()
        
        // 調整節點連接的方式：
        // 音源 -> 音量節點 -> 濾波器節點 -> 輸出
        this.oscillator.connect(this.gainNode)
        this.gainNode.connect(this.stereoPanner)
        // this.filter.connect(this.audioCtx.destination)
        
    },
}
</script>
<style lang="scss" scoped>
#stereo-panner-node {
  > button {
    margin: 10px;
  }
  #config {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    > .audio-note {
      width: 50vw;
      min-width: 300px;
      margin: 15px auto;
      border: solid 1px #d9d9d9;
      > h3 {
        text-align: left;
        margin: 10px;
        > span {
          display: inline-block;
          width: 100px;
          text-align: right;
        }
      }
      > .item {
        display: flex;
        width: 100%;
        max-width: 800px;
        margin: 5px auto;
        padding: 10px;
        > label {
          display: inline-block;
          min-width: 150px;
          text-align: right;
          > span {
            font-weight: 600;
            display: inline-block;
            width: 50px;
            text-align: center;
          }
        }
        > input {
          width: 100%;
          max-width: 600px;
          margin: 0 20px;
        }
        > select {
          margin: 0 20px;
        }
      }
    }
  }
}
</style>