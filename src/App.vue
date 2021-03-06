<template>
  <v-app :dark="backgroundActive && enableBackground">
    <main>
      <v-container>
        <h1>Metronome</h1>
        <v-text-field v-model="timeSignature" label="Time Signature"></v-text-field>
        <v-text-field v-model="bpm" label="BPM" type="number"></v-text-field>
        <v-btn color="primary" large @click="toggleRunning">
          {{ running ? 'Stop' : 'Start' }}
        </v-btn>
        <v-btn large color="secondary" @click="tapTempo">Tap tempo</v-btn>
        <v-checkbox label="Flash" v-model="enableBackground" class="checkbox"></v-checkbox>
        <a href="https://github.com/dhulme/metronome/blob/master/README.md" class="about-link">About</a>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import VApp from 'vuetify/es5/components/VApp';
  import VContainer from 'vuetify/es5/components/VGrid/VContainer';
  import VTextField from 'vuetify/es5/components/VTextField';
  import VBtn from 'vuetify/es5/components/VBtn';
  import VCheckbox from 'vuetify/es5/components/VCheckbox';

  const metronomeSound = new Audio('./static/metronome.wav');
  const metronomeUpSound = new Audio('./static/metronome-up.wav');

  const TAP_TEMPO_RESET_TIME = 2000;

  export default {
    components: {
      VApp,
      VContainer,
      VTextField,
      VBtn,
      VCheckbox,
    },
    data() {
      return {
        bpm: 128,
        running: false,
        count: 0,
        totalCount: 1,
        time: performance.now(),
        timeSignature: '4/4',
        soundReady: false,
        tapTempoTimes: [],
        tapTempoTime: null,
        backgroundActive: false,
        enableBackground: false,
      };
    },
    computed: {
      interval() {
        return (60 * 1000) / (this.bpm * (this.measure / 4));
      },
      beats() {
        return Number(this.timeSignature.split('/')[0]);
      },
      measure() {
        return Number(this.timeSignature.split('/')[1]);
      },
    },
    watch: {
      bpm: 'reset',
      beats: 'reset',
      measure: 'reset',
    },
    mounted() {
      const frame = () => {
        const d = performance.now() - this.time;
        if (d / this.totalCount > this.interval) {
          this.tick();
          this.totalCount += 1;
        }
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    },
    methods: {
      toggleRunning() {
        this.running = !this.running;
        this.tickActive = false;

        if (this.running) {
          metronomeUpSound.play();
          this.updateBackground();
          setTimeout(() => {
            metronomeSound.play();
            this.updateBackground();
          }, this.interval);
          this.set(2);
        }
      },
      set(count) {
        this.totalCount = count;
        this.count = count;
        this.time = performance.now();
      },
      reset() {
        this.set(0);
      },
      tick() {
        if (!this.running) {
          return;
        }

        if (this.count === this.beats) {
          this.count = 0;
        }
        if (this.count === 0) {
          metronomeUpSound.play();
        } else {
          metronomeSound.play();
        }
        this.updateBackground();
        this.count += 1;
      },
      updateBackground() {
        this.backgroundActive = !this.backgroundActive;
      },
      tapTempo() {
        if (!this.running) {
          this.toggleRunning();
        }

        const now = performance.now();
        if (!this.tapTempoTime || (now - TAP_TEMPO_RESET_TIME > this.tapTempoTime)) {
          this.tapTempoTimes = [];
        } else if (this.tapTempoTime) {
          this.tapTempoTimes.push(now - this.tapTempoTime);
        }
        this.tapTempoTime = now;

        const averageTime = (this.tapTempoTimes.reduce((acc, tap) => {
          return acc + tap;
        }, 0) / this.tapTempoTimes.length) || 0;

        if (averageTime !== 0) {
          this.bpm = Math.round((60 * 1000) / averageTime) / (this.measure / 4);
        }
      },
    },
  };
</script>

<style lang="stylus">
  @import '../node_modules/vuetify/src/stylus/app';
</style>

<style>
  .checkbox {
    margin-top: 1rem;
    margin-left: 6px;
  }

  .input-group label {
    transition: none !important;
  }

  .input-group__details:before {
    transition: none !important;
  }

  .about-link {
    position: absolute;
    bottom: 2rem;
  }
</style>



