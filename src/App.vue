<template>
  <div id="app">

    <Calendar :month="currentMonth" />
  </div>
</template>

<script>
  import { DateTime } from 'luxon';
  import Calendar from './components/Calendar';

  export default {
    name: 'app',
    data() {
      return {
        focusDate: null,
        currentMonth: []
      }
    },

    created() {
      this.currentMonth = this.getMonth(DateTime.local());
    },

    methods: {
      getMonth(dt) {
        const monthStart = DateTime.fromObject({month: dt.month, year: dt.year});
        let currentDay = monthStart.minus({
          day: monthStart.weekday,
        });

        let month = [];
        for (let i = 0; i < 42; i++) {
          month.push({
            displayDay: currentDay.day,
            date: currentDay
          });
          currentDay = currentDay.plus({day: 1});
        }

        return month;
      }
    },

    components: {Calendar}
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
