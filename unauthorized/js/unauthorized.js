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

    $(".paddingTopX").height($(".navbar").height());

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

    $(".selectBox").click(function(){
        // $(".selectlist").slideToggle();
        if($(".selectlist").hasClass("displaynone")){
            $(".selectlist").removeClass("displaynone");
        }else{
            $(".selectlist").addClass("displaynone");
        }
    })


    $(".selectlist-li").click(function(){
        $(".refundadd").hide();
        $(".s-letter").hide();
        var nameStr = ".refundadd" + $(this).index();
        var slStr = ".s-" + $(this).index();
        $(nameStr).show();
        $(slStr).show();
        if($(".enterIpt").hasClass("displaynone")){
            $(".enterIpt").show();
        }else{
            $(".enterIpt").hide();
        }
    })

    $(".dw-btn").click(function(){
        window.location.href = "http://www.apollochain.io/download.html";
    })

    function setEcharts() {
        var dom = document.getElementById("bing-box");
        console.log(3333, dom);
          var myChart = echarts.init(dom);
          var app = {};
          option = null;
          app.title = '环形图';

          option = {
              tooltip: {
                  trigger: 'item',
                  formatter: "{a} <br/>{b}: {c} ({d}%)"
              },
              legend: {
                  orient: 'vertical',
                  x: 'left'
              },
              graphic: {
                  type: 'image',
                  left: 'center',
                  top: 'middle',
                  x: 0,
                  y: 10,
                  style: {
                      image: '',
                      width: 205,
                      height: 205

                  }
              },
              animationDuration: 0,
              series: [
                  {
                      type:'pie',
                      radius: ['27%', '65%'],
                      avoidLabelOverlap: false,
                      startAngle: 70,
                      hoverOffset: 25,
                      selectedOffset: 25,
                      label: {
                          normal: {
                              show: true,
                              position: 'inside',
                              color: '#fff',
                              fontSize: '24',
                              fontWeight: 'bold'
                          },
                          emphasis: {
                              show: true,
                              textStyle: {
                                  fontSize: '24',
                                  fontWeight: 'bold'
                              }
                          }
                      },
                      labelLine: {
                          normal: {
                              show: false
                          }
                      },
                      data:[
                          {
                            value:40,
                            name: '40%',
                            title: 'Private Equity + ICO (40%)',
                            description: 'the project plans to use 40% APL to complete its early financing for fulfilling most of the starting work of the project, including but not limited to: micro-grid pilot, micro-grid expansion test, smart metre subsequent R&D, construction of power station and grids, establishment of the trading platform, etc. The project is expected to use this 40% APL for a total of 3-round-financing covers Pre-ICO, Private Equity and ICO.',
                            itemStyle:{
                                normal:{
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#5B72FF' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#2339C1' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }

                                }
                            }
                          },
                          {
                              value:10,
                              name: '10%',
                              title: 'Community Rewards (10%):',
                              description: "10% APL is allocated to building the APOLLOCHAIN's project community for encouraging more followers to join the community and participate in the project, as well as all types of contributions to the APOLLOCHAIN project, which are rewarded based on the nature and volume of each contribution.",
                            itemStyle:{
                                normal:{
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#33A5FE' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#1C5EE2' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }

                                }
                            }
                          },
                          {
                              value:15,
                              name: '15%',
                              title: 'Marketing (15%):',
                              description: '15% APL of the project is for marketing and promotion. Electricity trading platform requires sizable power supply & demand parties to participate in transactions in order to ensure the healthy and orderly conduct of the trading activities. Therefore, 15% of APL will be used for marketing of the APOLLOCHAIN project.',
                                itemStyle:{
                                    normal:{
                                        color: {
                                            type: 'linear',
                                            x: 0,
                                            y: 0,
                                            x2: 0,
                                            y2: 1,
                                            colorStops: [{
                                                offset: 0, color: '#5D39C3' // 0% 处的颜色
                                            }, {
                                                offset: 1, color: '#5690FF' // 100% 处的颜色
                                            }],
                                            globalCoord: false // 缺省为 false
                                        }

                                    }
                                }
                            },
                          {
                            value:5,
                            name: '5%',
                            title: 'Foundation (5%):',
                            description: 'the project plans to use 5% APL for establishing the APL foundation which has the main role of investing the new energy and blockchain related companies via this portion of APL, with a view to encouraging the R&D and application of the new energy and blockchain industries. APOLLOCHAIN accordingly will continue to foster and shape its business format.',
                            itemStyle:{
                                normal:{
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#FF7600' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#FB8B8B' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }

                                }
                            }
                          },
                          {
                              value:30,
                              name: '30%',
                              title: 'Founding Team (30%):',
                              description: 'the project plans to retain 30% APL within the founding team in both China and Australia for the sake of controlling the liquidity during the electricity trading process. This part of APL will be gradually unlocked in batches after the unlock conditions are triggered which ensures the power supply capacity can be increased to a certain extent, while the APL can still maintain the electricity trade within a stable price range.',
                            itemStyle:{
                                normal:{
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#FD5590' // 0% 处的颜色
                                        }, {
                                            offset: 1, color: '#F86D68' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }

                                }
                            }
                          }
                      ]
                  }
              ]
          };
          ;
          if (option && typeof option === "object") {
              myChart.setOption(option, true);
              window.onresize = myChart.resize;
          }
          myChart.on('click', function (params) {
              var title = params.data.title;
              var description = params.data.description;
              $('.change-wrap .box-right .des-wrap').find('h3').html(title);
              $('.change-wrap .box-right .des-wrap').find('p').html(description);
          });
          myChart.on('mouseover', function (params) {
              var title = params.data.title;
              var description = params.data.description;
              $('.change-wrap .box-right .des-wrap').find('h3').html(title);
              $('.change-wrap .box-right .des-wrap').find('p').html(description);
          });
    }
    // setEcharts();
    function setWidth() {
        var _width = $(window).width();
        if(_width < 705) {
            var _box_width = $('.all-container .bing-wrap .box').width();
            console.log('宽度', _box_width);
            $('.all-container .bing-wrap .box').find('.box-left').width(_box_width);
            $('.all-container .bing-wrap .box').find('.box-left').height(_box_width);
            $('.all-container .bing-wrap .box .canvas-wrap').find('div').width(_box_width);
            $('.all-container .bing-wrap .box .canvas-wrap').find('div').height(_box_width);
            $('.all-container .bing-wrap .box .canvas-wrap').find('canvas').width(_box_width);
            $('.all-container .bing-wrap .box .canvas-wrap').find('canvas').height(_box_width);

        }
    }
    setWidth();
    window.onresize = function(){
        $(".paddingTopX").height($(".navbar").height());
        // setWidth();
    }

    function countTime() {
        //获取当前时间
        var date = new Date();
        var now = date.getTime();
        //设置截止时间
        var str = "2018/6/14 00:00:00";
        var endDate = new Date(str);
        var end = endDate.getTime();

        //时间差
        var leftTime = end-now;
        //定义变量 d,h,m,s保存倒计时的时间
        var d,h,m,s;
        if (leftTime >= 0) {
            d = Math.floor(leftTime/1000/60/60/24);
            h = Math.floor(leftTime/1000/60/60%24);
            m = Math.floor(leftTime/1000/60%60);
            s = Math.floor(leftTime/1000%60);
        }
        //将倒计时赋值到div中
        if(d < 10) {
            $('.time-wrap .days h3').html('0' + d);
        }else {
            $('.time-wrap .days h3').html( d);
        }
        if(h < 10) {
            $('.time-wrap .hours h3').html('0' + h);
        }else {
            $('.time-wrap .hours h3').html(h);
        }
        if(m < 10) {
            $('.time-wrap .mins h3').html('0' + m);
        }else {
            $('.time-wrap .mins h3').html(m);
        }
        if(s < 10) {
            $('.time-wrap .secs h3').html('0' + s);
        }else {
            $('.time-wrap .secs h3').html(s);
        }

        //递归每秒调用countTime方法，显示动态时间效果
        setTimeout(countTime,1000);

    }
    countTime();
    setEcharts();
})
