import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Form,
  FormGroup,
  Grid,
  Row,
  Col,
  FormControl,
  ControlLabel,
  Checkbox,
  Button,
  PageHeader,
  ButtonGroup,
  Modal,
  Image
} from "react-bootstrap";
import "./styles.css";

class ConfirmAction extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { show: false };
  }

  static propTypes = {};

  static defaultProps = {};

  handleHide = e => {
    e ? e.stopPropagation() : null;
    this.setState({ show: false });
  };

  handleClickCapture = e => {
    if (e.target.type === "button") {
      return this.handleHide;
    } else {
      return e.stopPropagation();
    }
  };

  render() {
    const { show } = this.state;
    const {
      Action,
      Disabled,
      Icon,
      hasPermission,
      Size,
      Class,
      Title
    } = this.props;
    return hasPermission
      ? [
          <Button
            disabled={Disabled}
            onClick={e => {
              e.stopPropagation();
              Action;
              this.setState({ show: true });
            }}
            bsSize={Size}
            className={Class}
          >
            {Icon}
          </Button>,
          <Modal
            bsSize="small"
            onClickCapture={this.handleClickCapture}
            backdrop="static"
            //keyboard={false}
            show={show}
            onHide={this.handleHide}
            dialogClassName="confirmModal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-lg">DELETE</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col xs={12}>
                  <h4 className="Center">
                    Are you sure you want to delete "{Title}"?
                  </h4>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Row>
                <Col md={12} className="Center">
                  <ButtonGroup>
                    <Button onClick={Action} className="ConfirmActionButton">
                      Yes
                    </Button>
                    <Button onClick={this.handleHide}>No</Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </Modal.Footer>
          </Modal>
        ]
      : null;
  }
}
export default ConfirmAction;
