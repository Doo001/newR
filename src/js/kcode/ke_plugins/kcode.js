import KindEditor from 'kindeditor';

KindEditor.plugin('lwn', function () {
    const editor = this;
    const name = "lwn";
    editor.clickToolbar(name, () => {
        const cmd = editor.cmd;
        const p = cmd.selection().range;
        let prev = p.commonAncestor();

        while (prev !== null) {
            if (['LWN'].indexOf(prev.nodeName) !== -1) {
                const n = parseInt(prev.textContent, 10) + 1;
                p.deleteContents();
                editor.insertHtml(`<lwn>${n}.<nn></nn></lwn> `);
                return;
            } else if (prev.previousSibling) {
                prev = prev.previousSibling;
            } else {
                prev = prev.parentNode.previousSibling;
                if (prev !== null && 'lastElementChild' in prev) {
                    prev = prev.lastElementChild;
                }
            }
        }
        p.deleteContents();
        editor.insertHtml('<lwn>1.<nn></nn></lwn> ');
    });
});

KindEditor.plugin('nn', function () {
    const editor = this;
    const name = "nn";
    editor.clickToolbar(name, () => {
        const cmd = editor.cmd;
        const p = cmd.selection().range;

        if (p) {
            const startoffset = p.startOffset;
            const endoffset = p.endOffset;
            console.log(startoffset, endoffset);
            if (startoffset === endoffset) {
                p.deleteContents();
                editor.insertHtml('<nn>        </nn> ');
            } else {
                const htmlData = p.html();
                p.deleteContents();
                editor.insertHtml(`<u>${htmlData}</u>`);
            }
        }
    });
});

KindEditor.plugin('opts', function () {
    const editor = this;
    const name = "opts";
    editor.clickToolbar(name, () => {
        const cmd = editor.cmd;
        let p = cmd.selection().range.commonAncestor();
        let done = false;

        const o = document.createElement('opt');
        o.innerHTML = '<span>X. </span><span>option</span>';
        o.className = 'col-xs-2';

        while (p) {
            if (p.nodeName === 'OPTS') {
                p.appendChild(o);
                done = true;
                break;
            } else if (p.nodeName === 'SUBQ' || p.nodeName === 'Q') {
                const children = p.childNodes;
                for (let i = 0; i < children.length; i += 1) {
                    if (children[i].nodeName === 'OPTS') {
                        children[i].appendChild(o);
                        done = true;
                        break;
                    }
                }
                if (!done) {
                    const opts = document.createElement('opts');
                    opts.appendChild(o);
                    if (p.firstChild) {
                        p.insertBefore(opts, p.firstChild);
                    } else {
                        p.appendChild(opts);
                    }
                }
                break;
            } else if (p.nodeName === 'LI') {
                let hasSubq = false;
                const children = p.childNodes;
                for (let i = 0; i < children.length; i += 1) {
                    if (children[i].nodeName === 'SUBQ') {
                        p = children[i];
                        hasSubq = true;
                        break;
                    }
                }
                if (!hasSubq) {
                    p = p.parentNode;
                }
            } else {
                p = p.parentNode;
            }
        }
    });
});

KindEditor.plugin('rwn', function () {
    const editor = this;
    const name = "rwn";
    editor.clickToolbar(name, () => {
        const cmd = editor.cmd;
        const p = cmd.selection().range;
        let prev = p.commonAncestor();
        while (prev !== null) {
            if (['RWN'].indexOf(prev.nodeName) !== -1) {
                const n = parseInt(prev.textContent, 10) + 1;
                p.deleteContents();
                editor.insertHtml(`<rwn>${n}.<nn></nn></rwn>`);
                return;
            } else if (prev.previousSibling) {
                prev = prev.previousSibling;
            } else {
                prev = prev.parentNode.previousSibling;
                if (prev !== null && 'lastElementChild' in prev) {
                    prev = prev.lastElementChild;
                }
            }
        }
        p.deleteContents();
        editor.insertHtml('<rwn>1.<nn></nn></rwn>');
    });
});

KindEditor.plugin('sn', function () {
    const editor = this;
    const name = "sn";
    editor.clickToolbar(name, () => {
        const cmd = editor.cmd;
        const p = cmd.selection().range;
        let prev = p.commonAncestor();
        while (prev !== null) {
            if (['SN'].indexOf(prev.nodeName) !== -1) {
                p.deleteContents();
                return;
            } else if (prev.previousSibling) {
                prev = prev.previousSibling;
            } else {
                prev = prev.parentNode.previousSibling;
                if (prev !== null && 'lastElementChild' in prev) {
                    prev = prev.lastElementChild;
                }
            }
        }
        p.deleteContents();
    });
});

KindEditor.plugin('wn', function () {
    const editor = this;
    const name = "wn";
    editor.clickToolbar(name, () => {
        const cmd = editor.cmd;
        const p = cmd.selection().range;
        let prev = p.commonAncestor();

        while (prev !== null) {
            if (['WN'].indexOf(prev.nodeName) !== -1) {
                const n = parseInt(prev.textContent, 10) + 1;
                p.deleteContents();
                editor.insertHtml(`<wn>${n}</wn> `);
                return;
            } else if (prev.previousSibling) {
                prev = prev.previousSibling;
            } else {
                prev = prev.parentNode.previousSibling;
                if (prev !== null && 'lastElementChild' in prev) {
                    prev = prev.lastElementChild;
                }
            }
        }
        p.deleteContents();
        editor.insertHtml('<wn>1</wn> ');
    });
});
