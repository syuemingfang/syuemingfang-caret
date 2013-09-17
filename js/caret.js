/*!

# Caret jQuery Plugin
  a caret plugin for jQuery. 

  CDN: `https://syuemingfang-caret.googlecode.com/git/js/syuemingfang-caret.js`

  [GitHub project](https://github.com/syuemingfang/syuemingfang-caret) [Documentation](http://comment.cxm.tw/?url=https://raw.github.com/syuemingfang/syuemingfang-caret/master/comment.json)

****************************************************************************************************/

/*!

+ Version: 0.1.0.0
+ Copyright © 2013 [Syue](mailto:syuemingfang@gmail.com). All rights reserved.
+ Date: *Thu Aug 29 2013 11:16:29 GMT+0800 (Central Standard Time)*

## Examples
 1. **Standard** [Power by Cinderella](http://html.cxm.tw/?url=https://raw.github.com/syuemingfang/syuemingfang-caret/master/example.html)
 2. **Debug** [Power by jsPipe](http://jspipe.cxm.tw/?url=http://html.cxm.tw/index.php?url=https://raw.github.com/syuemingfang/syuemingfang-caret/master/example.html)

## How to Use
 1. **Setup** include this javascript files in your header.
  + **jQuery**
   `<script src='http://code.jquery.com/jquery-1.8.3.min.js'></script>`
  + **This Plguin**
   `<script src='https://syuemingfang-caret.googlecode.com/git/js/caret.js'></script>`
 2. **Usage**
  + **Format**  This Plugin accepts settings from an object of key/value pairs.
   `$(selector).caret({key: value...})`
  + **Example**
     + `$('button').caret({on: 'click'})`
 3. **Set** copy code from the `<head>` and `</head>` tags and paste it on your page.

        <script>
        $(document).ready(function(){
          //Usage
        });
        </script>

****************************************************************************************************/
;(function($){
 $.fn.caret=function(opt){
  var f=$.fn.caret;
  $.extend(f, {
    version: '0.1.0.2',
    //! 
    //!## Options
    set: {
     on: 'click',  //+ **on**
     wrap: 'on', //+ **wrap**
     wordbreak: false,//+ **wordbreak**  if true, target will word break
     target: null  //+ **target**
    },
    //! 
    //!****************************************************************************************************
    //!## API
    log: function(str){
      //!+ **log(str)** outputs a message to the web console.
      console.log(str)
    },
    text: function(elem, str){
      //!+ **text(elem, str)** text cross browser.
      var i='innerText' in elem ? 'innerText' : 'textContent';
      elem[i]=str;
    }
  }); 
  //! 
  //!****************************************************************************************************
  //!## Function
  var func=function(that, set){
    var initialize=function(){
      //!+ **initialize(that, set)**
      // Declare
      set.wrap != 'auto' ? that[0].setAttribute('wrap', set.wrap) : '';
      // Constructor
      that.on(set.on, function(){
        var pos=getPos(that);
        setPos.call(this, {obj: set.target, pos: pos});
      });
    }
    var getPos=function(obj){
      //!+ **getPos(obj)** Get Position
      // Declare
      var arr=obj.val().split('');
      var arr_hei=[];
      var arr_wid=[];      
      var w=0;
      var h=0;
      var start=0;
      var mir={
        obj: null,
        hei: 0,
        css: [ 
          'width', 'box-sizing', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 
          'font-family', 'font-size', 'font-style', 'font-variant', 'font-weight',
          'white-space', 'word-wrap', 'word-break',
          'word-spacing', 'letter-spacing', 'line-height', 'text-decoration', 'text-indent', 'text-transform', 
          'direction', 'flex-direction',
          '-webkit-appearance', '-webkit-rtl-ordering', '-webkit-user-select', '-webkit-writing-mode'
        ]
      };
      var mirror=mir.obj;
      var css=[];
      var style=null;
      // Constructor
      if(set.wordbreak == false){
        $(that).css({
          'word-wrap': 'break-word',
          'word-break': 'break-all'
        });
      }
      var carset=getCaret.call(this, {obj: obj[0]});
      mirror=document.createElement('div');
      document.body.appendChild(mirror);;
      set.wrap == 'on' ? $(mirror).css('overflow-x', 'hidden') : ''
      for(var i=0; i < mir.css.length; i++){
        $(mirror).css(mir.css[i], $(obj).css(mir.css[i]));
      }
      if($(mirror).css('white-space') == 'normal') $(mirror).css('white-space', 'pre')
      $(mirror).css({
        'position': 'absolute',
        'overflow-y': 'scroll'
      }); 
      // Get Height
      var mir_hei=$(mirror).height();
      var hei=[];
      for(var i=-1; i < carset; i++){
          arr_hei.push(arr[i+1]);
          $.fn.caret.text(mirror, arr_hei.join(''))
          if(mir_hei != $(mirror).height()){
            mir_hei=$(mirror).height();
            hei[hei.length]=$(mirror).height();
            start=arr[i+1] == "\n" ? i : i+1;
          }
      }
      var h=hei.length-2 < 0 ? 0 : hei[hei.length-2];
      // Get Width
      for(var i=start; i < carset; i++){
         arr_wid.push(arr[i]);
      }
      $.fn.caret.text(mirror, arr_wid.join(''));
      $(mirror).width('auto')
      w=$(mirror).width();
      document.body.removeChild(mirror);
      return {
        x: obj.offset().left+w-obj.scrollLeft()+'px',
        y: obj.offset().top+h-obj.scrollTop()+'px'
      }
    }
    var setPos=function(){
      //!+ **setPos()** Set Position
      //!  **obj** **pos**
      // Declare
      var opt=arguments[0];
      // Constructor
      $(opt.obj).css({
        'left': opt.pos.x,
        'top': opt.pos.y
      });
    }
    var getCaret=function(){
      //!+ **getCaret()** Get Caret
      //!  **obj**
      // Declare
      var opt=arguments[0];
      if(opt.obj.selectionStart){
        // Chrome, Firefox
        return opt.obj.selectionStart;
      } else if(!document.selection){
        return 0;
      } else{
        // IE 
        var c='\001';
        var sel=document.selection.createRange();
        var dul=sel.duplicate();
        var len=0;
        dul.moveToElementText(opt.obj);
        sel.text=c;
        var d=dul.text.replace(/\n/g, '');
        len=d.indexOf(c);
        sel.moveStart('character', -1);
        sel.text='';
        return len;     
      }
    }
    initialize();
  }
  return this.each(function(){ 
    var set=$.extend(f.set, opt);
    func($(this), set);
  });
 }
})(jQuery);