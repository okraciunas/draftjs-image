import React from 'react';
import { AtomicBlockUtils, Editor, EditorState, RichUtils } from 'draft-js';
import MediaImage from './MediaImage';
import './MediaEditor.css';

// https://scontent.fcgh7-1.fna.fbcdn.net/v/t1.0-9/19756500_324499201338723_4479190741032872974_n.png?oh=fbfcaa3be4d7f836550a007eaf36a424&oe=59CBBA57

export default class MediaEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      url: '',
      urlType: '',
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});
    this.onURLChange = (event) => this.setState({urlValue: event.target.value});

    this.getURL = this._getURL.bind(this);
    this.addImage = this._addImage.bind(this);
    this.addURL = this._addURL.bind(this);
    this.addDesktop = this._addDesktop.bind(this);
    this.confirmMedia = this._confirmMedia.bind(this);
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
    this.blockRenderer = this._blockRenderer.bind(this);
  }

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _confirmMedia(event) {
    event.preventDefault();

    const {editorState, urlValue, urlType} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      urlType,
      'IMMUTABLE',
      {src: urlValue}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
      urlValue: '',
    });
  }

  _onURLInputKeyDown(event) {
    if (event.which === 13) {
      this._confirmMedia(event);
    }
  }

  _promptForMedia(type) {
    this.setState({
      urlValue: '',
      urlType: type,
    });
  }

  _addImage() {
    this._promptForMedia('image');
  }

  _addURL(){
    this.addImage();
  }

  _addDesktop(){
    this.input.value = null;
    this.input.click();
  }

  _getURL(event){
    event.preventDefault();
    /*console.log(event.target.value);
    const file = event.target.files[0];

    if(file.type.indexOf('image') > -1) {
      const src = URL.createObjectURL(file);
      this.setState({urlValue: event.target.value});
      this._confirmMedia(event);
    }*/
  }

  _blockRenderer(block) {
    if (block.getType() === 'atomic') {
      return {
        component: MediaImage,
        editable: false,
      };
    }

    return null;
  }

  render() {
    return (
      <div className="root">
        <div className="url-input-container">
          <input
            className="url-input"
            onChange={this.onURLChange}
            ref="url"
            type="text"
            onKeyDown={this.onURLInputKeyDown}
            />
          <button onMouseDown={this.confirmMedia}>
            Confirm
          </button>
        </div>
        <div className="desktop-input-container">
          <button onMouseDown={this.addDesktop}>
            DESKTOP Image
            <input
              type="file"
              ref={element => this.input = element}
              onChange={this.getURL}
            />
          </button>
        </div>
        <div
          className="editor"
          onClick={this.focus}
        >
          <Editor
            blockRendererFn={this.blockRenderer}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref="editor"
            />
        </div>
      </div>
    );
  }
}