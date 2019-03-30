import KindEditor from 'kindeditor';

const kDialogBodyHtml = `<div style="padding:20px;">
    <div class="ke-dialog-row">
        <label for="keWikiName" style="width:64px;">wiki名</label>
        <input class="ke-input-text" type="text" id="keWikiName" name="wiki-name" value=""
            style="width:260px;"
        />
    </div>
    <div class="ke-dialog-row"">
        <label for="keWikiTitle" style="width:64px;">wiki显示名</label>
        <input class="ke-input-text" type="text" id="keWikiTitle" name="wiki-title" value=""
            style="width:260px;"
        />
    </div>
</div>`;

const onDialogYes = (editor, dialog) => {
    const wikiTitleBox = KindEditor('input[name="wiki-title"]', dialog.div);
    const wikiNameBox = KindEditor('input[name="wiki-name"]', dialog.div);
    let wikiName = KindEditor.trim(wikiNameBox.val());
    const wikiTitle = KindEditor.trim(wikiTitleBox.val());
    if (!wikiName) {
        alert('wiki名不能为空');
        wikiNameBox[0].focus();
        return;
    }
    // more value validation? likie html entities?
    let displayTitle = wikiTitle;
    wikiName = wikiName.replace(/：/g, ':');
    if (!displayTitle) {
        const commaPos = wikiName.lastIndexOf(':');
        if (commaPos !== -1) {
            displayTitle = wikiName.slice(commaPos + 1);
        } else {
            displayTitle = wikiName;
        }
        if (!displayTitle) {
            alert('wiki名不能以:结尾');
            wikiNameBox[0].focus();
            return;
        }
    }
    // check wiki existence?_
    const kcode = '[[wiki]]' + wikiName +  /* eslint prefer-template: 0 */
        (wikiTitle ? '|' + wikiTitle : '') + '[[/wiki]]';
    const wiki = editor.cmd.commonNode({ wiki: '*' });
    if (wiki && !editor.cmd.range.isControl()) {
        editor.cmd.range.selectNode(wiki.get());
        editor.cmd.select();
    }
    editor.insertHtml(kcode);
    editor.hideDialog();
};

KindEditor.plugin('wiki', function () {
    const self = this;
    const name = 'wiki';
    self.plugin.link = {
        edit: () => {
            const html = kDialogBodyHtml;
            const dialog = self.createDialog({
                name,
                width: 450,
                title: 'wiki链接',
                body: html,
                yesBtn: {
                    name: '确定',
                    click() { return onDialogYes(self, dialog); },
                },
            });
            const div = dialog.div;
            const wikiTitleBox = KindEditor('input[name="wiki-title"]', div);
            const wikiNameBox = KindEditor('input[name="wiki-name"]', div);
            self.cmd.selection();
            const wiki = self.cmd.commonAncestor('wiki');
            if (wiki) {
                self.cmd.range.selectNode(wiki.get());
                self.cmd.select();
                self.cmd.selection();
            }
            wikiTitleBox.val(self.cmd.range.toString());
            wikiNameBox[0].focus();
        },
    };
    self.clickToolbar(name, self.plugin.link.edit);
});
