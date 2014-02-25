/**
 * Created by fiffy on 14-2-25.
 */

(function(window,$){
    function MainControl(){
        var _this=this;
        this.init();
        return _this;
    }
    MainControl.prototype.init=function(){
        var _this=this;
        _this.config={};
        //初始化iscroll
        _this.initIscrollList();
        _this.attachAction();
        _this.initConfig();


        //绑定框架和默认时间禁止
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        window.addEventListener('load', function() {
            FastClick.attach(document.body);
        }, false);


    };

    MainControl.prototype.initConfig=function(){
        //记录tag标签数据
        var tags=$("#home-nav").children("li");
        this.config.tagTitle={
            taking_wrapper:tags.eq(0).text(),
            friend_wrapper:tags.eq(1).text(),
            game_wrapper:tags.eq(2).text(),
            setting_wrapper:tags.eq(3).text()
        };
    };

    MainControl.prototype.initIscrollList=function(){
        /*
         * taking_wrapper用户对话列表
         * friend_wrapper好友列表
         * game_wrapper游戏列表
         * setting_wrapper设置列表
         * session_wrapper对话内容列表
         */
        var _this=this;
        _this.iscrollWarpper={};


        _this.iscrollWarpper.taking_wrapper = new IScroll('#taking_wrapper', {
            scrollbars: 'custom',
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            tap:true
        });

        _this.iscrollWarpper.friend_wrapper = new IScroll('#friend_wrapper', {
            scrollbars: 'custom',
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            tap:true
        });
        _this.iscrollWarpper.game_wrapper = new IScroll('#game_wrapper', {
            scrollbars: 'custom',
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            tap:true
        });
        _this.iscrollWarpper.setting_wrapper = new IScroll('#setting_wrapper', {
            scrollbars: 'custom',
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            tap:true
        });
        _this.iscrollWarpper.session_wrapper=new IScroll("#session_wrapper",{
            scrollbars: 'custom',
            interactiveScrollbars:true,
            shrinkScrollbars:'scale',
            fadeScrollbars:true
        });
    };
    MainControl.prototype.attachAction=function(){
        var _this=this;
        //绑定 tag切换
        var tagId;
        for(var nav_item=0;nav_item<4;nav_item++){

            switch (nav_item){
                case 0:
                    tagId="taking_wrapper";
                    break;
                case 1:
                    tagId="friend_wrapper";
                    break;
                case 2:
                    tagId="game_wrapper";
                    break;
                case 3:
                    tagId="setting_wrapper";
                    break;

            }

            $("#home-nav li").eq(nav_item).on('click', '',tagId, function(e){_this.changeTag(event.data) });
        }


    };

    //对外接口

    //切换tag
    MainControl.prototype.changeTag=function(tagID){
        var allWarpper=$("#mainPage .wrapper");
        allWarpper.hide();
        $("#"+tagID).show();
        this.iscrollWarpper[tagID].refresh();
        $("#mainPage .header").text(this.config.tagTitle[tagID]);
    };

    if(!window.MainContorl){
        window.MainControl=new MainControl();
    }

})(window,Zepto);