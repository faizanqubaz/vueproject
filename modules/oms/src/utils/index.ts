import moment from "moment";
import phone from "phone";

export const EllipsisMiddle = (str: string): string => {
  if (str && str.length > 35) {
    return str.substr(0, 15) + "..." + str.substr(str.length - 10, str.length);
  }
  return str;
};

export const ToISODateString = (date: string): string => {
  const timezoneOffset = moment(date).utcOffset();
  return moment(date)
    .utc()
    .add(timezoneOffset, "minutes")
    .startOf("day")
    .toISOString();
};

export const FormRules = {
  required: [(v: string): string | boolean => !!v || "This field is required"],
  email: [
    (v: string): string | boolean =>
      /.+@.+/.test(v) || "Email address is invalid",
  ],
  phone: [
    (v: string): string | boolean =>
      phone(v, { country: "USA" }).isValid || "Phone number is invalid",
  ],
};

export const VisitStatuses = [
  { label: "Booked", value: "booked" },
  { label: "Assigned", value: "assigned" },
  { label: "Enroute", value: "enroute" },
  { label: "Started", value: "started" },
  { label: "Completed", value: "completed" },
  { label: "Canceled", value: "canceled" },
];

export const DaysOfWeek = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export const HoursOfDay = [
  { label: "12:00 AM", value: "24:00:00" },
  { label: "01:00 AM", value: "01:00:00" },
  { label: "02:00 AM", value: "02:00:00" },
  { label: "03:00 AM", value: "03:00:00" },
  { label: "04:00 AM", value: "04:00:00" },
  { label: "05:00 AM", value: "05:00:00" },
  { label: "06:00 AM", value: "06:00:00" },
  { label: "07:00 AM", value: "07:00:00" },
  { label: "08:00 AM", value: "08:00:00" },
  { label: "09:00 AM", value: "09:00:00" },
  { label: "10:00 AM", value: "10:00:00" },
  { label: "11:00 AM", value: "11:00:00" },
  { label: "12:00 PM", value: "12:00:00" },
  { label: "01:00 PM", value: "13:00:00" },
  { label: "02:00 PM", value: "14:00:00" },
  { label: "03:00 PM", value: "15:00:00" },
  { label: "04:00 PM", value: "16:00:00" },
  { label: "05:00 PM", value: "17:00:00" },
  { label: "06:00 PM", value: "18:00:00" },
  { label: "07:00 PM", value: "19:00:00" },
  { label: "08:00 PM", value: "20:00:00" },
  { label: "09:00 PM", value: "21:00:00" },
  { label: "10:00 PM", value: "22:00:00" },
  { label: "11:00 PM", value: "23:00:00" },
];

export const States = [
  { name: "Alabama", code: "AL", timeZone: "US/Central" },
  { name: "Alaska", code: "AK", timeZone: "US/Alaska" },
  { name: "Arizona", code: "AZ", timeZone: "US/Arizona" },
  { name: "Arkansas", code: "AR", timeZone: "US/Central" },
  { name: "California", code: "CA", timeZone: "US/Eastern" },
  { name: "Colorado", code: "CO", timeZone: "US/Mountain" },
  { name: "Connecticut", code: "CT", timeZone: "US/Eastern" },
  { name: "Delaware", code: "DE", timeZone: "US/Eastern" },
  { name: "District of Columbia", code: "DC", timeZone: "US/Eastern" },
  { name: "Florida", code: "FL", timeZone: "US/Eastern" },
  { name: "Georgia", code: "GA", timeZone: "US/Eastern" },
  { name: "Hawaii", code: "HI", timeZone: "US/Hawaii" },
  { name: "Idaho", code: "ID", timeZone: "US/Pacific" },
  { name: "Illinois", code: "IL", timeZone: "US/Central" },
  { name: "Indiana", code: "IN", timeZone: "US/Eastern" },
  { name: "Iowa", code: "IA", timeZone: "US/Central" },
  { name: "Kansas", code: "KS", timeZone: "US/Central" },
  { name: "Kentucky", code: "KY", timeZone: "US/Central" },
  { name: "Louisiana", code: "LA", timeZone: "US/Central" },
  { name: "Maine", code: "ME", timeZone: "US/Eastern" },
  { name: "Maryland", code: "MD", timeZone: "US/Eastern" },
  { name: "Massachusetts", code: "MA", timeZone: "US/Eastern" },
  { name: "Michigan", code: "MI", timeZone: "US/Central" },
  { name: "Minnesota", code: "MN", timeZone: "US/Central" },
  { name: "Mississippi", code: "MS", timeZone: "US/Eastern" },
  { name: "Missouri", code: "MO", timeZone: "US/Central" },
  { name: "Montana", code: "MT", timeZone: "US/Mountain" },
  { name: "Nebraska", code: "NE", timeZone: "US/Eastern" },
  { name: "Nevada", code: "NV", timeZone: "US/Eastern" },
  { name: "New Hampshire", code: "NH", timeZone: "US/Eastern" },
  { name: "New Jersey", code: "NJ", timeZone: "US/Eastern" },
  { name: "New Mexico", code: "NM", timeZone: "US/Mountain" },
  { name: "New York", code: "NY", timeZone: "US/Eastern" },
  { name: "North Carolina", code: "NC", timeZone: "US/Eastern" },
  { name: "North Dakota", code: "ND", timeZone: "US/Mountain" },
  { name: "Ohio", code: "OH", timeZone: "US/Eastern" },
  { name: "Oklahoma", code: "OK", timeZone: "US/Central" },
  { name: "Oregon", code: "OR", timeZone: "US/Pacific" },
  { name: "Pennsylvania", code: "PA", timeZone: "US/Eastern" },
  { name: "Rhode Island", code: "RI", timeZone: "US/Eastern" },
  { name: "South Carolina", code: "SC", timeZone: "US/Eastern" },
  { name: "South Dakota", code: "SD", timeZone: "US/Central" },
  { name: "Tennessee", code: "TN", timeZone: "US/Eastern" },
  { name: "Texas", code: "TX", timeZone: "US/Central" },
  { name: "Utah", code: "UT", timeZone: "US/Mountain" },
  { name: "Vermont", code: "VT", timeZone: "US/Eastern" },
  { name: "Virgin Island", code: "VI", timeZone: "Atlantic/South_Georgia" },
  { name: "Virginia", code: "VA", timeZone: "US/Eastern" },
  { name: "Washington", code: "WA", timeZone: "US/Pacific" },
  { name: "West Virginia", code: "WV", timeZone: "US/Eastern" },
  { name: "Wisconsin", code: "WI", timeZone: "US/Central" },
  { name: "Wyoming", code: "WY", timeZone: "US/Mountain" },
];
