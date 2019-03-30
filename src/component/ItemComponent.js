import React from 'react'
import {Q} from "../js/quantum";
import {Row, Col} from 'react-flexbox-grid';
import chemPng from '../img/chem.png'
import formulaPng from '../img/formula.png'
import underlinePng from '../img/underline.png'
import bracketsPng from '../img/brackets.png'
import {connect} from 'react-redux'
import {setFormula} from '../store/actions'

class ItemComponent extends React.Component {
    state= {
        startPos: '',
        endPos: '',
        selectedText: '',
        selectedLatex: ''
    }
    onDrop(evt) {
        if (evt.dataTransfer.files.length === 0) {
            return;
        }
        this.setState({dragging: false});
        evt.preventDefault();
        const file = evt.dataTransfer.files[0];
        if (['.png', '.jpg', '.jpeg', '.gif'].every(ext => !file.name.endsWith(ext.toLowerCase()))) {
            Q.alert("无效的图片文件");
            return;
        }

        const form = new FormData();
        form.append('file', file);
        Q.post('/api/upload', {data: form, processData: false, contentType: false})
            .then((data) => {
                this.insertImage(data.filename);
            })
            .catch(() => Q.alert('上传失败'))
        ;
    }

    onPaste(evt) {
        // 尽量不自己处理
        if (!evt.clipboardData.getData('text/html')) {
            return;
        }
        let ok = true;
        const $html = $('<div>' + evt.clipboardData.getData('text/html') + '</div>');
        if ($html.find('img').length === 0) {
            return;
        }
        $html.find('img').replaceWith(function () {
            const url = $(this).attr('src');
            if (!/sealdata\.youneng\.com\/img\//.test(url)) {
                ok = false;
                return '';
            }
            const basename = url.substring(url.lastIndexOf('/') + 1);
            return `[[img]]{"src":"${basename}"}[[/img]]`;
        });
        if (!ok) {
            return;
        }

        evt.preventDefault();
        const text = $html[0].innerText;
        const [start, end] = [this._textarea.selectionStart, this._textarea.selectionEnd];
        const out = `${this._textarea.value.slice(0, start)}${text}${this._textarea.value.slice(end)}`;
        this._textarea.value = out;
        this.cleanFormula()
        this.props.onChange({target: this._textarea});
    }

    insertImage(filename) {
        const md = `[[img]]{"src":"${filename}"}[[/img]]`;
        const pos = this._textarea.selectionStart;
        const out = `${this._textarea.value.slice(0, pos)}${md}${this._textarea.value.slice(pos)}`;
        this._textarea.value = out;
        this.cleanFormula()
        this.props.onChange({target: this._textarea});
    }

    openEditor(type) {
        this.state.selectedLatex = this.filterLatexText(this.state.selectedText);
        this.props.setFormula({
            formula: {
                toolbar: type,
                latex: this.state.selectedLatex,
                type: 'editor'
            },
            editor: this
        })
    }
    cleanFormula() {
        this.state.startPos = '';
        this.state.endPos = '';
        this.state.selectedText = ''
        this.state.selectedLatex = ''
    }
    filterLatexText = (text)=> {
        if (!text) return '';
        let result = text.match(/^[\\\(|\\\[|\$]\$?([^\$]+)\$?[\\\)|\\\]|\$]$/)
        if (result) {
            return result[1]
        } else return ''
    }
    updateLatex = (latex) => {
        if (this.state.selectedLatex) {
            this._textarea.value = this.props.value.replace(this.state.selectedLatex, latex);
        } else {
            this._textarea.value = this.props.value + '$' + latex + '$';
        }
        this.props.onChange({
            target: {
                name: this.props.name,
                value: this._textarea.value
            }
        })
        this.cleanFormula();
    }
    selectText = (e) => {
        this.state.startPos = e.target.selectionStart;
        this.state.endPos = e.target.selectionEnd;
        this.state.selectedText = e.target.value.substring(this.state.startPos, this.state.endPos)

    }
    onChange = (e) => {
        this.state.startPos = '';
        this.state.endPos = '';
        this.state.selectedText = ''
        this.props.onChange(e)
    }
    insertCustom = (e)=> {
        e.stopPropagation()
        this.cleanFormula()
        this._textarea.value = this.props.value + '[[nn]]';
        this.props.onChange({
            target: {
                name: this.props.name,
                value: this._textarea.value
            }
        })
    }
    render() {
        return (
            <div className="panel panel-default item-input-wrapper" data-name={this.props.name}>
                <div className="panel-heading">
                    <Row>
                        <Col>
                            <h3 className="panel-title">{this.props.title}</h3>
                        </Col>
                        <Col>
                            {
                                Global.config.subject == 'chemistry' ? <a className="formula-icon" title="化学公式" onClick={e => {
                                    e.stopPropagation();
                                    this.openEditor('chemistry')
                                }}>
                                    <img src={chemPng} alt="化学公式"/>
                                </a> :  <a className="formula-icon" title="数学公式" onClick={e => {
                                    e.stopPropagation();
                                    this.openEditor('general')
                                }}>
                                    <img src={formulaPng} alt="数学公式"/>
                                </a>

                            }


                            <a className="formula-icon" title="下划线" onClick={this.insertCustom}>
                                <img src={underlinePng} alt="下划线"/>
                            </a>
                            <a className="formula-icon" title="括号" onClick={this.insertCustom}>
                                <img src={bracketsPng} alt="括号"/>
                            </a>
                        </Col>
                    </Row>

                </div>
                <div className="panel-body">
                    <textarea
                        ref={(ref) => {
                            this._textarea = ref;
                        }}
                        name={this.props.name}
                        className="form-control" rows={this.props.rows}
                        value={this.props.value}
                        onChange={this.onChange}
                        onDrop={this.onDrop.bind(this)}
                        onBlur={this.props.onBlur || undefined}
                        onPaste={this.onPaste.bind(this)}
                        onSelect={this.selectText}
                    />
                </div>
            </div>
        );
    }
}

export default connect(null, function (dispatch) {
    return {
        setFormula: (data) => {
            dispatch(setFormula(data))
        }
    }
})(ItemComponent)