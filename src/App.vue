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
        timeSignature: '4/4',
        soundReady: false,
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
      bpm: 'reset',
      beats: 'reset',
      measure: 'reset'
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
        this.count++;
      }
    }
  };
</script>

<style>

</style>
