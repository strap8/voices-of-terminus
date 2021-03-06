import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  Row,
  Col,
  PageHeader,
  FormGroup,
  InputGroup,
  FormControl,
  Button,
  ButtonToolbar,
  Checkbox,
  Radio,
  Image,
  Tabs,
  Tab
} from "react-bootstrap";
import Select from "react-select";
import { removeAttributeDuplicates } from "../../../helpers";
import { selectStyles } from "../../../helpers/styles";
import { formOptions } from "../../../helpers/options";
import { UserHasPermissions } from "../../../helpers/userPermissions";
import { connect as reduxConnect } from "react-redux";
import "./styles.css";
import {
  GetForm,
  GetFormQuestions,
  GetFormRecipients,
  GetForms,
  PostResponse,
  clearResponses,
  EditResponse,
  DeleteForm,
  clearFormApi
} from "../../../actions/Forms";
import Moment from "react-moment";
import { withAlert } from "react-alert";
import { Redirect } from "react-router-dom";
import PendingAction from "../../../components/PendingAction";
import ConfirmAction from "../../../components/ConfirmAction";

const mapStateToProps = ({ User, Forms }) => ({
  User,
  Forms
});

const mapDispatchToProps = {
  GetForm,
  GetFormQuestions,
  GetFormRecipients,
  GetForms,
  PostResponse,
  clearResponses,
  EditResponse,
  DeleteForm,
  clearFormApi
};

class FormSystem extends Component {
  constructor(props) {
    super(props);

    this.state = { typeFilter: [] };
  }

  static propTypes = {};

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentDidMount() {
    const {
      User,
      GetForm,
      GetFormQuestions,
      GetFormRecipients,
      GetForms,
      clearFormApi,
      match
    } = this.props;
    const { token } = User;
    const pollId = match.params.id;
    clearFormApi();
    if (pollId) {
      GetForm(token, pollId);
      GetFormQuestions(token, pollId);
      GetFormRecipients(token, pollId);
    } else {
      GetForms(token);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    const { User, Forms, match, history } = props;
    const pollId = match.params.id;
    const { Form, Questions, Choices, Responses, Recipients } = Forms;
    const { pathname } = history.location;
    const { expiration_date } = Form;
    const expired = new Date(expiration_date) - new Date() < 0 ? true : false;
    this.setState({
      User,
      Forms,
      Form,
      Questions,
      Choices,
      Responses,
      Recipients,
      pollId,
      eventKey: pathname,
      history,
      expired
    });
  };

  componentWillUpdate(nextProps, nextState) {
    const { User, GetFormQuestions } = nextProps;
    const currentPollId = this.state.pollId;
    const nextPollId = nextState.pollId;
    const { token } = User;

    if (currentPollId != nextPollId) {
      GetForm(token, nextPollId);
      GetFormQuestions(token, nextPollId);
      GetFormRecipients(token, nextPollId);
    }
  }

  componentWillUnmount() {
    const { clearFormApi, clearResponses } = this.props;
    clearFormApi();
    clearResponses();
  }

  filterForms = (typeFilter, form_type) =>
    typeFilter.length > 0 ? typeFilter.some(e => e.value == form_type) : true;

  renderPolls = (Forms, typeFilter) => {
    const { User, DeleteForm } = this.props;
    const { history } = this.state;
    return Forms.filter(f => this.filterForms(typeFilter, f.form_type)).map(
      p => {
        const {
          id,
          title,
          author,
          author_username,
          date_created,
          last_modified,
          expiration_date
        } = p;
        return (
          <Row
            className="borderedRow"
            key={id}
            onClick={() => history.push(`/forms/${id}`)}
          >
            <Col xs={8}>
              <h3>
                <i className="fas fa-heading" /> {title}
              </h3>
            </Col>
            <Col
              xs={4}
              className="ActionToolbar cardActions"
              componentClass={ButtonToolbar}
            >
              <ConfirmAction
                Action={() => DeleteForm(User.token, id)}
                Disabled={false}
                Icon={<i className="fas fa-trash" />}
                hasPermission={UserHasPermissions(User, "delete_form", author)}
                Class="pull-right"
                Title={title}
              />
              {UserHasPermissions(User, "change_form", author) && (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    history.push(`/form/edit/${id}`);
                  }}
                  className="pull-right"
                >
                  <i className="fa fa-pencil-alt" />
                </Button>
              )}
            </Col>
            <Col xs={12}>
              <h4>
                <i className="fas fa-user" /> {author_username}
              </h4>
            </Col>
            <Col xs={12}>
              <h4>
                <i className="far fa-clock" />{" "}
                <Moment fromNow>{date_created}</Moment>
              </h4>
            </Col>
            <Col xs={12}>
              <h4>
                <i className="fa fa-pencil-alt" />{" "}
                <Moment fromNow>{last_modified}</Moment>
              </h4>
            </Col>
            <Col xs={12}>
              <h4>
                <i className="fas fa-lock" />{" "}
                <Moment fromNow>{expiration_date}</Moment>
              </h4>
            </Col>
          </Row>
        );
      }
    );
  };

  renderQuestions = (User, Questions, Choices, Responses, canView) => {
    const { eventKey, pollId, history, expired } = this.state;

    return User.is_superuser || canView ? (
      <Tabs
        defaultActiveKey={eventKey}
        activeKey={eventKey}
        className="Tabs"
        onSelect={eventKey => {
          this.setState({ eventKey });
          history.push(eventKey);
        }}
      >
        <Tab
          eventKey={`/forms/${pollId}/questions`}
          title={"Questions"}
          unmountOnExit={true}
        >
          {Questions.map((q, i) => {
            const { question, question_type, image } = q;
            return [
              <Row style={{ marginTop: 8 }} key={i}>
                <Col xs={12}>
                  <h4>
                    <i className="far fa-question-circle" /> {question}
                  </h4>
                </Col>
                {image && (
                  <Col xs={12}>
                    <Image src={image} height={250} />
                  </Col>
                )}
              </Row>,
              Choices[i] &&
                Choices[i].map(c => {
                  const { id, title, question_id } = c;
                  const usersResponses = Responses.results
                    .flat(2)
                    .filter(
                      r =>
                        r.author == User.id &&
                        Choices[i].some(c => c.id == r.choice_id)
                    );

                  const responseIndex = usersResponses.findIndex(
                    response => response.choice_id == id
                  );
                  const usersResponse =
                    responseIndex != -1 ? usersResponses[responseIndex] : {};
                  const { response } = usersResponse;
                  const checked = response == "true";

                  return (
                    <Row
                      className={checked ? "highlightedRow" : "borderedRow"}
                      key={i}
                    >
                      <Col xs={12}>
                        <FormGroup key={i}>
                          {this.switchQuestionChoices(
                            question_id,
                            question_type,
                            id,
                            title,
                            User,
                            Responses,
                            expired,
                            checked,
                            usersResponse.id,
                            response,
                            usersResponses
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                  );
                })
            ];
          })}
        </Tab>
        <Tab
          eventKey={`/forms/${pollId}/results`}
          title={"Results"}
          unmountOnExit={true}
        >
          {Questions.map((q, i) => {
            const { question, question_type } = q;
            return [
              <h4>
                <i className="far fa-question-circle" /> {question}
              </h4>,
              Choices[i] &&
                Choices[i].map(c => {
                  const { id, title, question_id } = c;
                  return (
                    <Row className="borderedRow noHover">
                      <Col xs={12}>
                        <FormGroup key={i}>
                          {this.switchQuestionChoicesResponses(
                            question_id,
                            question_type,
                            id,
                            title,
                            Responses
                          )}
                        </FormGroup>
                      </Col>
                    </Row>
                  );
                })
            ];
          })}
        </Tab>
      </Tabs>
    ) : (
      <h1>You don't have permission to view this form.</h1>
    );
  };

  switchQuestionChoices = (
    question_id,
    question_type,
    choice_id,
    title,
    User,
    Responses,
    expired,
    checked,
    responseId,
    response,
    usersResponses
  ) => {
    const { PostResponse, EditResponse } = this.props;
    var payload = {
      author: User.id,
      response: !checked,
      question_id,
      choice_id
    };
    switch (question_type) {
      case "Multiple":
        return (
          <Checkbox
            disabled={expired}
            key={choice_id}
            checked={checked}
            onClick={() =>
              !response
                ? PostResponse(User.token, payload, question_type)
                : EditResponse(User.token, responseId, payload, question_type)
            }
          >
            <span className="checkBoxText">{title}</span>
          </Checkbox>
        );
      case "Select":
        return (
          <Radio
            disabled={
              (!checked && usersResponses.some(e => e.response == "true")) ||
              expired
            }
            name="radioGroup"
            key={choice_id}
            checked={checked}
            onClick={() =>
              !response
                ? PostResponse(User.token, payload)
                : EditResponse(User.token, responseId, payload)
            }
          >
            <span className="checkBoxText">{title}</span>
          </Radio>
        );
      case "Text":
        const {
          loading,
          loaded,
          posting,
          posted,
          updating,
          updated,
          error
        } = Responses;

        const stateResponse = this.state.response;
        payload.response = stateResponse;
        return (
          <InputGroup>
            <FormControl
              disabled={expired}
              value={
                stateResponse || stateResponse == "" ? stateResponse : response
              }
              componentClass="textarea"
              name="response"
              wrap="hard"
              type="textarea"
              placeholder="Response..."
              onChange={e => this.onChange(e)}
            />
            <InputGroup.Addon>
              <PendingAction
                Disabled={expired}
                Click={() =>
                  !response
                    ? PostResponse(User.token, payload)
                    : EditResponse(User.token, responseId, payload)
                }
                ActionPending={posting}
                ActionComplete={posted}
                ActionError={error}
                ActionName={"POST"}
              />
            </InputGroup.Addon>
          </InputGroup>
        );
      case "Image":
        return [
          <Image src={response} className="ProfileImages" responsive rounded />,
          <FormControl
            disabled={expired}
            style={{ margin: "auto" }}
            type="file"
            label="File"
            onChange={e =>
              this.setImage(
                e,
                User.token,
                responseId,
                payload,
                response,
                PostResponse,
                EditResponse
              )
            }
          />
        ];
      default:
        return null;
    }
  };

  showStats = (userMultipleBoolResponses, uniqueUserResponses) => (
    <div className="responseStats">
      <span className="responseStatsPercentage">
        {this.responsePercentage(
          userMultipleBoolResponses,
          uniqueUserResponses.length
        )}
        %
      </span>
      <span>
        {`${userMultipleBoolResponses} / ${
          uniqueUserResponses.length
        } responses`}
      </span>
    </div>
  );

  responsePercentage = (numerator, denominator) =>
    !numerator || !denominator
      ? 0
      : new Number((parseInt(numerator) / parseInt(denominator)) * 100).toFixed(
          2
        );

  switchQuestionChoicesResponses = (
    question_id,
    question_type,
    choice_id,
    title,
    Responses
  ) => {
    const allUserQuestionResponses = Responses.results
      .flat(2)
      .filter(r => r.question_id == question_id);

    const uniqueUserResponses = removeAttributeDuplicates(
      allUserQuestionResponses,
      "author"
    );

    const userChoiceResponses = allUserQuestionResponses.filter(
      r => r.choice_id == choice_id
    );

    const userMultipleBoolResponses = userChoiceResponses.reduce(
      (total, r) => (r.response == "true" ? total + 1 : total),
      0
    );

    const userStringResponses = userChoiceResponses.reduce(
      (total, r) =>
        r.response && r.response != "true" && r.response != "false"
          ? total + 1
          : total,
      0
    );
    switch (question_type) {
      case "Multiple":
        return (
          <Checkbox disabled={true} key={choice_id}>
            <span className="checkBoxText">{title}</span>
            {this.showStats(userMultipleBoolResponses, uniqueUserResponses)}
          </Checkbox>
        );
      case "Select":
        return (
          <Radio disabled={true} name="radioGroup" key={choice_id}>
            <span className="checkBoxText">{title}</span>
            {this.showStats(userMultipleBoolResponses, uniqueUserResponses)}
          </Radio>
        );
      case "Text":
        return (
          <InputGroup>
            <FormControl
              disabled={true}
              value={null}
              componentClass="textarea"
              name="response"
              wrap="hard"
              type="textarea"
              placeholder="Response..."
            />
            {this.showStats(userStringResponses, uniqueUserResponses)}
          </InputGroup>
        );
      case "Image":
        return [
          <Image
            src="https://www.bbsocal.com/wp-content/uploads/2018/05/image-placeholder.png"
            className="ProfileImages"
            responsive
            rounded
          />,
          <FormControl
            disabled={true}
            style={{ margin: "auto" }}
            type="file"
            label="File"
          />,
          this.showStats(userStringResponses, uniqueUserResponses)
        ];
      default:
        return null;
    }
  };

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  setImage = (e, token, id, payload, response, PostResponse, EditResponse) => {
    const { alert } = this.props;
    var file = e.target.files[0];
    if (file.size > 3145728) {
      alert.error(<div>Please use an image less then 3MB</div>);
    } else {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        payload.response = reader.result;
        !response
          ? PostResponse(token, payload)
          : EditResponse(token, id, payload);
      };
    }
  };

  onSelectChange = (typeFilter, { action, removedValue }) => {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        typeFilter = formOptions.filter(v => v.isFixed);
        break;
    }
    this.setState({ typeFilter });
  };

  render() {
    const {
      User,
      Forms,
      Form,
      Questions,
      Choices,
      Responses,
      Recipients,
      pollId,
      eventKey,
      history,
      typeFilter
    } = this.state;
    const {
      author,
      author_username,
      date_created,
      expiration_date,
      id,
      last_modified,
      title
    } = Form;
    const expired = new Date(expiration_date) - new Date() < 0;
    const isAuthor = author == User.id;
    const isRecipient = Recipients.some(e => User.id == e.recipient);
    const isPublic = Recipients.length == 0;

    const canView = isAuthor || isRecipient || isPublic;
    return pollId &&
      !(
        eventKey.includes("questions") ||
        eventKey.includes("results") ||
        eventKey.includes("edit")
      ) ? (
      <Redirect to={`/forms/${pollId}/questions`} />
    ) : (
      <Grid className="FormSystem Container">
        <Row>
          <PageHeader className="pageHeader">FORMS</PageHeader>
        </Row>
        <Row>
          <h1 className="Center">{title}</h1>
        </Row>
        {pollId && expiration_date && (
          <Row className="Center">
            <span className="help Center">
              {isPublic ? "(Public)" : "(Private)"}
            </span>
            <h3>
              {expired
                ? ["Expired ", <Moment fromNow>{expiration_date}</Moment>]
                : ["Expires ", <Moment fromNow>{expiration_date}</Moment>]}
            </h3>
          </Row>
        )}
        <Row className="ActionToolbarRow">
          <Col
            md={4}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            {UserHasPermissions(User, "add_form") && (
              <Button onClick={() => history.push("/form/new/")}>
                <i className="fas fa-plus" /> Form
              </Button>
            )}
            {pollId && UserHasPermissions(User, "change_form") && (
              <Button onClick={() => history.push(`/form/edit/${pollId}`)}>
                <i className="fa fa-pencil-alt" /> Form
              </Button>
            )}
          </Col>
          {!pollId && (
            <Col md={8} xs={12}>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-tags" />
                </InputGroup.Addon>
                <Select
                  //https://react-select.com/props
                  value={typeFilter}
                  isMulti
                  styles={selectStyles()}
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  //isClearable={this.state.typeFilter.some(v => !v.isFixed)}
                  isSearchable={false}
                  placeholder="Filter by form type..."
                  classNamePrefix="select"
                  onChange={this.onSelectChange}
                  options={formOptions}
                />
              </InputGroup>
            </Col>
          )}
        </Row>
        {pollId
          ? this.renderQuestions(User, Questions, Choices, Responses, canView)
          : this.renderPolls(Forms.results, typeFilter)}
      </Grid>
    );
  }
}
export default withAlert(
  reduxConnect(mapStateToProps, mapDispatchToProps)(FormSystem)
);
