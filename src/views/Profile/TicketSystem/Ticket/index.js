import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  ButtonToolbar,
  Button,
  Image,
  ControlLabel,
  FormControl,
  FormGroup
} from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import FormData from "form-data";
import { getUsers, clearAdminApi } from "../../../../actions/Admin";
import { postTicket } from "../../../../actions/Tickets";
import { withAlert } from "react-alert";
import Select from "react-select";
import CreatableSelect from "react-select/lib/Creatable";
import { joinStrings } from "../../../../helpers";
import { ticketTypeOptions } from "../../../../helpers/options";
import { selectStyles } from "../../../../helpers/styles";
import PendingAction from "../../../../components/PendingAction";
import "./styles.css";

const mapStateToProps = ({ Admin, User }) => ({ Admin, User });

const mapDispatchToProps = { postTicket, getUsers, clearAdminApi };

class Ticket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ticket_type: ticketTypeOptions[0]
    };
  }

  static propTypes = {};

  static defaultProps = {
    ticketTypeOptions: ticketTypeOptions
  };

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate = true;
    // const { User } = nextProps;
    // const { last_login } = User;
    // const currentUser = this.state.User;
    // const currentLogin = currentUser.last_login;

    // if (isEquivalent(currentUser, User) && last_login != currentLogin)
    //   shouldUpdate = false;

    return shouldUpdate;
  }

  componentDidMount() {
    const { getUsers, clearAdminApi } = this.props;
    getUsers();
    clearAdminApi();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { Admin, ticketTypeOptions } = props;

    const peoplOptions = Admin.Users
      ? Admin.Users.map(
          i => (i = { value: i.username, label: i.username })
        ).sort((a, b) => a.label.localeCompare(b.label))
      : [];
    const { posting, posted, updating, updated, error } = Admin;
    this.setState({
      ticketTypeOptions,
      peoplOptions,
      posting,
      posted,
      updating,
      updated,
      error
    });
  };

  componentWillUnmount() {
    const { clearAdminApi } = this.props;
    clearAdminApi();
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  setImage = e => {
    const { alert } = this.props;
    var file = e.target.files[0];
    if (file.size > 3145728) {
      alert.error(<div>Please use an image less then 3MB</div>);
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => this.setState({ image: reader.result });
    }
  };

  selectOnChange = (e, a, name) => {
    switch (a.action) {
      case "clear":
        this.setState({ [name]: null });
        break;
      // case "create-option":
      //   this.setState({ [name]: e });
      //   break;
      case "pop-value":
        this.setState({ [name]: null });
        break;
      case "remove-value":
        this.setState({ [name]: null });
        break;
      // case "select-option":
      //   this.setState({ [name]: e });
      //   break;
      default:
        this.setState({ [name]: e });
    }
  };

  postTicket = () => {
    const { User, postTicket } = this.props;
    const {
      offenders,
      corroborators,
      others_involved,
      description,
      ticket_type,
      image
    } = this.state;

    let payload = new FormData();
    payload.append("author", User.id);
    payload.append("offenders", offenders ? joinStrings(offenders) : "");
    payload.append(
      "corroborators",
      corroborators ? joinStrings(corroborators) : ""
    );
    payload.append(
      "others_involved",
      others_involved ? joinStrings(others_involved) : ""
    );
    payload.append("description", description);
    payload.append("ticket_type", ticket_type.label);
    if (image) payload.append("image", image);
    payload.append("priority", ticket_type.value);

    postTicket(User.token, payload);
  };

  render() {
    const { history } = this.props;
    const {
      offenders,
      corroborators,
      others_involved,
      description,
      ticket_type,
      image,
      ticketTypeOptions,
      peoplOptions,
      posting,
      posted,
      updating,
      updated,
      error
    } = this.state;
    return (
      <Grid className="Ticket Container">
        <Row>
          <PageHeader className="pageHeader">TICKET</PageHeader>
        </Row>
        <Row className="ActionToolbarRow">
          <Col
            xs={12}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <PendingAction
              Disabled={!(description && ticket_type)}
              Click={() => this.postTicket()}
              ActionPending={posting}
              ActionComplete={posted}
              ActionError={error}
              ActionName={"POST"}
              Redirect={() => history.push("/tickets")}
            />
          </Col>
        </Row>
        <Row className="borderedRow">
          <Col xs={12} md={6}>
            <ControlLabel>Type</ControlLabel>
            <FormGroup>
              <Select
                name="ticket_type"
                value={ticket_type}
                onChange={(e, a) => this.selectOnChange(e, a, "ticket_type")}
                options={ticketTypeOptions}
                isClearable={false}
                isSearchable={false}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                styles={selectStyles()}
              />
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>
            <ControlLabel>Offenders</ControlLabel>
            <span className="help-inline">Main person involved</span>
            <FormGroup>
              <CreatableSelect
                //https://react-select.com/props
                name="offenders"
                value={offenders}
                isMulti={true}
                styles={selectStyles()}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isClearable={true}
                placeholder="Add..."
                classNamePrefix="select"
                onChange={(e, a) => this.selectOnChange(e, a, "offenders")}
                options={peoplOptions}
              />
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>
            <ControlLabel>Corroborators</ControlLabel>
            <span className="help-inline">Main person who is a witness</span>
            <FormGroup>
              <CreatableSelect
                //https://react-select.com/props
                name="corroborators"
                value={corroborators}
                isMulti={true}
                styles={selectStyles()}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isClearable={true}
                placeholder="Add..."
                classNamePrefix="select"
                onChange={(e, a) => this.selectOnChange(e, a, "corroborators")}
                options={peoplOptions}
              />
            </FormGroup>
          </Col>
          <Col xs={12} md={6}>
            <ControlLabel>Others involved</ControlLabel>
            <span className="help-inline">Others people</span>
            <FormGroup>
              <CreatableSelect
                name="others_involved"
                value={others_involved}
                isMulti={true}
                styles={selectStyles()}
                onBlur={e => e.preventDefault()}
                blurInputOnSelect={false}
                isClearable={true}
                placeholder="Add..."
                classNamePrefix="select"
                onChange={(e, a) =>
                  this.selectOnChange(e, a, "others_involved")
                }
                options={peoplOptions}
              />
            </FormGroup>
          </Col>
          <Col xs={12}>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                value={description}
                componentClass="textarea"
                type="textarea"
                name="description"
                wrap="hard"
                placeholder="Description"
                onChange={this.onChange}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row className="Center borderedRow">
          <Col xs={12}>
            <Image src={image} className="ProfileImages" responsive rounded />
            <ControlLabel>Image proof</ControlLabel>
            <FormControl
              style={{ margin: "auto" }}
              type="file"
              label="File"
              name="image"
              onChange={this.setImage}
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Ticket)
);
