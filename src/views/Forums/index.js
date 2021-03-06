import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, PageHeader, Tabs, Tab } from "react-bootstrap";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class Forums extends PureComponent {
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
      <Grid className="Forums Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">FORUMS</PageHeader>
        </Row>
        <Row>
          <Col>
            <Tabs defaultActiveKey={1} className="Tabs">
              <Tab eventKey={1} title="CATEGORIES" unmountOnExit={true}>
                Categories
              </Tab>
              <Tab eventKey={2} title="ALL TOPICS" unmountOnExit={true}>
                All topics
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Forums);
