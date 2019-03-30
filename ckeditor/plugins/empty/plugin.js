CKEDITOR.plugins.add( 'empty', {
    icons: 'empty',
    hdpi: true,
    init: function( editor ) {
        editor.ui.addButton('empty', {
            label: "占位符",
            command: "empty",
            toolbar: "insert",
        });

        editor.addCommand( 'empty',  {
            exec: function( editor ) {
                editor.insertHtml("<div><p></p><p></p><p></p><p></p><p></p></div>")
            }})

    }
});
