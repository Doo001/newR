import KindEditor from 'kindeditor';

function braceLikeFactory(name, left, right) {
    return KindEditor.plugin(name, function () {
        const self = this;
        self.clickToolbar(name, () => {
            const p = self.cmd.range;
            if (p) {
                const htmlData = p.html();
                p.deleteContents();
                self.insertHtml(`${left}${htmlData}${right}`);
            }
        });
    });
}

[
    ['parethesis', ' \\left', ' \\right'],
    ['mathbf', '{\\mathbf{', '}}'],
    ['mathrm', '{\\mathrm{', '}}'],
    ['inlineequation', ' \\( ', ' \\) '],
    ['multilineequation', ' \\[ ', ' \\] '],
    ['split', '\\begin{split}', '\\end{split}'],
    ['cases', '\\begin{cases}', '\\end{cases}'],
].map(triplet => braceLikeFactory(...triplet));

function simpleFactory(name, str) {
    return KindEditor.plugin(name, function () {
        const self = this;
        self.clickToolbar(name, () => {
            const p = self.cmd.range;
            if (p) {
                p.deleteContents();
                self.insertHtml(str);
            }
        });
    });
}

[
    ['because', ' \\(\\because\\) '],
    ['therefore', ' \\(\\therefore\\) '],
    ['circlenum', ' \\quad \\cdots \\cdots ①'],
    ['addshu', '\\left|\\right.'],
].map(pair => simpleFactory(...pair));
