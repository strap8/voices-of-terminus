import React, { PureComponent } from "react";
import { connect as reduxConnect } from "react-redux";
import { withAlert } from "react-alert";
import PropTypes from "prop-types";
import "./styles.css";
import "./stylesM.css";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  Image,
  Badge,
  MenuItem
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import vrLogo from "../../images/VR_Logo.png";
import votLogo from "../../images/VoT-Logo-White.png";
import votLogoHover from "../../images/VoT-Logo-Orange-Border-White.png";
import { Logout } from "../../actions/App";
import { roleClassIcon } from "../../helpers";
import { UserHasPermissions } from "../../helpers/userPermissions";

const mapStateToProps = ({ User, Messages }) => ({
  User,
  Messages
});

const mapDispatchToProps = {
  Logout
};

class NavBar extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    Logout: PropTypes.func.isRequired,
    Settings: PropTypes.object
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Messages } = props;
    this.setState({ User, Messages });
  };

  Logout = () => {
    const { Logout, alert } = this.props;
    Logout();
    alert.show([<div>GOODBYE</div>]);
  };

  unreadMessages = groups => {
    let count = 0;
    if (!groups) return count;
    for (let i = 0; i < groups.length; i++) {
      const { messages } = groups[i];
      if (!messages) return count;
      else
        for (let j = 0; j < messages.length; j++) {
          const { is_read } = messages[j];
          if (!is_read) count += 1;
        }
    }
    return count;
  };

  render() {
    const { history, location } = this.props;
    const { pathname } = location;
    const { User, Messages } = this.state;
    const { Settings } = User;
    const { show_footer, push_messages } = Settings;
    const unreadMessages = this.unreadMessages(Messages.results);
    const hasUnreadMessages = unreadMessages > 0;
    const {
      token,
      id,
      is_superuser,
      is_staff,
      bio,
      primary_role,
      primary_class
    } = User;

    return (
      <Navbar inverse collapseOnSelect className="NavBar">
        <Navbar.Header>
          <Navbar.Brand>
            {(UserHasPermissions(User, "change_user") ||
              User.is_staff ||
              User.is_moderator) && (
              <LinkContainer to="/admin/overview" className="AdminButton">
                <NavItem eventKey={11}>
                  <i className="fas fa-database" /> ADMIN
                </NavItem>
              </LinkContainer>
            )}
            {/*<LinkContainer to="/">
                <NavItem eventKey={1}><Image src={votLogo} onMouseOver={e => e.currentTarget.src = votLogoHover} onMouseLeave={e => e.currentTarget.src = votLogo}/></NavItem>
                </LinkContainer>*/}
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <LinkContainer to="/home">
              <NavItem eventKey={1}>HOME</NavItem>
            </LinkContainer>
            <LinkContainer to="/calendar">
              <NavItem eventKey={3}>CALENDAR</NavItem>
            </LinkContainer>
            <LinkContainer to="/articles/">
              <NavItem eventKey={4}>Articles</NavItem>
            </LinkContainer>
            <LinkContainer to="/news/">
              <NavItem eventKey={5}>NEWS</NavItem>
            </LinkContainer>
            {/* <LinkContainer to="/forums">
              <NavItem eventKey={6}>FORUMS</NavItem>
            </LinkContainer> */}
            <NavDropdown eventKey={7} title="GUILD" id="basic-nav-dropdown">
              <LinkContainer to="/guild/about">
                <NavItem eventKey={7.1}>ABOUT</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/roster">
                <NavItem eventKey={7.2}>ROSTER</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/charters">
                <NavItem eventKey={7.3}>CHARTERS</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/lore">
                <NavItem eventKey={7.4}>LORE</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/contests">
                <NavItem eventKey={7.5}>CONTESTS</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/team">
                <NavItem eventKey={7.6}>TEAM</NavItem>
              </LinkContainer>
              <LinkContainer to="/guild/join">
                <NavItem eventKey={7.7}>JOIN</NavItem>
              </LinkContainer>
              <MenuItem divider />
              <NavItem
                href="https://www.designbyhumans.com/shop/VoicesofTerminus/"
                target="_blank"
                eventKey={6.8}
              >
                STORE
              </NavItem>
              <LinkContainer to="/guild/donate">
                <NavItem eventKey={7.9}>DONATE</NavItem>
              </LinkContainer>
            </NavDropdown>
            <NavDropdown eventKey={8} title="MEDIA" id="basic-nav-dropdown">
              <LinkContainer to="/media/galleries">
                <NavItem eventKey={8.1}>GALLERIES</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/videos">
                <NavItem eventKey={8.2}>VIDEOS</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/streams">
                <NavItem eventKey={8.3}>STREAMS</NavItem>
              </LinkContainer>
              <LinkContainer to="/media/podcasts">
                <NavItem eventKey={8.4}>PODCASTS</NavItem>
              </LinkContainer>
            </NavDropdown>
            <LinkContainer to="/references">
              <NavItem eventKey={9}>REFERENCES</NavItem>
            </LinkContainer>
            <NavDropdown eventKey={10} title="VR" id="connect-nav-dropdown">
              <Image src={vrLogo} className="vrLogo" />
              <NavItem
                eventKey={10.1}
                href="http://pantheonmmo.com/?referer=VoicesOfTerminus"
                target="_blank"
              >
                WEBSITE
              </NavItem>
              <NavItem
                eventKey={10.2}
                href="http://visionaryrealms.com/?referer=VoicesOfTerminus"
                target="_blank"
              >
                NEWS + EVENTS
              </NavItem>
              <NavItem
                eventKey={10.3}
                href="https://www.youtube.com/channel/UC4MbaiykerIrjKWRA6407tQ"
                target="_blank"
              >
                GAMEPLAY
              </NavItem>
              <NavItem
                eventKey={10.4}
                href="http://www.pantheonmmo.com/news/latest_news/"
                target="_blank"
              >
                NEWSLETTERS
              </NavItem>
              <NavItem
                eventKey={10.5}
                href="https://pantheonriseofthefallen.gamepedia.com/Pantheon:_Rise_of_the_Fallen_Wiki"
                target="_blank"
              >
                WIKI
              </NavItem>
            </NavDropdown>

            {!User.token ? (
              <LinkContainer to="/login" className="navbar-right">
                <NavItem eventKey={9}>LOGIN</NavItem>
              </LinkContainer>
            ) : (
              <NavDropdown
                eventKey={11}
                title={[
                  primary_class ? (
                    <Image
                      src={roleClassIcon(primary_class)}
                      style={{ height: "25px" }}
                    />
                  ) : (
                    <i key={11.1} className="fas fa-user" />
                  ),
                  <span key={11.2}> {User.username} </span>,
                  <Badge
                    key={11.3}
                    className={`${hasUnreadMessages ? "unreadMessages" : ""}`}
                  >
                    {unreadMessages}
                  </Badge>
                ]}
                className="navbar-right"
                id="basic-nav-dropdown"
              >
                <LinkContainer to="/profile">
                  <NavItem eventKey={11.4}>PROFILE</NavItem>
                </LinkContainer>
                <LinkContainer to="/messages">
                  <NavItem eventKey={11.5}>
                    MESSAGES{" "}
                    <Badge
                      className={`${hasUnreadMessages ? "unreadMessages" : ""}`}
                    >
                      {unreadMessages}
                    </Badge>
                  </NavItem>
                </LinkContainer>
                <NavItem onClick={this.Logout}>LOGOUT</NavItem>
                <MenuItem divider />
                {UserHasPermissions(User, "add_article") && (
                  <LinkContainer to="/article/new/">
                    <NavItem eventKey={11.6}>
                      <i className="fas fa-plus" /> ARTICLE
                    </NavItem>
                  </LinkContainer>
                )}
                {UserHasPermissions(User, "add_newsletter") && (
                  <LinkContainer to="/newsletter/new">
                    <NavItem eventKey={11.7}>
                      <i className="fas fa-plus" /> NEWSLETTER
                    </NavItem>
                  </LinkContainer>
                )}
                {UserHasPermissions(User, "add_form") && (
                  <LinkContainer to="/form/new/">
                    <NavItem eventKey={11.8}>
                      <i className="fas fa-plus" /> FORM
                    </NavItem>
                  </LinkContainer>
                )}

                {UserHasPermissions(User, "add_event") && (
                  <LinkContainer to="/calendar/new/event">
                    <NavItem eventKey={11.9}>
                      <i className="fas fa-plus" /> EVENT
                    </NavItem>
                  </LinkContainer>
                )}
                {UserHasPermissions(User, "add_ticket") && (
                  <LinkContainer to="/ticket/new">
                    <NavItem eventKey={11.1}>
                      <i className="fas fa-plus" /> TICKET
                    </NavItem>
                  </LinkContainer>
                )}
                <MenuItem divider />
                <LinkContainer to="/forms">
                  <NavItem eventKey={11.11}>
                    <i className="fas fa-eye" /> FORMS
                  </NavItem>
                </LinkContainer>
                <LinkContainer to="/tickets">
                  <NavItem eventKey={11.12}>
                    <i className="fas fa-eye" /> YOUR TICKETS
                  </NavItem>
                </LinkContainer>
                <MenuItem divider />
                <MenuItem
                  onClick={() => history.push("/settings")}
                  className="Center"
                >
                  <i className="fas fa-cog" /> Settings
                </MenuItem>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(NavBar)
);
