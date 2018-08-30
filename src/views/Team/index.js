import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, Image, PageHeader } from 'react-bootstrap'
import './styles.css'
import Yarnilla from '../../images/yarnilla.png'
import Kodiack from '../../images/kodiack.png'
import Leksur from '../../images/leksur.png'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Team extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
  }
  
  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  getState = props => {
    this.setState({
      })
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
      <Grid className="TeamContainer">
        <Row>
          <Col md={3}>
            <Image src={Yarnilla} responsive />
          </Col>
          <Col md={9} xs={12} className="Card">
            <PageHeader>Yarnila Graumond<small>Founder</small></PageHeader>
            <p>I never gave Leksur a bio, so now I'm prancing around in the streets completely nude screaming "Bless me Oh Mighty Aradune! Blessss meeee!"</p>
          </Col>
        </Row>
        <Row>
        <Col md={3}>
          <Image src={Leksur} responsive />
        </Col>
        <Col lg={9} md={9} sm={12} xs={12}>
          <PageHeader>Leksur Ackus<small>Founder</small></PageHeader>
          <p>A streamer on mixer.com and twitch.tv, Leksur spends his days being an IT jack-of-all-trades. Leksur handles the VOT website as well as provides the Voices of Terminus show with a unique 
            perspective from a software developer's point of view. Hobbies include: Gaming, tinkering, rc racing and eating Halflings.</p>
        </Col>
      </Row>
        <Row>
          <Col md={3}>
            <Image src={Kodiack} responsive />
          </Col>
          <Col md={9} sm={12} xs={12}>
            <PageHeader>Kodiack Ironclaw</PageHeader>
            <p>I'm too busy to give Leksur a short bio b/c I'm super important, la-de-da!</p>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Team)