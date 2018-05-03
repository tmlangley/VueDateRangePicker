<template>
  <div class="calendar-dropdown" v-on:mousedown="stopBlur">
    <div class="controls">
      <div class="back" v-on:click="getLastMonth">&lt;</div>
      <div class="date">
        {{monthDateTime.monthLong}}
      </div>
      <div class="forward" v-on:click="getNextMonth">&gt;</div>
    </div>

    <Calendar
      :month="currentMonth"
      :range="range"
      :start="start"
      :end="end"
      :focusIndex="focusIndex"
      @startDateChanged="startChanged"
      @endDateChanged="endChanged"
      @focusChanged="focusChanged"
    />

  </div>
</template>

<script>
  import { DateTime } from 'luxon';
  import Calendar from './Calendar';

  export default {
    name: 'standalone-calendar',
    data() {
      return {
        focusDate: null,
        currentMonth: []
      }
    },
    props: {
      range: {
        type: Boolean
      },
      start: {
        type: Object
      },
      end: {
        type: Object
      },
      focusIndex: {
        type: Number
      }
    },

    created() {
      this.currentMonth = this.getMonth(DateTime.local());
    },

    computed: {
      monthDateTime() {
        return this.currentMonth[15].date;
      }
    },

    watch: {
      start(newVal) {
        if (newVal && !newVal.hasSame(this.monthDateTime, 'month')) {
          this.currentMonth = this.getMonth(newVal);
        }
      },
      end(newVal, oldVal) {
        if (newVal && newVal !== oldVal) {
          this.getMonth(newVal);
        }
      }
    },

    methods: {
      getLastMonth() {
        this.currentMonth = this.getMonth(this.monthDateTime.minus({month: 1}));
      },
      getNextMonth() {
        this.currentMonth = this.getMonth(this.monthDateTime.plus({month: 1}));
      },
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
      },
      startChanged(newDate) {
        this.$emit('startChanged', newDate);
      },
      endChanged(newDate) {
        this.$emit('endChanged', newDate);
      },
      focusChanged(date) {
        this.$emit('focusChanged', date);
      },
      stopBlur() {
        this.$emit('stopBlur');
      }
    },

    components: {Calendar}
  }
</script>

<style>
  .forward,
  .back {
    cursor: pointer;
  }

  .calendar-dropdown,
  .calendar-dropdown * {
    user-select: none;
  }
</style>
