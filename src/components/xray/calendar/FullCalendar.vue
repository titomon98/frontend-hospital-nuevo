<template>
  <VueFullCalendar defaultView="dayGridMonth"
                   :options="header"
                   :plugins="calendarPlugins"
                   :events="calendarEvents"
                   time-zone="UTC"
                   :selectable="true"
                   :editable="true"
                   @eventClick="handleEventClick"
                   ref="vueCallendar"
                   @eventRender="eventRender"
                   @datesSet="handleDateSet"
  />
</template>
<script>
import VueFullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
export default {
  name: 'FullCalendar',
  props: {
    // eslint-disable-next-line vue/require-valid-default-prop
    calendarEvents: { type: Array, default: [] },
    header: { type: Object,
      default () {
        return {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        }
      }
    },
    handleEventClick: {
      type: Function,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      calendarPlugins: [
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        listPlugin
      ]
    }
  },
  components: {
    VueFullCalendar // make the <VueFullCalendar> tag available
  },
  computed: {
  },
  methods: {
    eventRender () {
      // console.log('aaaaa')
    },
    handleDateSet () {
      console.log('cambia de mes')
    },
    dateClick () {
      console.log('click on fecha')
    }
  },
  mounted () {
    // console.log('hola')
    // console.log(this.$refs.vueCallendar)
    // console.log(this.$refs.vueCallendar.getApi())
    // console.log(this.$refs.vueCallendar.getApi().state.currentDate)
  }
}
</script>

<style lang='scss'>
  .fc-event, .fc-event:hover{
    color: #ffffff !important;
  }
  @import '~@fullcalendar/core/main.css';
  @import '~@fullcalendar/daygrid/main.css';
  @import '~@fullcalendar/timegrid/main.css';
  @import '~@fullcalendar/list/main.min.css';
</style>
