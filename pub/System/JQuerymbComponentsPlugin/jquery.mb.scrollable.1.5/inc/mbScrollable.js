/*
 *         mbScrollable, developed by Matteo Bicocchi on JQuery
 *        © 2002-2009 Open Lab srl, Matteo Bicocchi
 *			    www.open-lab.com - info@open-lab.com
 *       	version 1.5
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
      dir:"orizontal",
      width:950,
      elementsInPage:4,
      elementMargin:2,
      shadow:false,
      height:"auto",
      controls:"#controls",
      slideTimer:600,
      autoscroll:false,
      scrollTimer:6000
    },

    buildMbScrollable: function(options){

      return this.each (function (){
        this.options = {};
        $.extend (this.options, $.mbScrollable.defaults);
        $.extend (this.options, options);

        var mbScrollable=this;
        var el=this;
        this.isVertical= this.options.dir!="orizontal";
        var controls=$(this.options.controls);
        this.idx=1;
        this.scrollTo=0;
        this.elements= $(this).children();
        this.elements.addClass("scrollEl");
        controls.hide();

        $(this).children().each(function(){$(this).wrap("<div class='SECont'></div>");});
        if (this.options.shadow){
          $(this.elements).css("-moz-box-shadow",this.options.shadow);
          $(this.elements).css("-webkit-box-shadow",this.options.shadow);
        }
        this.elements= $(this).children();
        var eip= this.options.elementsInPage<this.elements.size()?this.options.elementsInPage:this.elements.size();
        if(this.isVertical){
          this.singleElDim= (this.options.height/eip)-this.options.elementMargin;
          $(this.elements).css({marginBottom:this.options.elementMargin, height:this.singleElDim, width:this.options.width});
        }else{
          this.singleElDim= (this.options.width/eip)-this.options.elementMargin;
          $(this.elements).css({marginRight:this.options.elementMargin, width:this.singleElDim, display:"inline-block" }); //float:"left"
        }
        this.elementsDim= (this.singleElDim*this.elements.size())+(this.options.elementMargin*this.elements.size());
        this.totalPages= Math.ceil(this.elements.size()/this.options.elementsInPage);

        var adj= $.browser.safari && el.options.elementsInPage>2?this.options.elementMargin/(this.options.elementsInPage):0;

        if(this.isVertical)
          $(mbScrollable).css({overflow:"hidden", height:this.options.height-adj,width:this.options.width, paddingRight:5, position:"relative"});
        else
          $(mbScrollable).css({overflow:"hidden", width:this.options.width-adj,height:this.options.height,paddingBottom:5, position:"relative"});

       var mbscrollableStrip=$("<div class='scrollableStrip'/>").css({width:this.elementsDim, position:"relative"});
        $(this.elements).wrapAll(mbscrollableStrip);
        this.mbscrollableStrip=$(this).find(".scrollableStrip");
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
        setTimeout(function(){
          $(".scrollEl").fadeIn();
        },1000);
        $(mbScrollable).mbManageControls();
      });
    },
    mbNextPage: function(){
      var el= $(this).get(0);
      if(el.idx==el.totalPages){
        $(this).mbManageControls();
        return;
      }

      var adj=  $.browser.safari && el.options.elementsInPage>2?el.options.elementMargin/el.options.elementsInPage:0;

      el.scrollTo-=((el.singleElDim+el.options.elementMargin)*el.options.elementsInPage)-adj;

      if (el.isVertical){
        if ((el.scrollTo<-el.elementsDim+el.options.height))
          el.scrollTo=-el.elementsDim+el.options.height;
        $(el.mbscrollableStrip).animate({marginTop:el.scrollTo},el.options.slideTimer);
      }else{
        if ((el.scrollTo<-el.elementsDim+el.options.width))
          el.scrollTo=-el.elementsDim+el.options.width;
        $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
      }
      el.idx+=1;
      $(this).mbManageControls();
    },
    mbPrevPage: function(){
      var el= $(this).get(0);
      if(el.idx==1){
        $(this).mbManageControls();
        return;
      }
      var adj=  $.browser.safari && el.options.elementsInPage>2?el.options.elementMargin/el.options.elementsInPage:0;

      el.scrollTo+=((el.singleElDim+el.options.elementMargin)*el.options.elementsInPage)+adj;

      if (el.isVertical){
        if (el.scrollTo>=0) el.scrollTo=0;
        $(el.mbscrollableStrip).animate({marginTop:el.scrollTo},el.options.slideTimer);
      }else{
        if (el.scrollTo>=0) el.scrollTo=0;
        $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
      }
      el.idx-=1;
      $(this).mbManageControls();
    },
    mbFirstPage: function(){
      var el= $(this).get(0);
      el.scrollTo=0;
      if (el.isVertical){
        $(el.mbscrollableStrip).animate({marginTop:el.scrollTo},el.options.slideTimer);
      }else{
        $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
      }
      el.idx=1;
      $(this).mbManageControls();
      $(el).mbStopAutoscroll();
    },
    mbLastPage: function(){
      var el= $(this).get(0);
      if (el.isVertical){
        el.scrollTo=-el.elementsDim+el.options.height;
        $(el.mbscrollableStrip).animate({marginTop:el.scrollTo},el.options.slideTimer);
      }else{
        el.scrollTo=-el.elementsDim+el.options.width;
        $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
      }
      el.idx=el.totalPages;
      $(this).mbManageControls();
      $(el).mbStopAutoscroll();
    },
    mbPageIndex: function(){
      var el= $(this).get(0);
      var controls=$(el.options.controls);
      var pages=controls.find(".pageIndex");
      if (pages){
        function getPage(i){
          el.scrollTo=-((el.singleElDim+el.options.elementMargin)*(el.options.elementsInPage*(i-1)));
          if(el.isVertical){
            if (el.scrollTo<-el.elementsDim+el.options.height)
              el.scrollTo=-el.elementsDim+el.options.height;
            $(el.mbscrollableStrip).animate({marginTop:el.scrollTo},el.options.slideTimer);
          }else{
            if (el.scrollTo<-el.elementsDim+el.options.width)
              el.scrollTo=-el.elementsDim+el.options.width;
            $(el.mbscrollableStrip).animate({marginLeft:el.scrollTo},el.options.slideTimer);
          }
          el.idx = Math.floor(i);
          $(el).mbManageControls();
        }
        var n=0;
        for(var i=1;i<=el.totalPages;i++){
          n++;
          var p=$("<span class='page'> "+n+" <\/span>").bind("click",function(){
            getPage($(this).html());
            $(el).mbStopAutoscroll();
          });
          pages.append(p);
        };
      }
    },
    mbAutoscroll:function(){
      var dir= "next";
      var el= $(this).get(0);

      if(el.autoscroll) return;
      var timer=el.options.scrollTimer;
      el.autoscroll = true;
      el.auto = setInterval(function(){
        dir= el.idx==1?"next":el.idx==el.totalPages?"prev":dir;
        if(dir=="next")
          $(el).mbNextPage();
        else
          $(el).mbPrevPage();
      },timer);
      $(el).mbManageControls();
    },
    mbStopAutoscroll: function(){
      var el= $(this).get(0);
      el.autoscroll = false;
      clearInterval(el.auto);
      $(el).mbManageControls();
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
      }else{
        controls.fadeIn();
      }
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