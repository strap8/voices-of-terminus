import React, { Component } from "react";
import { connect as reduxConnect } from "react-redux";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  Image,
  NavItem,
  Tabs,
  Tab
} from "react-bootstrap";
import "./styles.css";
import Galleries from "./Galleries";
import Videos from "./Videos";
import Streams from "./Streams";
import Podcasts from "./Podcasts";

const mapStateToProps = ({ YouTubeChannelData }) => ({
  YouTubeChannelData
});

const mapDispatchToProps = {};

class Media extends Component {
  constructor(props) {
    super(props);

    this.state = {
      YouTubeChannelData: [],
      history: {}
    };
  }

  static propTypes = {
    images: PropTypes.array,
    YouTubeChannelData: PropTypes.array,
    history: PropTypes.object,
    eventKey: ""
  };

  static defaultProps = {
    YouTubeChannelData: [],
    TabItems: [
      {
        eventKey: "/media/galleries",
        Title: <i className="fas fa-images"> GALLERIES</i>,
        Component: Galleries
      },
      {
        eventKey: "/media/videos",
        Title: <i className="fab fa-youtube"> VIDEOS</i>,
        Component: Videos
      },
      {
        eventKey: "/media/streams",
        Title: <i className="fab fa-twitch"> STREAMS</i>,
        Component: Streams
      },
      {
        eventKey: "/media/podcasts",
        Title: <i className="fas fa-podcast"> PODCASTS</i>,
        Component: Podcasts
      },
      {
        eventKey: "/media/vot-network",
        Title: <i className="fas fa-network-wired"> VOT NETWORK</i>,
        Component: Podcasts
      }
    ]
  };

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { YouTubeChannelData, history } = props;
    const { pathname } = history.location;
    this.setState({ eventKey: pathname, YouTubeChannelData, history });
  };

  renderTabs = TabItems =>
    TabItems.map(k => {
      const { eventKey, Title, Component } = k;
      const { history, location, match } = this.props;
      return (
        <Tab eventKey={eventKey} title={Title} unmountOnExit={true}>
          {<Component history={history} location={location} match={match} />}
        </Tab>
      );
    });

  render() {
    const { eventKey, history } = this.state;
    const { TabItems } = this.props;
    return (
      <Grid className="Media Container fadeIn">
        <Row>
          <PageHeader className="pageHeader">MEDIA</PageHeader>
        </Row>
        <Row>
          <Col>
            <Tabs
              defaultActiveKey={eventKey}
              activeKey={eventKey}
              className="Tabs"
              onSelect={eventKey => {
                this.setState({ eventKey });
                history.push(eventKey);
              }}
              animation={true}
            >
              {this.renderTabs(TabItems)}
            </Tabs>
          </Col>
        </Row>
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Media);
