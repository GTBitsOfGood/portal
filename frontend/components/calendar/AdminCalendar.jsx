import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getAvailabilities as getAvailabilitiesBase, addAvailability as addAvailabilityBase } from '../../redux/actions/availabilityActions';
import './calendar.css';

const getHoursPerDay = (day, availabilities) => {
  const hours = [];

  const availHours = [];
  for (let i = 0; i < availabilities.length; i += 1) {
    const curDay = availabilities[i];

    const startDate = moment(curDay.startDate);

    if (day.isSame(startDate, 'date')) {
      availHours.push({
        startDate,
        id: curDay._id,
        isBooked: curDay.isBooked,
      });
    }
  }

  const startHour = 9;
  const startHours = moment(day).startOf('day').add(startHour, 'hour');

  for (let i = 0; i < 8; i += 1) {
    const time = startHours.clone().add(i, 'hour');
    let isAvailable = false;
    let id = null;

    for (let j = 0; j < availHours.length; j += 1) {
      const curHour = availHours[j];

      if (time.isSame(curHour.startDate, 'hour')) {
        isAvailable = !curHour.isBooked;
        id = curHour.id;
        break;
      }
    }

    hours.push({
      time,
      isAvailable,
      id,
    });
  }

  return hours;
};

class AdminCalendar extends React.PureComponent {
  constructor(props) {
    super(props);

    const weekStart = moment().startOf('week').add(1, 'day');
    const upcomingDays = [];
    // const upcomingMonths = [];


    for (let i = 0; i < 5; i += 1) {
      upcomingDays.push(weekStart.clone().add(i, 'day').startOf('day'));
    }

    // for (let i = 0; i < 2; i += 1) {
    //   upcomingMonths.push(moment().add(i, 'month'));
    // }

    this.state = {
      upcomingDays,
      selectedDays: {},
      monthYear: moment(),
      interviewer: '',
      // upcomingMonths,
    };
  }

  async componentDidMount() {
    const { getAvailabilities } = this.props;
    let availabilityCheck = await getAvailabilities();
    availabilityCheck = availabilityCheck.payload;
    availabilityCheck.forEach((availability) => {
      this.setState((prevState) => ({
        selectedDays: {
          ...prevState.selectedDays,
          [moment(availability.startDate).toDate()]: availability._id,
        },
      }));
    });
  }

  addOrRemoveAvailability = (availableDate) => {
    const { selectedDays } = this.state;

    if (availableDate.toDate() in selectedDays) {
      const selectedDaysCopy = selectedDays;
      delete selectedDaysCopy[availableDate.toDate()];
      this.setState({
        selectedDays: selectedDaysCopy,
      });
      this.forceUpdate();
    } else {
      this.setState((prevState) => ({
        selectedDays: {
          ...prevState.selectedDays,
          [availableDate.toDate()]: -1,
        },
      }));
    }
  }

  getNextWeek = (curWeek) => {
    if (curWeek.diff(moment(), 'weeks') > 3) {
      return;
    }

    const nextWeek = [];
    const nextDay = curWeek.add(1, 'weeks').startOf('isoWeek');

    for (let i = 0; i < 5; i += 1) {
      nextWeek.push(nextDay.clone().add(i, 'day').startOf('day'));
    }

    this.setState({
      upcomingDays: nextWeek,
    });
  }

  getPreviousWeek = (curWeek) => {
    if (curWeek.isBefore(moment())) {
      return;
    }
    const prevWeek = [];
    const prevDay = curWeek.subtract(1, 'weeks').startOf('isoWeek');

    for (let i = 0; i < 5; i += 1) {
      prevWeek.push(prevDay.clone().add(i, 'day').startOf('day'));
    }

    this.setState({
      upcomingDays: prevWeek,
    });
  }

  updateMonthYear = (selectedMonth) => {
    this.setState({
      monthYear: selectedMonth,
    });
  }

  handleChangeInterviewer = (event) => {
    let eventClone = event.target.value;
    if (eventClone === '') {
      eventClone = null;
    }
    this.setState({
      interviewer: eventClone,
    });
  }

  addAvailability = (event) => {
    event.preventDefault();
    const { addAvailability } = this.props;
    const { selectedDays, interviewer } = this.state;

    Object.keys(selectedDays).forEach((date) => {
      const availability = {
        startDate: date,
        interviewer,
      };
      addAvailability(availability);
    });
  }

  render() {
    const { availability } = this.props;
    const {
      upcomingDays,
      selectedDays,
      monthYear,
      interviewer,
      // upcomingMonths,
    } = this.state;
    const { availabilities, loading } = availability;

    return (
      <div>
        <h1 style={{ fontWeight: 600, marginLeft: '10%' }}>Select your availability</h1>
        <span>
          <button
            type="button"
            className="navigationButton"
            style={{ marginLeft: '10%' }}
            onClick={() => this.getPreviousWeek(monthYear)}
          >
            {'< '}
            Previous Week
          </button>
          <button
            type="button"
            className="navigationButton"
            style={{ marginLeft: '50px' }}
            onClick={() => this.getNextWeek(monthYear)}
          >
            Next Week
            {' >'}
          </button>
          <div className="dropdown">
            <button
              type="button"
              className="monthSelected"
              style={{
                marginTop: '-40px',
                width: '300px',
                backgroundColor: '#C4C4C4',
                float: 'right',
                marginRight: '10%',
              }}
            >
              {monthYear.format('MMMM YYYY')}
            </button>
            {/* <div className="dropdownMonthList">
              {upcomingMonths.map((month) => (
                <button
                  key={month}
                  className="monthItem"
                  type="button"
                  onClick={() => this.updateMonthYear(month)}
                >
                  {month.format('MMMM YYYY')}
                </button>
              ))}
            </div> */}
          </div>
        </span>
        <div className="admincalendar-container">
          <div className="admincalendar">
            <div className="admincalendarHeader">
              {upcomingDays.map((day) => (
                <div
                  key={day.toString()}
                  className="adminheaderDay"
                >
                  <p className="weekDay">{day.format('dddd')}</p>
                  <p className="monthDay">{day.format('D')}</p>
                </div>
              ))}
            </div>
            <div className="admincalendarBody">
              {upcomingDays.map((day) => (
                <div
                  key={day.toString()}
                  className="dayColumn"
                >
                  {getHoursPerDay(day, availabilities).map(({ time, id }) => (
                    <button
                      key={time.toString()}
                      type="button"
                      className={`dayHour ${(loading || !(time.toDate() in selectedDays)) ? 'adminhourDisplay' : 'adminhourSelected'}`}
                      onClick={() => this.addOrRemoveAvailability(time)}
                      onKeyDown={() => this.addOrRemoveAvailability(time)}
                    >
                      <p className="time">
                        {time.format('h:mm a')}
                      </p>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <form onSubmit={this.addAvailability}>
          <label htmlFor="interviewer" className="inputInterviewer">
            Interviewer:
            <input
              type="text"
              id="interviewer"
              value={interviewer}
              onChange={this.handleChangeInterviewer}
              style={{ marginLeft: '15px', borderRadius: '5px', border: '1px solid black' }}
              required
            />
          </label>
          <button className="submitAvailability" type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

AdminCalendar.propTypes = {
  getAvailabilities: PropTypes.func.isRequired,
  addAvailability: PropTypes.func.isRequired,
  availability: PropTypes.shape({
    availabilities: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
  }),
};

AdminCalendar.defaultProps = {
  availability: {
    availabilities: [],
    loading: true,
  },
};

const mapStateToProps = (state) => ({
  availability: state.availability,
});

export default connect(mapStateToProps, {
  getAvailabilities: getAvailabilitiesBase,
  addAvailability: addAvailabilityBase,
})(AdminCalendar);
