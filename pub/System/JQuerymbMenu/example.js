
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

    $(function(){
      $("#myMenu").buildMenu(
      {
        template:foswiki.pubUrlPath+"/"+foswiki.systemWebName +"/JQuerymbComponentsPlugin/jquery.mb.menu/menuVoices.html",
        additionalData:"pippo=1",
        menuWidth:200,
        openOnRight:false,
        menuSelector: ".menuContainer",
        //iconPath:foswiki.pubUrlPath+"/"+foswiki.systemWebName +"/JQuerymbComponentsPlugin/jquery.mb.menu/ico/",
        iconPath: "",
        hasImages:true,
        fadeInTime:100,
        fadeOutTime:300,
        adjustLeft:2,
        minZindex:"auto",
        adjustTop:10,
        opacity:.95,
        shadow:true,
        shadowColor:"#ccc",
        hoverIntent:0,
        openOnClick:false,
        closeOnMouseOut:true,
        closeAfter:1000,
        hoverInted:400
      });


    }
            );



editMenu = function(obj, menu_name, web, topic) {
  var menu = $('#'+menu_name);
  var menu_class = menu.attr('class');
  
  var results = '<table class="foswikiTable" id="edit_'+menu_name+'"><tr><th style="display:none">icon</th><th>title</th><th>link</th><th>edit</th></tr>';
  //add rows
  var buttons = '<a onclick="moveUp(event);" class="foswikiButton"><img src="'+foswiki.pubUrl+'/'+foswiki.systemWebName+'/DocumentGraphics/up.png" alt="up" /></a>'+
                '<a onclick="createNew(event);" class="foswikiButton"><img src="'+foswiki.pubUrl+'/'+foswiki.systemWebName+'/DocumentGraphics/plus.png" alt="new" /></a>'+
                '<a onclick="deleteItem(event);" class="foswikiButton"><img src="'+foswiki.pubUrl+'/'+foswiki.systemWebName+'/DocumentGraphics/minus.png" alt="delete" /></a>'+
                '<a onclick="moveDown(event);" class="foswikiButton"><img src="'+foswiki.pubUrl+'/'+foswiki.systemWebName+'/DocumentGraphics/down.png" alt="down" /></a>';
  $(menu).find('.rootVoice').each(function(){
      //TODO: need to hide the 'edit' item, and refuse to edit non-simple menus
      if ($(this).attr('class').match('editMenu')) {
        return;
      }
      results += '<tr><td style="display:none">'+'none'+'</td><td>'+$(this).text()+'</td><td>'+$(this).attr('href')+'</td><td>'+buttons+'</td></tr>';
          });
  results += '</table>';
  var editDialog = '<div><b>Edit '+menu_name+' on '+web+'.'+topic+'</b><br />'+results+'<br />'+
        '<a onclick="saveChanges(event);" class="foswikiSubmit"><img src="'+foswiki.pubUrl+'/'+foswiki.systemWebName+'/DocumentGraphics/plus.png" alt="OK" />Save changes</a>'+
        '<a onclick="$.modal.close();" class="foswikiButton"><img src="'+foswiki.pubUrl+'/'+foswiki.systemWebName+'/DocumentGraphics/minus.png" alt="Cancel" />Cancel</a>'+
        '</div>';
  
  $(editDialog).modal({escClose:true, overlayClose:true, autoPosition: false, position: ['20%','10%']});
  

  return false; //prevent the default handler
}
moveUp = function(event) {
}
createNew = function(event) {
}
deleteItem = function(event) {
}
moveDown = function(event) {
  alert($(event).text());
}
saveChanges = function(event) {
  alert('save..');
  //figure out what changed, sent to server..
  $.modal.close();
}
