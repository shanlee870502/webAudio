<template>
  <div id="panner-node">
    <h1>Panner Node</h1>
    <button @click="clickHandler"> Play / Pause </button>
    <button @click="reset"> Reset </button>
    <div id="config">
      <div class="audio-note">
        <h3><span>音源</span></h3>
        <div class="item">
          <label for="frequency">frequency : <span>{{frequency}}</span> </label>
          <input type="range" min="0" max="1960" step="1" id="frequencyRange" v-model="frequency" @input="changeHandler">
        </div>
      </div>
      <div class="audio-note">
        <h3><span>增益節點</span></h3>
        <div class="item">
          <label for="volume">volume : <span>{{volume}}</span> </label>
          <input type="range" min="0" max="5" step="0.1" id="volumeRange" v-model="volume" @input="changeHandler">
        </div>
      </div>
    </div>
    <div id="drag-area" data-role="drag-drop-container" v-on="dragEvent">
      <div id="listener" :style="{left: this.dragData.listener.x + 'px', top: this.dragData.listener.y + 'px'}"> 聽者 </div>
      <div id="source" :style="{left: this.dragData.source.x + 'px', top: this.dragData.source.y + 'px'}"> 音源 </div>
    </div>
  </div>
</template>
<script>
import audioUnlock from '../lib/audioUnlock'
export default {
    data() {
        const AudioContext = window.AudioContext || window.webkitAudioContext
        const audioCtx = new AudioContext()
        const oscillator = audioCtx.createOscillator()
        const gainNode = audioCtx.createGain()
        const panner = audioCtx.createPanner()
        const listener = audioCtx.listener
        var first_play = true
        return{
            audioCtx,
            oscillator,
            gainNode,
            panner,
            listener,
            first_play,
            isPlaying: false,
            waveType: 'triangle', // sine, square, sawtooth, triangle
            frequency: 440,
            detune: 0,
            volume: 1,

            dragginElem: '',
            dragData: {
                listener:{
                    x:350,
                    y:350
                },
                source: {
                    x:400,
                    y:400
                }
            }
        }
    },
    methods:{
        clickHandler(){
            if(this.first_play){
                this.first_play = false
                this.oscillator.start()
                
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
            this.frequency = 440
            this.volume = 1
            this.dragData = {
                listener:{
                    x: window.innerWidth /2 + 20,
                    y: window.innerHeight/2 - 50,
                },
                source:{
                    x: window.innerWidth/2 -20,
                    y: window.innerHeight/2 + 50,
                }
            }
            this.setNoteConfig()
        },
        play(){
            this.panner.connect(this.audioCtx.destination)
        },
        stop(){
            this.panner.disconnect(this.audioCtx.destination)
        },
        setNoteConfig(){
            this.oscillator.type = this.waveType
            this.oscillator.frequency.value = this.frequency
            this.oscillator.detune.value = this.detune
            this.gainNode.gain.value = this.volume
            this.panner.setPosition(this.dragData.source.x, this.dragData.source.y, 1)
            this.listener.setPosition(this.dragData.listener.x, this.dragData.listener.y, 0)
        }
    },
    computed:{
        dragEvent() {
            return {
                mousedown: (e) => {
                    const id = e.target.id
                    if(id ==='source' || id === 'listener') this.draggingElem = e.target.id
                },
                mousemove: (e) => {
                    if(!this.draggingElem) {
                        return
                    }
                    this.dragData[this.draggingElem].x = e.clientX - 25
                    this.dragData[this.draggingElem].y = e.clientY - 25
                    this.setNoteConfig()
                    e.preventDefault()
                },
                mouseup: (e) => {
                    this.draggingElem = ''
                },
                touchstart: e => {
                    const id = e.target.id
                    if(id === 'source' || id ==='listener') this.draggingElem = e.target.id
                },
                touchmove: e => {
                if (!this.draggingElem) {
                    return
                }
                this.dragData[this.draggingElem].x = e.touches[0].pageX - 25
                this.dragData[this.draggingElem].y = e.touches[0].pageY - 25
                this.setNoteConfig()
                e.preventDefault()
                },
                touchend: () => {
                this.draggingElem = ''
                }
            }
        }
    },
    mounted(){
        audioUnlock(this.audioCtx)
        this.dragData = {
            listener:{
                x: window.innerWidth / 2 + 20,
                y: window.innerHeight / 2 - 50,
            },
            source:{
                x: window.innerWidth/2 - 20,
                y: window.innerHeight/2 + 50,
            }
        }
        this.setNoteConfig()
        this.panner.rolloffFactor = 1 // 聆聽效果
        this.oscillator.connect(this.gainNode)
        this.gainNode.connect(this.panner)
    }
    
}
</script>
<style lang="scss" scoped>
#panner-node {
  max-height: 100vh;
  > button {
    margin: 10px;
  }
  #config {
    display: flex;
    justify-content: center;
    flex-direction: row;
    margin: auto;
    max-width: 50vw;
    min-width: 300px;
    > .audio-note {
      flex: 1;
      box-sizing: border-box;
      margin: 15px auto;
      border: solid 1px #d9d9d9;
      > h3 {
        text-align: center;
        margin: 10px;
        > span {
          display: inline-block;
        }
      }
      > .item {
        display: flex;
        width: 100%;
        margin: 5px auto;
        padding: 10px;
        > label {
          display: inline-block;
          min-width: 50px;
          text-align: right;
          > span {
            font-weight: 600;
            display: inline-block;
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
  #drag-area {
    width: 50vw;
    min-width: 300px;
    height: 400px;
    border: solid 1px #d9d9d9;
    margin: auto;
    overflow: hidden;
  }
  #listener {
    line-height: 50px;
    font-size: 150%;
    user-select: none;
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    padding: 10px;
    background-color: #3692be;
  }
  #source {
    line-height: 50px;
    font-size: 150%;
    user-select: none;
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    padding: 10px;
    background-color: #bf8f36;
  }
}
</style>