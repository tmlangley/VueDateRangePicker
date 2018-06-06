<template>
  <div class="calendar-dropdown" v-on:mousedown="stopBlur" v-if="month">
    <div class="controls">
      <div class="back" v-on:click="getLastMonth">&lt;</div>
      <div class="date">
        {{month.dt.monthLong}}
      </div>
      <div class="forward" v-on:click="getNextMonth">&gt;</div>
    </div>
    <div class="calendar">
      <div class="weekdays">
        <div class="weekday" v-for="(weekday, i) in weekdays" :key="i">
          {{weekday}}
        </div>
      </div>
      <div class="days" :class="[{hasRange: hasRange}]">
        <div
          v-if="days"
          v-for="(day, index)
             in days"
          @click="selectDay(day, 'Mouse')"
          v-on="!isTouchDevice() ? { mouseover: () => setHover(day) } : null"
          :key="index" class="day"
          :class="[
              { currentDay: day.isCurrentDay },
              { notInMonth: !day.inMonth },
              { restricted: day.isRestricted },
              { start: isStart(day.ts) },
              { end: isEnd(day.ts) },
              { selected: isStart(day.ts) || isEnd(day.ts) },
              { range: day.isInRange || isInRange(day.dt) }
            ]"
        >
          {{day.formatted}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Day from '../Day';
  import Calendar from "../Calendar";

  export default {
    name: "calendar-month",
    data() {
      return {
        month: null,
        hasRange: false,
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        start: null,
        end: null,
        hasHover: false
      }
    },

    props: ['nextStart', 'nextEnd', 'restrictedDates'],

    computed: {
      days() {
        return [...this.month]
      }
    },

    created() {
      this.calendar = new Calendar(this.nextStart, this.nextStart, this.nextEnd, {
        restrictedDates: this.restrictedDates
      });
      this.month = this.calendar.month;
    },

    watch: {
      nextStart(val) {
        this.selectDay(val, 'Manual', 'start');
      },

      nextEnd(val) {
        this.selectDay(val, 'Manual', 'end');
      },

      start(val) {
        if (val && val instanceof Day) {
          this.$emit('startChanged', val.dt);
        }
      },

      end(val) {
        if (val && val instanceof Day) {
          this.$emit('endChanged', val.dt);
        }
      }
    },

    methods: {
      isTouchDevice() {
        return 'ontouchstart' in document.documentElement;
      },

      selectDay(dt, type, field = null) {
        if (dt.isRestricted) return;
        this.calendar.selectDay(dt, type, field);
        this.hasRange = this.month.hasRange;
        this.start = this.month.getStartDate();
        this.end = this.month.getEndDate();
      },

      isStart(ts) {
        return this.month.states.start ? this.month.states.start.ts === ts : false;
      },

      isEnd(ts) {
        return this.month.states.end ? this.month.states.end.ts === ts : false;
      },

      isInRange(dt) {
        return this.month.inRange(dt);
      },

      setHover(day) {
        this.month.setHover(day);
        this.hasRange = this.month.hasRange;
      },

      getLastMonth() {
        this.calendar.prevMonth();
        this.$set(this, 'month', this.calendar.month);
      },

      getNextMonth() {
        this.calendar.nextMonth();
        this.$set(this, 'month', this.calendar.month);
      },

      focusChanged(date) {
        this.$emit('focusChanged', date);
      },

      stopBlur() {
        this.$emit('stopBlur');
      }
    }
  }
</script>

<style scoped>

</style>