import dayjs from 'dayjs'
export default {
  methods: {
    timeFormat(s, formatter = 'YYYY-MM-DD HH:mm:ss') {
      const ms = parseInt(s) * 1000
      return dayjs(ms).format(formatter)
    }
  }
}