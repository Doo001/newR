CKEDITOR.plugins.add( 'pindent', {
    icons: 'pindent',
    hdpi: true,
    init: function( editor ) {
        editor.ui.addButton('pindent', {
            label: "首行缩进",
            command: "pindent",
            toolbar: "paragraph",
        });

        editor.addCommand( 'pindent',  {
            allowedContent: 'p{text-indent}',
            requiredContent: 'p',
            exec: function( editor ) {
                var style = new CKEDITOR.style( { element: 'p', attributes: { 'style': "text-indent: 2em"} } );
                let active = style.checkActive( editor.elementPath(), editor );
                if (active) {
                    editor.removeStyle( style );
                } else {
                    editor.applyStyle( style );
                }
            }})

    }
});
