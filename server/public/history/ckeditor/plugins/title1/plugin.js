CKEDITOR.plugins.add( 'title1', {
    icons: 'title1',
    hdpi: true,
    init: function( editor ) {
        editor.ui.addButton('title1', {
            label: "一级标题",
            command: "title1",
            toolbar: "insert",
        });

        editor.addCommand( 'title1',  {
            exec: function( editor ) {
                var style = new CKEDITOR.style( { element: 'b', attributes: { 'style': "font-size: 16px"} } );
                let active = style.checkActive( editor.elementPath(), editor );
                if (active) {
                    editor.removeStyle( style );
                } else {
                    editor.applyStyle( style );
                }
            }})

    }
});
