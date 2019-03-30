import React from 'react';
import KindEditor from 'kindeditor';
// 不要使用 to-string-loader@1.1.5，会产生 bug，有个 css-loader 注入的文件可能注入失败
import kEditorInnerStyle from '!!to-string-loader!css-loader!resolve-url-loader!sass-loader!css/kcode_editor_inner.scss';


import './ke_plugins/kcode';
import './ke_plugins/punctuan';
import './ke_plugins/tex';
import './ke_plugins/wiki';
import './ke_plugins/dragndrop';

import './ke_lang/zh-CN';

export function createEditor(element, btns) {
    // should be called when KindEditor.ready
    if (!btns) {
        // eslint-disable-next-line no-param-reassign
        btns = ['image', 'nn', 'period', 'comma', 'chinesecomma', 'colon',
            'semicolon', 'parethesis', 'mathbf', 'mathrm', 'inlineequation', 'multilineequation',
            'split', 'cases', 'because', 'therefore', 'circlenum', 'addshu', 'wiki'];
    }

    return KindEditor.create(element, {
        resizeType: 1,
        width: "100%",
        height: "10px",
        langType: 'zh-CN',
        allowPreviewEmoticons: false,
        uploadJson: '/api/upload',
        allowImageRemote: false,
        filePostName: 'file',
        filterMode: false,
        newlineTag: 'br',
        minChangeSize: '1',
        autoHeightMode: true,
        items: btns,
        allowFileManager: false,
        cssData: kEditorInnerStyle,
        afterCreate() {
            this.loadPlugin('autoheight');
        },
    });
}

export default createEditor;

export function replacePaste(editor) {
    if (!editor) {
        return;
    }
    const k = KindEditor;
    const doc = editor.edit.doc;
    const cmd = editor.cmd.selection();
    const cls = '__kindeditor_paste__';
    const divCls = `div.${cls}`;
    let pasting = false;
    let div;
    let bookmark;
    function movePastedData() {
        cmd.range.moveToBookmark(bookmark);
        cmd.select();
        // 重置一下高度
        const edit = editor.edit;
        const body = edit.doc.body;
        edit.iframe.height(100);
        editor.resize(null, Math.max((k.IE ? body.scrollHeight : body.offsetHeight) + 76, 100));
        if (k.WEBKIT) {
            k(divCls, div).each(function () {
                k(this).after('<br />').remove(true);
            });
            k('span.Apple-style-span', div).remove(true);
            k('span.Apple-tab-span', div).remove(true);
            k('span[style]', div).each(function () {
                if (k(this).css('white-space') === 'nowrap') {
                    k(this).remove(true);
                }
            });
            k('meta', div).remove();
        }
        let html = div[0].innerHTML;
        div.remove();
        if (html === '') {
            return;
        }
        if (k.WEBKIT) {
            html = html.replace(/(<br>)\1/ig, '$1');
        }
        if (editor.pasteType === 2) {
            html = html.replace(/(<(?:p|p\s[^>]*)>) *(<\/p>)/ig, '');
            if (/schemas-microsoft-com|worddocument|mso-\w+/i.test(html)) {
                html = k.clearMsWord(html, editor.filterMode ?
                    editor.htmlTags : k.options.htmlTags);
            } else {
                html = k.formatHtml(html, editor.filterMode ? editor.htmlTags : null);
                html = editor.beforeSetHtml(html);
            }
        }
        if (editor.pasteType === 1) {
            html = html.replace(/&nbsp;/ig, ' ');
            html = html.replace(/\n\s*\n/g, '\n');
            html = html.replace(/<br[^>]*>/ig, '\n');
            html = html.replace(/<\/p><p[^>]*>/ig, '\n');
            html = html.replace(/<[^>]+>/g, '');
            html = html.replace(/ {2}/g, ' &nbsp;');
            if (editor.newlineTag === 'p') {
                if (/\n/.test(html)) {
                    html = html.replace(/^/, '<p>').replace(/$/, '<br /></p>')
                        .replace(/\n/g, '<br /></p><p>');
                }
            } else {
                html = html.replace(/\n/g, '<br />$&');
            }
        }
        editor.insertHtml(html, true);
    }
    k(doc.body).unbind('paste');
    k(doc.body).bind('paste', () => {
        if (pasting) {
            return;
        }
        pasting = true;
        k(divCls, doc).remove();
        bookmark = cmd.range.createBookmark();
        div = k(`<div class="${cls}"></div>`, doc).css({
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            left: '-1981px',
            top: `${k(bookmark.start).pos().y}px`,
            'white-space': 'nowrap',
        });
        k(doc.body).append(div);
        setTimeout(() => {
            movePastedData();
            pasting = false;
        }, 100);
    });
}

export class KcodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this._editor = null;
    }

    componentDidMount() {
        this._editor = createEditor(this.ref, this.props.btns);
        replacePaste(this._editor);
    }

    componentWillReceiveProps(nextProps) {
        this._editor.html(nextProps.value);
    }

    shouldComponentUpdate() {
        // 防止编辑器被重置，我们自己维护编辑器状态
        // 虽然react记住的vdom和新渲染的一样不会触发重绘
        return false;
    }

    setHtml(value) {
        this._editor.html(value);
    }

    html() {
        return this._editor.html();
    }

    value() {
        return this._editor.html();
    }

    text() {
        return this._editor.text();
    }

    insertHtml(value) {
        this._editor.insertHtml(value);
    }

    render() {
        return (
            <textarea
                defaultValue={this.props.value}
                ref={(ref) => { this.ref = ref; }}
            />
        );
    }
}
