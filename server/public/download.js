$(function(){
    // console.log("hello world")
    // let flowPic = document.querySelector(".flow-pic");
    // changeFlowHeight();
    //
    // window.onresize = function(){
    //     changeFlowHeight();
    // }
    //
    // function changeFlowHeight(){
    //     flowPic.style.height = (flowPic.offsetWidth)*403/1160 + "px";
    // }

    // $(window).scroll(function(event){
    //     if($(window).scrollTop() < 300){
    //         if($(".navbar").hasClass("navbar-light")){
    //             $(".navbar").addClass("navbar-dark").removeClass("navbar-light");
    //         }
    //     }else{
    //         if($(".navbar").hasClass("navbar-dark")){
    //             $(".navbar").addClass("navbar-light").removeClass("navbar-dark");
    //         }
    //     }
    //
    //
    // });

    $(".navbar-slideShow").on("click",function(){
        $(".slideRight").addClass("in");
        $(".mock").addClass("show");
    })

    $(".mock").on("click",function(){
        $(".slideRight").removeClass("in");
        $(".mock").removeClass("show");
    })

    $(".teamlink").on("click",function(){
        $(".slideRight").removeClass("in");
        $(".mock").removeClass("show");
    })
    $(".paddingTopX").height($(".navbar").height())
    window.onresize = function(){
        $(".paddingTopX").height($(".navbar").height())
    }
    var browser = {
        versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }(),
        language:(navigator.browserLanguage || navigator.language).toLowerCase()
    }
    if(!browser.versions.mobile){
        $(".banner-btn").show();
        $(".switchon").show();
    }

})
