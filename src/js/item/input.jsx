import React from 'react';
import $ from 'jquery';
import { setNavBar, NavItem } from 'js/nav';
import { Q, Edu } from 'js/quantum';
import { KcodeEditor } from 'js/kcode/editor';
import { Movable } from 'js/widgets/movable';
import { HtmlWithTex } from 'js/widgets/html_with_tex';
import "css/main.scss";
import { EduSwitcher } from 'component/ItemParsing';

let gGoodToLeave = true;

export class VolumeInputPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parseResult: null,
        };
    }

    componentDidMount() {
        setCurrentNav('创建');

        $(window).on('beforeunload.volume-input-page', () => {
            if (!gGoodToLeave) {
                return "题目尚未保存，确认离开此页面？";
            } else {
                return undefined;
            }
        });
    }

    componentWillUnmount() {
        $(window).off('beforeunload.volume-in-page');
    }

    handleVolumeParsed(result) {
        this.setState({ parseResult: result });
    }

    handleVolumeSaved() {
        gGoodToLeave = true;
        this.setState({ parseResult: null });
    }

    render() {
        return (
            <div id="volume-input-page" className="flex-row">
                <VolumePreviewPane parseResult={this.state.parseResult} />
                <VolumeInputPane
                    from_doc={this.props.location.query.from_doc}
                    onVolumeSaved={this.handleVolumeSaved.bind(this)}
                    onVolumeParsed={this.handleVolumeParsed.bind(this)}
                />
            </div>
        );
    }
}


function setCurrentNav(current) {
//     const navItems = [
//         // new NavItem('录入', '/volume/input'),
//         // new NavItem('已录入', '/volumes'),
// //      new NavItem('上传Doc', '/doc/input'),
// //      new NavItem('已上传', '/docs'),
//         new NavItem('单题录入', '/item/parse'),
//     ];
    const navItems = [
        new NavItem('查询', '/item_search'),
        new NavItem('创建', '/item/parse'),
        new NavItem('标注', '/item/review?review=tag'),
        new NavItem('复标', '/item/review?review=tag&subreview=retag'),
        new NavItem('审核', '/item/review?review=typeset')];
    setNavBar(navItems, current);
}


function VolumePreviewPane({parseResult}) {
    if (!parseResult) {
        return (
            <div className="volume-preview-pane">
                请在右侧录入内容并预览获得结果，检查无误后保存。
            </div>
        );
    }
    // if (parseResult.error_code) {
    //     return (
    //         <div className="volume-preview-pane contextual-danger">
    //             {parseResult.error_msg}
    //         </div>
    //     );
    // }

    function renderHeader() {
        // const [total, bad] =
        //     [parseResult.length,
        //         parseResult.filter(item => item.error_code !== 0).length];
        const total = parseResult.length;
        return (
            <h4>
                共 {total} 题
            </h4>
        );
    }

    function renderBody() {
        return (
            <ol className="item-list">
                { parseResult.map((item, index) =>
                    <li key={index}>
                        <HtmlWithTex html={item} />
                    </li>
                //    <li key={index}>
                //        {
                //            item.error_code === 0 ? <HtmlWithTex html={item.html} /> :
                //            <div className='contextual-danger'>
                //                <p> {item.error_msg} </p>
                //                <p> 问题: {item.question} </p>
                //                <p> 答案: {item.answer} </p>
                //            </div>
                //        }
                //    </li>
                )}
            </ol>
        );
    }

    return (
        <div className="volume-preview-pane">
            { renderHeader() }
            { renderBody() }
        </div>
    );
}

class VolumeInputPane extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            edu: Edu.kJunior,
            busy: false,
        };
        this._editor = null;
    }

    componentDidMount() {
        this._editor._editor.edit.afterChange(() => { gGoodToLeave = false; });

        this.loadFromWord();
    }

    loadFromWord() {
        if (!this.props.from_doc) {
            return;
        }

        Q.get(`/api/doc/${this.props.from_doc}?text=1`)
         .done((word) => {
             this.setState({
                 title: word.title,
             });

             this._editor.setHtml(preprocess(word.text));
         })
         .fail(() => Q.alert("获取doc文件失败", 'warning'));
    }


    handleSave() {
        const title = this.state.title.trim();
        if (!title) {
            Q.alert("请输入标题，标题不能为空",'danger');
            return;
        }

        const json = {
            title,
            edu: this.state.edu,
            content: Q.htmlUnescape(this._editor.text()),
        };

        if (this.props.from_doc) {
            json.from_doc = this.props.from_doc;
        }

        this.setState({ busy: true });
        Q.put('/api/volume', { json })
         .done(() => {
             Q.alert("录入成功, 2秒后自动清空输入");
             setTimeout(() => {
                 this._editor.setHtml('');
                 this.props.onVolumeSaved();
             }, 2000);
         })
            .always(() => this.setState({ busy: false }))
        ;
    }

    handlePreview() {
        // 不在外部保存editor要显示的内容，而是让editor来处理。
        this._editor.setHtml(highlightInputTex(
            this._editor.html()
                .replace(/\n/g, '') // clear \n as it will bring some blanks back in editor
                .replace(/<\/?span.*?>/g, '')  // strip highlight cauz sometime tags got broken
        ));
        const content = Q.htmlUnescape(this._editor.text());
        let title = this.state.title.trim();
        if (!title) {
            title = this.extractTitle(content);
            if (title) {
                this.setState({ title });
            }
        }
        const json = {
            title,
            edu: this.state.edu,
            content,
        };
        if (this.props.from_doc) {
            json.from_doc = this.props.from_doc;
        }

        this.setState({ busy: true });
        Q.post('/api/volume/parse', { json })
            .done(this.props.onVolumeParsed)
            .always(() => this.setState({ busy: false }))
        ;
    }

    extractTitle(content) {
        const match = /^\s*\\tiganqu\b(.*)$/m.exec(content);
        if (!match) {
            return '';
        }
        return match[1]
            .replace(/\$/g, '')
            .replace(/\\\w+/g, '')
            .replace(/\{|\}/g, '')
            .replace(/ {2,}/g, ' ')
            .trim()
        ;
    }

    render() {
        return (
            <div className="volume-input-pane">
                <div className="input-group">
                    <span className="input-group-addon">标题</span>
                    <input
                        type="text" className="form-control"
                        value={this.state.title}
                        onChange={evt => this.setState({ title: evt.target.value })}
                    />
                </div>
                <EduSwitcher
                    edu={this.state.edu}
                    onEduChanged={newEdu => this.setState({ edu: newEdu })}
                />
                <KcodeEditor
                    // 初始化时不设置editor内容，
                    // 在点击预览时更新editor中html的内容为text经过处理之后添加了html标签的内容。
                    btns={['clearhtml', 'image']}
                    ref={(ref) => { this._editor = ref; }}
                />
                <Movable className="op-zone panel panel-default">
                    <button
                        className="btn btn-default"
                        onClick={this.handlePreview.bind(this)}
                        disabled={this.state.busy}
                    >
                        预览
                    </button>
                    <button
                        className="btn btn-default"
                        onClick={this.handleSave.bind(this)}
                        disabled={this.state.busy}
                    >
                        保存
                    </button>
                </Movable>
            </div>
        );
    }
}

function highlightInputTex(text) {
    /* eslint no-param-reassign: 0 */
    let ret = text;
    const repl1 = '<span class="tex tex-open">$1</span><span class="tex tex-text">$2</span><span class="tex tex-close">$3</span>';
    ret = ret.replace(/(\\[([])((?!<\/span>)(?:.|\n)*?)(\\[)\]])(?!<\/span>)/g, repl1);
    ret = ret.replace(/(\$\$?)((?:.|\n)*?)(\1)(?!<\/span>)/g, repl1);
    const repl2 = '<span class="tex tex-open">$1</span><span class="tex tex-text">$3</span><span class="tex tex-close">$4</span>';
    // 为防止重复处理，\begin \end 前后不能有 span(公式替换后标记), 由于 js 限制，只看 end
    ret = ret.replace(/(\\begin\{(array|split|matrix|cases|gather|multiline|eqnarray)\})(.*?)(\\end\{\2\})(?!<\/span>)/g, repl2);

    // 题目结构相关命令
    return ret.replace(/\\(tiganqu|daanqu|item|ans|sov|onech|twoch|fourch)(?!<\/)\b/g,
        `<span class="tex-text">$&</span>`);
}

function preprocess(text) {
    let ret = text;
    ret = ret.replace(/[［[【]\s*(?:例题?|.*测试题|巩固|拓展|.*补充题).*?[\]】］]\s*/g, '\\item ');
    ret = ret.replace(/[［[【]\s*答案?\s*[\]】］]\s*/g, '\\ans ');
    ret = ret.replace(/[［[【]\s*详?[分解]析?\s*[\]】］]\s*/g, '\\sov ');
    ret = ret.replace(/\\frac/g, '\\dfrac');
    ret = ret.replace(/\\\[/g, '\\(');
    ret = ret.replace(/\\]/g, '\\)');
    ret = ret.replace(/\\text\{(.*?)\}/g, '$1');
    ret = ret.replace(/(\\_)+ *\\\)/g, '\\)[[nn]]');
    ret = ret.replace(/原式 *\\\(/g, '\\(text{原式}');
    ret = ret.replace(/\{\\kern \dpt\}/g, '');
    ret = ret.replace(/\[\[un]]\s*\[\[\/un]]/g, '[[nn]]');
    ret = ret.replace(/\\vartriangle\s*/g, '\\vartriangle ');
    ret = ret.replace(/\\delta\s*/ig, '\\vartriangle ');
    ret = ret.replace(/\\nderline\b/g, '\\underline');

    // 标记连续的数字
    ret = ret.replace(/\d+(?:[,，、]\d+)+/g, 'begin_mark$&end_mark');

    // 去除公式环境里面的标记
    function repl(match, ebegin, econtent, eclose) {
        const content = econtent.replace(/begin_mark(.*?)end_mark/g, '$1');
        return ebegin + content + eclose;
    }
    ret = ret.replace(/(\\\()(.+?)(\\\))/g, repl);
    ret = ret.replace(/(\$\$?)(.+?)(\1)/g, repl);

    // 剩下的标记都是非公式环境。将剩下的标记加入公式环境
    function repl2(match, econtent) {
        const content = econtent.replace(/\d+/g, '$$$&$$');
        return content;
    }
    ret = ret.replace(/begin_mark(.*?)end_mark/g, repl2);


    return Q.htmlEscape(ret).replace(/\r/g, '').replace(/\n/g, '<br />');
}
