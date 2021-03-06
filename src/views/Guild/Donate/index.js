import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import { Grid, Row, Col, Button } from "react-bootstrap";
import "./styles.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class Donate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  render() {
    return (
      <Grid className="Donate Container fadeIn">
        <Row>
          <Col className="donationText" xs={12}>
            <p>
              VoT (Voices of Terminus) Show is community / fan-based
              podcast/show started March 23, 2016. Its is made for the community
              and fans of Pantheon during it’s development and thereafter. The
              show is never based on tips or donations nor does it budget for
              them. It is for the community, by the community, for the fans, by
              the fans. Donations are NEVER required, but if you feel like
              supporting the show, then click the following link/button. Always
              take care of yourself first! Otherwise feel free to support the
              show by retweeting, following and spreading the word!
            </p>
          </Col>
          <Col className="donateButton" xs={12}>
            <Button
              type="submit"
              href="https://paypal.me/VoicesofTerminus"
              target="_blank"
            >
              <i className="fas fa-donate fa-2x">
                <span style={{ fontSize: "30px" }}> Donate</span>
              </i>
            </Button>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Donate);
