/*
 *         mbScrollable, developed by Matteo Bicocchi on JQuery
 *        © 2002-2009 Open Lab srl, Matteo Bicocchi
 *			    www.open-lab.com - info@open-lab.com
 *       	version 1.0
 *       	tested on: 	Explorer, Chrome, FireFox for PC
 *                  		FireFox and Safari for Mac Os X
 *                  		FireFox for Linux
 *         MIT (MIT-LICENSE.txt) licenses.
 */

(function($) {
  $.mbScrollable= {
    plugin:"mb.scroller",
    author:"MB",
    version:"1.0",
    defaults:{
      width:950,
      elementsInPage:4,
      elementMargin:2,
      shadow:false,
      height:"auto",
      controls:"#controls",
      slideTimer:600,
      autoscroll:false,
      scrollTimer:6000,

      nextCallback:function(){},
      prevCallback:function(){}
    },
    buildMbScrollable: function(options){

      return this.each (function (){
        this.options = {};
        $.extend (this.options, $.mbScrollable.defaults);
        $.extend (this.options, options);

        var mbScrollable=this;
        var el=this;
        var controller=$(this.options.controls);
        this.idx=1;
        this.scrollTo=0;
        this.elements= $(this).children();
        this.elements.addClass("scrollEl");

        controller.hide();
        $(this).children().each(function(){$(this).wrap("<div class='SECont'></div>");});
        if (this.options.shadow){
          $(this.elements).css("-moz-box-shadow",this.options.shadow);
          $(this.elements).css("-webkit-box-shadow",this.options.shadow);
        }
        this.elements= $(this).children();

        this.singleElWidth= (this.options.width/this.options.elementsInPage)-this.options.elementMargin;
        this.elementsWidth= (this.singleElWidth*this.elements.size())+(this.options.elementMargin*this.elements.size());
        this.totalPages= Math.ceil(this.elements.size()/this.options.elementsInPage);
        if (this.options.elementsInPage<this.options.elementsInPage){
          this.totalPages-=this.options.elementsInPage-this.options.elementsInPage;
        }

        this.elementsInpage= Math.floor(this.options.width/this.singleElWidth);
        $(this.elements).css({marginRight:this.options.elementMargin, width:this.singleElWidth, display:"inline-block" }); //float:"left"

        var adj= $.browser.safari && el.options.elementsInPage>2?this.options.elementMargin/(this.options.elementsInPage):0;

        $(mbScrollable).css({overflow:"hidden", width:this.options.width-adj,height:this.options.height,paddingBottom:5, position:"relative"});
        $(this.elements).wrapAll("<div class='scrollableStrip'><\/div>");
        this.mbscrollableStrip= $(this).find(".scrollableStrip");
        $(this.mbscrollableStrip).css({width:this.elementsWidth, position:"relative"});
        $(this.elements).hover(
                function(){
                  if($(mbScrollable)[0].autoScrollActive)
                    $(mbScrollable).mbStopAutoscroll();
                },
                function(){
                  if($(mbScrollable)[0].autoScrollActive)
                    $(mbScrollable).mbAutoscroll();
                }
                );
        if(this.options.autoscroll && this.elements.size()>this.options.elementsInPage){
          this.autoScrollActive=true;
          $(this).mbAutoscroll();
        }
        $(this).mbPageIndex();
        $(mbScrollable).mbActivateControls();
        $(mbScrollable).mbManageControls();
        setTimeout(function(){
          $(".scrollEl").fadeIn();
          controller.fadeIn();
        },2000);
      });
    },
    mbNextPage: function(){
      var el= $(this).get(0);
      if(el.idx==el.totalPages){
        $(this).mbManageControls();
        return;
      }
      if (el.options.nextCallback) el.options.nextCallback();

      var adj=  $.browser.safari && el.options.elementsInPage>2?el.options.elementMargin/el.options.elementsInPage:0;

      el.scrollTo-=((el.singleElWidth+el.options.elementMargin)*el.options.elementsInPage)-adj;
      if (el.scrollTo<-el.elementsWidth+el.options.width)
        el.scrollTo=-el.elementsWidth+el.options.width;
      $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
      el.idx+=1;
      $(this).mbManageControls();
    },
    mbPrevPage: function(){
      var el= $(this).get(0);
      if(el.idx==1){
        $(this).mbManageControls();
        return;
      }
      if (el.options.prevCallback) el.options.prevCallback();

      var adj=  $.browser.safari && el.options.elementsInPage>2?el.options.elementMargin/el.options.elementsInPage:0;

      el.scrollTo+=((el.singleElWidth+el.options.elementMargin)*el.options.elementsInPage)+adj;
      if (el.scrollTo>=0)
        el.scrollTo=0;
      $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
      el.idx-=1;
      $(this).mbManageControls();
    },
    mbFirstPage: function(){
      var mbScrollable=this;
      var el= $(this).get(0);
      el.scrollTo=0;
      $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
      el.idx=1;
      $(this).mbManageControls();
      $(mbScrollable).mbStopAutoscroll();
    },
    mbLastPage: function(){
      var mbScrollable=this;
      var el= $(this).get(0);
      el.scrollTo=-el.elementsWidth+el.options.width;
      $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
      el.idx=el.totalPages;
      $(this).mbManageControls();
      $(mbScrollable).mbStopAutoscroll();
    },
    mbPageIndex: function(){
      var mbScrollable=this;
      var el= $(mbScrollable).get(0);
      var controls=$(el.options.controls);
      var pages=controls.find(".pageIndex");
      if (pages){
        function getPage(i){
          el.scrollTo=-((el.singleElWidth+el.options.elementMargin)*(el.options.elementsInPage*(i-1)));
          if (el.scrollTo<-el.elementsWidth+el.options.width)
            el.scrollTo=-el.elementsWidth+el.options.width;
          $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
          el.idx = Math.floor(i);
          $(mbScrollable).mbManageControls();
        }
        var n=0;
        for(var i=1;i<=el.totalPages;i++){
          n++;
          var p=$("<span class='page'> "+n+" <\/span>").bind("click",function(){
            getPage($(this).html());
            $(mbScrollable).mbStopAutoscroll();
          });
          pages.append(p);
        };
      }
    },
    mbAutoscroll:function(){
      var dir= "next";
      var mbScrollable=this;
      var el= $(mbScrollable).get(0);

      if(el.autoscroll) return;
      var timer=el.options.scrollTimer;
      el.autoscroll = true;
      el.auto = setInterval(function(){
        dir= el.idx==1?"next":el.idx==el.totalPages?"prev":dir;
        if(dir=="next")
          $(mbScrollable).mbNextPage();
        else
          $(mbScrollable).mbPrevPage();
      },timer);
      $(this).mbManageControls();
    },
    mbStopAutoscroll: function(){
      var mbScrollable=this;
      var el= $(mbScrollable).get(0);
      el.autoscroll = false;
      clearInterval(el.auto);
      $(this).mbManageControls();
    },
    mbActivateControls: function(){
      var mbScrollable=this;
      var el= $(mbScrollable).get(0);
      var controls=$(el.options.controls);
      controls.find(".first").bind("click",function(){$(mbScrollable).mbFirstPage();});
      controls.find(".prev").bind("click",function(){$(mbScrollable).mbStopAutoscroll();$(mbScrollable).mbPrevPage();});
      controls.find(".next").bind("click",function(){$(mbScrollable).mbStopAutoscroll();$(mbScrollable).mbNextPage();});
      controls.find(".last").bind("click",function(){$(mbScrollable).mbLastPage();});
      controls.find(".start").bind("click",function(){$(mbScrollable).mbAutoscroll();$(mbScrollable)[0].autoScrollActive=true;});
      controls.find(".stop").bind("click",function(){$(mbScrollable).mbStopAutoscroll();$(mbScrollable)[0].autoScrollActive=false;});
    },
    mbManageControls:function(){
      var mbScrollable=this;
      var el= $(mbScrollable).get(0);
      var controls=$(el.options.controls);
      if (el.elements.size()<=el.options.elementsInPage){
        controls.hide();
      }
      /*
       if (!el.options.autoscroll){
       controls.find(".start").hide();
       controls.find(".stop").hide();
       }
       */
      if (el.idx==el.totalPages){
        controls.find(".last").addClass("disabled");
        controls.find(".next").addClass("disabled");
      }else{
        controls.find(".last").removeClass("disabled");
        controls.find(".next").removeClass("disabled");
      }

      if (el.idx==1){
        controls.find(".first").addClass("disabled");
        controls.find(".prev").addClass("disabled");
      }else{
        controls.find(".first").removeClass("disabled");
        controls.find(".prev").removeClass("disabled");
      }

      if (el.autoscroll){
        controls.find(".start").addClass("sel");
        controls.find(".stop").removeClass("sel");
      }else{
        controls.find(".start").removeClass("sel");
        controls.find(".stop").addClass("sel");
      }

      controls.find(".page").removeClass("sel");
      controls.find(".page").eq(el.idx-1).addClass("sel");
      controls.find(".idx").html(el.idx+" / "+el.totalPages);
    }
  };

  $.fn.mbScrollable=$.mbScrollable.buildMbScrollable;
  $.fn.mbNextPage=$.mbScrollable.mbNextPage;
  $.fn.mbPrevPage=$.mbScrollable.mbPrevPage;
  $.fn.mbFirstPage=$.mbScrollable.mbFirstPage;
  $.fn.mbLastPage=$.mbScrollable.mbLastPage;
  $.fn.mbPageIndex=$.mbScrollable.mbPageIndex;
  $.fn.mbAutoscroll=$.mbScrollable.mbAutoscroll;
  $.fn.mbStopAutoscroll=$.mbScrollable.mbStopAutoscroll;
  $.fn.mbActivateControls=$.mbScrollable.mbActivateControls;
  $.fn.mbManageControls=$.mbScrollable.mbManageControls;

})(jQuery);