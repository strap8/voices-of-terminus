import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import { Link } from "react-router-dom";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class ScrollTextBox extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      URL: "",
      Title: ""
    };
  }

  static propTypes = {
    URL: PropTypes.string,
    Title: PropTypes.string
  };

  static defaultProps = {
    URL: "",
    Title: ""
  };

  componentWillMount() {
    this.getState(this.props);
  }
  componentWillUpdate() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { URL, Title } = props;
    this.setState({ URL, Title });
  };

  componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    const { URL, Title } = this.state;
    return (
      <Link to={URL} className="ScrollTextBox">
        <p>{Title}</p>
      </Link>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(ScrollTextBox);
