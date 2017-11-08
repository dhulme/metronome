<template>
  <v-app>
    <main>
      <v-container>
        <v-text-field v-model="timeSignature" label="Time Signature"></v-text-field>
        <v-text-field v-model="bpm" label="BPM"></v-text-field>
        <v-btn color="primary" @click="toggleRunning">{{ running ? 'Stop' : 'Start' }}</v-btn>
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
        count: 0,
        totalCount: 1,
        time: performance.now(),
        timeSignature: '4/4'
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
      }
    },
    watch: {
      bpm: 'reset'
    },
    mounted() {
      const frame = () => {
        const d = performance.now() - this.time;
        if (d / this.totalCount > this.interval) {
          this.tick();
          this.totalCount++;
        }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    methods: {
      toggleRunning() {
        this.running = !this.running;
        this.reset();
      },
      reset() {
        this.totalCount = 1;
        this.count = 0;
        this.time = performance.now();
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
        this.count++;
      }
    }
  };
</script>

<style>

</style>
