<template>
  <div id="app">
    <date-picker
      startLabel="Check-In"
      endLabel="Check-out"
    />
  </div>
</template>

<script>
  import DatePicker from './components/DatePicker';

  export default {
    name: 'app',
    components: { DatePicker },
    data() {
      return {}
    }
  }

</script>

<style lang="scss">
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0 auto;
  }

  $light-gray: #cccccc;
  $medium-gray: #999999;
  $dark-gray: #666666;
  $black: #333333;
  $off-white: #f8f8f8;
  $lighter-gray: #efefef;
  $white: #fff;
  $red: #ec293e;

  /// Breakpoints
  $breakpoints: (
    small: 0,
    smedium: 480px,
    medium: 640px,
    mlarge: 768px,
    large: 1024px,
    xlarge: 1280px,
    xxlarge: 1440px,
  );

  @mixin breakpoint($key) {
    @media (min-width: #{map-get($breakpoints, $key)}) {
      @content;
    }
  }

  .datePicker {
    $selection-size: 2.4em;
    position: relative;
    max-width: 400px;
    min-width: 300px;
    margin-top: 2rem;

    label {
      position: absolute;
      bottom: 100%;
    }

    .inputs {
      display: flex;
      position: relative;
      z-index: 20;
      padding: 0;

      &:before {
        z-index: 1;
        content: '';
        display: block;
        width: 2px;
        height: 27px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: $off-white;
      }

      input {
        margin-bottom: 0;
        border: 0 none;
        outline: 0 none;
        background: transparent none;
        text-align: center;
        font-size: 16px;
        font-weight: 300;
        min-width: 0;
        width: auto;
        color: $dark-gray;
        padding: 14px 0;

        &:active,
        &:focus,
        &:hover {
          box-shadow: none;
        }
      }

      .display-date {
        position: absolute;
        display: block;
        top: 50%;
        left: 3px;
        width: calc(50% - 3px);
        transform: translateY(-50%);
        background: #fff;
        touch-action: manipulation;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        opacity: 1;
        transition: 0.2s opacity;
      }

      input:focus + .display-date {
        opacity: 0;
      }

      .end .display-date {
        left: 50%;
      }
    }
    .form-element {
      flex: 1;
      width: 50%;
    }

    &.open {
      position: relative;
    }

    &.closed {
      .inputs {
        background: #fff;
        box-shadow: 0 13px 35px rgba(0, 0, 0, 0.1);
        border-radius: 25px;
      }
    }

    .datePickerDropdown {
      position: absolute;
      background: #fff;
      border-radius: 25px;
      top: -6px;
      left: 0;
      z-index: 10;
      transform: none;
      padding: 50px 20px 20px 20px;
      box-shadow: 0 13px 35px rgba(0, 0, 0, 0.1);

      @media (hover: none) {
        width: calc(100vw - 60px);
      }

      @include breakpoint(medium) {
        width: calc(100% - 40px);
      }
    }

    .controls {
      display: flex;
      justify-content: space-between;
      min-height: 56px;
      align-items: center;
      border-bottom: 1px solid rgba($medium-gray, 0.1);
      margin-bottom: 15px;
    }

    .forward,
    .back {
      cursor: pointer;
      height: 100%;
      padding: 16px 20px;
      position: relative;
      text-indent: -9999px;

      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
        width: 11px;
        height: 11px;
        border: 2px solid $medium-gray;
      }
    }

    .back {
      border-right: 1px solid rgba($medium-gray, 0.1);

      &:before {
        border-top: transparent none;
        border-right: transparent none;
      }
    }

    .forward {
      border-left: 1px solid rgba($medium-gray, 0.1);
      &:before {
        border-bottom: transparent none;
        border-left: transparent none;
      }
    }

    .date {
      font-weight: bold;
    }

    .calendar-dropdown,
    .calendar-dropdown * {
      user-select: none;
    }

    .calendar {
      width: 100%;

      @include breakpoint(mlarge) {
        max-width: 500px;
      }
    }

    .weekdays,
    .days {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
    }

    .weekdays {
      margin-bottom: 6px;
    }

    .weekday {
      flex: 1;
      width: 14.285714286%;
      flex-basis: 14.285714286%;
      text-align: center;
      padding: 5px 0;
      text-transform: uppercase;
      font-size: 11px;
      color: $medium-gray;
    }

    .day {
      flex: 1;
      width: 14.285714286%;
      flex-basis: 14.285714286%;
      padding: 11px 0;
      touch-action: manipulation;
      -webkit-tap-highlight-color: rgba(0,0,0,0);
      background: #fff;
      appearance: none;
      cursor: pointer;
      text-align: center;
      z-index: 2;
      position: relative;
      font-size: 13px;
      font-weight: bold;
    }

    @media not all and (hover: none) {
      .focus,
      .day:hover {
        &:after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: $selection-size;
          height: $selection-size;
          background: $off-white;
          z-index: -1;
          border-radius: 50%;
        }
      }
    }

    @media not all and (hover: none) {
      .start + .focus:before,
      .range + .focus:before,
      .start + .day:hover:before,
      .range + .day:hover:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        transform: translate(0, -50%);
        width: 50%;
        height: $selection-size;
        background: $off-white;
        z-index: -1;
      }
    }

    .currentDay {
      color: $red;
    }

    .days .day.range {
      &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: $selection-size;
        background: $off-white;
        z-index: -1;
        border-radius: 0;
      }

      &:nth-child(7n + 7):before {
        border-radius: 0 $selection-size $selection-size 0;
      }
      &:nth-child(7n + 8):before {
        border-radius: $selection-size 0 0 $selection-size;
      }

      &.focus {
        color: $medium-gray;
      }
    }

    .notInMonth {
      color: $light-gray;
    }

    .days .day.selected {
      color: #fff;
      overflow: hidden;

      &:before,
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: $selection-size;
        height: $selection-size;
        border-radius: 0;
      }

      &:after {
        background: transparent none;
      }

      &:before {
        background: $red;
        border-radius: 50%;
        z-index: -1;
      }

      &.focus:before {
        background: darken($red, 10%);
      }
    }


    .days.hasRange .day.selected:after {
      width: 100%;
      transform: translate(0, -50%);
      background: $off-white;
      z-index: -2;
    }

    .days .day.selected.end {
      &:after {
        left: 0;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
