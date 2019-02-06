import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import Calendar from "react-calendar/dist/entry.nostyle";
import EventList from "../../components/EventList";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  ButtonToolbar,
  Button
} from "react-bootstrap";
import Moment from "react-moment";
import MomentJS from "moment";
import "./styles.css";
import "./stylesM.css";
import { getYearMonthEvents } from "../../actions/Events";
import ReactTooltip from "react-tooltip";
import Tooltip from "./Tooltip/index";
const mapStateToProps = ({ User, Window, Events }) => ({
  User,
  Window,
  Events
});

const mapDispatchToProps = { getYearMonthEvents };

class GuildCalendar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: null,
      isMobile: false,
      show: false,
      editing: false
    };
  }

  static propTypes = {
    activeDate: PropTypes.Date,
    isMobile: PropTypes.bool
  };

  static defaultProps = { activeDate: new Date() };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const { getYearMonthEvents, activeDate } = this.props;
    const payload = { date: activeDate };
    getYearMonthEvents(payload);
    this.setState({ activeDate });
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Events, Window } = props;
    this.setState({ User, Events, Window });
  };

  onChange = activeDate => this.setState({ activeDate });

  Today = () => {
    const { getYearMonthEvents } = this.props;
    const activeStartDate = new Date();
    const payload = { date: activeStartDate };
    getYearMonthEvents(payload);
    this.setState({ activeDate: activeStartDate });
  };

  onActiveDateChange = ({ activeStartDate, view }) => {
    const { getYearMonthEvents } = this.props;
    const payload = { date: activeStartDate };
    getYearMonthEvents(payload);
    return this.setState({ activeDate: activeStartDate });
  };

  render() {
    const { history } = this.props;
    const { User, Events, Window, activeDate, show, editing } = this.state;
    const { isMobile } = Window;
    const renderTooltip = props => (
      <div
        {...props}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          padding: "2px 10px",
          color: "white",
          borderRadius: 3,
          ...props.style
        }}
      >
        Simple tooltip
      </div>
    );
    const tileContent = ({ date, view }) => {
      const { hovering, hoverIndex } = this.state;
      //console.log("HERE: ", Events);
      let mapCounter = {}; // Use to display only 1 eventLabelColor per day for mobile
      return (
        <div class="TileContent">
          {Events.results.map((k, i) => {
            const calendarDay = MomentJS(date);
            const eventStartTime = MomentJS(k.start_date);
            const eventFound = eventStartTime.isSame(calendarDay, "day");
            const dayOfTheYear = eventStartTime.dayOfYear();
            //console.log("calendarDay: ", calendarDay);
            mapCounter[dayOfTheYear] = mapCounter[dayOfTheYear] + 1 || 1;
            return view === "month" && eventFound && !isMobile ? (
              <div
                className="hasEventsContainer"
                // onMouseEnter={e => this.setState({ hoverIndex: i })}
                // onMouseOver={e => this.setState({ hovering: true })}
                // onMouseOut={e => this.setState({ hovering: false })}
              >
                <span className="eventLabelColor" />

                <span data-for={`${k.id}`} data-tip={i}>
                  <Moment format="hh:mma">{k.start_date}</Moment>
                </span>
                <ReactTooltip
                  id={`${k.id}`}
                  key={i}
                  className="toolTipWrapper"
                  place="top"
                  type="dark"
                  effect="solid"
                  offset={{ right: 36 }}
                >
                  {Tooltip({ ...k })}
                </ReactTooltip>

                <h6 className="eventTitle">{k.name}</h6>
              </div>
            ) : view === "month" &&
              eventFound &&
              mapCounter[dayOfTheYear] < 2 ? (
              <div class="hasEventsContainerMobile">
                <span className="eventLabelColor" />
              </div>
            ) : null;
          })}
        </div>
      );
    };
    return (
      <Grid className="GuildCalendar Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">CALENDAR</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              disabled={!(User.is_superuser || User.can_create_calendar_event)}
              onClick={e => history.push("/calendar/new/event")}
              className="todayButton"
            >
              <i className="far fa-calendar-plus" /> Event
            </Button>
            <Button onClick={this.Today} className="todayButton pull-right">
              <i className="fas fa-calendar-day" /> Today
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Calendar
              calendarType="ISO 8601"
              onChange={this.onChange}
              value={activeDate}
              ativeStartDate={new Date()} // fallback if value not set
              tileContent={tileContent}
              //tileClassName={this.tileHandler}
              minDetail={"month"}
              onActiveDateChange={this.onActiveDateChange}
              showFixedNumberOfWeeks={true}
              next2Label={null}
              prev2Label={null}
              nextLabel={<i className="fa fa-chevron-circle-right" />}
              prevLabel={<i className="fa fa-chevron-circle-left" />}
              onClickDay={null}
            />
          </Col>
          <Col className="EventList" lgHidden mdHidden sm={12}>
            <h2>
              <Moment format="MMM D">{activeDate}</Moment>
            </h2>
            <EventList data={Events.results} activeDate={activeDate} />
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(GuildCalendar);
