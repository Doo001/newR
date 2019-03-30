import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { updateEditor } from '../store/actions'
import '../css/formulaKit.scss'
function mapStateToProps(state) {
  return {
    formula: state.formula
  }
}
function mapDispatchToProps(dispatch) {
  return {
    updateEditor: (latex, type) => {
      dispatch(updateEditor(latex, type))
    }
  }
}
class FormulaKit extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    loaded : false
  }
  componentDidMount() {

  }
  lazyLoad() {
    this.editor = com.wiris.jsEditor.JsEditor.newInstance({/*'language': 'zh',*/ 'toolbar': this.props.formula.toolbar});
    this.editor.insertInto(this.elem)
    if (this.props.formula.latex) {
      this.latex2Ml(this.props.formula.latex)
    }
    this.state.loaded = true;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.formula.type != nextProps.type) return ;
    if (!this.container.classList.contains('show')) {
      if (!this.state.loaded) {
        this.lazyLoad()
      }
      this.container.classList.add('show')
    }

    if (this.props.formula.toolbar != nextProps.toolbar) {
      this.editor.setParams({toolbar: nextProps.formula.toolbar})
    }
    if (this.props.formula.latex != nextProps.formula.latex) {
      this.latex2Ml(nextProps.formula.latex)
    }

  }
  latex2Ml(latex) {
    fetch('https://www.wiris.net/demo/editor/latex2mathml?httpstatus=true', {
      method: "POST",

      body: `latex=${encodeURIComponent(latex)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      }}).then(response => response.text()).then(mml => {
        this.editor.setMathML(mml)
      }
    )
  }

  insertEditor = (e) => {
    //this.props.insertEditor(this.editor.getMathML())

    fetch('https://www.wiris.net/demo/editor/mathml2latex?httpstatus=true',{
      method: "POST",

      body: `mml=${encodeURIComponent(this.editor.getMathML())}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      }}).then(response => response.text()).then(latex => {
        this.props.updateEditor(latex, this.props.type)
      }
    )
  }
  close =(e) => {
    e.stopPropagation();
    this.container.classList.remove('show')
  }
  render() {

    return (
      <div className="formula-editorWrap" ref={ref=> this.container = ref}>
        <header className="clearfix">
          <a className="formula-close" onClick={this.close}><span className="glyphicon glyphicon-remove"></span></a>
        </header>


        <div className="formula-editor" ref={ref=>this.elem = ref}>
        </div>
        <div>
          <button className="btn" onClick={this.insertEditor}>插入</button>
        </div>
      </div>
    )
  }
}

FormulaKit.PropTypes = {
  formula: PropTypes.object.required,
  updateEditor: PropTypes.func.required
}
export default connect(mapStateToProps, mapDispatchToProps)(FormulaKit)
