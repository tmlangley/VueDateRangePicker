<template>
  <div id="app">
    <date-picker />
    <!--<h2>Standalone</h2>-->
    <!--<standalone :range="false" />-->
    <!--<h2>Range</h2>-->
    <!--<standalone :range="true" />-->
  </div>
</template>

<script>
  import Standalone from './components/StandaloneCalendar';
  import DatePicker from './components/DatePicker';

  export default {
    name: 'app',
    components: { Standalone, DatePicker },
    data() {
      return {}
    }
  }

</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
