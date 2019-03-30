/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
    // Define changes to default configuration here. For example:
    config.language = 'zh-cn';
    config.font_defaultLabel = window.navigator.appVersion.indexOf("Windows") == -1 ? "PingFang SC": "Microsoft YaHei";
    config.font_names = "PingFang SC;Microsoft YaHei";
    config.extraPlugins = 'pindent, empty, title1, title2, uploadimage, clipboard, pastefromword, colordialog, tableresize';
    //config.extraPlugins += 'mathjax';
    config.extraPlugins += Global.config.subject == 'chemistry'? ', chemistry': ',formula';
    config.toolbarGroups = [
        '/',
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'forms', groups: [ 'forms' ] },
        '/',
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'paragraph', 'blocks', 'align', 'bidi' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'tools', groups: [ 'tools' ] },
        '/',
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] }
    ];


    config.removeButtons = 'Source,Save,Templates,Copy,Cut,NewPage,Preview,Print,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Checkbox,TextField,Textarea,Select,Form,Button,HiddenField,Radio,Blockquote,CreateDiv,Language,Anchor,Unlink,Link,Flash,Smiley,PageBreak,Iframe,Styles,ShowBlocks,About,texzilla,Strike,NumberedList,BulletedList,BidiLtr,BidiRtl,HorizontalRule,Format,Font,FontSize,BGColor,Outdent,Indent';
    config.colorButton_colors = "#000/000, #E41A21/E41A21, #427EC4/427EC4, #3CB72D/3CB72D";
    let specialChars = [];
    specialChars.push('&#9312;','&#9313;', '&#9314;','&#9315;','&#9316;','&#9317;','&#9318;','&#9319;','&#9320;','&#9321;','&#9322;','&#9323;','&#9324;','&#9325;','&#9326;','&#9327;','&#9328;','&#9329;','&#9330;','&#9331;', '&#12881;', '&#12882;', '&#12883;', '&#12884;', '&#12885;', '&#12886;', '&#12887;', '&#12888;', '&#12889;', '&#12890;', '&#12891;', '&#12892;', '&#12893;', '&#12894;', '&#12895;');
    specialChars.push('&#9332;', '&#9333;', '&#9334;', '&#9335;', '&#9336;', '&#9337;', '&#9338;', '&#9339;', '&#9340;', '&#9341;', '&#9342;', '&#9343;', '&#9344;', '&#9345;', '&#9346;', '&#9347;', '&#9348;', '&#9349;', '&#9350;', '&#9351;')
    specialChars.push('&#9352;', '&#9353;', '&#9354;', '&#9355;', '&#9356;', '&#9357;', '&#9358;', '&#9359;', '&#9360;', '&#9361;', '&#9362;', '&#9363;', '&#9364;', '&#9365;', '&#9366;', '&#9367;', '&#9368;', '&#9369;', '&#9370;', '&#9371;')
    specialChars.push('&#8544;', '&#8545;', '&#8546;', '&#8547;', '&#8548;', '&#8549;', '&#8550;', '&#8551;', '&#8552;', '&#8553;', '&#8554;', '&#8555;' )
    specialChars.push('&#8560;', '&#8561;', '&#8562;', '&#8563;', '&#8564;', '&#8565;', '&#8566;', '&#8567;', '&#8568;', '&#8569;', '&#8570;', '&#8571;')
    specialChars.push('&#12832;', '&#12833;', '&#12834;', '&#12835;', '&#12836;', '&#12837;', '&#12838;', '&#12839;', '&#12840;', '&#12841;')
    config.specialChars = specialChars.concat(config.specialChars)
    config.colorButton_enableAutomatic = false;
    config.colorButton_enableMore = false;
    config.uploadUrl = '/api/upload';
    config.imageUploadUrl = '/api/upload';
    //config.mathJaxLib = "http://sealimg.youneng.com/mathjax2/2.7.2/MathJax.js?config=TeX-AMS_SVG-full";

};
