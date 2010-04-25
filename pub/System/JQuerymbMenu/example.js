/*
     * DEFAULT OPTIONS
     *
     options: {
     template:"yourMenuVoiceTemplate",--> the url that returns the menu voices via ajax. the data passed in the request is the "menu" attribute value as "menuId"
     additionalData:"",								--> if you need additional data to pass to the ajax call
     menuSelector:".menuContainer",		--> the css class for the menu container
     menuWidth:150,										--> min menu width
     openOnRight:false,								--> if the menu has to open on the right insted of bottom
     iconPath:"ico/",									--> the path for the icons on the left of the menu voice
     hasImages:true,									--> if the menuvoices have an icon (a space on the left is added for the icon)
     fadeInTime:100,									--> time in milliseconds to fade in the menu once you roll over the root voice
     fadeOutTime:200,									--> time in milliseconds to fade out the menu once you close the menu
     menuTop:0,												--> top space from the menu voice caller
     menuLeft:0,											--> left space from the menu voice caller
     submenuTop:0,										--> top space from the submenu voice caller
     submenuLeft:4,										--> left space from the submenu voice caller
     opacity:1,												--> opacity of the menu
     shadow:false,										--> if the menu has a shadow
     shadowColor:"black",							--> the color of the shadow
     shadowOpacity:.2,								--> the opacity of the shadow
     openOnClick:true,								--> if the menu has to be opened by a click event (otherwise is opened by a hover event)
     closeOnMouseOut:false,						--> if the menu has to be cloesed on mouse out
     closeAfter:500,									--> time in millisecond to whait befor closing menu once you mouse out
     minZindex:"auto", 								--> if set to "auto" the zIndex is automatically evaluate, otherwise it start from your settings ("auto" or int)
     hoverInted:0, 										--> if you use jquery.hoverinted.js set this to time in milliseconds to delay the hover event (0= false)
     onContextualMenu:function(o,e){} --> a function invoked once you call a contextual menu; it pass o (the menu you clicked on) and e (the event)
     },
     */

$(function() {
    $("#myMenu").buildMenu({
        //template: foswiki.pubUrlPath + "/" + foswiki.systemWebName + "/JQuerymbComponentsPlugin/jquery.mb.menu/menuVoices.html",
        template: foswiki.scriptUrlPath+'/rest/JQZenTablePlugin/getEditForUndefinedMenu',
        additionalData: "pippo=1;mbMenuRootTopic="+foswiki.mbMenuRootTopic,
        menuWidth: 200,
        openOnRight: false,
        menuSelector: ".menuContainer",
        //iconPath:foswiki.pubUrlPath+"/"+foswiki.systemWebName +"/JQuerymbComponentsPlugin/jquery.mb.menu/ico/",
        iconPath: "",
        hasImages: true,
        fadeInTime: 100,
        fadeOutTime: 300,
        adjustLeft: 2,
        minZindex: "auto",
        adjustTop: 10,
        opacity: .95,
        shadow: true,
        shadowColor: "#ccc",
        hoverIntent: 0,
        openOnClick: false,
        closeOnMouseOut: true,
        closeAfter: 1000,
        hoverInted: 400
    });
});

///////////////////////////////////////////////////////////////////
//
// Uses SvenDowideit's fork of zentable - which can be found at 
//
//  http://github.com/SvenDowideit/ZenTable
//
//
(function($) {
    $.fn.editMenu = function(menu_name, web, topic) {
        this.menu_name = menu_name;
        var menu = $('#' + this.menu_name);
        this.menu_class = menu.attr('class');
        this.web = web;
        this.topic = topic;

        $('.menuEditDialogMenuName').text(this.menu_name);
        $('.menuEditDialogWebName').text(this.web);
        $('.menuEditDialogTopicName').text(this.topic);

        var rows = [];
        var index = 1;
        menu.find('.rootVoice').each(function() {
            //TODO: need to hide the 'edit' item, and refuse to edit non-simple menus
            if ($(this).attr('class').match('editMenu')) {
                return;
            }
            var label = $(this).text();
            var link = $(this).attr('href') || '';
            
            if ($.metadata){
                $.metadata.setType("class");
                //mmm, metadata attr's in the class field (eddies in the space time continum
                if ($(this).metadata().menu) $(this).attr("menu",$(this).metadata().menu);
            }

            var sub_menu = $(this).attr('menu') || '';
            if (sub_menu == 'empty') {
                sub_menu = '';
            }
            rows.push([index++, label, link, sub_menu, '']);
        });
        rows.push([index++, '', '(title with no text == delete item)', 'use this item to add another row', '']);

        this.onEditHandler = function(editing, value, colName, row, col) {
            if (colName == 'order') {
                //need to renumber everything automatically - to support replacing plain edit with up&down buttons
            }
            $.fn.zentable.instance.data.set(row, col, value);
            $.fn.zentable.instance.data.refresh();
            $('#zentableFoswikiSubmit').removeClass('foswikiSubmitDisabled');
        };

        this.saveChangesAlreadyCalled = false; //The unbin('click') isn't working, so the second time the menu edit is used, there are 2 onclick's etc :(
        this.saveChanges = function(event) {
            //$.fn.zentable.instance.data.actualArray[row][col]
            //ok, so we 'know' that the actualArray rows are in 'order'
            var menuElements = '';

            if (this.saveChangesAlreadyCalled) {
                return false;
            }
            this.saveChangesAlreadyCalled = true;

            $.each($.fn.zentable.instance.data.actualArray, function(idx, row) {
                var text = row[1];
                var link = row[2];
                var menu = row[3];
                menuElements += text + ';' + link + ';' + menu + '\n';
            });

            //throw it at the server
            $('#zentableFoswikiLog').ajaxError(function(event, XMLHttpRequest, ajaxOptions, thrownError) {
                $(this).text('failed to save: ' + XMLHttpRequest.responseText);
            });
            $.post(
            foswiki.scriptUrl + '/rest/JQZenTablePlugin/updateMenu', {
                saveto: this.web + '.' + this.topic,
                menu: this.menu_name,
                elements: menuElements
            },
            function(responseText) {
                $('#zentableFoswikiLog').unbind(); //clear the error handler
                //TODO: beats me why JQuery is broken and does not unbind.
                $('#zentableFoswikiSubmit').unbind('.zenTable'); //clear the onclick
                //alert(responseText);
                $.modal.close();
            },
            "text");

            return false;
        }

        var self = this;
        //$('#zentableFoswikiSubmit').addClass('foswikiSubmitDisabled');
        $('#zentableFoswikiSubmit').bind('click.zenTable', function(e) {
            self.saveChanges.apply(self, arguments);
        });

        $("#zentable").zentable({
            cols: [{
                name: 'order',
                id: 'order',
                editable: true,
                width: 30,
                orderable: true
            },
            {
                name: 'title',
                id: 'title',
                editable: true,
                width: 200,
                orderable: false
            },
            {
                name: 'link',
                id: 'link',
                editable: true,
                width: 300,
                orderable: false
            },
            {
                name: 'menu',
                id: 'menu',
                editable: true,
                width: 200,
                orderable: false
            },
            {
                name: '.',
                id: '.',
                editable: false,
                width: 1,
                orderable: false
            }
            //TODO: add toogle button for delete? (set delete column to true...
            ],
            data: rows,
            onedit: this.onEditHandler,
            order: 'order',
            //totalsRow: false,
            //hideIfEmpty: false
        });
        $("#menuEditDialog").modal({
            escClose: true,
            overlayClose: true,
            autoPosition: false,
            position: ['20%', '10%'],
            containerCss: {
                width: '820px'
            },
            onClose: function() {
                $.modal.close();
            }
        });
    }
})(jQuery);