Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    }
    // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.seller', 'ionic-citypicker', 'ngFileUpload', 'ionic-datepicker', 'ionic-img-lazy-load', 'ionicLazyLoad'])

.run(function($ionicPlatform, $rootScope, $state, $ionicHistory, $ionicPopup) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)默认情况下隐藏附件栏（删除此显示在键盘上方的附件栏形式输入）
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        $rootScope.Uploadurl = "http://platform.kuaibeikj.com/kuaibei/api/uploadImg";

        $rootScope.myBack = function(t, e, l) {
            if (null !== $ionicHistory.backView() && e) {
                var r = $ionicHistory.backView();
                "tab.errPage" == r.stateName ? $state.go(t, l) : $ionicHistory.goBack()
            } else {
                $state.go(t, l)
            }
        };
        //需要登录的页面
        var needLoginView = ["tab.index", "tab.personal"];
        //var needLoginView = ["tab.index"];
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            var stateId = toState.name;
            if (needLoginView.contains(stateId)) {
                //console.log("需要登录后访问:"+stateId);
                if (!localStorage.getItem("token")) {
                    event.preventDefault();
                    $state.go("login");
                }
            }
        });
        //移除启动加载
        document.body.removeChild(document.getElementById("pinner"));
    });


    function GDgetGEO(){
        //加载地图，调用浏览器定位服务
        var error1 = 0;
        $rootScope.myAddress='定位中...'
        map = new AMap.Map('', {
            resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition: 'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
            AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
        });
        //解析定位结果
        function onComplete(data) {
            console.log(data);
            $rootScope.myAddress=data.formattedAddress;
            alert(data.formattedAddress);
            var str = ['定位成功'];
            str.push('经度：' + data.position.getLng());
            str.push('纬度：' + data.position.getLat());
            if (data.accuracy) {
                str.push('精度：' + data.accuracy + ' 米');
            } //如为IP精确定位结果则没有精度信息
            str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
            // document.getElementById('tip').innerHTML = str.join('<br>');
            $rootScope.$apply(this.myAddress);
            var error1 = 0;  //
        }
        //解析定位错误信息
        function onError(data) {
            $rootScope.myAddress = '定位失败';
            $rootScope.$apply(this.myAddress);
            var error1 = 1;
        }
        return error1;
    }
    
    // 如果高德定位失败 使用 QQ定位
    if(GDgetGEO()){  
        $rootScope.myAddress='定位中...';
        var geolocation = new qq.maps.Geolocation();
        var options = {
            timeout: 5000
        }; //超时设置 
        function getCurLocation() {
            geolocation.getLocation(showPosition, showErr, options); // 精度定位 
        }
        function showPosition(position) {
            console.log(position); // 输出定位结果 
            if(position.addr)
                $rootScope.myAddress=position.addr;
            else
                $rootScope.myAddress=position.city;
            $rootScope.$apply(this.myAddress);
            alert($rootScope.myAddress);
        }
        function showErr() {
            geolocation.getIpLocation(showPosition, showErrOver); // IP定位 粗糙定位 
        }
        function showErrOver() {
            console.log('定位失败');
            $rootScope.myAddress='定位失败';
            $rootScope.$apply(this.myAddress);
        }
        getCurLocation();
    }

    //   backAction();
    //console.log('Thank you for not eating my delicious ice cream cone');  });}var backAction= $ionicPlatform.registerBackButtonAction(function(){  return;}, 401)
    /*
     *主页面显示退出提示框
     */
    $ionicPlatform.registerBackButtonAction(function(e) {

        e.preventDefault();

        //function showConfirm() {
        //  var confirmPopup = $ionicPopup.confirm({
        //    title: '<div align="left"><i class="icon ion-android-alert assertive"><strong>&nbsp;提示：</strong></i></div>',
        //    template: '<div><strong>您确定要退出应用吗?</strong></div>',
        //    okText: '退出',
        //    cancelText: '取消'
        //  });
        //
        //  confirmPopup.then(function (res) {
        //    if (res) {
        //      ionic.Platform.exitApp();
        //
        //    } else {
        //      // Don't close
        //
        //    }
        //  });
        //}
        //alert("back?");
        // Is there a page to go back to?
        if ($ionicHistory.backView()) {
            // Go back in history
            //$ionicHistory.goBack();
            //$rootScope.$ionicHistory.backView.goBack();

            $ionicHistory.goBack();
            $ionicPopup.close();
        }
        //e.preventDefault();
        return false;

    }, 101);

})

//$locationProvider.html5Mode(true);
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    $ionicConfigProvider.views.swipeBackEnabled(false);

    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/system/tabs.html'
    })

    // Each tab has its own nav history stack:

    .state('tab.index', {
        url: '/index',
        views: {
            'index': {
                templateUrl: 'templates/index.html',
                title: '首页',
                controller: 'IndexCtrl'
            }
        }
    })

    .state('tab.seller', {
        url: '/seller',
        views: {
            'seller': {
                templateUrl: 'templates/business/seller.html',
                title: '商家',
                controller: 'SearchCtrl'
            }
        }
    })

    .state('tab.personal', {
            url: '/personal',
            views: {
                'personal': {
                    templateUrl: 'templates/user/personal.html',
                    title: '个人中心',
                    controller: 'UserCtrl'
                }
            }
        })
        //初始登录页面
        .state("login", {
            url: "/login",
            templateUrl: "templates/login/login.html",
            title: '登入注册',
            controller: "LoginController"
        })

    .state("activityRegister", {
        url: "/activityRegister",
        templateUrl: "activityRegister.html",
        title: '用户注册',
        controller: "aRegisterController"
    })

    .state("qrcodeRegister", {
        url: "/qrcodeRegister",
        templateUrl: "qrcodeRegister.html",
        title: '用户注册',
        controller: "qrcodeRegisterController"
    })

    .state("addbank", {
        url: "/addbank",
        templateUrl: "/templates/user/bank/addbank.html",
        title: '添加银行卡',
        controller: "AddbankController"
    })

    .state("bank", {
        url: "/bank",
        templateUrl: "/templates/user/bank/bank.html",
        title: '银行卡',
        controller: "BankController"
    })

    .state("myCoupons", {
        url: "/myCoupons",
        templateUrl: "/templates/user/Coupons/myCoupons.html",
        title: '优惠券',
        controller: "CouponsController"
    })

    .state("invitecodepage", {
        url: "/invitecodepage",
        templateUrl: "/templates/info/invitecodepage.html",
        title: '邀请码',
        controller: "invitecodepageController"
    })

    .state("zscounselor", {
        url: "/zscounselor",
        templateUrl: "/templates/info/zscounselor.html",
        title: '专属顾问',
        controller: "zscounselorController"
    })

    .state("inviterecordpage", {
        url: "/inviterecordpage",
        templateUrl: "/templates/info/inviterecordpage.html",
        title: '邀请记录',
        controller: "inviterecordpageController"
    })

    .state("zsaward", {
        url: "/zsaward",
        templateUrl: "/templates/info/zsaward.html",
        title: '我的奖励',
        controller: "zsawardController"
    })

    .state("zsinfo", {
        url: "/zsinfo",
        templateUrl: "/templates/info/zsinfo.html",
        title: '我的信息',
        controller: "zsinfoController"
    })

    .state("awarddateils", {
        url: "/awarddateils",
        templateUrl: "/templates/info/awarddateils.html",
        title: '奖励明细',
        controller: "awarddateilsController"
    })

    .state("awardwithdraw", {
        url: "/awardwithdraw",
        templateUrl: "/templates/info/awardwithdraw.html",
        title: '奖励提现',
        controller: "awardwithdrawController"
    })

    .state("awarddetailslist", {
        url: "/awarddetailslist/:jlnum",
        templateUrl: "/templates/info/awarddetailslist.html",
        title: '明细记录',
        controller: "awarddetailslistController"
    })

    .state("ptUnpayToDg", {
        url: "/ptUnpayToDg",
        templateUrl: "/templates/info/ptUnpayToDg.html",
        title: '待发奖励',
        controller: "ptUnpayToDgController"
    })

    .state("friendrRequests", {
        url: "/friendrRequests",
        templateUrl: "/templates/user/share/friendrRequests.html",
        title: '好友邀请',
        controller: "friendrRequestsController"
    })

    .state("myShare", {
        url: "/myShare",
        templateUrl: "/templates/user/share/myShare.html",
        title: '我的红包',
        controller: "myShareController"
    })

    .state("discount", {
        url: "/myDiscount",
        templateUrl: "/templates/user/discount/myDiscount.html",
        title: '折扣券',
        controller: "discountController"
    })

    .state("friendpartIn", {
        url: "/friendpartIn/:setinviteCodes",
        templateUrl: "/templates/user/share/friendpartIn.html",
        title: '快贝分期',
        controller: "friendpartInController"
    })

    //.state("loan-details",{
    //  url:"/loan-details/:id",
    //  templateUrl:"/templates/loan-details.html",
    //  title:'贷款详情',
    //  controller:"DetailsController"
    //})

    .state("news", {
            url: "/news",
            templateUrl: "/templates/user/news/news.html",
            title: '消息'
        })
        .state("tips", {
            url: "/tips",
            templateUrl: "/templates/user/news/tips.html",
            title: '消息详情',
            controller: "TipsController",
        })

    .state("borrowing", {
        url: "/myBorrowing",
        templateUrl: "/templates/user/borrowing/myBorrowing.html",
        title: '我要还款',
        controller: "BorrowingController",
    })

    .state("set", {
        url: "/set",
        templateUrl: "/templates/user/setup/set.html",
        title: '设置',
        controller: "SetController",
    })

    .state("aboutUs", {
        url: "/aboutUs",
        templateUrl: "/templates/user/about/aboutUs.html",
        title: '关于我们'
    })

    .state("introduction", {
        url: "/introduction",
        templateUrl: "/templates/user/about/introduction.html",
        title: '产品介绍'
    })

    .state("about", {
            url: "/about_KB",
            templateUrl: "/templates/user/about/about_KB.html",
            title: '关于快贝'
        })
        //用户注册协议
        .state("registerAgreement", {
            url: "/registerAgreement",
            templateUrl: "/templates/login/register/registerAgreement.html",
            title: '注册协议'
        })

    .state("help", {
        url: "/help",
        templateUrl: "/templates/user/help/help.html",
        title: '用户帮助',
        controller: "HelpController",
    })

    // .state("changePayPwd",{
    //     url:"/changePayPwd",
    //     templateUrl:"/templates/user/setup/changePayPwd.html",
    //     title:'修改交易密码',
    //     controller:"ChangePayPwdController",
    //   })

    // .state("changephone",{
    //     url:"/changephone",
    //     templateUrl:"/templates/user/setup/changephone.html",
    //     title:'修改手机号码',
    //     controller:"ChangephoneController",
    //   })
    .state("changepwd", {
            url: "/changepwd",
            templateUrl: "/templates/user/setup/changepwd.html",
            title: '修改登录密码',
            controller: "ChangepwdController",
        })
        // .state("forgetPayPwd",{
        //     url:"/forgetPayPwd",
        //     templateUrl:"/templates/user/setup/forgetPayPwd.html",
        //     title:'找回交易密码',
        //     controller:"forgetPayPwdController",
        //   })
        // .state("setPayPwd",{
        //     url:"/setPayPwd",
        //     templateUrl:"/templates/user/setup/setPayPwd.html",
        //     title:'设置交易密码',
        //     controller:"setPayPwdController",
        //   })

    .state("authentication", {
        url: "/authentication",
        templateUrl: "/templates/info/authentication.html",
        title: '身份认证',
        controller: "authenticationController",
    })

    .state("myAccount", {
        url: "/myAccount",
        templateUrl: "/templates/user/account/myAccount.html",
        title: '我的额度',
        controller: "myAccountController"
    })

    .state("info", {
            url: "/info",
            templateUrl: "/templates/info/info.html",
            title: '身份认证',
            controller: "InfoController",
        })
        .state("information", {
            url: "/information",
            templateUrl: "/templates/info/information.html",
            title: '基本信息',
            controller: "MationController",
        })
        .state("suppleInfo", {
            url: "/suppleInfo",
            templateUrl: "/templates/info/suppleInfo.html",
            title: '辅助信息',
            controller: "SuppleInfoController"
        })

    .state("reput", {
            url: "/reput",
            templateUrl: "/templates/info/reput.html",
            title: '信誉图标',
            // controller:"SuppleInfoController"
        })
        .state("loan-details", {
            url: "/loan-details/:id",
            templateUrl: "/templates/orders/loan-details.html",
            title: '贷款详情',
            controller: "DetailsController"
        })

    .state("kuaibeiWallet", {
        url: "/kuaibeiWallet",
        templateUrl: "/templates/product/kuaibeiWallet.html",
        title: '快贝分期',
        controller: "kuaibeiWalletController"
    })

    // .state("login-id",{
    //     url:"/login-id",
    //     templateUrl:"/templates/login/login-id.html",
    //     title:'身份证登录',
    //     // controller:"SuppleInfoController"
    //   })
    .state("forgetpwd", {
        url: "/forgetpwd",
        templateUrl: "/templates/login/forgetPwd/forgetpwd.html",
        title: '忘记密码',
        controller: "ForgetpwdController"
    })

    .state("upload", {
            url: "/upload",
            templateUrl: "/templates/info/upload.html",
            title: '资料上传',
            controller: "UploadController"
        })
        .state("repayment", {
            url: "/repayment/:id",
            templateUrl: "/templates/user/repay/repayment.html",
            title: '还款',
            controller: "RepaymentController"
        })
        .state("repaylist", {
            url: "/repaylist",
            templateUrl: "/templates/user/repay/repaylist.html",
            title: '还款列表',
            controller: "RepaylistController"
        })
        .state("seller-details", {
            url: "/seller-details/:id",
            templateUrl: "/templates/business/seller-details.html",
            title: '商户详情',
            controller: "sellerDetailsController"
        })
        .state("repay", {
            url: "/repay",
            templateUrl: "/templates/agreement/repay.html",
            title: '协议'
        })

    .state("contract", {
        url: "/contract",
        templateUrl: "/templates/agreement/contract.html",
        title: '合同',
        controller: "contractCtrl"
    })

    .state("borrowCompact", {
        url: "/borrowCompact",
        templateUrl: "/templates/agreement/borrowCompact.html",
        title: '借款额度合同',
        controller: "borrowCompactCtrl"

    })

    .state("ticketUsetext", {
            url: "/ticketUsetext",
            templateUrl: "/templates/user/Coupons/ticketUsetext.html",
            title: '使用说明',
            controller: "ticketUsetextCtrl"
        })
        //添加优惠券
        .state("getActivityCode", {
            url: "/getActivityCode",
            templateUrl: "/templates/user/Coupons/getActivityCode.html",
            title: '添加优惠券',
            controller: "getActivityCodeCtrl"
        })
        .state("discountDirections", {
            url: "/discountDirections",
            templateUrl: "/templates/user/discount/discountDirections.html",
            title: '使用说明'

        })

    .state("insurance", {
            url: "/insurance",
            templateUrl: "/templates/agreement/insurance.html",
            title: '协议'
        })
        .state("pinan", {
            url: "/pinan",
            templateUrl: "/templates/agreement/pinan.html",
            title: '协议'
        })
        .state("audit", {
            url: "/audit/:id",
            templateUrl: "/templates/orders/audit.html",
            title: '审核结果',
            controller: "auditController"
        })
        .state("notice", {
            url: "/notice",
            templateUrl: "/templates/agreement/notice.html",
            title: '协议'
        })
        .state("financing", {
            url: "/financing",
            templateUrl: "/templates/agreement/financing.html",
            title: '融资协议'
        })
        .state('dash', {
            url: '/dash',
            templateUrl: '/a/tab-dash.html',
            controller: 'DashCtrl'
        })
        // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

});
//加载ionic route
angular.module('phonepos', ['ionic', 'route'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});