import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect as reduxConnect } from "react-redux";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  InputGroup,
  FormControl,
  ButtonToolbar,
  Button
} from "react-bootstrap";
import "./styles.css";
import "./stylesM.css";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { setEditorState } from "../../actions/TextEditor";
import { clearHtmlDocument } from "../../actions/App";
import {
  getArticle,
  postArticle,
  updateArticle,
  clearArticlesApi
} from "../../actions/Articles";
import { getUsers } from "../../actions/Admin";
import { Redirect } from "react-router-dom";
import CreatableSelect from "react-select/lib/Creatable";
import { selectStyles } from "../../helpers/styles";
import { articleSlectOptions } from "../../helpers/options";
import { UserHasPermissions } from "../../helpers/userPermissions";
import {
  removeAttributeDuplicates,
  RemoveArrayDuplicates,
  joinStrings,
  splitString,
  isEquivalent
} from "../../helpers";
import { options } from "./options";
import PendingAction from "../PendingAction";

const mapStateToProps = ({
  Articles,
  editorState,
  HtmlDocument,
  User,
  Admin
}) => ({
  Articles,
  editorState,
  HtmlDocument,
  User,
  Admin
});

const mapDispatchToProps = {
  getArticle,
  postArticle,
  setEditorState,
  updateArticle,
  clearHtmlDocument,
  getUsers,
  clearArticlesApi
};

class TextEditor extends Component {
  constructor(props) {
    super(props);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);

    this.state = {
      author: null,
      body: "",
      date_created: "",
      date_modified: "",
      id: null,
      last_modified: null,
      last_modified_by: null,
      slug: null,
      tags: [articleSlectOptions[0]],
      title: "",
      suggestions: [],

      editorState: null,
      show: false
    };
  }

  static propTypes = {
    editorState: PropTypes.func.isRequired,
    getArticle: PropTypes.func.isRequired,
    postArticle: PropTypes.func.isRequired,
    setEditorState: PropTypes.func.isRequired,
    updateArticle: PropTypes.func.isRequired,
    clearHtmlDocument: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    clearArticlesApi: PropTypes.func.isRequired
  };

  static defaultProps = { editorState: EditorState.createEmpty() };

  componentWillMount() {
    this.getState(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { editorState, title, User, tags } = nextState;
    const currentEditorState = this.state.editorState;
    const currentTitle = this.state.title;
    const currentUser = this.state.User;
    const currentSelectValue = this.state.tags;

    const editorChanged = !isEquivalent(currentEditorState, editorState);
    const titleChanged = currentTitle != title;
    const userChanged = !isEquivalent(currentUser, User);
    const isFiltering = tags != currentSelectValue;

    return editorChanged || titleChanged || userChanged || isFiltering;
  }

  componentDidMount() {
    const { match, getArticle, getUsers, clearArticlesApi } = this.props;
    const { id } = match.params;
    if (id) getArticle(id);
    clearArticlesApi();
    getUsers();
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    let { Articles, editorState, Admin } = props;
    const { Users } = Admin;
    const suggestions = Users.map(
      user =>
        (user = {
          text: user.username,
          value: user.username,
          url: `/profile/${user.id}`
        })
    );
    const { User, HtmlDocument, match } = props;
    const Leader = User.is_leader || User.is_council;
    const { author, title } = HtmlDocument;
    let { tags } = this.state;
    if (HtmlDocument.tags)
      tags = HtmlDocument.tags
        .split("|")
        .map(i => (i = { value: i, label: i, isFixed: i == "Article" }));

    const { id } = match ? match.params : null;
    const { path } = match ? match : null;
    const currentTags = Articles.results.map(e => splitString(e.tags)).flat(1);
    const TagOptions = removeAttributeDuplicates(
      [...articleSlectOptions, ...currentTags],
      "value"
    );

    // If HTML Document has been loaded from Redux and editing a Article
    if (HtmlDocument.html && path.includes("edit")) {
      const { html } = HtmlDocument;
      editorState = this.htmlToEditorState(html);
    }

    // Set the editorState from Redux if it exists else create an empty state
    else if (editorState) {
      editorState = this.htmlToEditorState(editorState);
    }

    this.setState({
      Articles,
      User,
      HtmlDocument,
      id,
      author,
      tags,
      title,
      editorState,
      tags: this.orderOptions(tags),
      suggestions,
      TagOptions
    });
  };

  htmlToEditorState = html => {
    const blocksFromHtml = htmlToDraft(html);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    return EditorState.createWithContent(contentState);
  };

  componentWillUnmount() {
    const { setEditorState, clearHtmlDocument, clearArticlesApi } = this.props;
    const { editorState } = this.state;
    clearArticlesApi();
    // setEditorState(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    clearHtmlDocument();
  }

  onEditorStateChange = editorState => {
    this.setState({ editorState });
  };

  postArticle = () => {
    const { postArticle } = this.props;
    const { editorState, title, User, tags } = this.state;
    const EditorState = editorState ? editorState.getCurrentContent() : null;
    const html = draftToHtml(convertToRaw(EditorState));
    const mentions = this.getMentions(EditorState);
    const payload = {
      title,
      slug: "doc",
      author: User.id,
      html,
      tags: joinStrings(tags),
      last_modified_by: User.id
    };
    postArticle(User.token, mentions, payload);
  };

  updateArticle = id => {
    const { updateArticle } = this.props;
    const { tags, title, editorState, User } = this.state;
    const EditorState = editorState ? editorState.getCurrentContent() : null;
    const html = draftToHtml(convertToRaw(EditorState));
    const mentions = this.getMentions(EditorState);
    const payload = {
      last_modified_by: User.id,
      html,
      tags: joinStrings(tags),
      title
    };
    updateArticle(id, User.token, mentions, payload);
  };

  getMentions = EditorState => {
    const mentions = [];
    if (!EditorState) return mentions;

    const entityMap = convertToRaw(EditorState).entityMap;

    Object.values(entityMap).forEach(entity => {
      if (entity.type === "MENTION") {
        mentions.push(entity.data);
      }
    });

    return RemoveArrayDuplicates(
      mentions.map(m => parseInt(m.url.split("/")[2]))
    );
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  orderOptions = values =>
    values.filter(v => v.isFixed).concat(values.filter(v => !v.isFixed));

  onSelectChange(tags, { action, removedValue }) {
    switch (action) {
      case "remove-value":
      case "pop-value":
        if (removedValue.isFixed) {
          return;
        }
        break;
      case "clear":
        tags = articleSlectOptions.filter(v => v.isFixed);
        break;
    }
    tags = this.orderOptions(tags);
    this.setState({ tags });
  }

  clearArticle = () =>
    this.setState({
      title: "",
      editorState: EditorState.createEmpty(),
      tags: [articleSlectOptions[0]]
    });

  render() {
    const { history } = this.props;
    const {
      User,
      id,
      author,
      title,
      editorState,
      HtmlDocument,
      tags,
      suggestions,
      Articles,
      TagOptions
    } = this.state;
    const { posting, posted, updating, updated, error } = Articles;
    const canPostOrUpdate = !(title && editorState && tags[0].value);
    return !UserHasPermissions(User, "add_article") ? (
      history.length > 2 ? (
        <Redirect to={history.goBack()} />
      ) : (
        <Redirect to="/login" />
      )
    ) : (
      <Grid className="TextEditor Container fadeIn">
        <Row className="ActionToolbarRow">
          <Col
            md={6}
            xs={6}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <PendingAction
              key={1}
              Disabled={canPostOrUpdate}
              Click={this.postArticle}
              ActionPending={posting}
              ActionComplete={posted}
              ActionError={error}
              ActionName={"POST"}
            />
            <PendingAction
              key={2}
              Disabled={!id || canPostOrUpdate}
              ShouldShow={id ? true : false}
              Click={() => this.updateArticle(id)}
              ActionPending={updating}
              ActionComplete={updated}
              ActionError={error}
              ActionName={"UPDATE"}
            />
          </Col>
          <Col
            md={6}
            xs={6}
            className="ActionToolbar cardActions"
            componentClass={ButtonToolbar}
          >
            <Button
              type="submit"
              onClick={() => this.clearArticle()}
              className="pull-right"
            >
              Clear
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-heading" />
                </InputGroup.Addon>
                <FormControl
                  value={title}
                  type="text"
                  placeholder="Title"
                  name="title"
                  autoFocus={true}
                  onChange={this.onChange.bind(this)}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <i className="fas fa-tag" />
                </InputGroup.Addon>
                <CreatableSelect
                  //https://react-select.com/props
                  value={tags}
                  isMulti
                  styles={selectStyles()}
                  onBlur={e => e.preventDefault()}
                  blurInputOnSelect={false}
                  isClearable={tags.some(v => !v.isFixed)}
                  placeholder="Add tags..."
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={this.onSelectChange}
                  options={TagOptions}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Editor
              wrapperClassName="Wrapper"
              editorClassName="Editor"
              toolbarClassName="Toolbar"
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
              onFocus={e => e.preventDefault()}
              // onBlur={(e, editorState) => {
              //   this.props.setEditorState(
              //     draftToHtml(convertToRaw(editorState.getCurrentContent()))
              //   );
              // }}
              onTab={e => e.preventDefault()}
              blurInputOnSelect={false}
              toolbar={options}
              mention={{
                separator: " ",
                trigger: "@",
                suggestions
              }}
              // toolbarOnFocus
              // stripPastedStyles="off"
              // spellCheck="off"
              // autoCapitalize="off"
              // autoComplete="off"
              // autoCorrect="off"
            />
          </Col>
        </Row>
        {/* <Row>
          <Col sm={12}>
            <textarea
            style={{height: '500px', width: '100%'}}
            disabled
            value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            />
          </Col>
        </Row> */}
      </Grid>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TextEditor);
