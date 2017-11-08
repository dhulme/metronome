<template>
  <v-app>
    <main>
      <v-container>
        <v-text-field v-model="bpm"></v-text-field>
        <v-btn color="primary">Start</v-btn>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  const metronomeSound = new Audio('./static/metronome.wav');
  const metronomeUpSound = new Audio('./static/metronome-up.wav');

  export default {
    data() {
      return {
        bpm: 128,
        running: false,
        interval: null,
        beats: 4,
        measure: 4,
        count: 0
      };
    },
    computed: {
      intervalTimeout() {
        return (60 * 1000) / this.bpm;
      }
    },
    watch: {
      bpm() {
        clearInterval(this.interval);
      }
    },
    mounted() {
      let time = performance.now();
      let count = 1;
      const frame = () => {
        const now = performance.now();
        const d = now - time;
        if (d / count > this.intervalTimeout) {
          this.tick();
          count++;
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    methods: {
      tick() {
        if (this.count === this.beats) {
          this.count = 0;
        }
        if (this.count === 0) {
          metronomeUpSound.play();
        } else {
          metronomeSound.play();
        }
        this.count++;
      }
    }
  };
</script>

<style>

</style>
