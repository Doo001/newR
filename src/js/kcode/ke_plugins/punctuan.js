// 全椒标点符号
import KindEditor from 'kindeditor';

function simpleFactory(name, ch) {
    return KindEditor.plugin(name, function () {
        const self = this;
        self.clickToolbar(name, () => {
            const p = self.cmd.range;
            if (p) {
                p.deleteContents();
                self.insertHtml(ch);
            }
        });
    });
}

[
    ['period', '．'],
    ['comma', '，'],
    ['chinesecomma', '、'],
    ['colon', '：'],
    ['semicolon', '；'],
].map(pair => simpleFactory(...pair));
