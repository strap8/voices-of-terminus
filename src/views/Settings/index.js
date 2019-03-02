import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader, Checkbox } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import "./stylesM.css";
import { getSettings, postSettings, setSettings } from "../../actions/Settings";

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = { getSettings, postSettings, setSettings };

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUpdate() {}

  /* render() */

  componentDidMount() {
    const { User, getSettings } = this.props;
    if (User.token) getSettings(User.token, User.id);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User } = props;
    this.setState({ User });
  };

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    const { postSettings, setSettings } = this.props;
    const { User } = this.state;
    const { Settings } = User;
    const { show_footer, push_messages } = Settings;
    return (
      <Grid className="Settings Container">
        <Row>
          <PageHeader className="pageHeader">SETTINGS</PageHeader>
        </Row>
        <Row>
          <h2 className="headerBanner">Appearance</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <Checkbox
              disabled={!User.id}
              checked={show_footer}
              onClick={() =>
                !Settings.id
                  ? postSettings(User.token, { user: User.id })
                  : setSettings(User.token, Settings.id, {
                      show_footer: !show_footer
                    })
              }
            >
              <span className="checkBoxText">Show footer</span>
              <span className="help">Toggles the view of the footer.</span>
            </Checkbox>
          </Col>
        </Row>
        <Row>
          <h2 className="headerBanner">Features</h2>
        </Row>
        <Row className="checkBoxTable">
          <Col xs={12}>
            <Checkbox
              disabled={!User.id}
              checked={push_messages}
              onClick={() =>
                !Settings.id
                  ? postSettings(User.token, { user: User.id })
                  : setSettings(User.token, Settings.id, {
                      push_messages: !push_messages
                    })
              }
            >
              <span className="checkBoxText">Push messages</span>
              <span className="help">
                Toggles frequent fetches of messages.
              </span>
            </Checkbox>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Settings);
