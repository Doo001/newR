import KindEditor from 'kindeditor';
import { Q } from 'js/quantum';


KindEditor.plugin('dragndrop', function () {
    this.afterCreate(() => {
        KindEditor(this.edit.doc.body).bind('drop', handleDrop.bind(this));
    });
});

function handleDrop(evt) {
    // is valid img file
    const imgFiles = [...evt.event.dataTransfer.files].filter(isValidImageFile);
    if (imgFiles.length !== 0) {
        evt.preventDefault();
        const form = new FormData();
        form.append('file', imgFiles[0]);
        Q.post('/api/upload', { data: form, processData: false, contentType: false })
            .then((result) => {
                this.exec('insertimage', result.url);
            })
        ;
        return;
    }
    // is valid tex file
    const texFiles = [...evt.event.dataTransfer.files].filter(isValidTexFile);
    if (texFiles.length !== 0) {
        evt.preventDefault();
        const reader = new FileReader();
        reader.onloadend = (file) => {
            this.insertHtml(text2html(file.target.result));
        };
        reader.readAsText(texFiles[0]);
    }
}

function isValidImageFile(file) {
    return ['.jpg', '.jpeg', '.gif', '.png'].some((type) => {
        return file.name.toLowerCase().endsWith(type);
    });
}

function isValidTexFile(file) {
    return file.name.toLowerCase().endsWith('tex');
}

function text2html(text) {
    // 保留 text 的换行
    return Q.htmlEscape(text).replace(/\r/g, '').replace(/\n/g, '<br />');
}
