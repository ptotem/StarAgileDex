/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
  config.PreserveSessionOnFileBrowser = true;
  // Define changes to default configuration here. For example:
  config.language = 'en';
  // config.uiColor = '#AADC6E';

  //config.ContextMenu = ['Generic','Anchor','Flash','Select','Textarea','Checkbox','Radio','TextField','HiddenField','ImageButton','Button','BulletedList','NumberedList','Table','Form'] ; 
  
//  config.height = '20px';
  config.width = '104%';
  
  config.resize_enabled = true;
  config.resize_maxHeight = 400;
  config.resize_maxWidth = 0;
  
  //config.startupFocus = true;
  
  // works only with en, ru, uk languages
//  config.extraPlugins = "embed,attachment";

  config.font_names = 'Century Gothic; Canela; Verdana; Arial';

  config.fontSize_sizes = '12/12px;14/14px;16/16px;24/24px;28/28px;';
  
  config.toolbar = 'Easy';
  
  config.toolbar_Easy =
    [
        ['Cut','Copy','Paste'],
        ['Undo','Redo'],
        ['Format'],
        ['Bold','Italic','Underline','TextColor'],
        ['NumberedList','BulletedList'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
        ['Font','FontSize' ]
    ];

  config.MaxLength= 10;

};

