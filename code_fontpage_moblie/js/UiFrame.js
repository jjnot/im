/**
 * Created by fiffy on 14-2-11.
 * The Sample functions you can use in web app
 * 依赖于zepto.js
 * 精简版
 */

(function(window, $){

    var UIFrame = function () {
        var _this = this;
        _this.init();
        return _this;
    };


    UIFrame.prototype={
        init:function(){
            var _this=this;
            initAlertBlock();
            _this.windowWidth=$(window).width();
            _this.windowHeight=$(window).height();
            _this.alertBlock=$("#_UiFrame_alertBlock");
        },


        /*  函数作用：显示提示
         *  config:{
         *  delay: 动画延迟,
         *  keepTime:提示保留时间
         *  callback:提示动画消失后回调函数
         *  }
         */
        alert:function(msg,config){
            var _this=this;
            var windowWidth=_this.windowWidth;
            var windowHeight=_this.windowHeight;
            var block=_this.alertBlock;
            if(!config){config={}}
            block.show();
            block.text(msg);
            var width=block.width();
            var height=block.height();
            block.css("left",(windowWidth-width)/2);
            block.css("top",(windowHeight-height)/2);
            var delay=config.delay||250;
            var keepTime=config.keepTime||600;
            block.css("-webkit-transition",delay+"ms"+" opacity");
            block.css("transition",delay+"ms"+" opacity");
            block.css("opacity",1.0);
            window.setTimeout(function(){
                block.css("opacity",0);
                window.setTimeout(function(){
                     block.hide();
                     if(config.callback){
                     config.callback();
                     }
                },delay);
            },delay+keepTime);
        },

        /*  函数作用：显示提示,不消失
         *  config:{
         *  delay: 动画延迟
         *  }
         */
        alertLast:function(msg,config){
            var _this=this;
            if(!config){config={}}
            var windowWidth=_this.windowWidth;
            var windowHeight=_this.windowHeight;
            var block=_this.alertBlock;
            block.show();
            block.text(msg);
            var width=block.width();
            var height=block.height();
            block.css("left",(windowWidth-width)/2);
            block.css("top",(windowHeight-height)/2);
            var delay=config.delay||250;
            block.css("-webkit-transition",delay+"ms"+" opacity");
            block.css("transition",delay+"ms"+" opacity");
            block.css("opacity",1.0);
        },

        /*  函数作用：显示消失,不消失
         *  config:{
         *  delay: 动画延迟
         *  }
         */
        hideAlert:function(config){
            var _this=this;
            if(!config){config={}}
            var block=_this.alertBlock;
            var delay=config.delay||250;
            block.css("-webkit-transition",delay+"ms"+" opacity");
            block.css("transition",delay+"ms"+" opacity");
            block.css("opacity",0);
            window.setTimeout(function(){
                block.hide();
                if(config.callback){
                    config.callback();
                }
            },delay);
        }

    };
    /*
     * 非接口
     * 初始化函数区
     */

    function initAlertBlock(){
        if(!document.getElementById("_UiFrame_alertBlock")){
            var alertDivHtml='<div id="_UiFrame_alertBlock"></div>';
            $("body").append(alertDivHtml);
            $("#_UiFrame_alertBlock").attr("style","display:none;z-index:99;word-wrap: break-word;word-break: normal;opacity:0;background-color:rgba(0,0,0,0.9);color: #ffffff;position: fixed;top: 40%;width: auto;border-radius: 4px;max-width: 70%;left: 20%;display: block;padding-left: 10px;padding-right: 10px;padding-top: 15px;padding-bottom: 15px;text-align: center;")
        }
    }

    if(!window.UiFrame){
        window.UiFrame=new UIFrame();
    }



})(window,Zepto);