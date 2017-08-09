// @flow

import React, { Component } from 'react';
import moment from 'moment';

import CustomSelect from 'components/CustomSelect';
import { MONTH_OPTIONS } from 'containers/constants';

type Props = {
  value: Date,
  onChange: Function,
  yearCounts: number,
}
type State = {
  year: string,
  month: string,
  day: string,
}
class DatePicker extends Component {
  constructor(props: Props) {
    super(props);
    const month = props.value ? props.value.getMonth() + 1 : '';
    this.state = {
      year: props.value ? props.value.getFullYear().toString() : '',
      month: month.toString(),
      day: props.value ? props.value.getDate().toString() : '',
    };
  }
  state: State

  getDateValues = () => {
    const dates = [];
    for (let i = 1; i <= 31; i += 1) {
      dates.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return dates;
  }

  getYearValues = () => {
    const years = [];
    const currentYear = moment().toDate().getFullYear();
    const startYear = currentYear - this.props.yearCounts;

    for (let i = currentYear; i > startYear; i -= 1) {
      years.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return years;
  }

  props: Props
  render() {
    const { year, month, day } = this.state;
    return (
      <div
        className="datePicker row"
      >
        <div className="column medium-4 small-12">
          <CustomSelect
            className="large datepicker"
            value={month}
            clearable={false}
            options={MONTH_OPTIONS}
            placeholder="Month"
            onChange={(e) => {
              this.setState({
                month: e.value,
              });
              this.props.onChange(moment(`${e.value}-${day}-${year}`, 'MM-DD-YYYY').toDate());
            }}
          />
          <div className="show-for-small-only mb-sm"></div>
        </div>
        <div className="column medium-4 small-12">
          <CustomSelect
            className="large datepicker"
            value={day}
            clearable={false}
            options={this.getDateValues()}
            placeholder="Day"
            onChange={(e) => {
              this.setState({
                day: e.value,
              });
              this.props.onChange(moment(`${month}-${e.value}-${year}`, 'MM-DD-YYYY').toDate());
            }}
          />
          <div className="show-for-small-only mb-sm"></div>
        </div>
        <div className="column medium-4 small-12">
          <CustomSelect
            className="large datepicker"
            value={year}
            clearable={false}
            options={this.getYearValues()}
            placeholder="Year"
            onChange={(e) => {
              this.setState({
                year: e.value,
              });
              this.props.onChange(moment(`${month}-${day}-${e.value}`, 'MM-DD-YYYY').toDate());
            }}
          />
          <div className="show-for-small-only mb-sm"></div>
        </div>
      </div>
    );
  }
}

export default DatePicker;
