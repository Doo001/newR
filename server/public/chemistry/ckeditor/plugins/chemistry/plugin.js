CKEDITOR.plugins.add( 'chemistry', {
    icons: 'chemistry',
    hdpi: true,
    init: function( editor ) {
        editor.ui.addButton('chemistry', {
            label: "化学公式",
            command: "chemistry",
            toolbar: "insert",
        });

        editor.addCommand( 'chemistry',  {
            exec: function( editor ) {
                var text = editor.getSelection().getSelectedText(), latex = '';
                if (text) {
                    var result = text.match(/^[\\\(|\\\[|\$]\$?([^\$]+)\$?[\\\)|\\\]|\$]$/)
                    if (result) {
                        latex = result[1]
                    }
                }
                if (!editor.updateLatex) {
                    editor.updateLatex = function(data) {
                        var text = this.getSelection().getSelectedText(), selectionText = '';
                        if (text) {
                            var result = text.match(/^[\\\(|\\\[|\$]\$?([^\$]+)\$?[\\\)|\\\]|\$]$/)
                            if (result) {
                                selectionText = text;
                            }
                        }
                        if (selectionText) {
                            var real = selectionText.replace(window.store.getState().formula.latex, data);
                            editor.insertHtml(real, 'text',editor.getSelection().getRanges()[0])
                        } else {
                            editor.insertHtml('$'+data+'$', 'text')
                        }
                    }
                }

                window.store.dispatch({
                    type: 'UPDATE_CK_FORMULA',
                    data: {
                        formula: {
                            toolbar: 'chemistry',
                            latex: latex,
                            type: 'ckeditor'
                        },
                        editor: editor
                    }

                })
            }})

    }
});
