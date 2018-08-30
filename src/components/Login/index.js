import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'
import './styles.css'
import { Form, FormGroup, Grid, Row, Col, FormControl, Checkbox, Button, PageHeader} from 'react-bootstrap'

const mapStateToProps = () => ({

})

const mapDispatchToProps = dispatch => {

}

class Login extends Component {
  
  constructor(props) {
    super();
 
    this.state = {
    
    };
  }

  static propTypes = {
    
  }

  static defaultProps = {

  }
  
  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
 
  }

  render() {
    return (
      <Grid className="LoginContainer">
        <Form className="LoginForm">
          <Row>
            <PageHeader>LOGIN</PageHeader>
          </Row>
          <Row>
            <Col md={6} smOffset={3} sm={6}>
              <FormGroup controlId="formHorizontalEmail">
                <FormControl type="email" placeholder="Email"/>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6} smOffset={3} sm={6}>
              <FormGroup controlId="formHorizontalPassword">
                <FormControl type="password" placeholder="Password" />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col smOffset={3} sm={6}>
              <FormGroup>
                <Checkbox>Remember me</Checkbox>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col smOffset={3} sm={6}>
              <FormGroup>
                  <Button type="submit" className="loginButton">Sign in</Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Grid>
    );
  }
}
 
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
