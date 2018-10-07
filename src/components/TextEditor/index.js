import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import {Grid, Row, Col, FormGroup, FormControl, ButtonToolbar, Button} from 'react-bootstrap'
import './styles.css'
import './stylesM.css'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import {setEditorState} from '../../actions/TextEditor'
import {createDocument} from '../../actions/Articles'
import {Map} from 'immutable'
import {Redirect} from 'react-router-dom'

const mapStateToProps = ({User, editorState}) => ({
  User,
  editorState
})

const mapDispatchToProps = {
  setEditorState
}

class TextEditor extends Component {
  constructor(props) {
    super(props)
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
    this.postArticle = this.postArticle.bind(this)

    this.state = {
      author: null,
      body: '',
      date_created: '',
      date_modified: '',
      id: null,
      last_modified: null,
      last_modified_by: null,
      slug: null,
      tags: '',
      title: '',

      editorState: EditorState.createEmpty(),
      show: false
    }
  }

  static propTypes = {
    editorState: new Map()
  }

  static defaultProps = {
  }
  
  
  componentWillMount() {
    this.getState(this.props)
  }

  shouldComponentUpdate(nextProps) {
    return true
  }

  componentWillUpdate() {
  }

  /* render() */

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {User} = props
    // Set the editorState from Redux if it exists else set an initial value
    const editorState = props.editorState.hasOwnProperty('_immutable') && props.editorState._immutable.hasOwnProperty('_map') ? props.editorState : EditorState.createEmpty()
    this.setState({User, editorState})
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }

  onEditorStateChange = editorState => {
    this.props.setEditorState(editorState)
  }

  onChange = event => {
    event.target.name === 'title' ? this.setState({title: event.target.value})
    : event.target.name === 'tags' ? this.setState({tags: event.target.value}) : null
  }

  postArticle = () => {
    const {editorState, title, tags, User} = this.state
    const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    createDocument({title, slug: 'Doc', author: User.id, html, tags, last_modified_by: User.id})
    this.setState({editorState: EditorState.createEmpty(), title: '', tags: '', slug: ''})
   }

  render() {
    const {User, editorState, title, tags, slug } = this.state
    return (
      !User.token ? <Redirect to="/login"/>
      :<Grid className="TextEditor Container">
        <Row>
          <Col sm={12}>
            <form>
              <FormGroup className="editorForm">
                <FormControl value={title} type="text" placeholder="Title" name="title" onChange={this.onChange.bind(this)}/>
              </FormGroup>
              <FormGroup className="editorForm">
                <FormControl value={tags} type="text" placeholder="Tags" name="tags" onChange={this.onChange.bind(this)}/>
              </FormGroup>
            </form>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <Editor
              wrapperClassName="Wrapper"
              editorClassName="Editor"
              toolbarClassName="Toolbar"
              editorState={editorState}
              onEditorStateChange={this.onEditorStateChange}
                />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <textarea
              className="TextEditorOutput"
              disabled
              value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <ButtonToolbar>
              <Button type="submit" onClick={this.postArticle} className="newArticleButton">
                Post
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
      </Grid>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(TextEditor)