import moment from 'moment'

export const ToISODateString = (date: string): string => {
  const timezoneOffset = moment(date).utcOffset()
  return moment(date)
    .utc()
    .add(timezoneOffset, 'minutes')
    .startOf('day')
    .toISOString()
}
