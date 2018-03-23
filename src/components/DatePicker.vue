<template>
  <div class="datePicker">
    <div class="datePickerDropdown" v-show="calendarOpen">
      <standalone-calendar
        :range="range"
        :start="startDate"
        :end="endDate"
        :focusIndex="focusIndex"
        ref="calendar"
        @startChanged="startChanged"
        @endChanged="endChanged"
        @focusChanged="focusChanged"
        @stopBlur="stopBlur = true"
      />
    </div>
    <div class="inputs">
      <input
        type="text"
        ref="start"
        :value="startStringFormat"
        @input="setIfValid('startDate', $event.target.value)"
        @focus="handleInputFocus"
        @blur.prevent="handleBlur"
        @keyup.esc="calendarOpen=false"
        @keydown="moveFocus($event)"
        @keydown.enter="selectFocusedDay"
        @click="calendarFocus=false"
      >

      <input
        ref="end"
        type="text"
        :value="endStringFormat"
        v-if="showStartEndFields"
        @keyup="setIfValid('endDate', $event.target.value)"
        @keyup.esc="calendarOpen=false"
        @focus="handleInputFocus"
        @blur.prevent="handleBlur"
        @keydown="moveFocus($event)"
        @keydown.enter="selectFocusedDay"
        @click="calendarFocus=false"
      >
    </div>

  </div>
</template>

<script>
  import { DateTime } from 'luxon';
  import StandaloneCalendar from './StandaloneCalendar';

  export default {
    name: "date-picker",
    components: {StandaloneCalendar},
    props: {
      format: {
        default: 'M/d/y'
      },
      range: {
        type: Boolean,
        default: true
      },
      showStartEndFields: {
        type: Boolean,
        default: true
      },
      startingDate: {
        type: Object,
        default: () => {
          return DateTime.local()
        }
      },
    },
    data() {
      return {
        startDate: null,
        endDate: null,
        calendarOpen: false,
        focusIndex: null,
        focusDate: null,
        stopBlur: false,
        userInput: false,
        calendarFocus: false
      }
    },

    computed: {
      startStringFormat() {
        return this.startDate ? this.startDate.toFormat(this.format) : '';
      },
      endStringFormat() {
        return this.endDate ? this.endDate.toFormat(this.format) : '';
      }
    },

    watch: {
      calendarOpen(newval) {
        if (!newval) {
          this.calendarFocus=false;
        }
      }
    },

    created() {
      this.startDate = this.startingDate;
    },

    methods: {
      moveFocus(e) {
        let nextFocus = null;
        const index = this.focusIndex;
        const arrows = [37, 38, 39, 40];

        // Enter calendar focus on down arrow press.
        if (!this.calendarFocus && e.keyCode === arrows[3]) {
          this.calendarFocus = true;
        }

        // Early return if the calendar isn't focused.
        if (!this.calendarFocus) {
          return;
        }

        if (arrows.includes(e.keyCode)) {
          e.preventDefault();

          // Set the focus to the middle of the first week if it is unset.
          if (index === null) {
            this.focusIndex = 3;
            return;
          }
        }

        switch (e.keyCode) {
          case arrows[0]: // Left arrow
            if (index > 0) {
              nextFocus = index-1;
            }
            break;
          case arrows[1]: // Up arrow
            if (index > 6) {
              nextFocus = index - 7;
            } else {
              this.$refs.calendar.getLastMonth();
              nextFocus = index + 35;
            }
            break;
          case arrows[2]: // Right arrow
            if (index < 41) {
              nextFocus = index+1;
            }
            break;
          case arrows[3]: // Down arrow
            if (index < 35) {
              nextFocus = index + 7;
            } else {
              this.$refs.calendar.getNextMonth();
              nextFocus = index - 35;
            }
            break;
        }

        if (nextFocus !== null) {
          this.focusIndex = nextFocus;
        }
      },

      handleInputFocus() {
        this.calendarFocus = false;
        this.calendarOpen = true;
      },

      selectFocusedDay() {
        if (this.userInput) {
          this.userInput = false;
          return;
        }
        if (this.focusDate) {
          if (this.startDate && !this.endDate && this.focusDate.ts > this.startDate.ts) {
            this.endDate = this.focusDate;
          } else {
            this.startDate = this.focusDate;
            this.endDate = null;
          }
        }
      },

      setIfValid(variable, val) {
        const newDate = DateTime.fromFormat(val, this.format);
        if (newDate.isValid) {
          this.userInput = true;
          this.focusDate = newDate;
          this[variable] = newDate;
        }
        if (!val.length && variable === 'endDate') {
          this.endDate = null;
        }
      },
      startChanged(newDate) {
        this.startDate = newDate;
      },
      endChanged(newDate) {
        this.endDate = newDate;
      },
      focusChanged(date) {
        this.focusDate = date;
      },
      handleBlur() {
        if (this.stopBlur) {
          this.stopBlur = false;
        } else {
          this.calendarOpen = false;
        }
      }
    }
  }
</script>

<style scoped>
  .datePicker {
    position: relative;
    max-width: 300px;
    min-width: 200px;
  }

  .datePickerDropdown {
    position: absolute;
    top: 100%;
    left: 0;
  }

</style>