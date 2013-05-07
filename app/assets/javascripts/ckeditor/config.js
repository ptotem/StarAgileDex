/*
 Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    config.resize_dir = 'vertical';
    config.toolbar_Custom =
        [
            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline'] },
            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-','Outdent','Indent','-', 'Table', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight','-', 'Maximize' ] }
        ];
    config.toolbar_Basic =
        [
            ['Bold', 'Italic', '-', 'NumberedList', 'BulletedList', '-', 'Link', 'Unlink','-','Maximize']
        ];
};
