import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { Grid, Row, Col, PageHeader } from 'react-bootstrap'
import './styles.css'
import Card from '../../components/Card'

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

class Articles extends Component {
  constructor(props) {
    super(props)
 
    this.state = {
    }
  }

  static propTypes = { 
  }

  static defaultProps = {
    Cards: [
      { Preview: '1 Contents of a document', Title: 'TITLE 1', Author: 'AUTHOR 1', Tags: ['Review', 'Blog'] },
      { Preview: '2 Contents of a document', Title: 'TITLE 2', Author: 'AUTHOR 2', Tags: ['FanFiction', 'Blog'] },
      { Preview: '3 Contents of a document', Title: 'TITLE 3', Author: 'AUTHOR 3', Tags: ['Blog', 'Review'] },
      { Preview: '4 Contents of a document', Title: 'TITLE 4', Author: 'AUTHOR 4 ', Tags: ['Blog'] },
      { Preview: '5 Contents of a document', Title: 'TITLE 8', Author: 'AUTHOR 5', Tags: ['Review', 'Blog'] },
      { Preview: '6 Contents of a document', Title: 'TITLE 8', Author: 'AUTHOR 6', Tags: ['FanFiction', 'Blog'] },
      { Preview: '7 Contents of a document', Title: 'TITLE 8', Author: 'AUTHOR 7', Tags: ['FanFiction', 'Review'] },
      { Preview: '8 Contents of a document', Title: 'TITLE 8', Author: 'AUTHOR 8 ', Tags: ['Blog'] }
    ]
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

  renderCards = (Cards) => Cards.map(card => {
    return (
      <Col className="CardContainer" md={3}>
        <Card {...card} />
      </Col>
    )
  })

  render() {
    const {Cards} = this.props
    return (
      <Grid className="Articles Container">
        <Row>
            <PageHeader className="pageHeader">ARTICLES</PageHeader>
        </Row>

        <Row>
          <h3>Highlights</h3>
          {this.renderCards(Cards)}
        </Row>

        <Row>
          <h3>Recent</h3>
        </Row>

      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Articles)