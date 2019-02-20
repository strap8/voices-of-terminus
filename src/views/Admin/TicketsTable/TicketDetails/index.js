import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Well,
  Image,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  ButtonGroup
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import { getTicket, editTicket } from "../../../../actions/Tickets";
import { clearAdminApi } from "../../../../actions/Admin";
import { Link, Redirect } from "react-router-dom";
import Moment from "react-moment";
import { circleColor, ticketStatusOptions } from "../../../../helpers";
import Select from "react-select";
import { selectStyles } from "../../../../helpers/styles";
import "./styles.css";
import { stat } from "fs";

const mapStateToProps = ({ Admin, User }) => ({ Admin, User });

const mapDispatchToProps = { getTicket, editTicket, clearAdminApi };

class TicketDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {
    ticketTypeOptions: ticketStatusOptions
  };

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {
    const { User, getTicket, clearAdminApi, match } = this.props;
    const { id } = match.params;
    const { token } = User;
    clearAdminApi();
    getTicket(token, id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, User, ticketTypeOptions } = props;
    const { Ticket, posting, posted, updating, updated, error } = Admin;
    const { notes } = this.state.notes ? this.state : Ticket;
    const { status } = this.state.status ? this.state : Ticket;
    this.setState({
      User,
      Ticket,
      ticketTypeOptions,
      posting,
      posted,
      updating,
      updated,
      error,
      notes,
      status
    });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    const { clearAdminApi } = this.props;
    clearAdminApi();
  }

  renderOthersInvolved = othersInvolved =>
    othersInvolved.map(o => {
      const name = o;
      return <span className="OthersInvolved">{name}</span>;
    });

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  selectOnChange = (e, a, name) => {
    switch (a.action) {
      case "clear":
        this.setState({ [name]: null });
        break;
      case "pop-value":
        if (e.value.isFixed) {
          return;
        }
      case "select-option":
        this.setState({ [name]: e });
        break;
    }
  };

  editTicketStatus = () => {
    const { User, editTicket, match } = this.props;
    const { id } = match.params;
    let { status, notes } = this.state;
    if (typeof status == "object") status = status.value;

    const payload = { status, notes };

    editTicket(User.token, id, payload);
  };

  render() {
    const { history } = this.props;
    const {
      User,
      Ticket,
      ticketTypeOptions,
      posting,
      posted,
      updating,
      updated,
      error
    } = this.state;
    const canViewTickets =
      User.is_leader ||
      User.is_advisor ||
      User.is_council ||
      User.is_general_officer ||
      User.is_officer;
    const {
      id,
      author,
      author_username,
      offender,
      offender_username,
      corroborator,
      corroborator_username,
      others_involved,
      description,
      image,
      priority,
      ticket_type,
      date_created,
      last_modified
    } = Ticket;
    const { status, notes } = this.state;
    const othersInvolved = others_involved ? others_involved.split("|") : [];
    const dateChanged = new Date(last_modified) - new Date(date_created) > 0;
    return !canViewTickets ? (
      history.length > 2 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/" />
      )
    ) : (
      Ticket && (
        <Grid className="TicketDetails Container">
          <Row>
            <PageHeader className="pageHeader">TICKET</PageHeader>
          </Row>
          <Row>
            <Col xs={12}>
              <h3>
                <i
                  className="fas fa-circle"
                  style={{ color: circleColor(status) }}
                />
                {` Status: ${status}`}
              </h3>
            </Col>
            <Col xs={12}>
              <h3>
                <i className="fas fa-exclamation-circle" />
                {` Priority: ${priority}`}
              </h3>
            </Col>
            <Col xs={12}>
              <h3>{`Type: ${ticket_type}`}</h3>
            </Col>
            <Col xs={12}>
              <h3>
                Created: <Moment fromNow>{date_created}</Moment>
              </h3>
            </Col>
            {dateChanged && (
              <Col xs={12}>
                <h3>
                  Updated: <Moment fromNow>{last_modified}</Moment>
                </h3>
              </Col>
            )}
            {author_username && (
              <Col xs={12}>
                <h3>
                  Reported by:{" "}
                  <Link to={`/admin/edit/user/${author}`}>
                    {author_username}
                  </Link>
                </h3>
              </Col>
            )}
            {offender && (
              <Col xs={12}>
                <h3>
                  Offended by:{" "}
                  <Link to={`/admin/edit/user/${offender}`}>
                    {offender_username}
                  </Link>
                </h3>
              </Col>
            )}
            {othersInvolved.length > 0 && (
              <Col xs={12}>
                <h3>
                  Others involved:{this.renderOthersInvolved(othersInvolved)}
                </h3>
              </Col>
            )}
            <Col xs={12}>
              <h3>Description</h3>
              <Well className="TicketDescription" bsSize="large">
                {description}
              </Well>
            </Col>
            <Col xs={12}>
              <h3>Image proof</h3>
              <Image
                title="Image proof"
                className="ImageProof"
                src={image}
                rounded
              />
            </Col>
            <Col xs={12}>
              <ControlLabel>Update status</ControlLabel>
              <Select
                height={100}
                name="ticket_type"
                value={status.value ? status : { value: status, label: status }}
                onChange={(e, a) => this.selectOnChange(e, a, "status")}
                options={ticketTypeOptions}
                isClearable={false}
                isSearchable={false}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles()}
              />
            </Col>
            <Col xs={12}>
              <FormGroup>
                <ControlLabel>Notes</ControlLabel>
                <FormControl
                  value={notes}
                  componentClass="textarea"
                  type="textarea"
                  name="notes"
                  wrap="hard"
                  placeholder="Notes..."
                  onChange={this.onChange}
                />
              </FormGroup>
            </Col>
            <Col md={12} className="Center">
              <ButtonGroup>
                <Button onClick={() => this.editTicketStatus()}>
                  {" "}
                  {posting && !posted
                    ? [<i className="fa fa-spinner fa-spin" />, " SUBMIT"]
                    : !posting && posted && !error
                    ? [
                        <i
                          className="fas fa-check"
                          style={{ color: "var(--color_emerald)" }}
                        />,
                        " SUBMIT"
                      ]
                    : error
                    ? [
                        <i
                          className="fas fa-times"
                          style={{ color: "var(--color_alizarin)" }}
                        />,
                        " SUBMIT"
                      ]
                    : "SUBMIT"}
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Grid>
      )
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TicketDetails);