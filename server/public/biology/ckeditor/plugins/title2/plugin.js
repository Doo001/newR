CKEDITOR.plugins.add( 'title2', {
    icons: 'title2',
    hdpi: true,
    init: function( editor ) {
        editor.ui.addButton('title2', {
            label: "二级标题",
            command: "title2",
            toolbar: "insert",
        });

        editor.addCommand( 'title2',  {
            exec: function( editor ) {
                var style = new CKEDITOR.style( { element: 'b', attributes: { 'style': "font-size: 14px"} } );
                let active = style.checkActive( editor.elementPath(), editor );
                if (active) {
                    editor.removeStyle( style );
                } else {
                    editor.applyStyle( style );
                }
            }})

    }
});
