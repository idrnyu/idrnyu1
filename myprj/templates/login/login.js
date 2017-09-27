angular.module('starter.controllers', [])
	// 登入
	.controller('LoginController', ["$scope", "ajax", "$state", "modal", "REG", "$interval", "$timeout", "$ionicPopup", function($scope, ajax, $state, modal, REG, $interval, $timeout, $ionicPopup) {

		// 登入
		$scope.user = {
			password: localStorage.getItem("password"),
			username: localStorage.getItem("username")
		};
		$scope.subimt = function() {

			if(!REG.isMobile($scope.user.username)) {
				modal.loading('请输入正确的手机号码', 1500);
			} else if(!$scope.user.password || !$scope.user.username) {
				modal.loading('请输入正确的用户名和密码', 1500);
				return
			}
			ajax.post("/login", $scope.user, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();

					localStorage.setItem("upid", data.data.id);
					localStorage.setItem("token", data.data.token);
					localStorage.setItem("username", $scope.user.username);
					localStorage.setItem("password", $scope.user.password);
					//guo
					//session数据  暂时取消此方法
					//					$.ajax({
					//						type:"post",
					//						url:"http://platform.kuaibeikj.com/kuaibei//querySessionId",
					//						data:"",
					//						success:function(data){
					//							localStorage.setItem("sessionId", data);
					//						}
					//					});
					var tokenKeyValue = localStorage.getItem("token");
					var upid = localStorage.getItem("upid");
					_saber = {
						partnerId: "kuaibeikj",
						tokenKey: tokenKeyValue
					};
					var aa = document.createElement('script');
					aa.async = true;
					aa.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'df.baiqishi.com/static/webdf/saber.js?t=' + (new Date().getTime() / 3600000).toFixed(0);
					var bb = document.getElementsByTagName('script')[0];
					bb.parentNode.insertBefore(aa, bb);

					//首页首次登陆调用后台服务器的白骑士接口 目前设置延时数据调用为3000ms  -----
					$timeout(function() {
						$.ajax({
							type: "post",
							url: 'http://platform.kuaibeikj.com/kuaibei//baiqishi/login',
							data: {
								tokenKey: tokenKeyValue,
								uid: upid
							},
						});
					}, 3000);

					$state.go('tab.index'); //跳转

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);
		};
		// 添加回车登录控制器  gong
		$scope.enterSubimt = function(ev) {
			var keycode = window.event ? ev.keyCode : e.which;
			if(keycode == 13) {
				$scope.subimt();
			}
		}
		// 注册
		$scope.json = {
			"code": "",
			"userName": "",
			"mobile": "",
			"password": "",
			"goodsType": "",
			"activityCode": ""

		};
		// 重获验证码
		$scope.canClick = false;
		$scope.description = "获取验证码";
		var second = 59;
		var timerHandler;
		$scope.getTestCode = function() {
			if(!REG.isMobile($scope.json.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);
				return
			}
			ajax.post("/api/sms/send", {
				"apkind": "register",
				"minute": "5",
				"mobile": $scope.json.mobile
			}, function(data) {
				if(data.basic.status == 1) {
					timerHandler = $interval(function() {
						if(second <= 0) {
							$interval.cancel(timerHandler);
							second = 59;
							$scope.description = "获取验证码";
							$scope.canClick = false;
						} else {
							$scope.description = second + "s后重发";
							second--;
							$scope.canClick = true;
						}
					}, 1000)
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);
		};

		$scope.serverSideList2 = [{
			text: "瓷砖地板",
			value: "瓷砖地板"
		}, {
			text: "厨房卫浴",
			value: "厨房卫浴"
		}, {
			text: "墙面材料",
			value: "墙面材料"
		}, {
			text: "门窗装饰",
			value: "门窗装饰"
		}, {
			text: "灯饰照明",
			value: "灯饰照明"
		}, {
			text: "家用电器",
			value: "家用电器"
		}, {
			text: "家居家具",
			value: "家居家具"
		}, {
			text: "装饰公司",
			value: "装饰公司"
		}, ];
		$scope.showselect = function() {
			html = '<ion-radio ng-repeat="item in serverSideList2" ng-value="item.value" ng-model="json.clientSide" ng-change="serverSideChange(item)" name="server-side">{{ item.text }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '关注类型',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		// 关闭弹窗
		$scope.serverSideChange = function() {
			$scope.myPopup.close();
		};

		var htmlEl = angular.element(document.querySelector('html'));
		htmlEl.on('click', function(event) {
			if(event.target.nodeName === 'HTML') {
				if($scope.myPopup) { //myPopup即为popup
					$scope.myPopup.close();
				}
			}
		});

		$scope.ac = {
			isChecked: true
		};
		$scope.register = function() {

			if(!REG.isMobile($scope.json.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);
				return
			} else if(!REG.isPwd($scope.json.password)) {
				modal.loading("请输入6-32位登录密码", 1500);
				return
			} else if(!$scope.json.code) {
				modal.loading("请输入验证码", 1500);
				return
			} else if($scope.ac.isChecked === false) {
				modal.loading("请同意并阅读相关注册协议", 1500);
				return
			}
			ajax.post("/register", $scope.json, function(data) {

				if(data.basic.status == 1) {

					modal.loading("注册成功，立即登入", 1500);
					$timeout(function() {
						location.reload();
					}, 1000);

					$scope.logintoactivity = "1";
					localStorage.setItem("logintoactivity", $scope.logintoactivity);

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});
		}

	}])