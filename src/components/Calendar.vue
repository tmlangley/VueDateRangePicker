<template>

  <div class="calendar">
    <div class="weekdays">
      <div class="weekday" v-for="weekday in weekdays">
        {{weekday}}
      </div>
    </div>
    <div class="days" v-on:mouseenter="setActive" v-on:mouseleave="setInactive">
      <button
        v-on:click="select(day.date)"
        v-on:keyup.enter="select(day.date)"
        v-on:mouseenter="hover(day.date)"
        v-on:keydown="moveFocus($event, index)"
        v-for="(day, index) in month"
        :key="index" class="day"
        :ref="`day_${index}`"
        :class="{
        selected: (startDate && startDate.hasSame(day.date, 'day'))
        || (endDate && endDate.hasSame(day.date, 'day')),
        range: startDate && endDate
      }"
      >
        {{day.displayDay}}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "calendar",
    data() {
      return {
        focusIndex: null,
        startDate: null,
        endDate: null,
        hoverDate: null,
        isActive: false,
        selectedDates: [],
        weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      }
    },
    props: {
      month: {
        type: Array
      }
    },

    methods: {
      moveFocus(e, index) {
        let nextFocus = null;

        switch (e.keyCode) {
          case 37: // Left arrow
            if (index > 0) {
              nextFocus = index-1;
            }
            break;
          case 38: // Up arrow
            if (index > 6) {
              nextFocus = index - 7;
            }
            break;
          case 39: // Right arrow
            if (index < 41) {
              nextFocus = index+1;
            }
            break;
          case 40: // Down arrow
            if (index < 35) {
              nextFocus = index + 7;
            }
            break;
        }

        if (nextFocus !== null) {
          this.$refs[`day_${nextFocus}`][0].focus();
        }
      },

      select(date) {
        if (this.startDate && !this.endDate
          && date.ts > this.startDate.ts) {
          this.endDate = date;
        } else {
          this.startDate = date;
          this.endDate = null;
        }
      },

      hover(date) {
        this.hoverDate = date;
      },
      setActive() {
        this.isActive = true;
      },
      setInactive() {
        this.isActive = false;
      }
    }
  }
</script>

<style scoped>
  .calendar {
    max-width: 500px;
    width: 100%;
  }


  .weekdays,
  .days {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
  }

  .weekday {
    flex: 1;
    width: 0;
    flex-basis: 14.285714286%;
    text-align: center;
    padding: 5px 0;
  }

  .day {
    flex: 1;
    width: 0;
    flex-basis: 14.285714286%;
    padding: 1em;
    touch-action: manipulation;
    background: #fff;
    appearance: none;
  }

  .day:hover,
  .day:focus,
  .day:active {
    outline: 0 none;
    background: #00c3c3;
  }

  .range.selected ~ * {
    background: slategray;
    color: #fff;
  }

  .range.selected ~ .selected ~ * {
    background: transparent;
    color: black;
  }

  .day.selected {
    background: teal;
    color: #fff;
  }


</style>