<template>
  <div class="datePicker" :class="calendarOpen ? 'open' : 'closed'">
    <div class="datePickerDropdown" v-show="calendarOpen">
      <calendar-month
        ref="calendar"
        :nextStart="startDate"
        :nextEnd="endDate"
        @startChanged="startChanged"
        @endChanged="endChanged"
        @stopBlur="stopBlur = true"
      />
    </div>
    <div class="inputs">
      <div class="form-element start">
        <label for="datepicker-start">{{ startLabel }}</label>
        <input
          id="datepicker-start"
          type="text"
          ref="start"
          maxlength="10"
          v-model="startInput"
          @focus="handleInputFocus('start')"
          @blur.prevent="handleBlur"
          @keyup.esc="calendarOpen=false"
          @keydown="moveFocus($event)"
          @click="calendarFocus=false"
        >
        <span class="display-date">{{ startFormat }}</span>
      </div>

      <div class="form-element end">
        <label for="datepicker-end">{{ endLabel }}</label>
        <input
          id="datepicker-end"
          type="text"
          ref="end"
          maxlength="10"
          v-model="endInput"
          @focus="handleInputFocus('end')"
          @blur.prevent="handleBlur"
          @keyup.esc="calendarOpen=false"
          @keydown="moveFocus($event)"
          @click="calendarFocus=false"
        >
        <span class="display-date">{{ endFormat }}</span>
      </div>
    </div>

  </div>
</template>

<script>
  import { DateTime } from 'luxon';
  import CalendarMonth from './CalendarMonth';

  export default {
    name: "date-picker",
    components: {CalendarMonth},
    props: {
      range: {
        type: Boolean,
        default: true
      },
      showStartEndFields: {
        type: Boolean,
        default: true
      },
      format: {
        type: Object,
        default: () => {
          return {
            month: 'short',
            day: 'numeric'
          }
        }
      },
      start: {
        type: Object,
        default: () => {
          return DateTime.local()
        }
      },
      end: {
        type: Object,
        default: () => {
          return DateTime.local().plus({day: 1})
        }
      },
      startLabel: {
        type: String
      },
      endLabel: {
        type: String
      }
    },
    data() {
      return {
        startDate: null,
        endDate: null,
        trueStart: null,
        trueEnd: null,
        calendarOpen: false,
        focusIndex: null,
        focusDate: null,
        stopBlur: false,
        userInput: false,
        calendarFocus: false,
        startInput: '',
        endInput: '',
        lockStart: false,
        lockEnd: false,
      }
    },

    created() {
      this.startDate = this.start;
      this.endDate = this.end;
      this.trueStart = this.start;
      this.trueEnd = this.end;
      this.startInput = this.start ? this.start.toISODate() : '';
      this.endInput = this.end ? this.end.toISODate() : '';
    },

    computed: {
      startFormat() {
        if (this.trueStart) {
          if (this.trueStart.hasSame(DateTime.local(), 'day')) {
            return "Today";
          }
        }
        return this.startDate ? this.trueStart.toLocaleString(this.format) : '';
      },
      endFormat() {
        if (this.trueEnd) {
          if (this.trueEnd.hasSame(DateTime.local().plus({ days: 1}), 'day')) {
            return "Tomorrow";
          }
        }
        return this.trueEnd ? this.trueEnd.toLocaleString(this.format) : '';
      }
    },

    watch: {
      calendarOpen(newval) {
        if (!newval) {
          this.calendarFocus = false;
        }
      },

      startInput(val) {
        if (this.lockStart) {
          this.lockStart = false;
          return;
        }

        if (!val.length) {
          this.startDate = null;
          return;
        }

        if (val.length !== 10) return;

        const newDate = DateTime.fromISO(val);

        if (newDate.isValid) {
          this.startDate = newDate;
          this.setStart(newDate);
          if (!this.endDate) {
            this.startDate = newDate;
          }
          if (this.endDate && this.endDate && newDate.diff(this.endDate.minus({days: 1})).milliseconds > 0) {
            this.setStart(newDate);
            this.endDate = this.startDate.plus({days: 1});
          } else {
            this.endDate = null;
            this.startDate = newDate;
          }
        }
      },

      endInput(val) {
        if (this.lockEnd) {
          this.lockEnd = false;
          return;
        }
        if (!val.length) {
          this.endDate = null;
          return;
        }
        const newDate = DateTime.fromISO(val);
        if (newDate.isValid) {
          this.setEnd(newDate);
        }
      }
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

      handleInputFocus(input) {
        this.calendarFocus = false;
        this.calendarOpen = true;
      },

      setStart(val) {
        this.startDate = val;
        this.startUpdateCount = this.startUpdateCount+1;
      },

      setEnd(val) {
        this.endDate = val;
        this.endUpdateCount = this.endUpdateCount+1;
      },

      startChanged(newDate) {
        this.lockStart = true;
        this.startInput = newDate.toISODate();
        this.trueStart = newDate;
        this.$emit('startChanged', newDate);
      },

      endChanged(newDate) {
        this.lockEnd = true;
        this.endInput = newDate.toISODate();
        this.trueEnd = newDate;
        this.$emit('endChanged', newDate);
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

<style lang="scss">
</style>