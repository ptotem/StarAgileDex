/*
 Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    config.resize_dir = 'vertical';
    config.toolbar_Custom =
        [
            { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Font', 'FontSize' ] },
            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList','Table', '-', 'Link', 'Unlink', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight','-', 'Maximize' ] }
        ];
};
