import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Grid, Row, Col, Well, Image} from 'react-bootstrap'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import './stylesM.css'
import {getUser} from '../../../actions/App'
import {withRouter} from 'react-router-dom'
import {statusLevelInt, statusLevelString, classIcon, professionIcon} from '../../../helpers'
import Moment from 'react-moment'

const mapStateToProps = ({Admin}) => ({
  Admin
})

const mapDispatchToProps = {
  getUser
}

class OtherProfile extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
    /* 
    is_superuser(pin): false
    email(pin): "vot@gmail.com"
    is_staff(pin): false
    is_leader(pin): false
    is_council(pin): true
    is_general_officer(pin): false
    is_officer(pin): false
    is_senior_member(pin): false
    is_junior_member(pin): false
    is_recruit(pin): false
    is_raid_leader(pin): false
    is_banker(pin): false
    is_recruiter(pin): false
    is_class_lead(pin): false
    is_crafter_lead(pin): false
    can_create_article(pin): true
    can_create_newsletter(pin): true
    can_create_calendar_event(pin): false
    can_read_article(pin): true
    can_read_newsletter(pin): true
    can_read_calendar_event(pin): true
    can_update_article(pin): false
    can_update_newsletter(pin): false
    can_update_calendar_event(pin): false
    can_delete_article(pin): false
    can_delete_newsletter(pin): false
    can_delete_calendar_event(pin): false
    is_active(pin): true
    date_joined(pin): "2018-11-06T17:31:55.216372Z"
    last_login(pin): "2018-11-06T17:51:54.552876Z"
    experience_points(pin): 0
    discord_url(pin): ""
    twitter_url(pin): ""
    twitch_url(pin): ""
    youtube_url(pin): ""
    primary_class(pin): "Dire Lord"
    */
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentWillUpdate() {
  }

  componentDidMount() {
    const {id} = this.props.match.params
    this.props.getUser(id)
  }
  
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User} = props.Admin
    this.setState({User})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  renderRoles = roles => Object.keys(roles).map(k => {
    if(roles[k]) {
      if(k === 'is_raid_leader') return <span>Raid Leader</span>
      if(k === 'is_banker') return <span>Banker</span>
      if(k === 'is_recruiter') return <span>Recruiter</span>
      if(k === 'is_class_lead') return <span>Class Lead</span>
      if(k === 'is_crafter_lead') return <span>Crafter Lead</span>
    }
    return null
  })

  render() {
    const {User} = this.state
    const {is_leader, is_council, is_general_officer, is_officer, is_senior_member, is_junior_member, is_recruit,
    is_raid_leader, is_banker, is_recruiter, is_class_lead, is_crafter_lead} = User ? User : {}
    const UserStatus = {is_leader, is_council, is_general_officer, is_officer, is_senior_member, is_junior_member, is_recruit}
    const UserRoles = {is_raid_leader, is_banker, is_recruiter, is_class_lead, is_crafter_lead}
    return (
      User ? 
      <Grid className="OtherProfile Container">
        <Row>
          <Col xs={12} style={{textAlign: 'center'}}>
            <Image src={User.profile_image} style={{height: '250px'}}/>
            <div><h3><i class="fas fa-birthday-cake"/> <Moment format="MMM DD, YYYY">{User.date_joined}</Moment></h3></div>
            <div><h3><i class="fas fa-sign-in-alt"/>  <Moment fromNow>{User.last_login}</Moment></h3></div>
            <div><h3><i class="fas fa-coins"/> {User.guild_points}</h3></div>
            <div><h2><progress value={User.experience_points} min="0" max="10000"></progress></h2></div>
          </Col>
          <Col xs={12} style={{textAlign: 'center'}}>
            <h1>{User.username.toUpperCase()}</h1>
            <span className="help">{User.first_name} {User.last_name}</span>
            <h2>{statusLevelString(statusLevelInt(UserStatus))}</h2>
            <div className="userRoles help">{this.renderRoles(UserRoles)}</div>
            <h4><Image src={classIcon(User.primary_class)} style={{height: '24px'}}/>
            <strong> Primary</strong> {'|'} {User.primary_race} {'|'} {User.primary_role} {'|'} {User.primary_class} {'|'}</h4>
            <h4><Image src={classIcon(User.secondary_class)} style={{height: '26px'}}/>
            <strong> Secondary</strong> {'|'} {User.secondary_race} {'|'} {User.secondary_role} {'|'} {User.secondary_class} {'|'}</h4>
            <h4>{professionIcon(User.profession, User.profession_specialization)}<strong> Profession</strong> {'|'} {User.profession} {'|'}  {User.profession_specialization} {'|'}</h4>
          </Col>
          <Col xs={12}>
            <Well className="userBio" bsSize="large">{User.bio ? User.bio : 'No biography given.'}</Well>
          </Col>
          <Col xs={12}>
            <Well className="userBio" bsSize="large"><i class="fas fa-award"/> Achievements <i class="fas fa-certificate"/></Well>
          </Col>
        </Row>
        <Row>
          
        </Row>
        
      </Grid> : null 
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(OtherProfile))
