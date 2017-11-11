<template>
  <v-app>
    <main>
      <v-container>
        <h1>Metronome</h1>
        <v-text-field v-model="timeSignature" label="Time Signature"></v-text-field>
        <v-text-field v-model="bpm" label="BPM" type="number"></v-text-field>
        <v-btn color="primary" large @click="toggleRunning">
          {{ running ? 'Stop' : 'Start' }}
        </v-btn>
        <v-btn large @click="tapTempo">Tap tempo</v-btn>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  const metronomeSound = new Audio('./static/metronome.wav');
  const metronomeUpSound = new Audio('./static/metronome-up.wav');

  const TAP_TEMPO_RESET_TIME = 2000;

  export default {
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
        tapTempoLastTime: null,
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

        if (this.running) {
          metronomeUpSound.play();
          setTimeout(() => metronomeSound.play(), this.interval);
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
        this.count += 1;
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
          return acc + (tap - this.tapTempoLastTime);
        }, 0) / this.tapTempoTimes.length) || 0;

        if (averageTime !== 0) {
          this.bpm = Math.round((60 * 1000) / averageTime) / (this.measure / 4);
        }
      },
    },
  };
</script>

<style>

</style>
