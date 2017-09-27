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
					$timeout(function(){
		                $.ajax({
							type: "post",
							url: 'http://platform.kuaibeikj.com/kuaibei//baiqishi/login',
							data: {
								tokenKey: tokenKeyValue,
								uid: upid
							},
						});
		           },3000);
					
					
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

	.controller('aRegisterController', ["$scope", "ajax", "$state", "modal", "REG", "$interval", "$timeout", "$ionicPopup", function($scope, ajax, $state, modal, REG, $interval, $timeout, $ionicPopup) {

		$scope.goodsTypes = [
			goods = ""
		];

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
				value: 1,
				checked: false
			}, {
				text: "厨房卫浴",
				value: 2,
				checked: false
			}, {
				text: "墙面材料",
				value: 3,
				checked: false
			}, {
				text: "门窗装饰",
				value: 4,
				checked: false
			}, {
				text: "灯饰照明",
				value: 5,
				checked: false
			},
			{
				text: "家居家具",
				value: 7,
				checked: false
			},
			{
				text: "家用电器",
				value: 6,
				checked: false
			}, {
				text: "装饰公司",
				value: 8,
				checked: false
			}
		];

		$scope.check_val = [];

		$scope.showselect = function() {
			html = '<ion-checkbox ng-repeat="item in serverSideList2" name="test" ng-click="goodsTypestext(item.text ) || goodsTypesvalue(item.value,item.checked ,$index) "  ng-model="item.checked" ng-checked="item.checked" ng-change="serverSideChange(item)" name="server-side">{{ item.text }}</ion-checkbox>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '关注类型',
				scope: $scope,
				//buttons: [{
				//  text: '取消'
				//
				//}],
				buttons: [{
					text: '确定',
					type: 'button-positive',
					onTap: function(e) {

						$scope.json.goodsType = $scope.check_val.join(",");
					}
				}, ]
			});
		};

		$scope.goodsTypes.goods = "请选择关注类型";
		$scope.goodsTypestext = function(text) {
			$scope.goodsTypes.goods = text;
			//$scope.goodsTypesgoods.push(text);
			//console.log(text);
		};

		$scope.goodsTypesvalue = function(value, checked, $index) {

			if(checked == true) {
				$scope.check_val.push(value);
			} else {
				$scope.check_val.splice($index, 1);
			}

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

		$scope.registerlogin = function() {

			$scope.logintoactivity = "1";
			localStorage.setItem("logintoactivity", $scope.logintoactivity);

			$scope.user = {
				password: $scope.json.password,
				username: $scope.json.mobile
			};

			if(!REG.isRealName($scope.json.userName)) {
				modal.loading("请输入正确的姓名", 1500);
				return
			} else if(!REG.isMobile($scope.json.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);

				return
			} else if(!REG.isPwd($scope.json
					.password)) {
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

					ajax.post("/login", $scope.user, function(data) {
						if(data.basic.status == 1) {
							modal.loadingHide();
							//console.log(data)

							localStorage.setItem("token", data.data.token);
							localStorage.setItem("username", $scope.user.username);
							localStorage.setItem("password", $scope.user.password);
							$state.go('tab.index');
						} else {
							modal.loading(data.basic.msg, 1500);
						}
					}, 1);

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});

		};

	}])

	.controller('qrcodeRegisterController', ["$scope", "ajax", "$state", "modal", "REG", "$interval", "$timeout", "$ionicPopup", function($scope, ajax, $state, modal, REG, $interval, $timeout, $ionicPopup) {

		$scope.goodsTypes = [
			goods = ""
		];

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
				value: 1,
				checked: false
			}, {
				text: "厨房卫浴",
				value: 2,
				checked: false
			}, {
				text: "墙面材料",
				value: 3,
				checked: false
			}, {
				text: "门窗装饰",
				value: 4,
				checked: false
			}, {
				text: "灯饰照明",
				value: 5,
				checked: false
			},
			{
				text: "家居家具",
				value: 7,
				checked: false
			},
			{
				text: "家用电器",
				value: 6,
				checked: false
			}, {
				text: "装饰公司",
				value: 8,
				checked: false
			}
		];

		$scope.check_val = [];

		$scope.showselect = function() {
			html = '<ion-checkbox ng-repeat="item in serverSideList2" name="test" ng-click="goodsTypestext(item.text ) || goodsTypesvalue(item.value,item.checked ,$index) "  ng-model="item.checked" ng-checked="item.checked" ng-change="serverSideChange(item)" name="server-side">{{ item.text }}</ion-checkbox>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '关注类型',
				scope: $scope,

				buttons: [{
					text: '确定',
					type: 'button-positive',
					onTap: function(e) {

						$scope.json.goodsType = $scope.check_val.join(",");

					}
				}, ]
			});
		};

		$scope.goodsTypes.goods = "请选择关注类型";
		$scope.goodsTypestext = function(text) {
			$scope.goodsTypes.goods = text;
			//$scope.goodsTypesgoods.push(text);
			//console.log(text);
		};

		$scope.goodsTypesvalue = function(value, checked, $index) {

			if(checked == true) {
				$scope.check_val.push(value);
			} else {
				$scope.check_val.splice($index, 1);
			}

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

		//
		$scope.registerlogin = function() {

			$scope.logintoactivity = "1";
			localStorage.setItem("logintoactivity", $scope.logintoactivity);

			$scope.user = {
				password: $scope.json.password,
				username: $scope.json.mobile
			};

			if(!REG.isRealName($scope.json.userName)) {
				modal.loading("请输入正确的姓名", 1500);
				return
			} else if(!REG.isMobile($scope.json.mobile)) {
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

					ajax.post("/login", $scope.user, function(data) {
						if(data.basic.status == 1) {
							modal.loadingHide();
							//console.log(data)

							localStorage.setItem("token", data.data.token);
							localStorage.setItem("username", $scope.user.username);
							localStorage.setItem("password", $scope.user.password);
							$state.go('tab.index');
						} else {
							modal.loading(data.basic.msg, 1500);
						}
					}, 1);

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});

		};

	}])

	// 首页+下单
	.controller('IndexCtrl', ["$scope", "ajax", "modal", "$ionicSlideBoxDelegate", "$state", "$ionicPopup", "$location", function($scope, ajax, modal, $ionicSlideBoxDelegate, $state, $ionicPopup, $location) {

		//商家
		ajax.post("/api/coupon/queryAllMyCoupons", {}, function(data) {
			//console.log(data)
			if(data.basic.status == 1) {
				//if (!isEmptyObject(data.data)) {
				//
				//}
				if(data.data) {
					//console.log(data);
					$scope.allyiuhuiq = data.data.sjCoupon;
					if(localStorage.getItem("logintoactivity") == "1") {
						if($scope.allyiuhuiq != null) {
							$scope.subactivity = true;
						}

					}
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		$scope.joinactivity = function() {
			$scope.subactivity = false;
			localStorage.removeItem("logintoactivity")
		};

		//额度
		ajax.post("/api/limit/queryLimit", {}, function(data) {
			//console.log("1111111111"+data);
			if(data.basic.status == 1) {

				$scope.Limitlist = data.data;

				if($scope.Limitlist.totalLimit == "0.00") {

					$scope.youLimit = "50000.00";
					$scope.Limitbtntext = "立即激活";
					localStorage.setItem("loanpageid", 1);
				} else {
					$scope.youLimit = $scope.Limitlist.totalLimit;

					$scope.Limitbtntext = "提升额度";   //2017年9月23日15:45:52  未做  只修改显示文字  gong
//					localStorage.setItem("loanpageid", 4);

				}
				//}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		//      $location.path('authentication');
		//localStorage.setItem("loanpageid", id);
		$scope.go_activate = function() {

			if($scope.Limitlist.totalLimit == "0.00") {
				localStorage.setItem("loanpageid", 1);
				$state.go("authentication");
			} else {
//				localStorage.setItem("loanpageid", 4);   // 2017年9月23日16:06:37  未做  提升额度  只修改样式
//				$state.go("authentication");
			}

		};
//审核页面
		var json = {};
		ajax.post("/home", json, function(data) {
			if(data.basic.status == 1) {

				var obj = data.data.messages;
				modal.loadingHide();
				$scope.products = data.data.products;

				//console.log(data.data.products);   ///*******测试  龚宇   注释*******///***//

				$ionicSlideBoxDelegate.loop(true);
				$ionicSlideBoxDelegate.update();
				$scope.productImages = data.data.banners;
				if(obj && obj.isRead == 0) {
					var confirmPopup = $ionicPopup.show({
						title: obj.title,
						template: obj.content,
						buttons: [{
							text: '确定',
							type: 'button-positive',
							onTap: function(e) {
								$location.path('/orders/audit/' + obj.oanOrderId);
//								$location.path('/audit/' + obj.oanOrderId);
							}
						}, ]
					});
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}

		});

		$scope.go_details = function(id, maxAmount, minAmount, defaultAmount) {
			if(!localStorage.getItem("token")) {
				var confirmPopup = $ionicPopup.confirm({
					title: '提示',
					template: '您还没有登录，立即登录',
					buttons: [{
						text: '取消'
					}, {
						text: '登录',
						type: 'button-positive',
						onTap: function(e) {
							$state.go("login");
							return
						}
					}, ]
				});
				return
			}
			//$location.path('/loan-details/'+ id);
			//console.log(id);
			$location.path('authentication');
			localStorage.setItem("loanpageid", id);
			localStorage.setItem("maxAmount", maxAmount);
			localStorage.setItem("minAmount", minAmount);
			localStorage.setItem("defaultAmount", defaultAmount);
		};

		//$scope.zsinfo.salerName = "张樊";
		//查看导购
		$scope.json = {
			"uid": ""
		};
		//$scope.json.uid = localStorage.getItem("uid");
		ajax.post("/api/daogou/queryDaogou", $scope.json, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);

				$scope.zsinfo = data.data;
				$scope.zsinfoid = data.data.id;

				localStorage.setItem("zsinviteCode", data.data.inviteCode)
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		$scope.gotozsmore = function() {

			if($scope.zsinfoid != null) {

				$state.go("zsaward");
			} else {
				$state.go("zscounselor")
			}
		}

	}])

	// 产品详情
	.controller('DetailsController', ["$scope", "ajax", "modal", "$timeout", "$location", "$stateParams", "$ionicPopup", "$state", "$rootScope", "$ionicHistory", "REG", function($scope, ajax, modal, $timeout, $location, $stateParams, $ionicPopup, $state, $rootScope, $ionicHistory, REG, $ionicModal) {
		if(!localStorage.getItem("token")) {
			$state.go("login");
			return
		}

		//元素数据
		$scope.orderlist = {
			'mount': localStorage.getItem("defaultAmount"),
			'maxAmount': localStorage.getItem("maxAmount"),
			'minAmount': localStorage.getItem("minAmount"),
			'month': '',
			'Amount': '',
			'increment': '',
			'repaymentService': '',
			'lifeInsurance': ''
		};

		$scope.$on("$ionicView.beforeEnter", function(event, data) {

			var cacheFlag = localStorage.getItem("cacheFlag");

			if(cacheFlag) {
				//console.log(cacheFlag);
				var cacheData = JSON.parse(cacheFlag);
				$scope.orderlist = cacheData.orderlist;
				$scope.settingsList = cacheData.settingsList;
				$scope.sid = cacheData.sid;
				$scope.sh = cacheData.sh;
				$scope.store = cacheData.store;
				$rootScope.onebank = cacheData.onebank;
				$scope.on = cacheData.on;

				localStorage.removeItem("cacheFlag");
				//console.log("当前是否缓存:"+cacheFlag);
			}

			//console.log("当前是否缓存:"+cacheFlag);
			document.getElementById("volume").setAttribute("max", $scope.orderlist.maxAmount);
		});

		//跳转到银行做一个记录
		$scope.toBank = function() {
			var cacheData = {};
			cacheData.orderlist = $scope.orderlist;
			cacheData.settingsList = $scope.settingsList;
			cacheData.sid = $scope.sid;
			cacheData.sh = $scope.sh;
			cacheData.store = $scope.store;
			cacheData.onebank = $rootScope.onebank;
			cacheData.on = $scope.on;
			//console.log(cacheData);
			localStorage.setItem("cacheFlag", JSON.stringify(cacheData));
			$state.go('bank');
		};
		var json = {
			"amount": $scope.orderlist.mount,
			"id": $stateParams.id
		};
		var timeoutId = null;

		$scope.valFn = function(num) {
			var len = num.length;
			var letnum = num.toString().substring(len - 2);
			if(!REG.isNumber(num)) {
				modal.loading('请输入整数', 1800);
				$scope.orderlist.mount = localStorage.getItem("defaultAmount");
			} else if(parseInt(num) > parseInt($scope.orderlist.maxAmount)) {
				modal.loading('金额不能多于' + $scope.orderlist.maxAmount, 2000);
				$scope.orderlist.mount = localStorage.getItem("defaultAmount");
			} else if(parseInt(num) < parseInt($scope.orderlist.minAmount)) {
				modal.loading('金额不能少于' + $scope.orderlist.minAmount, 2000);
				$scope.orderlist.mount = localStorage.getItem("defaultAmount");
			} else if(letnum != 00) {
				//console.log(num.toString().substring(0,len - 2));
				modal.loading('金额是以100递增', 1800);
				$scope.orderlist.mount = num.toString().substring(0, len - 2) + "00";
			}
			json.amount = $scope.orderlist.mount;
			liList();
		};

		$scope.rangeChange = function() {
			json.amount = $scope.orderlist.mount;
			liList();
		};

		function liList() {
			ajax.post("/api/product/detail", json, function(data) {
				if(data.basic.status == 1) {
					//console.log(data);
					$scope.cplist = data.data.details;
					if($scope.orderlist.month) {
						var newMoney;
						angular.forEach($scope.cplist, function(obj, i) {
							if($scope.orderlist.month == obj.month) {
								newMoney = obj;
							}
						});
						//返回的本金分期金额
						$scope.orderlist.Amount = newMoney.monthRepaymentAmount;
					}

				} else {
					modal.loading(data.basic.msg, 1500);
				}

			});
		}
		//$scope.orderBym = {}
		// 初始化产品列表
		ajax.post("/api/product/detail", json, function(data) {
			if(data.basic.status == 1) {
				//console.log(data.data );
				$scope.cplist = data.data.details;
				$scope.orderlist.lifeInsurance = parseInt(data.data.charges.lifeInsurance);
				$scope.orderlist.repaymentService = parseInt(data.data.charges.repaymentService);
				$scope.orderlist.increment = parseInt($scope.orderlist.repaymentService) + parseInt($scope.orderlist.lifeInsurance);

			} else {
				modal.loading(data.basic.msg, 1500);
			}

		});

		// toggle
		$scope.settingsList = [{
			text: "是否加入寿险计划？",
			url: '#/insurance',
			checked: true
		}, {
			text: "灵活还款及代扣服务",
			url: '#/repay',
			checked: true
		}];
		//console.log(localStorage.getItem("loanpageid"));
		//qianbao
		$scope.kuaibeiwallet = localStorage.getItem("loanpageid");

		if($scope.kuaibeiwallet == "6") {
			$scope.walletshow = true;
		} else if($scope.kuaibeiwallet == "4") {

		}

		$scope.show = function(item, index) {

			if(index == 0) {
				if(item.checked == false) {
					$scope.orderlist.increment = parseInt($scope.orderlist.increment) - parseInt($scope.orderlist.lifeInsurance);
				} else {
					$scope.orderlist.increment = parseInt($scope.orderlist.increment) + parseInt($scope.orderlist.lifeInsurance);
				}
			} else if(index == 1) {
				if(item.checked == false) {
					$scope.orderlist.increment = parseInt($scope.orderlist.increment) - parseInt($scope.orderlist.repaymentService);
				} else {
					$scope.orderlist.increment = parseInt($scope.orderlist.increment) + parseInt($scope.orderlist.repaymentService);
				}
			}

		};

		// 添加样式
		$scope.liClss = function(index, month, monthRepaymentAmount) {
			//console.log(index);
			$scope.on = index;
			$scope.orderlist.month = month;
			$scope.orderlist.Amount = monthRepaymentAmount;
			$scope.choeseordermonth = month;
		};

		// 选择贷款用途
		$scope.sid = {
			clientSide: '请选择贷款用途'
		};

		$scope.serverSideList = [{
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
				text: "家居家具",
				value: "家居家具"
			},
			{
				text: "家用电器",
				value: "家用电器"
			},
			{
				text: "装饰公司",
				value: "装饰公司"
			}
		];
		$scope.showselect = function() {
			html = '<ion-radio ng-repeat="item in serverSideList" ng-value="item.value" ng-model="sid.clientSide" ng-change="serverSideChange(item)" name="server-side">{{ item.text }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '选择贷款用途',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		// 选择商户
		$scope.sh = {
			itme: {
				name: '请选择品牌'
			}
		};

		ajax.post("/api/shop/load", {}, function(data) {
			if(data.basic.status == 1) {
				$scope.shopList = data.data;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		$scope.shop = function() {
			$timeout(function() {
				html = '<ion-radio ng-repeat="item in shopList" ng-value="item"  ng-model="sh.itme" ng-change="serverSideChange()">{{ item.name }}</ion-radio>';
				$scope.myPopup = $ionicPopup.show({
					template: html,
					title: '请选择品牌',
					scope: $scope,
					buttons: [{
						text: '取消'
					}]
				});
			}, 500);
		};

		// 选择名店

		$scope.store = {
			itme: {
				name: '请选择门店'
			}
		};

		$scope.storeId = function(shopid) {
			if(!shopid) {
				modal.loading("请先选择品牌", 1500);
				return
			}
			ajax.post("/api/shop/load", {
				"pid": shopid
			}, function(data) {
				//console.log(data)
				if(data.basic.status == 1) {
					$scope.storeList = data.data;
					//console.log(data.data);
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});
			$timeout(function() {
				html = '<ion-radio ng-repeat="item in storeList" ng-value="item"  ng-model="store.itme" ng-change="serverSideChange()">{{ item.name }}</ion-radio>';
				$scope.myPopup = $ionicPopup.show({
					template: html,
					title: '请选择门店',
					scope: $scope,
					buttons: [{
						text: '取消'
					}]
				});
			}, 500);
		};

		// 关闭弹窗
		$scope.serverSideChange = function() {
			$scope.myPopup.close();
		};

		// 显示银行卡
		ajax.post("/api/userBankCard/list", json, function(data) {
			if(data.basic.status == 1) {
				if(data.data) {
					angular.forEach(data.data, function(itme, index) {
						if(itme.isMaster == 1) {
							$rootScope.onebank = itme;
							//console.log(data)
						}
					});
				} else {
					$scope.onebank.str = "选择银行卡";
				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}

		});

		$scope.ptyouhui = {
			item: {
				name: '请选择优惠券'
			}
		};

		ajax.post("/api/coupon/queryAllMyCoupons", {}, function(data) {
			//console.log(data)
			if(data.basic.status == 1) {
				//if (!isEmptyObject(data.data)) {
				//
				//}
				if(data.data) {
					$scope.allnewyiuhuiq = data.data.myCoupon;
					//console.log(data)
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		$scope.tochooseptyouhui = function() {

			if($scope.orderlist.Amount == "") {

				modal.loading("请先选择期数", 1500);
				return
			}
			//allnewyiuhuiq
			// && kuaibeiwallet == item.product_limit
			html='<div class="list" style="max-height: 100%;"><div class="item" ng-repeat="item in allnewyiuhuiq" ng-click="chooseptyouhuitext( item.name) || chooseptyouhui(item.id)"style="height: 100px; padding-top: 5px;" ng-if="item.status == 1  && item.isUsed != 1"><div class="cardbgmin" style="background-color: orange;float: left;width: 40%;height: 100px;margin-top: -5px;margin-left: -16px;"><span style="float: left;margin-top: 24px;width:100%;text-align: center"><span style="color:white;font-size: 30px;" ng-if="item.offsetInterest != 0">{{item.offsetInterest}}<a style="font-size: 16px;color: white">%</a></span><span style="color:white;font-size: 26px;" ng-if="item.offsetMoney != 0">{{item.offsetMoney}}<a style="font-size: 14px;color: white">元</a></span><p style="height: 2px"></p><span style="color: white; font-size: 11px;">{{item.specJsonF.key1 }}</span></span></div><span class="item-note" style="float: right;width: 60%;"><span class="item-note" style="font-size: 12px;float: left;color:red;font-weight: bold;" >{{item.name }}</span><br><span class="numlist" style="font-size: 12px;margin-top: 2px;color: #282828 ;width: 100%">{{item.specJsonF.key2 }}</span><span class="numlist" style="font-size: 12px;margin-top: 2px;color: #282828 ;width:auto;word-break:normal; display:block; white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;">{{item.specJsonF.key3 }}</span></span></div></div>'
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '选择优惠券',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		$scope.chooseptyouhuitext = function(name) {
			$scope.myPopup.close();
			$scope.ptyouhui.item.name = name;
		};

		$scope.chooseptyouhui = function(id) {
			$scope.myPopup.close();
			$scope.getCouponsByid = id;

			//领取
			var getaddCoupons = {
				"cId": $scope.getCouponsByid
			};
			localStorage.setItem("CouponsByid", $scope.getCouponsByid);
			ajax.post("/api/coupon/addCouponUser", getaddCoupons, function(data) {
				//console.log(data)
				if(data.basic.status == 1) {
					//if (!isEmptyObject(data.data)) {
					//
					//}
					if(data.data) {
						//console.log(data);
					}
				} else {
					modal.loading(data.basic.msg, 1500);
				}

			}, 1);

			var Couponsjson = {
				"amount": $scope.orderlist.mount,
				"productId": $stateParams.id,
				"couponId": $scope.getCouponsByid,
				"periods": $scope.choeseordermonth
			};

			ajax.post("/api/order/previewRepaymentWithCoupon", Couponsjson, function(data) {
				if(data.basic.status == 1) {
					//console.log(data.data );
					$scope.yhRepayment = data.data;
					$scope.yhRepaymentcutMoney = data.data.cutMoney;
					$scope.yhRepaymentrepayment = data.data.repayment;

					if($scope.yhRepaymentrepayment == '0') {
						//modal.loading("您选择的优惠券不能使用，请重新选择！", 5000);
						$scope.showAlert = function() {
							var alertPopup = $ionicPopup.alert({
								title: '优惠券',
//								template: '您选择的优惠券不能使用，可重新选择！'    //龚宇注释  gong
								template: '您选择的优惠券不符合优惠券使用规则，可重新选择！'
							});
							alertPopup.then(function(res) {})
						};
						$scope.ptyouhui.item.name="请选择优惠券";
						$scope.showAlert();
					}

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});

		};

		$scope.Coupons = {
			item: {
				name: '请选择折扣券'
			}
		};

		//商家
		ajax.post("/api/coupon/queryAllMyCoupons", {}, function(data) {
			//console.log(data)
			if(data.basic.status == 1) {
				//if (!isEmptyObject(data.data)) {
				//
				//}
				if(data.data) {
					//console.log(data);
					$scope.allyiuhuiq = data.data.sjCoupon;
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		//
		//$scope.CouponsList = [{
		//  text: "7天免息",
		//  content:"借款可用免除部分利息",
		//  value: "7"
		//}, {
		//  text: "10天免息",
		//  content:"借款可用免除部分利息",
		//  value: "10"
		//}, {
		//  text: "减免利息",
		//  content:"借款可用免除部分利息",
		//  value: "100"
		//}];

		$scope.youhui = [
			Coupons = ""
		];
		$scope.tochooseyouhui = function() {

			html = '<div class="item" ng-repeat="item in allyiuhuiq" ng-click="chooseyouhuitext( item.name) || chooseyouhui(item.id)" ng-if="item.status == 1  && item.isUsed != 1"><span style="float: left;margin-top: 10px;"> <span style="color:orange;font-size: 20px;">￥{{item.offsetMoney }}</span> </span><span class="item-note" style="float: right;width: 65%"><span class="item-note" style="font-size: 12px;float: left;width: 100%;color: #282828" >{{item.name }}</span><br><span class="numlist" style="font-size: 12px;margin-top: 8px;float: left;width: 100% ;color: #282828" >{{item.specJsonF.key3}}</span></span></div>'

			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '选择折扣券',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});

		};

		$scope.chooseyouhui = function(id) {
			$scope.myPopup.close();
			//console.log(id );
			$scope.getCouponByid = id;

			localStorage.setItem("CouponByid", $scope.getCouponByid);

			//领取
			var getaddCoupon = {
				"cId": $scope.getCouponByid
			};
			ajax.post("/api/coupon/addCouponUser", getaddCoupon, function(data) {
				//console.log(data)
				if(data.basic.status == 1) {

					if(data.data) {

					}
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);

		};

		$scope.chooseyouhuitext = function(name) {
			$scope.myPopup.close();
			//console.log(text)
			$scope.Coupons.item.name = name;

		};

		// 提交贷款
		$scope.showPopup = function(mount, checked, increment) {

			if($scope.yhRepaymentcutMoney == undefined) {
				$scope.yhRepaymentcutMoney = 0;
				$scope.yhRepaymentrepayment = 0;
			}

			if(!$scope.orderlist.month || !$scope.orderlist.Amount) {
				modal.loading('请选择贷款分期', 1500);
				return
			} else if($scope.settingsList[1].checked != true) {
				modal.loading('请选择灵活还款服务', 1500);
				return
			} else if($scope.sid.clientSide == '请选择贷款用途') {
				modal.loading('请选择贷款用途', 1500);
				return
			} else if($scope.sh.itme.name == '请选择品牌') {
				modal.loading('请选择品牌', 1500);
				return
			} else if($scope.store.itme.name == '请选择门店') {
				modal.loading('请选择门店', 1500);
				return
			} else if(!$scope.onebank) {
				modal.loading('请添加银行卡', 1500);
				return
			}
			var lifeInsurance_money = $scope.orderlist.lifeInsurance;

			if($scope.settingsList[0].checked == false) {
				lifeInsurance_money = 0
			}
			$scope.CouponsByid = localStorage.getItem("CouponsByid");

			//localStorage.setItem("inviteRecordIds",data.data.inviteRecordId);
			$scope.inviteRecordId = localStorage.getItem("inviteRecordIds");
			$scope.orderSubmit = {
				"bankCardId": JSON.stringify($rootScope.onebank.id),
				"commodityType": $scope.sid.clientSide,
				"isJoinLifeInsurance": $scope.settingsList[0].checked,
				"isRepaymentService": $scope.settingsList[1].checked,
				"loanMoney": mount,
				"loanPeriods": $scope.orderlist.month,
				"productId": $stateParams.id,
				"shopId": JSON.stringify($scope.sh.itme.id),
				"lifeInsurance": JSON.stringify(lifeInsurance_money),
				"repaymentService": JSON.stringify($scope.orderlist.repaymentService),
				//"bankCardId":JSON.stringify($rootScope.onebank.id),
				"storeId": JSON.stringify($scope.store.itme.id),
				"inviteRecordId": $scope.inviteRecordId,
				"couponId": $scope.CouponsByid
			};
			//console.log($scope.orderSubmit.lifeInsurance);
			//<hr style="color:rgba(84, 84, 84, 0.62);width:60px;border:1px solid rgba(84, 84, 84, 0.62);margin-top: -20px;z-index: 100;position: absolute;float: right;margin-left: 140px"/>
			var html = '<div class="list"><div class="item" href="#">贷款金额<span class="item-note" style="color: #282828 ">' + mount + '元</span></div>' +
				//'<div class="list"><div class="item" href="#">优惠后贷款金额<span class="item-note">' + mount + '元</span></div>' +
				'<div class="item" href="#" ng-if="yhRepaymentcutMoney != 0 ">优惠金额<span class="item-note" style="color:  #282828" >' + $scope.yhRepaymentcutMoney + '元</span></div>' +
				'<div class="item" href="#">贷款期数<span class="item-note" style="color:  #282828">' + $scope.orderlist.month + '个月</span></div>' +
				'<div class="item" href="#" style="height: 55px" ng-if="yhRepaymentrepayment == 0 ">每期还款<span class="item-note" style="color: #282828">' + parseFloat(parseFloat(($scope.orderlist.Amount)) + parseFloat(increment)) + '元</span> </div>' +
				'<div class="item" href="#" style="height: 55px" ng-if="yhRepaymentrepayment != 0 ">每期还款<span class="item-note oldnousetxt" style="margin-top: -10px;height: 20px; ">' + parseFloat(parseFloat(($scope.orderlist.Amount)) + parseFloat(increment)) + '元</span> <br><span class="item-note" style="float: right;margin-top: -8px;color:  #282828" >' + parseFloat(parseFloat(($scope.yhRepaymentrepayment)) + parseFloat(increment)) + '元</span></div>' +

				'<div class="item" href="#">贷款用途<span class="item-note" style="color: #282828">' + $scope.sid.clientSide + '</span></div>' +
				'<div class="item" href="#">银行卡号<span class="item-note" style="color: #282828">' + $rootScope.onebank.str + '</span></div></div>';
			// 确实提交
			var myPopup = $ionicPopup.show({
				template: html,
				title: '贷款详情',
				scope: $scope,
				buttons: [{
					text: '取消'
				}, {
					text: '提交',
					type: 'button-positive',
					onTap: function(e) {
						e.preventDefault();
						localStorage.setItem("order", JSON.stringify($scope.orderSubmit));
						localStorage.setItem("Amount", $scope.orderlist.Amount);

						localStorage.setItem("onebank_str", $scope.onebank.str);

						if($scope.yhRepaymentrepayment != undefined && $scope.yhRepaymentrepayment != '0') {
							localStorage.setItem("newAmount", $scope.yhRepaymentrepayment + increment);
							//console.log(increment);

						} else {
							localStorage.setItem("newAmount", 0);

						}

						if($scope.yhRepaymentcutMoney != undefined && $scope.yhRepaymentcutMoney != '0') {
							localStorage.setItem("yhRepaymentcutMoney", $scope.yhRepaymentcutMoney)
						} else {
							localStorage.setItem("yhRepaymentcutMoney", 0)
						}

						//$timeout(function() {
						$state.go("info");
						//})
						myPopup.close();
					}
				}, ]
			});
		}

		var htmlEl = angular.element(document.querySelector('html'));
		htmlEl.on('click', function(event) {
			if(event.target.nodeName === 'HTML') {
				if($scope.myPopup) {
					$scope.myPopup.close();
				}
			}
		});

	}])

	.controller('kuaibeiWalletController', ["$scope", "ajax", "modal", "$timeout", "$location", "$stateParams", "$ionicPopup", "$state", "$rootScope", "$ionicHistory", "REG", function($scope, ajax, modal, $timeout, $location, $stateParams, $ionicPopup, $state, $rootScope, $ionicHistory, REG, $ionicModal) {
		if(!localStorage.getItem("token")) {
			$state.go("login");
			return
		}

		$(function() {
			//当前省
			$scope.curtProvince = remote_ip_info['province'];
			//当前市
			$scope.curtcity = remote_ip_info['city'];

		});

		//html = '<div style="text-align: center"><ion-spinner icon="android"></ion-spinner><p>系统正在判断您所在的城市是否可以申请快贝钱包，请稍后</p></div>';
		//$scope.myPopup1 = $ionicPopup.show({
		//  template: html,
		//  title: '定位中',
		//  scope: $scope,
		//  buttons: [{
		//    text: '取消',
		//    type: 'button-positive',
		//    onTap: function(e) {
		//      e.preventDefault();
		//      $scope.myPopup1.close();
		//      //$state.go("index")
		//      $scope. myBack('tab.index','true');
		//    }}
		//  ]
		//});

		//$scope.locaingtimeclose = $timeout(function(){
		//  $scope.myPopup1.close();
		//},3000);

		//$scope.locationtime = $timeout( function(){
		//
		//  //$scope.showAlert();
		//  html = '<div style="text-align: center"><i class="icon ion-checkmark-circled positive" style="font-size: 40px;"></i><p>亲，您所在的城市可申请快贝钱包，欢迎使用！</p></div>';
		//  $scope.myPopup2 = $ionicPopup.show({
		//    template: html,
		//    title: '定位中',
		//    scope: $scope,
		//    buttons: [{
		//      text: '确定',
		//      type: 'button-positive',
		//      onTap: function(e) {
		//        e.preventDefault();
		//        $scope.myPopup2.close();
		//        //$state.go("index")
		//
		//      }}
		//    ]
		//  });
		//
		//},3001);

		//$scope.locaedtime = $timeout(function(){
		//
		//},4000)

		//$scope.showAlert = function() {
		//  var alertPopup = $ionicPopup.alert({
		//    title: '定位中',
		//    template: '系统正在判断您所在的城市是否可以申请快贝钱包，请稍后'
		//  });
		//  alertPopup.then(function (res) {
		//
		//  })
		//};

		//$scope.showAlert = function() {
		//  var alertPopup = $ionicPopup.alert({
		//    title: '定位中',
		//    template: '<div style="text-align: center"><ion-spinner icon="android"></ion-spinner><p>系统正在判断您所在的城市是否可以申请快贝钱包，请稍后</p></div>'
		//  });
		//  alertPopup.then(function (res) {
		//
		//  })
		//};

		//元素数据
		$scope.orderlist = {
			'mount': 5000,
			'maxAmount': 10000,
			'minAmount': 1000,
			'month': '',
			'Amount': '',
			'increment': '',
			'repaymentService': '',
			'lifeInsurance': ''
		};

		$scope.KliClss1 = function() {
			$scope.on = $scope.index = 1;
		};

		$scope.KliClss2 = function() {
			$scope.on = $scope.index = 2;
		};
		$scope.KliClss3 = function() {
			$scope.on = $scope.index = 3;
		};

		// 选择贷款用途
		$scope.sid = {
			clientSide: '请选择贷款用途'
		};

		$scope.serverSideList = [{
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
				text: "家居家具",
				value: "家居家具"
			},
			{
				text: "家用电器",
				value: "家用电器"
			},
			{
				text: "装饰公司",
				value: "装饰公司"
			}
		];
		$scope.showselect = function() {
			html = '<ion-radio ng-repeat="item in serverSideList" ng-value="item.value" ng-model="sid.clientSide" ng-change="serverSideChange(item)" name="server-side">{{ item.text }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '选择贷款用途',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		$scope.serverSideChange = function() {
			$scope.myPopup.close();
		};

		var json = {};
		ajax.post("/api/userBankCard/list", json, function(data) {
			if(data.basic.status == 1) {
				if(data.data) {
					angular.forEach(data.data, function(itme, index) {
						if(itme.isMaster == 1) {
							$rootScope.onebank = itme;
							//console.log(data)
						}
					});
				} else {
					$scope.onebank.str = "选择银行卡";
				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}

		});

		$scope.ptyouhui = {
			item: {
				name: '请选择优惠券'
			}
		};

		ajax.post("/api/coupon/queryAllMyCoupons", {}, function(data) {
			//console.log(data)
			if(data.basic.status == 1) {
				//if (!isEmptyObject(data.data)) {
				//
				//}
				if(data.data) {
					$scope.allnewyiuhuiq = data.data.myCoupon;
					//console.log(data)
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		$scope.tochooseptyouhui = function() {

			html = '<div class="list" style="max-height: 100%;"><div class="item" ng-repeat="item in allnewyiuhuiq" ng-click="chooseptyouhuitext( item.name) || chooseptyouhui(item.id)" style="height: 150px;"  ng-if="item.status == 1  && item.isUsed != 1">  <div class="cardbgmin" style="background-color: orange;float: left;width: 40%;height: 150px;margin-top: -13px;margin-left: -16px;"> <span style="float: left;line-height: 150px;width:100%;text-align: center"> <span style="color:white;font-size: 30px;" ng-if="item.offsetInterest != 0">{{item.offsetInterest}}<a style="font-size: 16px;color: white">%</a> </span> <span style="color:white;font-size: 26px;" ng-if="item.offsetMoney != 0">{{item.offsetMoney}}<a style="font-size: 14px;color: white">元</a> </span> </span> </div> <span class="item-note" style="float: right;width: 60%;"><span class="item-note" style="font-size: 12px;float: left;color:red;font-weight: bold;" >{{item.name }}</span><br><span class="numlist" style="font-size: 12px;margin-top: 8px;color: #282828 ;width: 100%" >{{item.specJsonF.key1 }}</span><span class="numlist" style="font-size: 12px;margin-top: 8px;color: #282828 ;width: 100%">{{item.specJsonF.key2 }}</span><span class="numlist" style="font-size: 12px;margin-top: 8px;color: #282828 ;width:auto;word-break:normal; display:block; white-space:pre-wrap;word-wrap : break-word ;overflow: hidden ;">{{item.specJsonF.key3 }}</span></span></div></div>'
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '选择优惠券',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});

		};

		$scope.chooseptyouhuitext = function(name) {
			$scope.myPopup.close();
			$scope.ptyouhui.item.name = name;

		};

	}])

	// 商家详情
	.controller('sellerDetailsController', ["$scope", "modal", "ajax", "$stateParams", function($scope, modal, ajax, $stateParams) {
		ajax.post("/api/shop/detail", {
			"id": $stateParams.id
		}, function(data) {
			if(data.basic.status == 1) {
				$scope.shop = data.data;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		})
	}])
	
	// 商家  gong  迁移出去
	// .controller('SellerCtrl', ["$scope", "modal", "ajax", "FinancList", "$timeout", "$state", "focus", "$controller", "$rootScope", function($scope, modal, ajax, FinancList, $timeout, $state, focus, $controller, $rootScope) {
		
	// 	$scope.searText = [];

	// 	//获取列表
	// 	function getData() {
	// 		var json = {
	// 			"page": 1,
	// 			"pageSize": 10
	// 		};

	// 		var url = "/api/shop/list";
	// 		ajax.post(url, json, function(data) {
	// 			//console.log(data); //*********后台数据*********** */
	// 			if(data.basic.status == 1) { //获取后台数据成功标志
	// 				$scope.articles = data.data.items; // 取数据
	// 				if(json.page <= data.data.paged.pageCount && data.data.paged.total > json.pageSize) {
	// 					FinancList.param.curPage = 1; //进来时初始化请求数据
	// 					$rootScope.orderlist = []; // 进来时初始化请求数据  以便二次调用
	// 					FinancList.param.hasmore = true;
	// 				} else {
	// 					FinancList.param.hasmore = false;
	// 				}
	// 			} else {
	// 				modal.loading(data.basic.msg, 1000);
	// 			}
	// 		});

	// 		//上拉触发函数
	// 		$scope.loadMore = function() {
	// 			//这里使用定时器是为了缓存一下加载过程，防止加载过快
	// 			$timeout(function() {
	// 				if(!FinancList.param.hasmore) {
	// 					$scope.$broadcast('scroll.infiniteScrollComplete');
	// 					return;
	// 				}
	// 				$scope.articles = $scope.articles.concat(FinancList.getList(url));
	// 				$scope.$broadcast('scroll.infiniteScrollComplete');
	// 				FinancList.param.curPage++;

	// 			}, 1500);
	// 		};
	// 		//控制列表是否允许其加载更多
	// 		$scope.moreDataCanBeLoaded = function() {
	// 			return FinancList.param.hasmore;
	// 		};
	// 	};

	// 	$rootScope.loac = window.location.hash;
	// 	$scope.$watch('loac', function(newValue, oldValue) {
	// 		// alert(newValue);
	// 		if(newValue == "#/tab/seller") {
	// 			$(".listbox").remove(); //删除遍历后的元素们
	// 			getData();
	// 		}
	// 	});

	// 	// 搜索按钮
	// 	$scope.sear = function() {
	// 		console.log("搜索：" + this.searText);
	// 		modal.loading('努力加载中...', 1000);
	// 	};

	// 	// 小的字符串清空按钮
	// 	$scope.colText = function() {
	// 		$scope.searText = ""; //清空输入框
	// 		focus("searchText"); //聚焦到输入框
	// 	};

	// 	// 筛选按钮
	// 	$scope.sScreen = function() {
	// 		alert('弹出选择框');
	// 	};

	// 	// 侧边分类选中
	// 	$(".conte").on('click', function(ev) {
	// 		FinancList.param.hasmore = false;
	// 		FinancList.param.curPage = 1; //进来时初始化请求数据
	// 		$rootScope.orderlist = []; // 进来时初始化请求数据  以便二次调用
	// 		$(".listbox").remove(); //删除遍历后的元素们
	// 		var delay = 0; // 做点击延迟加载视图
	// 		$timeout(function() {
	// 			delay = 1;
	// 			if(angular.element(tag).attr('name') == 'all' && delay) { //
	// 				console.log(123);
	// 				getData(); // 获取后台列表
	// 			} else {
	// 				$(".listbox").remove(); //删除遍历后的元素们
	// 			}
	// 		}, 500);
	// 		var tag = ev.target;
	// 		console.log(tag);
	// 		angular.element(tag).addClass('myActive').siblings().removeClass('myActive');
	// 	});

	// 	// 设定旁边固定高度 以及视图的宽高
	// 	$("#conte").css('top', $("#topbar").outerHeight() + $("#SearchBox").outerHeight());
	// 	$("#conte").css('width', $(window).width() - $("#SellerList").outerWidth());
	// 	$("#conte").css('height', $(document).height() - $("#topbar").outerHeight() - 94);
	// 	$("#ContBox").css('margin-top', $("#SearchBox").outerHeight() - 1);

	// }])
	// 个人中心
	.controller('UserCtrl', ["$scope", "modal", "ajax", "$state", "$ionicPopup", function($scope, modal, ajax, $state, $ionicPopup) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		var json = {};
		ajax.post("/api/users/info", json, function(data) {
			if(data.basic.status == 1) {
				$scope.user = data.data
			} else {
				modal.loading(data.basic.msg, 1500);
			}

		});
		// gong
		ajax.post("/api/coupon/queryAllMyCoupons", {}, function(data) {
			if(data.basic.status == 1) {

				if(data.data) {
					// 修改平台优惠券可用数的
					$scope.allnewyiuhuiqlength = 0;
					for(var i = 0; i < data.data.myCoupon.length; i++) {
						if(data.data.myCoupon[i].status == 1 && data.data.myCoupon[i].isUsed != 1) {
							$scope.allnewyiuhuiqlength++;
						}
					}

				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		ajax.post("/api/systemMessage/newCount", json, function(data) {
			if(data.basic.status == 1) {
				//console.log(data)
				$scope.newCount = data.data
			} else {
				modal.loading(data.basic.msg, 1500);
			}

		});

		$scope.gotoNextyou = function() {
			$state.go("Coupons");
		};

		$scope.gotodiscount = function() {
			$state.go("discount")
		};

		$scope.gotofriendrRequests = function() {
			$state.go("friendrRequests")
		}

	}])
	// 个人资料/
	.controller('MationController', ["$scope", "modal", "ajax", "$state", "Upload", "$timeout", "$ionicPopup", "$rootScope", "$ionicLoading", function($scope, modal, ajax, $state, Upload, $timeout, $ionicPopup, $rootScope, $ionicLoading) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		ajax.post("/api/users/info", {}, function(data) {
			if(data.basic.status == 1) {
				$scope.user = data.data;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});
		// 上传图片
		$scope.data = {
			file: null
		};

		$scope.upload = function() {
			if(!$scope.data.file) {
				return;
			}
			var data = {}; // 接口需要的额外参数，比如指定所上传的图片属于哪个用户: { UserId: 78 }angular.copy($scope.params.data || {});
			data.file = $scope.data.file;
			Upload.upload({
				url: $rootScope.Uploadurl,
				data: data
			}).progress(function(evt) {
				//进度条
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				$ionicLoading.show({
					template: '正在上传中,进度' + progressPercentage + '%'
				});
				if(progressPercentage == 100) {
					$ionicLoading.hide();
				}
			}).success(function(data) {
				$ionicLoading.hide();
				if(data.basic.status == 1) {
					$scope.user.portrait = data.data.url;
					var obj = {
						portrait: data.data.url
					};
					updateuser(obj);
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}).error(function() {
				$ionicLoading.hide();
				if(data.basic.msg) {
					modal.loading(data.basic.msg, 1500);
				}
			});
		};

		function updateuser(obj) {
			ajax.post("/api/users/updateUserInfo", obj, function(data) {
				if(data.basic.status == 1) {
					modal.loading("修改成功", 1500);
					// $timeout(function() {
					//     location.reload()
					// }, 1500);
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			})
		}

	}])

	// 添加银行卡
	.controller('AddbankController', ["$scope", "modal", "ajax", "$stateParams", "$interval", "REG", "$timeout", "$state", "$rootScope", "$ionicPopup", function($scope, modal, ajax, $stateParams, $interval, REG, $timeout, $state, $rootScope, $ionicPopup) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return

		}

		$scope.userlist = {};
		ajax.post("/api/users/queryDataByStep", {
			"step": "1"
		}, function(data) {
			if(data.basic.status == 1) {
				if(data.data) {
					$scope.userlist = data.data;
				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		$scope.model = {
			"account": '',
			"bankname": '',
			"address": '',
			"city": "",
			"img": "2123",
			"code": "",
			"isMaster": "0",
			"mobile": "",
			"province": ""
		};

		var vm = $scope.vm = {};
		vm.CityPickData = {
			areaData: ['请选择城市'],
			title: '开户地区',
			hardwareBackButtonClose: false,
			buttonClicked: function() {
				$scope.model.province = this.areaData[0];
				$scope.model.city = this.areaData[1];
				$scope.model.address = this.areaData[2];

			},
		}
		// 重获验证码
		$scope.canClick = false;
		$scope.description = "获取验证码";
		var second = 59;
		var timerHandler;
		$scope.getTestCode = function() {
			if(!REG.isMobile($scope.model.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);
				return
			}
			ajax.post("/api/sms/send", {
				"apkind": "bankCardAdd",
				"minute": "5",
				"mobile": $scope.model.mobile
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
			});
		};

		// 提交
		$scope.ac = {
			isChecked: true
		};
		$scope.btn_bc = function() {
			$scope.model.name = $scope.userlist.name;
			$scope.model.idcard = $scope.userlist.idcard;
			if(!($scope.model.name)) {
				modal.loading("请使用您本人的姓名", 1500);
				return
			} else if(!$scope.model.idcard) {
				modal.loading("请填写身份证号", 1500);
				return
			} else if(!REG.isNumber($scope.model.account)) {
				modal.loading("请输正确的入银行卡号", 1500);
				return
			} else if(!$scope.model.province || !$scope.model.city || !$scope.model.address) {
				modal.loading("请选择开户行地址", 1500);
				return
			} else if(!REG.isMobile($scope.model.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);
				return
			} else if(!$scope.model.code) {
				modal.loading("请输入验证码", 1500);
				return
			} else if($scope.ac.isChecked == false) {
				modal.loading("请阅读并同意相关合同", 1500);
			}

			ajax.post("/api/userBankCard/add", $scope.model, function(data) {
				if(data.basic.status == 1) {
					ajax.post("/api/userBankCard/list", {}, function(data) {
						if(data.basic.status == 1) {
							//console.log(data);
							$rootScope.bankListUser = data.data;
							modal.loading("添加成功！", 1500);
							$timeout(function() {
								$state.go("bank");
							}, 1500)
						} else {
							modal.loading(data.basic.msg, 1500);
						}

					});
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			})
		};

		$scope.solook = function() {
			$state.go("borrowCompact")
		}

	}])

	// 忘记登入密码
	.controller('ForgetpwdController', ["$scope", "ajax", "modal", "REG", "$interval", "$timeout", "$state", function($scope, ajax, modal, REG, $interval, $timeout, $state) {
		$scope.json = {
			"code": "",
			"mobile": "",
			"password": ""
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
				"apkind": "retrievePwd",
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
			});
		};

		$scope.retrievePwd = function() {
			if(!REG.isMobile($scope.json.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);
				return
			} else if(!REG.isPwd($scope.json.password)) {
				modal.loading("请输入6-32位登录密码", 1500);
				return
			} else if(!$scope.json.code) {
				modal.loading("请输入验证码", 1500);
				return
			}
			ajax.post("/api/users/retrievePwd", $scope.json, function(data) {
				if(data.basic.status == 1) {
					modal.loading("修改成功，立即登入", 1500);
					$timeout(function() {
						$state.go("login");
					}, 1500);

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});
		}
	}])

	// 验证第三部图片资料
	.controller('UploadController', ["$scope", "ajax", "modal", "$stateParams", "$location", "Upload", "$timeout", "$state", "$ionicPopup", "$rootScope", "$ionicLoading", function($scope, ajax, modal, $stateParams, $location, Upload, $timeout, $state, $ionicPopup, $rootScope, $ionicLoading, $filter) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		$scope.photosList = {
			sfz1: '',
			sfz2: '',
			face: '',
			banck: '',
			other1: '',
			other2: '',
			other3: ''
		};

		ajax.post("/api/users/queryDataByStep", {
			"step": "4"
		}, function(data) {
			if(data.basic.status == 1) {
				if(data.data.photos) {
					$scope.photosList.sfz1 = data.data.photos.身份证正面;
					$scope.photosList.sfz2 = data.data.photos.身份证反面;
					$scope.photosList.face = data.data.photos.申请人照片;
					$scope.photosList.banck = data.data.photos.代扣银行卡照片;
					$scope.photosList.other1 = data.data.photos.other1;
					$scope.photosList.other2 = data.data.photos.other2;
					$scope.photosList.other3 = data.data.photos.other3;
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		// 上传图片
		$scope.data = {
			file: null,
		};
		$scope.data1 = {
			file1: null,
		};
		$scope.data2 = {
			file2: null,
		};
		$scope.data3 = {
			file3: null,
		};

		$scope.data4 = {
			file4: null,
		};
		$scope.data5 = {
			file5: null,
		};
		$scope.data6 = {
			file6: null,
		};

		$scope.upload = function(file, num) {
			if(!file) {
				return;
			}
			//EXIF.getData()
			var data = {}; // 接口需要的额外参数，比如指定所上传的图片属于哪个用户: { UserId: 78 }angular.copy($scope.params.data || {});
			data.file = file;
			Upload.upload({
				url: $rootScope.Uploadurl,
				data: data
			}).progress(function(evt) {
				//进度条
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				$ionicLoading.show({
					template: '正在上传中,进度' + progressPercentage + '%'
				});
				if(progressPercentage == 100) {
					$ionicLoading.hide();
				}
			}).success(function(data) {
				$ionicLoading.hide();
				if(data.basic.status == 1) {
					$ionicLoading.hide();
					if(num == 0) {
						$scope.photosList.sfz1 = data.data.url;
						//console.log($scope.photosList.sfz1);
					}
					if(num == 1) {
						$scope.photosList.sfz2 = data.data.url;
					}
					if(num == 2) {
						$scope.photosList.face = data.data.url;
					}
					if(num == 3) {
						$scope.photosList.banck = data.data.url;
					}
					if(num == 4) {
						$scope.photosList.other1 = data.data.url;
					}
					if(num == 5) {
						$scope.photosList.other2 = data.data.url;
					}
					if(num == 6) {
						$scope.photosList.other3 = data.data.url;
					}
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}).error(function() {
				$ionicLoading.hide();
				modal.loading(data.basic.msg, 1500);
			});
		};

		$scope.newallMoney = (localStorage.getItem("newAmount"));
		$scope.yhRepaymentcutMoney2 = (localStorage.getItem("yhRepaymentcutMoney"));

		$scope.goNext = function() {

			$scope.pageid = localStorage.getItem("loanpageid");
			if(localStorage.getItem("order")) {
				$scope.orderlist = eval('(' + localStorage.getItem("order") + ')');
				var allMoney = parseFloat(parseFloat(localStorage.getItem("Amount")) + parseFloat($scope.orderlist.repaymentService) + parseFloat($scope.orderlist.lifeInsurance));
				//console.log($scope.orderlist.lifeInsurance);
				//var allMoney=parseFloat(parseFloat(localStorage.getItem("Amount"))+$scope.orderlist.repaymentService+$scope.orderlist.lifeInsurance);

				var html = '<div class="list"><div class="item" href="#">贷款金额<span class="item-note" style="color: #282828">' + $scope.orderlist.loanMoney + '元</span></div>' +
					'<div class="item" href="#" ng-if="yhRepaymentcutMoney2 != 0 ">优惠金额<span class="item-note" style="color: #282828"  >' + $scope.yhRepaymentcutMoney2 + '元</span></div>' +
					'<div class="item" href="#">贷款期数<span class="item-note" style="color: #282828">' + $scope.orderlist.loanPeriods + '个月</span></div>' +
					'<div class="item" ng-if="newallMoney == 0">每期还款<span class="item-note" style="color:#282828 ">' + allMoney + '元</span></div>' +
					'<div class="item" href="#" style="height: 55px" ng-if="newallMoney != 0">每期还款<span class="item-note oldnousetxt" style="margin-top: -10px;height: 20px; ;">' + allMoney + '元</span> <br><span class="item-note" style="float: right;margin-top: -8px;color: #282828">' + $scope.newallMoney + '元</span></div>' +

					'<div class="item">贷款用途<span class="item-note" style="color: #282828">' + $scope.orderlist.commodityType + '</span></div>' +
					'<div class="item">银行卡号<span class="item-note" style="color: #282828">' + localStorage.getItem("onebank_str") + '</span></div></div>';
			} else {
				var html = '您还没有去申请贷款,立即申请'
			}

			$rootScope.subimts = {
				"身份证正面": $scope.photosList.sfz1,
				"身份证反面": $scope.photosList.sfz2,
				"申请人照片": $scope.photosList.face,
				"代扣银行卡照片": $scope.photosList.banck,
				"other1": $scope.photosList.other1,
				"other2": $scope.photosList.other2,
				"other3": $scope.photosList.other3
			};
			if(!$scope.photosList.sfz1 || $scope.photosList.sfz1.length < 1) {
				modal.loading("请上传身份证正面照", 1500);
				return
			} else if(!$scope.photosList.sfz2 || $scope.photosList.sfz2.length < 1) {
				modal.loading("请上传身份证反面照", 1500);
				return
			} else if(!$scope.photosList.face || $scope.photosList.face.length < 1) {
				modal.loading("请上传申请人照片", 1500);
				return
			} else if(!$scope.photosList.banck || $scope.photosList.banck.length < 1) {
				modal.loading("请上传代扣银行卡照片", 1500);
				return
			}

			if($scope.pageid == "1") {

				ajax.post("/api/users/step4", $rootScope.subimts, function(data) {
					//console.log(data);
					if(data.basic.status == 1) {

						var data = {};
						ajax.post("/api/limit/submit", data, function(data) {
							if(data.basic.status == 1) {
								//console.log(data.data.msg)
								// console.log(data)

							} else {
								modal.loading(data.basic.msg, 1500);
							}

						}, 1);

						$scope.showAlert();

						//    }
						//  }, ]
						//});

					} else {
						modal.loading(data.basic.msg, 1500);
					}
				});

				$scope.showAlert = function() {
					var alertPopup = $ionicPopup.alert({
						title: '额度申请',
						template: '你的额度申请已提交成功，请稍后在我的额度中查看与使用'
					});
					alertPopup.then(function(res) {
						window.location.href = "#/tab/personal";
					})
				};

			} else {

				ajax.post("/api/users/step4", $rootScope.subimts, function(data) {
					//console.log($rootScope.subimts)
					if(data.basic.status == 1) {
						// 确实提交
						//console.log(data)
						var myPopup = $ionicPopup.show({
							template: html,
							title: '贷款详情',
							scope: $scope,
							buttons: [{
								text: '取消'
							}, {
								text: '确定',

								type: 'button-positive',
								onTap: function(e) {
									e.preventDefault();
									myPopup.close();
									if(localStorage.getItem("order")) {
										ajax.post("/api/order/submit", $scope.orderlist, function(data) {
											// localStorage.setItem("order",'');
											// localStorage.setItem("Amount", '');
											// localStorage.setItem("onebank_str", '');
											//console.log(data);
											if(data.basic.status == 1) {
												if(data.basic.msg == 3) {
													modal.loading("很抱歉，30分钟之内最多申请三次订单", 2000);
												} else if(data.basic.msg == 5) {
													modal.loading("很抱歉，24小时之内最多申请五次订单", 2000);
												} else {
												myPopup.close();
												modal.loading("申请成功", 1500);
												localStorage.removeItem("order");
												localStorage.removeItem("Amount");
												localStorage.removeItem("onebank_str");
												$timeout(function() {
													// $state.go("tab.personal");
													window.location.href = "#/tab/personal";
													//var  id =  localStorage.getItem("loanpageid");
													//
													//   $location.path('/loan-details/'+ id);

													$scope.getCouponByid = localStorage.getItem("CouponByid");
													$scope.CouponByid = localStorage.getItem("CouponsByid");
													//console.log(  $scope.CouponByid );
													//couponId
													if($scope.CouponByid != null) {
														var data = {
															couponId: $scope.CouponByid
														};
														ajax.post("/api/coupon/updateCouponUser", data, function(data) {

															if(data.basic.status == 1) {
																//if (!isEmptyObject(data.data)) {
																//
																//}
																if(data.data) {
																	console.log($scope.CouponsByid);
																	console.log(data);
																	//localStorage.removeItem("CouponsByid");
																}
															} else {
																modal.loading(data.basic.msg, 1500);
															}
														}, 1);
													}

													//使用
													if($scope.getCouponByid != null) {
														var getCoupon = {
															"couponId": $scope.getCouponByid
														};
														ajax.post("/api/coupon/updateCouponUser", getCoupon, function(data) {

															if(data.basic.status == 1) {

																if(data.data) {
																	//console.log(data);
																	localStorage.removeItem("CouponByid");
																}
															} else {
																modal.loading(data.basic.msg, 1500);
															}
														}, 1);
													}

												}, 1500)
											}


											} else {
												modal.loading(data.basic.msg, 1500);
											}

										}, 1);
									} else {

										$state.go("tab.index");
										myPopup.close();
									}

								}
							}, ]
						});

					} else {
						modal.loading(data.basic.msg, 1500);
					}
				})
			}

		};

		var htmlEl = angular.element(document.querySelector('html'));
		htmlEl.on('click', function(event) {
			if(event.target.nodeName === 'HTML') {
				if($scope.myPopup) { //myPopup即为popup
					$scope.myPopup.close();
				}
			}
		});

	}])

	// 银行
	.controller('BankController', ["$scope", "ajax", "$ionicPopup", "modal", "$state", "$rootScope", function($scope, ajax, $ionicPopup, modal, $state, $rootScope) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}
		// 删除银行卡
		$scope.onItemDelete = function(item) {
			$scope.confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '确定删除' + item.str + '的银行卡？',
				buttons: [{
					text: '取消'
				}, {
					text: '确定',
					type: 'button-positive',
					onTap: function(e) {
						e.preventDefault();
						ajax.post("/api/userBankCard/del", {
							"withdrawalCardId": item.id
						}, function(data) {
							if(data.basic.status == 1) {
								modal.loading(data.basic.msg, 1500);
								$scope.confirmPopup.close();
								$rootScope.bankListUser.splice($rootScope.bankListUser.indexOf(item), 1);

								ajax.post("/api/userBankCard/list", {}, function(data) {
									if(data.basic.status == 1) {
										$rootScope.bankListUser = data.data;
									} else {
										modal.loading(data.basic.msg, 1500);
									}
								});
							} else {
								modal.loading(data.basic.msg, 1500);
							}

						});
					}

				}]
			});
		};

		// 设定主卡
		$scope.share = function(item) {
			ajax.post("/api/userBankCard/setMaster", {
				"withdrawalCardId": item.id
			}, function(data) {
				if(data.basic.status == 1) {
					modal.loading(data.basic.msg, 1500);
					//console.log(data.basic.msg);
					ajax.post("/api/userBankCard/list", {}, function(data) {
						if(data.basic.status == 1) {
							$rootScope.bankListUser = data.data;
							angular.forEach(data.data, function(itme, index) {
								if(itme.isMaster == 1) {
									$rootScope.onebank = itme;
								}
							});

						} else {
							modal.loading(data.basic.msg, 1500);
						}
					});

				} else {
					modal.loading(data.basic.msg, 1500);
				}

			});
		};

		$scope.$watch('$viewContentLoaded', function() {
			// 银行卡列表
			ajax.post("/api/userBankCard/list", {}, function(data) {

				if(data.basic.status == 1) {
					$rootScope.bankListUser = data.data;
				} else {
					modal.loading(data.basic.msg, 1500);
				}

			});
		});

	}])
	// 消息提示
	.controller('TipsController', ["$scope", "modal", "ajax", "$state", "$ionicPopup", "FinancList", "$timeout", function($scope, modal, ajax, $state, $ionicPopup, FinancList, $timeout) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		var json = {
			"page": 1,
			"pageSize": 10
		};
		var url = "/api/systemMessage/list";

		ajax.post(url, json, function(data) {
			if(data.basic.status == 1) {
				$scope.tipslist = data.data.items;
				if(json.page <= data.data.paged.pageCount && data.data.paged.total > json.pageSize) {
					FinancList.param.hasmore = true;
				} else {
					FinancList.param.hasmore = false;
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		//上拉触发函数
		$scope.loadMore = function() {
			//这里使用定时器是为了缓存一下加载过程，防止加载过快
			$timeout(function() {
				if(!FinancList.param.hasmore) {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					return;
				}
				$scope.tipslist = $scope.tipslist.concat(FinancList.getList(url));
				$scope.$broadcast('scroll.infiniteScrollComplete');
				FinancList.param.curPage++;
			}, 1000);
		};

		//控制列表是否允许其加载更多
		$scope.moreDataCanBeLoaded = function() {
			return FinancList.param.hasmore;
		};

		$scope.Edit = function() {
			ajax.post("/api/systemMessage/empty", {}, function(data) {
				if(data.basic.status == 1) {
					modal.loading("已清空", 1500);
					location.reload();
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			})
		}

	}])

	// 贷款订单列表
	.controller('BorrowingController', ["$scope", "ajax", "$stateParams", "$ionicPopup", "FinancList", "$timeout", "$http", "modal", "$state", "$ionicListDelegate", function($scope, ajax, $stateParams, $ionicPopup, FinancList, $timeout, $http, modal, $state, $ionicListDelegate) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		var json = {
			"page": 1,
			"pageSize": 10,
		}
		var url = "/api/order/list";
		$scope.status = 99;
		getTabs(99);
		// tab切换
		$scope.tabs = function(status) {
			$scope.status = status;
			getTabs(status);
		}
		// 读取数据
		function getTabs(status) {
			if(status != 99) {
				json.orderStatus = status;
			} else {
				json.orderStatus = "";
			}

			ajax.post(url, json, function(data) {
				if(data.basic.status == 1) {
					$scope.articles = data.data.items;
					if(json.page <= data.data.paged.pageCount && data.data.paged.total > json.pageSize) {
						FinancList.param.hasmore = true;
					} else {
						FinancList.param.hasmore = false;
					}
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1)

		}

		//上拉触发函数
		$scope.loadMore = function() {
			//这里使用定时器是为了缓存一下加载过程，防止加载过快
			$timeout(function() {
				if(!FinancList.param.hasmore) {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					return;
				}
				if($scope.status != 99) {
					$scope.articles = $scope.articles.concat(FinancList.getList(url, $scope.status));
				}
				$scope.articles = $scope.articles.concat(FinancList.getList(url));
				$scope.$broadcast('scroll.infiniteScrollComplete');
				FinancList.param.curPage++;
			}, 1000);
		};
		//控制列表是否允许其加载更多
		$scope.moreDataCanBeLoaded = function() {
			return FinancList.param.hasmore;
		}
		$ionicListDelegate.showReorder(true);

		$scope.showPopup = function(id, loanPeriods, repaymentPeriods) {
			var html = "";
			html += '<div class="row bg-white"><div class="col col-33">还款日期</div><div class="col text-r">共' + loanPeriods + '期，已还' + repaymentPeriods + '期</div></div>';
			ajax.post("/api/repaymentSchedule/list", {
				"orderId": id
			}, function(data) {
				if(data.basic.status == 1) {
					angular.forEach(data.data, function(itme, index) {
						html += '<div class="row bg-white" style="border-top: 1px solid #eee;padding:0.5rem"><div class="col ">' + itme.shouldTime.substring(0, 10) + '</div>';
						if(itme.status == 1) {
							html += '<div class="col text-r yellow">已还款 ¥' + itme.shouldAmount + '</div></div>';
						} else {
							html += '<div class="col text-r">未还款 ¥' + itme.shouldAmount + '</div></div>';
						}
					})
					// 自定义弹窗
					var myPopup = $ionicPopup.show({
						template: html,
						title: '还款详情',
						scope: $scope,
						buttons: [{
							text: '<b>关闭</b>',
							type: 'button-positive',
						}, ]
					});

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});

		};
		var htmlEl = angular.element(document.querySelector('html'));
		htmlEl.on('click', function(event) {
			if(event.target.nodeName === 'HTML') {
				if($scope.myPopup) { //myPopup即为popup
					$scope.myPopup.close();
				}
			}
		});

	}])
	//手动还款+逾期
	.controller('RepaymentController', ["$scope", "ajax", "modal", "$stateParams", "$location", "Upload", "$timeout", "$state", "$ionicPopup", "$rootScope", "$ionicLoading", function($scope, ajax, modal, $stateParams, $location, Upload, $timeout, $state, $ionicPopup, $rootScope, $ionicLoading) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		ajax.post("/api/userRepayment/detail", {
			"repaymentScheduleId": $stateParams.id
		}, function(data) {
			if(data.basic.status == 1) {
				$scope.repayment = data.data;

			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		$scope.subimt = {
			"realityAmount": "",
			"repaymentAccount": "",
			"repaymentImgs": "",
			"repaymentScheduleId": $stateParams.id,
			"uremark": "",
			"way": ""
		};

		// 上传图片
		$scope.data = {
			file: null
		};

		$scope.upload = function() {
			if(!$scope.data.file) {
				return;
			}
			var data = {}; // 接口需要的额外参数，比如指定所上传的图片属于哪个用户: { UserId: 78 }angular.copy($scope.params.data || {});
			data.file = $scope.data.file;
			Upload.upload({
				url: $rootScope.Uploadurl,
				data: data
			}).progress(function(evt) {
				//进度条
				var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
				$ionicLoading.show({
					template: '正在上传中,进度' + progressPercentage + '%'
				});
				if(progressPercentage == 100) {
					$ionicLoading.hide();
				}
			}).success(function(data) {
				$ionicLoading.hide();
				if(data.basic.status == 1) {
					$scope.subimt.repaymentImgs = data.data.url;
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}).error(function() {
				$ionicLoading.hide();
				modal.loading(data.basic.msg, 1500);
			});
		};

		// 提交还款
		$scope.subimtRepayment = function() {
			if(!$scope.subimt.realityAmount) {
				modal.loading("请输入手动还款金额", 1500);
				return
			} else if(!$scope.subimt.way) {
				modal.loading("请输入手动还款的方式", 1500);
				return
			} else if(!$scope.subimt.repaymentAccount) {
				modal.loading("请输入手动还款的账号", 1500);
				return
			} else if(!$scope.subimt.repaymentImgs) {
				modal.loading("请上传还款凭证", 1500);
				return
			}
			ajax.post("/api/userRepayment/submit", $scope.subimt, function(data) {
				if(data.basic.status == 1) {
					modal.loading("还款成功！", 1500);
					$timeout(function() {
						$state.go("tab.personal");
					}, 1500);
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1)

		}

	}])
	// 退出登入   bugs
	.controller('SetController', ["$scope", "$state", "$rootScope", function($scope, $state, $rootScope) {
		$scope.outlogin = function() {
			localStorage.removeItem("token");
			$rootScope.bankListUser = "";
			$state.go("login");
		}
	}])

	// 帮助中心
	.controller('HelpController', ["$scope", "$http", "$state", "$ionicPopup", function($scope, $http, $state, $ionicPopup) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		$scope.status = 1;
		getTabs(1);
		// tab切换
		$scope.tabs = function(status) {
			$scope.status = status;
			getTabs(status);
		};
		// 读取数据

		function getTabs(status) {
			if(status == 1) {
				var url = "json/ed.json";
			} else if(status == 2) {
				var url = "json/hk.json";
			} else if(status == 3) {
				var url = "json/jk.json";
			} else if(status == 4) {
				var url = "json/fee.json";
			}
			$http.get(url).success(function(response) {
				$scope.fee = response;
			});

		}

		$scope.data = {
			showReorder: false
		};

	}])

	.controller('authenticationController', function($scope, $stateParams, $state, $ionicLoading, $timeout, $ionicTabsDelegate, $ionicSlideBoxDelegate, $http, $ionicPopup, REG, ajax, modal, $location, $filter, $rootScope) {

		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		$scope.jbinfo = {
			name: '',
			idcard: '',
			xjdz: '',
			jzsj: '',
			tel: '',
			weixin: '',
			qq: '',
			email: ''

		};
		$scope.sIRecord = {
			"inviteCode": ''
		};
		$scope.disablebtns = true;
		var i = 0;
		$scope.inputcheckbox = function() {
			i++;
			if(i % 2 != 0) {
				$scope.disablebtns = false;
				//$scope.ibox = true;

			} else {
				$scope.disablebtns = true;
				//$scope.ibox = false;

			}

		};
		//$scope.ibox = false;
		$scope.contractlook = function() {
			$state.go('contract');
			$scope.disablebtns = false;
			//$scope.ibox = true;
			document.getElementById("checkbox1").checked = true;

		};
		var id = localStorage.getItem("loanpageid");

		if(id == 1) {
			$scope.zsinvite = false
		} else {
			$scope.zsinvite = true
		}

		$scope.goNext = function() {

			if(!REG.isRealName($scope.jbinfo.name)) {
				modal.loading("请输入真实姓名", 1500);
				return
			} else if(!REG.isIdcard($scope.jbinfo.idcard)) {
				modal.loading("请输入有效身份证号", 1500);
				return
			}

			ajax.post("/api/users/step1", $scope.jbinfo, function(data) {
				if(data.basic.status == 1) {
					//$state.go("info")
					//$state.go('loan-details/' + id);
					//console.log(data)
					//localStorage.setItem("inviteRecordIds",data.data.inviteRecordId);
					//console.log(data.data.inviteRecordId)
					if(id == 1) {
						$state.go("info")
					} else if(id == 6) {
						//console.log(id);
						$state.go("kuaibeiWallet");

					} else {
						$location.path('/loan-details/' + id);
					}

					//localStorage.setItem("loanpageid", id);
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});

			///api/users/saveInviteRecord
			ajax.post("/api/daogou/saveInviteRecord", $scope.sIRecord, function(data) {
				if(data.basic.status == 1) {

					//console.log(data)
					localStorage.setItem("inviteRecordIds", data.data.inviteRecordId);
					//console.log(data.data.inviteRecordId)

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});

			localStorage.setItem("jbinfoname", $scope.jbinfo.name);
			localStorage.setItem("jbinfoidcard", $scope.jbinfo.idcard);

		};
		//

		//if(localStorage.getItem("jbinfoname") == null){

		// 读取数据填充
		ajax.post("/api/users/queryDataByStep", {
			"step": "1"
		}, function(data) {
			//console.log(data)
			if(data.basic.status == 1) {
				if(!isEmptyObject(data.data)) {
					$scope.jbinfo = data.data;

					//console.log(data)

					if(data.data.idcard != null) {
						$scope.authdis = true
					}
					//$scope.sid.clientSide = data.data.hunying;
					//$scope.zfqk.type = data.data.zfq;
					//$scope.dq.province = data.data.province;
					//$scope.dq.city = data.data.city;
					//$scope.dq.address = data.data.address;
					//vm.CityPickData.areaData=[$scope.dq.province,$scope.dq.city,$scope.dq.address];
				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		//}
		function isEmptyObject(obj) {
			for(var name in obj) {
				return false;
			}
			return true;
		}

	})

	.controller('borrowCompactCtrl', function($scope, $state) {

		$scope.gotoaddbank = function() {
			$state.go("addbank")

		}
	})

	.controller('contractCtrl', function($scope, $state) {

		$scope.gotoauth = function() {
			$state.go("authentication")

		}

	})
	// 验证 第一步
	.controller('InfoController', ["$scope", "$stateParams", "$ionicPopup", "REG", "ajax", "modal", "$state", "$timeout", function($scope, $stateParams, $ionicPopup, REG, ajax, modal, $state, $timeout) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		// 住房状况
		$scope.zfqk = {
			type: '请选择住房状况'
		};

		$scope.zflist = [{
			value: "自置无按揭"
		}, {
			value: "自置有按揭"
		}, {
			value: "亲属楼宇"
		}, {
			value: "集体宿舍"
		}, {
			value: "租房"
		}, {
			value: "其他"
		}, {
			value: "自建房"
		}];
		$scope.zf = function() {
			html = '<ion-radio ng-repeat="item in zflist" ng-value="item.value" ng-model="zfqk.type" ng-change="serverSideChange(item)" name="server-side">{{ item.value }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '请选择住房状况',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		$scope.jzsj = {
			type: '请选择居住时间'
		};
		//1年内，1-3年，3-5年，5年以上
		$scope.jzsjvalue = [{
			value: "1年内"
		}, {
			value: "1-3年"
		}, {
			value: "3-5年"
		}, {
			value: "5年以上"
		}];

		$scope.showjzsj = function() {

			html = '<ion-radio ng-repeat="item in jzsjvalue" ng-value="item.value" ng-model="jzsj.type" ng-change="serverSideChange(item)" name="server-side">{{ item.value }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '请选择住房状况',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});

		};

		// 婚姻状况
		$scope.sid = {
			clientSide: '请选择婚姻状况'
		};

		$scope.serverSideList = [{
			value: "未婚"
		}, {
			value: "已婚"
		}, {
			value: "其他"
		}];
		$scope.showselect = function() {
			html = '<ion-radio ng-repeat="item in serverSideList" ng-value="item.value" ng-model="sid.clientSide" ng-change="serverSideChange(item)" name="server-side">{{ item.value }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '请选择婚姻状况',
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
		$scope.dq = {};
		// 选择地址
		var vm = $scope.vm = {};
		vm.CityPickData = {
			areaData: ['请选择城市'],
			title: '居住地区',
			hardwareBackButtonClose: false,
			watchChange: true,
			buttonClicked: function() {
				$scope.dq.province = this.areaData[0];
				$scope.dq.city = this.areaData[1];
				$scope.dq.address = this.areaData[2];

			},
		};

		$scope.jbinfo = {
			name: '',
			idcard: '',
			xjdz: '',
			jzsj: '',
			tel: '',
			weixin: '',
			qq: '',
			email: ''
		};

		//localStorage.setItem("jbinfoname",$scope.jbinfo.name);
		//localStorage.setItem("jbinfoidcard",$scope.jbinfo.idcard);

		$scope.jbinfo.name = localStorage.getItem("jbinfoname");
		$scope.jbinfo.idcard = localStorage.getItem("jbinfoidcard");

		$scope.goNext = function() {
			$scope.jbinfo.zfq = $scope.zfqk.type;
			$scope.jbinfo.province = $scope.dq.province,
				$scope.jbinfo.city = $scope.dq.city,
				$scope.jbinfo.address = $scope.dq.address,
				$scope.jbinfo.hunying = $scope.sid.clientSide;
			$scope.jbinfo.jzsj = $scope.jzsj.type;

			if(!REG.isRealName($scope.jbinfo.name)) {
				modal.loading("请输入真实姓名", 1500);
				return
			} else if(!REG.isIdcard($scope.jbinfo.idcard)) {
				modal.loading("请输入有效身份证号", 1500);
				return
			} else
			if($scope.jbinfo.zfq == "请选择住房状况") {
				modal.loading("请选择住房状况", 1500);
				return
			} else if(!$scope.jbinfo.province || !$scope.jbinfo.city || !$scope.jbinfo.address) {
				modal.loading("请选择地区", 1500);
				return
			} else if(!$scope.jbinfo.xjdz) {
				modal.loading("请输入详细地址", 1500);
				return
			} else if($scope.jbinfo.zfq == "请选择婚姻状况") {
				modal.loading("请选择婚姻状况", 1500);
				return
			} else if(!REG.isMobile($scope.jbinfo.tel)) {
				modal.loading("输入正确的手机号", 1500);
				return
			} else if(!($scope.jbinfo.weixin)) {
				modal.loading("请输入微信号", 1500);
				return
			}
			ajax.post("/api/users/step1", $scope.jbinfo, function(data) {
				if(data.basic.status == 1) {
					$state.go("suppleInfo");
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			})
		}

		// 读取数据填充
		ajax.post("/api/users/queryDataByStep", {
			"step": "1"
		}, function(data) {
			if(data.basic.status == 1) {
				if(!isEmptyObject(data.data)) {
					$scope.jbinfo = data.data;
					$scope.sid.clientSide = data.data.hunying;
					$scope.zfqk.type = data.data.zfq;
					$scope.jzsj.type = data.data.jzsj;
					$scope.dq.province = data.data.province;
					$scope.dq.city = data.data.city;
					$scope.dq.address = data.data.address;
					vm.CityPickData.areaData = [$scope.dq.province, $scope.dq.city, $scope.dq.address];
				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}
		})

		function isEmptyObject(obj) {
			for(var name in obj) {
				return false;
			}
			return true;
		}

	}])
	// 验证第二部 辅助信息
	.controller('SuppleInfoController', ["$scope", "$stateParams", "$ionicPopup", "REG", "ajax", "modal", "$state", "$ionicModal", function($scope, $stateParams, $ionicPopup, REG, ajax, modal, $state, $ionicModal) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}
		// 请选择您的职业
		$scope.occupa = {
			type: '请选择您的社会身份'
		};

		$scope.occupation = [{
			value: "在职人员"
		}, {
			value: "企业负责人"
		}, {
			value: "自由职业"
		}, {
			value: "无业"
		}, {
			value: "退休"
		}, {
			value: "个体工商户"
		}, {
			value: "个体经营者"
		}];
		$scope.showOccupation = function() {
			html = '<ion-radio ng-repeat="item in occupation" ng-value="item.value" ng-model="occupa.type" ng-change="serverSideChange()" name="server-side">{{ item.value }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '请选择您的职业',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		// 教育程度
		$scope.educa = {
			type: '请选择最高学历'
		};

		$scope.education = [{
			value: "博士及以上"
		}, {
			value: "硕士"
		}, {
			value: "大学本科"
		}, {
			value: "大学专科/专科学院"
		}, {
			value: "高中/中专/技校"
		}, {
			value: "初中"
		}, {
			value: "初中以下"
		}];
		$scope.showEducation = function() {
			html = '<ion-radio ng-repeat="item in education" ng-value="item.value" ng-model="educa.type" ng-change="serverSideChange()" name="server-side">{{ item.value }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '请选择最高学历',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		// 亲属关系
		$scope.qs = {
			gx: '请选择联系人关系'
		};

		$scope.qslist = [{
			value: "父母"
		}, {
			value: "配偶"
		}, {
			value: "子女"
		}, {
			value: "兄妹"
		}, {
			value: "同事"
		}, {
			value: "朋友"
		}];
		$scope.showqs = function(num) {
			if(num >= 0) {
				html = '<ion-radio ng-repeat="item in qslist" ng-value="item.value" ng-model="articles[' + num + '].gx" ng-change="serverSideChange()" name="server-side">{{ item.value }}</ion-radio>';

			} else {
				html = '<ion-radio ng-repeat="item in qslist" ng-value="item.value" ng-model="qs.gx" ng-change="serverSideChange()" name="server-side">{{ item.value }}</ion-radio>';

			}
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '请选择联系人关系',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		$scope.gzsr = {
			type: '请选择收入范围'
		};

		$scope.gzsrvalue = [{
			value: "5000元以下"
		}, {
			value: "5000元-10000元"
		}, {
			value: "10000元-20000元"
		}, {
			value: "20000元以上"
		}];

		$scope.showGzsr = function() {
			html = '<ion-radio ng-repeat="item in gzsrvalue" ng-value="item.value" ng-model="gzsr.type" ng-change="serverSideChange()" name="server-side">{{ item.value }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '请选择收入范围',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		// 房贷
		$scope.fd = {
			isfd: '无'
		};

		$scope.fdlist = [{
			value: "无"
		}, {
			value: "有"
		}];
		$scope.showfd = function() {
			html = '<ion-radio ng-repeat="item in fdlist" ng-value="item.value" ng-model="fd.isfd" ng-change="serverSideChange()" name="server-side">{{ item.value }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '是否有房贷',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		// 车贷
		$scope.cd = {
			iscd: '无'
		};

		$scope.cdlist = [{
			value: "无"
		}, {
			value: "有"
		}];
		$scope.showcd = function() {
			html = '<ion-radio ng-repeat="item in cdlist" ng-value="item.value" ng-model="cd.iscd" ng-change="serverSideChange()" name="server-side">{{ item.value }}</ion-radio>';
			$scope.myPopup = $ionicPopup.show({
				template: html,
				title: '是否有车贷',
				scope: $scope,
				buttons: [{
					text: '取消'
				}]
			});
		};

		// 选择同地址
		$scope.settingsList = {
			'checked': false
		};

		// 添加联系人模板
		$ionicModal.fromTemplateUrl('templates/modal.html', {
			scope: $scope
		}).then(function(modal) {
			$scope.modal = modal;
		});

		// 关闭模板
		$scope.createContact = function(u) {
			$scope.contacts.push({
				name: u.firstName + ' ' + u.lastName
			});
			$scope.modal.hide();
		};

		$scope.articles = [];
		$scope.contact = {
			gx: '',
			xm: '',
			lxdh: '',
			txjdz: '',
			lxdz: '',
		};
		if($scope.contact.txjdz == false) {
			$scope.contact.lxdz = ''
		}
		$scope.addlist = function() {
			$scope.contact.gx = $scope.qs.gx;
			$scope.contact.txjdz = $scope.settingsList.checked;

			if($scope.contact.gx == '请选择联系人关系') {
				modal.loading("请选择联系人关系", 1500);
				return
			} else if(!$scope.contact.xm) {
				modal.loading("姓名不能为空", 1500);
				return
			} else if(!REG.isMobile($scope.contact.lxdh)) {
				modal.loading("手机号码不能为空", 1500);
				return
			} else if($scope.contact.txjdz == false && !($scope.contact.lxdz)) {
				modal.loading("请输入现居住详细地址", 1500);
				return
			}
			if($scope.contact.txjdz == true) {
				$scope.contact.lxdz = '同现居地址';
			}

			if(!$scope.articles) {
				$scope.articles = [];
				$scope.articles.push($scope.contact);
			} else {
				$scope.articles.push($scope.contact);
			}
			$scope.contact = {
				gx: '',
				xm: '',
				lxdh: '',
				txjdz: '',
				lxdz: ''
			};
			$scope.qs = {
				gx: "请选择联系人关系"
			};
			modal.loading("保存成功", 1500);
			$scope.modal.hide();
		};

		// 去往下一步
		//修改guo--2017年9月14日10:13:57
		$scope.jbinfo = {
			shsf: '',
			jycd: '',
			gzsr: '',
			qtsr: '',
			qtdk: '',
			youfd: '',
			youcd: '',
			youxykd: '',
			dwqc: '',
			area:'',//区号
			dwdh: '',//单位电话
			zjrzrq: '',
			dwdz: '',
			dwxxdz: '',
			otherContacts: ''
		};
		$scope.goNext = function() {
			$scope.jbinfo.shsf = $scope.occupa.type;
			$scope.jbinfo.jycd = $scope.educa.type;
			$scope.jbinfo.youfd = $scope.fd.isfd;
			$scope.jbinfo.youcd = $scope.cd.iscd;
			$scope.jbinfo.dwdz = $scope.dq;
			$scope.jbinfo.otherContacts = $scope.articles;
			$scope.jbinfo.gzsr = $scope.gzsr.type;

			if($scope.jbinfo.shsf == "请选择您的社会身份") {
				modal.loading("请选择您的社会身份", 1500);
				return
			} else if($scope.jbinfo.jycd == "请选择最高学历") {
				modal.loading("请选择最高学历", 1500);
				return
			} else if(!$scope.jbinfo.gzsr) {
				modal.loading("请输入您的工作收入", 1500);
				return
			}
			//else if (!$scope.jbinfo.qtsr) {
			//    modal.loading("请输入您的其他收入", 1500);
			//    return
			//}
			//else if (!$scope.jbinfo.qtdk) {
			//    modal.loading("请输入您的贷款金额", 1500);
			//    return
			//}
			//else if (!$scope.jbinfo.youxykd) {
			//    modal.loading("请输入您的信用卡张数", 1500);
			//    return
			//}
			else if(!$scope.jbinfo.dwqc) {
				modal.loading("请输入单位全称", 1500);
				return
			} else if(!$scope.jbinfo.dwdh) {
				modal.loading("请输入单位电话", 1500);
				return
			} else if(!$scope.jbinfo.dwdz) {
				modal.loading("请选择地区", 1500);
				return
			} else if(!$scope.jbinfo.dwxxdz) {
				modal.loading("请输入详细地址", 1500);
				return
			} else if(!$scope.jbinfo.otherContacts || $scope.jbinfo.otherContacts.length < 2) {
				modal.loading("请添加至少2位联系人", 1500);
				return
			}
			ajax.post("/api/users/step2", $scope.jbinfo, function(data) {
				if(data.basic.status == 1) {
					$state.go("reput");
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			})
		}

		$scope.dq = '';
		// 选择地址
		var vm = $scope.vm = {};
		vm.CityPickData = {
			areaData: ['请选择城市'],
			title: '单位地址',
			hardwareBackButtonClose: false,
			watchChange: true,
			buttonClicked: function() {
				$scope.dq = this.areaData[0] + ',' + this.areaData[1] + ',' + this.areaData[2];
			},
		}

		// 读取数据填充
		ajax.post("/api/users/queryDataByStep", {
			"step": "2"
		}, function(data) {
			if(data.basic.status == 1) {
				if(!isEmptyObject(data.data)) {
					$scope.jbinfo = data.data;
					$scope.occupa.type = $scope.jbinfo.shsf;
					$scope.gzsr.type = $scope.jbinfo.gzsr;
					$scope.educa.type = $scope.jbinfo.jycd;
					$scope.fd.isfd = $scope.jbinfo.youfd;
					$scope.cd.iscd = $scope.jbinfo.youcd;
					$scope.dq = $scope.jbinfo.dwdz;
					$scope.jbinfo.otherContacts = data.data.otherContacts;
					$scope.articles = data.data.otherContacts;
					if(!$scope.jbinfo.youxykd) {
						$scope.jbinfo.youxykd = "无"
					}
					vm.CityPickData.areaData = $scope.dq.split(",");

				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}
		})

		function isEmptyObject(obj) {
			for(var name in obj) {
				return false;
			}
			return true;
		}

		// 关闭弹窗
		$scope.serverSideChange = function(n) {
			$scope.myPopup.close();
		};

		// 删除联系人
		//$scope.delLxr = function(item) {
		//    $scope.confirmPopup = $ionicPopup.confirm({
		//        title: '提示',
		//        template: '确定删除姓名为' + item.xm + '的联系人？',
		//        buttons: [{
		//            text: '取消'
		//        }, {
		//            text: '确定',
		//            type: 'button-positive',
		//            onTap: function(e) {
		//                e.preventDefault();
		//                $scope.confirmPopup.close();
		//                $scope.articles.splice($scope.articles.indexOf(item), 1);
		//            }
		//
		//        }]
		//    });
		//};

		// 时间转换
		var weekDaysList = ["日", "一", "二", "三", "四", "五", "六"];
		var monthList = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
		var datePickerCallback = function(val) {
			if(typeof(val) === 'undefined') {} else {
				var oldTime = (new Date(val)).getTime(); //得到毫秒数
				var newTime = new Date(oldTime); //就得到普通的时间了
				$scope.jbinfo.zjrzrq = Todate(val);
			}
		};
		$scope.datepickerObject = {
			titleLabel: '日期选择', //Optional
			todayLabel: '今天', //Optional
			closeLabel: '取消', //Optional
			setLabel: '确定', //Optional
			setButtonType: 'button-calm', //Optional
			todayButtonType: 'button-calm', //Optional
			closeButtonType: 'button-calm', //Optional
			inputDate: new Date(), //Optional
			mondayFirst: false, //Optional
			//disabledDates: disabledDates, //Optional
			weekDaysList: weekDaysList, //Optional
			monthList: monthList, //Optional
			templateType: 'modal', //Optional
			modalHeaderColor: 'bar-calm', //Optional
			modalFooterColor: 'bar-calm', //Optional
			from: new Date(1990, 12, 31), //Optional
			to: new Date(2018, 12, 31), //Optional
			callback: function(val) { //Mandatory
				datePickerCallback(val);
			}
		};

		var htmlEl = angular.element(document.querySelector('html'));
		htmlEl.on('click', function(event) {
			if(event.target.nodeName === 'HTML') {
				if($scope.myPopup) { //myPopup即为popup
					$scope.myPopup.close();
				}
			}
		});

		function Todate(num) {
			//Fri Oct 31 18:00:00 UTC+0800 2008
			num = num + ""; //给字符串后就一个空格
			var date = "";
			var month = new Array();
			month["Jan"] = 1;
			month["Feb"] = 2;
			month["Mar"] = 3;
			month["Apr"] = 4;
			month["May"] = 5;
			month["Jun"] = 6;
			month["Jul"] = 7;
			month["Aug"] = 8;
			month["Sep"] = 9;
			month["Oct"] = 10;
			month["Nov"] = 11;
			month["Dec"] = 12;
			var week = new Array();
			week["Mon"] = "一";
			week["Tue"] = "二";
			week["Wed"] = "三";
			week["Thu"] = "四";
			week["Fri"] = "五";
			week["Sat"] = "六";
			week["Sun"] = "日";
			str = num.split(" "); //根据空格组成数组
			// date = str[5] + "-"; //就是在2008的后面加一个“-”
			//通过修改这里可以得到你想要的格式
			date = str[3] + "-" + month[str[1]] + "-" + str[2];
			// date = date + " 星期" + week[str[0]];
			return date;
		}
	}])

	// .controller('ChangePayPwdController', function($scope) {})
	//     .controller('ChangephoneController', function($scope) {})

	// 修改登入密码
	.controller('ChangepwdController', ["$scope", "ajax", "modal", "REG", "$state", "$ionicPopup", function($scope, ajax, modal, REG, $state, $ionicPopup) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		$scope.pwd = {
			"original": "",
			"password": "",
		};
		$scope.modifyPwd = function() {
			ajax.post("/api/users/modifyPwd", $scope.pwd, function(data) {
				if(!REG.isPwd($scope.pwd.original)) {
					modal.loading("请输入6-32位旧密码", 1500);
					return false
				}
				if(data.basic.status == 1) {
					modal.loading("修改成功,请重新登入", 1500);
					$state.go("login");
				} else {
					modal.loading(data.basic.msg, 1500);
				}

			});
		}

	}])

	// 找回交易密码
	// .controller('forgetPayPwdController', function($scope, $stateParams, $state) {

	//     })
	// 还款记录
	.controller('RepaylistController', ["$scope", "modal", "ajax", "FinancList", "$timeout", "$state", "$ionicPopup", function($scope, modal, ajax, FinancList, $timeout, $state, $ionicPopup) {
		if(!localStorage.getItem("token")) {
			var confirmPopup = $ionicPopup.confirm({
				title: '提示',
				template: '您还没有登录，立即登录',
				buttons: [{
					text: '取消'
				}, {
					text: '登录',
					type: 'button-positive',
					onTap: function(e) {
						$state.go("login");
						return
					}
				}, ]
			});
			return
		}

		var json = {
			"page": 1,
			"pageSize": 10
		};
		var url = "/api/userRepayment/list";
		ajax.post(url, json, function(data) {
			if(data.basic.status == 1) {
				$scope.articles = data.data.items;
				if(json.page <= data.data.paged.pageCount && data.data.paged.total > json.pageSize) {
					FinancList.param.hasmore = true;
				} else {
					FinancList.param.hasmore = false;
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);
		//上拉触发函数
		$scope.loadMore = function() {
			//这里使用定时器是为了缓存一下加载过程，防止加载过快
			$timeout(function() {
				if(!FinancList.param.hasmore) {
					$scope.$broadcast('scroll.infiniteScrollComplete');
					return;
				}
				$scope.articles = $scope.articles.concat(FinancList.getList(url));
				$scope.$broadcast('scroll.infiniteScrollComplete');
				FinancList.param.curPage++;
			}, 1500);
		};
		//控制列表是否允许其加载更多
		$scope.moreDataCanBeLoaded = function() {
			return FinancList.param.hasmore;
		}

	}])

	.controller('auditController', ["$scope", "modal", "ajax", "$stateParams", function($scope, modal, ajax, $stateParams) {
		$scope.ac = {
			isChecked1: true,
			isChecked2: true
		};
		ajax.post('/api/order/confirmContract', {
			oanOrderId: $stateParams.id
		}, function(data) {
			if(data.basic.status == 1) {
				//console.log(data.data)
				$scope.audit = data.data;
				//console.log(data);
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);
		$scope.pdfurl = function(index) {
			if(index == 1) {
				window.open($scope.audit.contract1);
			} else {
				window.open($scope.audit.contract2);
			}
		};
		$scope.goNext = function() {

			if($scope.ac.isChecked1 == false || $scope.ac.isChecked2 == false) {
				modal.loading("请查看并同意两项条款", 1500);
				return
			} else {
				window.location = "http://platform.kuaibeikj.com/kuaibei/api/lianlianpay/signApply?oanId=" + $stateParams.id
			}
		};
		//  http://platform.kuaibeikj.com/kuaibei/api/lianlianpay/signApply?oanId
	}])

	.controller('CouponsController', ["$scope", "$ionicSlideBoxDelegate", "$state", "ajax", "modal", function($scope, $ionicSlideBoxDelegate, $state, ajax, $http, $ionicPopup, $rootScope) {

		ajax.post("/api/coupon/queryAllMyCoupons", {}, function(data) {
			//console.log(data)
			if(data.basic.status == 1) {
				//if (!isEmptyObject(data.data)) {
				//
				//}
				if(data.data) {
					$scope.allnewyiuhuiq = data.data.myCoupon;
					//console.log(data.data.myCoupon)
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		$scope.useallnewCoupons = function(id) {

			//console.log(id );
			$scope.getCouponByid = id;

			//领取
			var getaddCoupon = {
				"cId": $scope.getCouponByid
			};
			ajax.post("/api/coupon/addCouponUser", getaddCoupon, function(data) {
				//console.log(data)
				if(data.basic.status == 1) {

					if(data.data) {
						//console.log(data);
					}
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);

			localStorage.setItem("loanpageid", "4");
			$state.go("authentication");
		};

		$scope.gouseptq = function() {
			localStorage.setItem("loanpageid", "4");
			$state.go("authentication");
		};
		//个人中心—我的优惠券-使用说明
		$scope.lookusetext = function() {
			$state.go("ticketUsetext")
		};
		//个人中心—我的优惠券-添加优惠券
		$scope.getActivityCode = function() {
			$state.go("getActivityCode")
		};

		$scope.tabNames = ['未使用', '已使用', '已过期'];
		$scope.slectIndex = 0;
		$scope.activeSlide = function(index) {
			//console.log(index)
			$scope.slectIndex = index;
			$ionicSlideBoxDelegate.slide(index);

		};
		$scope.slideChanged = function(index) {
			$scope.slectIndex = index;

		};
		$scope.pages = [
		"templates/user/Coupons/Coupons_Not.html", 
		"templates/user/Coupons/Coupons_Done.html", 
		"templates/user/Coupons/Coupons_Over.html"
		];

	}])

	//领取优惠券 --guo
	.controller('getActivityCodeCtrl', ["$scope", "$state", "ajax", "$rootScope", "modal", "$ionicPopup", function($scope, $state, ajax, $rootScope, modal, $ionicPopup) {
		$scope.json = {
			code: ""
		}
		$scope.addCouponByCode = function() {
			if($scope.json.code != null &&$scope.json.code) {
					console.log($scope.json.code+"-2")
				//添加优惠券-接口
				ajax.post("/api/coupon/addCouponByCode", $scope.json, function(data) {

					if(data.basic.status == 1) {
						//判断领取状态
						if(data.data == 1) {
							modal.loading("恭喜您，领取成功", 1500);
						} else if(data.data == 2) {
							modal.loading("领取失败，您已经领取过该优惠券", 1500);
						} else if(data.data == 3) {
							modal.loading("领取失败，优惠券已经领完啦！", 1500);
						} else if(data.data == 4) {
							modal.loading("领取失败，活动已经结束", 1500);
						} else if(data.data == 5) {
							modal.loading("领取失败，优惠码不存在", 1500);
						}
					} else {
						modal.loading("未知错误,请联系技术人员", 1500);
					}
				})

			} else {
				modal.loading("请输入优惠券", 1500);
			}

		};
	}])
	//
	.controller('ticketUsetextCtrl', ["$scope", "$state", "$rootScope", function($scope, $state, $rootScope) {

		$scope.goCoupons = function() {
			$state.go("myCoupons")
		};
		var clicknum = 0;
		$scope.lookdetails = function(textnum) {
			clicknum++;

			if(clicknum % 2 != 0) {
				if(textnum == "1") {
					$scope.textdetails1 = true;
					$scope.textdetails2 = false;
					$scope.textdetails3 = false;
					//$scope.textdetails4 = false;
				} else if(textnum == "2") {
					$scope.textdetails2 = true;
					$scope.textdetails1 = false;
					$scope.textdetails3 = false;
					//$scope.textdetails4 = false;
				} else if(textnum == "3") {
					$scope.textdetails3 = true;
					$scope.textdetails1 = false;
					$scope.textdetails2 = false;
					//$scope.textdetails4 = false;
				} else {
					$scope.textdetails3 = false;
					$scope.textdetails1 = false;
					$scope.textdetails2 = false;
					//$scope.textdetails4 = true;
				}
			} else {
				$scope.textdetails3 = false;
				$scope.textdetails1 = false;
				$scope.textdetails2 = false;
				//$scope.textdetails4 = false;
			}

		}
	}])

	.controller('discountController', ["$scope", "$ionicSlideBoxDelegate", "$state", "ajax", "modal", function($scope, $ionicSlideBoxDelegate, $state, ajax, $http, $ionicPopup, $rootScope) {

		//`status` tinyint(4) DEFAULT NULL COMMENT '状态  0未启用 1有效中 2已失效',

		$scope.tabNames = ['未使用', '已使用', '已过期'];
		$scope.slectIndex = 0;
		$scope.activeSlide = function(index) { //点击时候触发
			$scope.slectIndex = index;
			$ionicSlideBoxDelegate.slide(index);

		};
		$scope.slideChanged = function(index) { //滑动时候触发
			$scope.slectIndex = index;

		};
		$scope.pages = [
		"templates/user/discount/discountTab_Not.html",
		"templates/user/discount/discountTab_Done.html", 
		"templates/user/discount/discountTab_Over.html"
		];

		$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent, index) {
			//这里写获取dom的操作，
			$scope.activeSlide = function(index) { //点击时候触发
				$scope.slectIndex = index;
				//$ionicSlideBoxDelegate.slide(index);
				//console.log(index)
				//document.getElementById("boxstext").style.color = "#397FF5"
			};

		});

		//商家
		ajax.post("/api/coupon/queryAllMyCoupons", {}, function(data) {
			//console.log(data);

			if(data.basic.status == 1) {
				//if (!isEmptyObject(data.data)) {
				//
				//}
				//   -1 未到使用期  0 已过期 1 有效   ？已使用
				//$scope.allyiuhuiq.status
				if(data.data) {

					$scope.allyiuhuiq = data.data.sjCoupon;
				}
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		$scope.useCoupons = function(id) {

			//console.log(id );
			$scope.getCouponByid = id;

			//领取
			var getaddCoupon = {
				"cId": $scope.getCouponByid
			};
			ajax.post("/api/coupon/addCouponUser", getaddCoupon, function(data) {
				//console.log(data)
				if(data.basic.status == 1) {
					//if (!isEmptyObject(data.data)) {
					//
					//}
					if(data.data) {
						//console.log(data);
					}
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);

			localStorage.setItem("loanpageid", "5");
			$state.go("authentication");
		};

		$scope.lookdisusetext = function() {
			$state.go("discountDirections")
		}

	}])

	.controller('myAccountController', ["$scope", "$state", "ajax", "modal", "$stateParams", "$rootScope","$location", function($scope, $state, ajax, modal, $stateParams, $rootScope, $location) {

		$scope.tabNames = ['授信额度', '我的余额', '邀请奖励'];
		$scope.slectIndex = 0;
		$scope.activeSlide = function(index) {
			//console.log(index)
			$scope.slectIndex = index;
			//$ionicSlideBoxDelegate.slide(index);

		};
		$scope.slideChanged = function(index) {
			$scope.slectIndex = index;

		};
		$scope.pages = [
		"templates/user/account/amount_Limit.html",
		"templates/user/account/amount_Balance.html",
		"templates/user/account/amount_Invite.html"
		];

		ajax.post("/api/limit/queryLimit", {

		}, function(data) {
			if(data.basic.status == 1) {

				if(data.data) {
					//console.log(data);
					$scope.Limitlist = data.data;

					if($scope.Limitlist.totalLimit == "0.00") {
						$scope.noLimit = true;
						$scope.Limitbtntext = "立即激活";
						$scope.gotoloanpage = function() {
							localStorage.setItem("loanpageid", "1");
							$state.go("authentication");
						};
					} else {
						$scope.noLimit = false;
						$scope.Limitbtntext = "立即使用";   //  跳转到正常分期服务   id 5  这里有bug  这里写为固定
						$scope.gotoloanpage = function() {
							ajax.post('/home', json, function(data){
								$location.path('authentication');
								localStorage.setItem("loanpageid", data.data.products[1].id);
								localStorage.setItem('maxAmount',data.data.products[1].maxAmount);
								localStorage.setItem('minAmount',data.data.products[1].minAmount);
								localStorage.setItem('defaultAmount',data.data.products[1].defaultAmount);
							});
//							$state.go("authentication");
						};

					}
				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});
		//

		//元素数据
		$scope.orderlist = {
			'mount': localStorage.getItem("defaultAmount")

		};

		//$scope.$on("$ionicView.beforeEnter", function(event, data){
		//
		//  var cacheFlag = localStorage.getItem("cacheFlag");
		//
		//  if(cacheFlag){
		//    //console.log(cacheFlag);
		//    var cacheData = JSON.parse(cacheFlag);
		//    $scope.orderlist = cacheData.orderlist;
		//    $scope.settingsList = cacheData.settingsList;
		//    $scope.onebank = cacheData.onebank;
		//    $scope.on =cacheData.on;
		//
		//    localStorage.removeItem("cacheFlag");
		//  }
		//
		//
		//});

		//跳转到银行做一个记录
		$scope.toBank = function() {
			//var cacheData = {};
			//cacheData.orderlist = $scope.orderlist;
			//cacheData.settingsList = $scope.settingsList;
			//cacheData.onebank = $scope.onebank;
			//cacheData.on =$scope.on;
			//localStorage.setItem("cacheFlag",JSON.stringify(cacheData));
			$state.go('bank');
		};

		var json = {
			"amount": $scope.orderlist.mount,
			"id": $stateParams.id
		};
		// 显示银行卡
		ajax.post("/api/userBankCard/list", json, function(data) {
			if(data.basic.status == 1) {
				if(data.data) {

					angular.forEach(data.data, function(itme, index) {
						if(itme.isMaster == 1) {
							//console.log(itme );
							$rootScope.onebank = itme;
						}
					});
				} else {
					$scope.onebank.str = "选择银行卡";
				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}

		});

		$scope.json = {
			"type": "0"
		};
		$scope.midtextinfo = "注册奖励";
		/////api/daogou/queryDaogouInviteRecords
		////$scope.json ={};
		ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);

				$scope.zsclientinfo = data.data.dgiList;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		//功能：会员查看自己的所有红包
		//URL：/api/red/queryMyRed
		//参数：
		//无
		//返回值：
		//redUserVOList
		//{'myStatus':'0','myMsg':'您尚无红包'}
		$scope.MyRed = {};
		ajax.post("/api/red/queryMyRed", $scope.MyRed, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.myredpacketall = data.data;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		$scope.redpacketdh = {
			//rId:"",
			redUserId: "",
			cId: "1"
		};

		//$scope.userid =   localStorage.getItem("upid");
		$scope.duihuanquan1 = function(id) {
			//$scope.redpacketdh.rId = id
			//console.log($scope.userid)
			$scope.redpacketdh.redUserId = id;

			ajax.post("/api/red/saveRedToCoupon", $scope.redpacketdh, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();
					//console.log(data);

					$scope.showAlert();
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);

			$scope.showAlert = function() {
				var alertPopup = $ionicPopup.alert({
					title: '红包兑换',
					template: '红包兑换成平台优惠券成功，请在平台优惠券处查看！'
				});
				alertPopup.then(function(res) {
					//console.log('Thank you for not eating my delicious ice cream cone');
				})
			};

		}

	}])

	.controller('invitecodepageController', ["$scope", "ajax", "modal", "REG", "$interval", "$timeout", "$ionicPopup", "$state", "$rootScope", function($scope, ajax, modal, REG, $interval, $timeout, $ionicPopup, $state, $rootScope) {

		$scope.sh = {
			itme: {
				name: '请选择您的所属品牌'
			}
		};
		$scope.json = {
			"code": "",
			"name": "",
			"idNum": "",
			"mobile": "",
			"remark": "",
			"shopName	": "",
			"storeName": "",
			"storeId	": "",
			"shopId": "",
			"salerName": "",
			"salerMobile": ""
		};
		$scope.zs = {
			"isIdcard": ""
		};
		//$scope.json.shId = $scope.sh.itme.id;
		// 选择商户

		ajax.post("/api/shop/load", {}, function(data) {
			if(data.basic.status == 1) {
				$scope.shopList = data.data;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		});

		$scope.inpute2 = true;
		$scope.shop = function() {
			$scope.inpute1 = true;
			$timeout(function() {
				html = '<ion-radio ng-repeat="item in shopList" ng-value="item"  ng-model="sh.itme" ng-change="serverSideChange()">{{ item.name }}</ion-radio>';
				$scope.myPopup = $ionicPopup.show({
					template: html,
					title: '请选择品牌',
					scope: $scope,
					buttons: [{
						text: '取消'
					}]
				});

			}, 500);
		};

		// 选择名店

		$scope.store = {
			itme: {
				name: '请选择您的所属门店'
			}
		};

		$scope.storeId = function(shopid) {
			if(!shopid) {
				modal.loading("请先选择品牌", 1500);
				return
			}
			ajax.post("/api/shop/load", {
				"pid": shopid
			}, function(data) {
				if(data.basic.status == 1) {
					$scope.storeList = data.data;
					//console.log(data.data);
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});
			$timeout(function() {
				html = '<ion-radio ng-repeat="item in storeList" ng-value="item"  ng-model="store.itme" ng-change="serverSideChange()">{{ item.name }}</ion-radio>';
				$scope.myPopup = $ionicPopup.show({
					template: html,
					title: '请选择门店',
					scope: $scope,
					buttons: [{
						text: '取消'
					}]
				});
			}, 500);
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

		$scope.gotogetzscode = function() {

			//console.log($scope.store.itme.name)

			$scope.json.shopName = $scope.sh.itme.name;
			$scope.json.storeName = $scope.store.itme.name;

			$scope.json.shopId = $scope.sh.itme.id;
			$scope.json.storeId = $scope.store.itme.id;
			$scope.json.salerName = localStorage.getItem("salerNames");
			//localStorage.setItem("salerNames", data.data.salerName);
			//localStorage.setItem("salerMobiles", data.data.salerMobile);
			$scope.json.salerMobile = localStorage.getItem("salerMobiles");
			//$scope.json.idNum =   $scope.zs.isIdcard;
			//console.log($scope.json.shId);

			if(!REG.isRealName($scope.json.name)) {
				modal.loading("请输入正确的姓名", 1500);
				return
			} else if(!REG.isIdcard($scope.json.idNum)) {
				modal.loading("请输入正确的身份证号", 1500);
				return
			} else if(!REG.isMobile($scope.json.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);
				return
			} else if(!$scope.json.code) {
				modal.loading("请输入验证码", 1500);
				return
			}

			ajax.post("/api/daogou/submit", $scope.json, function(data) {
				if(data.basic.status == 1) {

					localStorage.setItem("uid ", data.data.uid);
					localStorage.setItem("zsinviteCode", data.data.inviteCode);
					$state.go("zsaward");
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});

		}

	}])

	.controller('zscounselorController', ["$scope", "$state", "ajax", "REG", "modal", "$rootScope", function($scope, $state, ajax, REG, modal, $http, $ionicPopup, $rootScope) {

		$scope.json = {
			"salerName": "",
			"salerMobile": ""
		};

		$scope.gotoNextcode = function() {

			//console.log($scope.json.salerName)

			if(!REG.isRealName($scope.json.salerName)) {
				modal.loading("请输入真实姓名", 1500);
				return
			} else if(!REG.isMobile($scope.json.salerMobile)) {
				modal.loading("请输入有效手机号码", 1500);
				return
			}

			ajax.post("/api/daogou/checkSaler", $scope.json, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();
					//console.log(data.data.salerName);

					localStorage.setItem("salerNames", data.data.salerName);
					localStorage.setItem("salerMobiles", data.data.salerMobile);

					$state.go("invitecodepage")
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);

		}
	}])

	.controller('zsawardController', ["$scope", "$state", "ajax", "modal", function($scope, $state, ajax, modal, $http, $ionicPopup, $rootScope) {

		$scope.zsinviteCode = localStorage.getItem("zsinviteCode");

		$scope.toadetails = function() {
			$state.go("awarddateils")
		};
		$scope.goinviterecord = function() {
			localStorage.setItem("typenum", "1");
			$state.go("inviterecordpage")
		};
		$scope.gozsinfo = function() {
			$state.go("zsinfo")
		}

	}])

	.controller('awarddetailslistController', ["$scope", "$state", "ajax", "modal", "$stateParams", "$ionicPopup", function($scope, $state, ajax, modal, $stateParams, $ionicPopup) {
		//type   邀请类型，0普通邀请码的订单 1导购邀请码的订单
		//type 邀请类型，0普通邀请注册， 1导购邀请交易，2普通邀请交易

		//console.log($stateParams.jlnum);

		if($stateParams.jlnum == "2") {
			$scope.jlnum22 = true;
			$scope.jlnum11 = false;
		} else {
			$scope.jlnum11 = true;
			$scope.jlnum22 = false;
		}

		$scope.json = {
			"type": "1"
		};
		///api/daogou/queryDaogouInviteRecords
		//$scope.json ={};
		ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);

				$scope.zsclientinfo = data.data.dgiList;
				$scope.allbonusSum = data.data.bonusSum
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		//分期红包两级处理显示

		//功能：会员查看自己的所有红包
		//URL：/api/red/queryMyRed
		//参数：
		//无
		//返回值：
		//redUserVOList
		//{'myStatus':'0','myMsg':'您尚无红包'}
		$scope.MyRed = {};
		ajax.post("/api/red/queryMyRed", $scope.MyRed, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.myredpacketall = data.data;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		////hongbao----记录
		//功能：红包兑换成优惠券，暂时只能兑换成管理费减免券，且1:1兑换
		//URL：/api/red/saveRedToCoupon
		//参数：
		//rId: 红包id
		//redUserId：红包用户关联的id
		//cId：优惠券id
		//返回值：
		//{'myStatus':'1','myMsg':'兑换成功！'}
		//{'myStatus':'0','myMsg':'兑换失败，红包已经使用！'}
		//{'myStatus':'-1','myMsg':'兑换失败，数据库未查到您有该红包！'}
		// rId: 红包id  不要的

		//cId:"1"  费用减免券

		$scope.redpacketdh = {
			//rId:"",
			redUserId: "",
			cId: "1"
		};

		//$scope.userid =   localStorage.getItem("upid");
		$scope.duihuanquan = function(id) {
			//$scope.redpacketdh.rId = id
			//console.log($scope.userid)
			$scope.redpacketdh.redUserId = id;

			ajax.post("/api/red/saveRedToCoupon", $scope.redpacketdh, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();
					//console.log(data);

					//$scope.showAlert();
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);
			$scope.showAlert = function() {
				var alertPopup = $ionicPopup.alert({
					title: '红包兑换',
					template: '红包兑换成平台优惠券成功，请在平台优惠券处查看！'
				});
				alertPopup.then(function(res) {
					//console.log('Thank you for not eating my delicious ice cream cone');
				})
			};

		}

	}])

	.controller('zsinfoController', ["$scope", "$state", "ajax", "modal", function($scope, $state, ajax, modal, $http, $ionicPopup, $rootScope) {

		//查看导购
		$scope.json = {
			"uid": ""
		};

		ajax.post("/api/daogou/queryDaogou", $scope.json, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);

				$scope.zsinfo = data.data;
				localStorage.setItem("zsinviteCode", data.data.inviteCode);
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

	}])

	.controller('inviterecordpageController', ["$scope", "$state", "ajax", "modal", function($scope, $state, ajax, modal, $http, $ionicPopup) {

		//type   邀请类型，0普通邀请码的订单 1导购邀请码的订单
		//type 邀请类型，0普通邀请注册， 1导购邀请交易，2普通邀请交易
		//$scope.json = {
		//  "type":"1"
		//};
		//
		//$scope.midtextinfo = "分期金额";
		/////api/daogou/queryDaogouInviteRecords
		////$scope.json ={};
		//ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json, function(data) {
		//  if (data.basic.status == 1) {
		//    modal.loadingHide();
		//    console.log(data);
		//
		//    $scope.zsclientinfo = data.data;
		//  } else {
		//    modal.loading(data.basic.msg, 1500);
		//  }
		//},1);

		$scope.typenum = localStorage.getItem("typenum");
		//console.log($scope.typenum);
		if($scope.typenum == 1) {

			$scope.json = {
				"type": "1"
			};

			$scope.midtextinfo = "分期金额";
			///api/daogou/queryDaogouInviteRecords
			//$scope.json ={};
			ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();
					//console.log(data);

					$scope.zsclientinfo = data.data.dgiList;
					//console.log( $scope.zsclientinfo.b_name);
					localStorage.setItem("allbonusSum", data.data.bonusSum);
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);
		} else if($scope.typenum == "0") {
			$scope.json = {
				"type": "0"
			};
			$scope.midtextinfo = "邀请奖励";
			/////api/daogou/queryDaogouInviteRecords
			////$scope.json ={};
			ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();
					//console.log(data);

					$scope.zsclientinfo = data.data.dgiList;
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);

		} else {
			$scope.json = {
				"type": "2"
			};
			$scope.midtextinfo = "分期金额";
			///api/daogou/queryDaogouInviteRecords
			//$scope.json ={};
			ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();
					//console.log(data);

					$scope.zsclientinfo = data.data;
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);
		}

		///api/daogou/queryDaogouInviteRecords
	}])

	.controller('ptUnpayToDgController', ["$scope", "$state", "ajax", "modal", "$stateParams", "$rootScope", function($scope, $state, ajax, modal, $stateParams, $http, $ionicPopup, $rootScope) {

		//功能：导购查看自己的已还款计划和未还款计划
		//URL：/api/red/queryPayDaogouSchedule
		//参数：
		//无
		//返回值：
		//paidList,unpayList

		///api/daogou/queryPayDaogouSchedule
		$scope.jsonSchedule = {};
		ajax.post("/api/daogou/queryPayDaogouSchedule", $scope.jsonSchedule, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.ptUnpaydata = data.data.unpayList;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

	}])
	.controller('awarddateilsController', ["$scope", "$state", "ajax", "modal", "$location", function($scope, $state, ajax, modal, $location, $http, $ionicPopup, $rootScope) {

		//查看余额变动记录
		///api/wallet/queryInoutLog

		//提现申请
		///api/wallet/addWithdraw

		//查看提现记录
		///api/wallet/queryWithdrawLog
		// allbonusSum 导购当前邀请分期红包
		//$scope. bonusSum =  localStorage.getItem("allbonusSum") ;

		$scope.goadl = function(jlnum) {
			//console.log(jlnum);
			//$state.go("awarddetailslist",jlnum)
			$location.path('/awarddetailslist/' + jlnum);
		};

		$scope.ptunpay = function() {
			$state.go("ptUnpayToDg")
		}

		$scope.gotofenqi = function() {
			localStorage.setItem("loanpageid", 5);
			$state.go("authentication")
		};

		$scope.tabNames = ['现金奖', '红包奖'];
		$scope.slectIndex = 0;
		$scope.activeSlide = function(index) {
			//console.log(index)
			$scope.slectIndex = index;
			//$ionicSlideBoxDelegate.slide(index);
		};
		$scope.slideChanged = function(index) {
			$scope.slectIndex = index;
		};
		$scope.pages = ["/templates/info/awarddetails1.html", "/templates/info/awarddetails2.html"];

		$scope.wantwithdraw = function() {
			$state.go("awardwithdraw")
		};

		//查看可提现余额 /api/wallet/queryMoney
		$scope.jsonqueryMoney = {};
		ajax.post("/api/wallet/queryMoney", $scope.jsonqueryMoney, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.moneyLefts = data.data.moneyLeft;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		//    功能：导购查看现金奖励计划。
		//    * 访问z_pay_daogou_schedule表；
		//    * 应前端要求，一个URL返回两个结果集，一个是未发放计划，一个是已发放计划
		//    URL：/api/daogou/queryPayDaogouSchedule
		//    参数：
		//	无
		//    返回值：
		//	paidList,unpayList
		//
		//

		//    功能：导购查看所有未发的现金奖励总和。
		//URL：/api/daogou/queryAllUnpayCashForDaogou
		//    参数：
		//	无
		//    返回值：
		//	totalCashBonus
		$scope.jsonUnpay = {};
		ajax.post("/api/daogou/queryAllUnpayCashForDaogou", $scope.jsonUnpay, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.untotalCashBonus = data.data.totalCashBonus;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		//    //查看提现记录
		//    /api/wallet/queryWithdrawLog
		////查看导购邀请交易的总现金奖励（收入）
		//    /api/wallet/queryDaogouTotalCashBonus

		$scope.json = {};

		ajax.post("/api/wallet/queryWithdrawLog", $scope.json, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);

				$scope.WithdrawLogs = data.data;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		ajax.post("/api/daogou/queryDaogouTotalCashBonus", $scope.json, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.totalCashBonuss = data.data.totalCashBonus
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		$scope.jsonreddetail = {
			"type": "1"
		};
		///api/daogou/queryDaogouInviteRecords
		//$scope.json ={};
		ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.jsonreddetail, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);

				$scope.zsclientinfo = data.data.dgiList;
				//console.log( $scope.zsclientinfo.b_name);
				$scope.bonusSum = data.data.bonusSum;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

	}])

	.controller('awardwithdrawController', ["$scope", "$state", "ajax", "modal", "$stateParams", "$rootScope", function($scope, $state, ajax, modal, $stateParams, $http, $ionicPopup, $rootScope) {

		$scope.json = {
			"type": "1"
		};

		///api/daogou/queryDaogouInviteRecords
		//$scope.json ={};
		ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);

				$scope.zsclientinfo = data.data.dgiList;
				//localStorage.setItem("allbonusSum",data.data.bonusSum) ;
				$scope.bonusSums = data.data.bonusSum;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		///api/daogou/queryDaogouInviteRecords
		//
		//会员或者导购查看邀请(注册或者交易）记录。
		//* 根据type的值，可能返回专属邀请码交易记录，也可能是普通邀请码交易记录，也可能是邀请注册记录。
		//* type : 0普通注册邀请，  1导购专属邀请交易，2普通邀请交易

		//查看可提现余额 /api/wallet/queryMoney
		$scope.jsonqueryMoney = {};
		ajax.post("/api/wallet/queryMoney", $scope.jsonqueryMoney, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.moneyLefts = data.data.moneyLeft;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		//元素数据
		$scope.orderlist = {
			'mount': localStorage.getItem("defaultAmount")
		};

		$scope.$on("$ionicView.beforeEnter", function(event, data) {

			var cacheFlag = localStorage.getItem("cacheFlag");

			if(cacheFlag) {
				//console.log(cacheFlag);
				var cacheData = JSON.parse(cacheFlag);
				$scope.orderlist = cacheData.orderlist;
				$scope.settingsList = cacheData.settingsList;
				$scope.onebank = cacheData.onebank;
				$scope.on = cacheData.on;

				localStorage.removeItem("cacheFlag");
			}

		});

		//跳转到银行做一个记录
		$scope.toBank = function() {
			var cacheData = {};
			cacheData.orderlist = $scope.orderlist;
			cacheData.settingsList = $scope.settingsList;
			cacheData.onebank = $scope.onebank;
			cacheData.on = $scope.on;
			localStorage.setItem("cacheFlag", JSON.stringify(cacheData));
			$state.go('bank');
		};

		var json = {
			"amount": $scope.orderlist.mount,
			"id": $stateParams.id
		};
		// 显示银行卡
		ajax.post("/api/userBankCard/list", json, function(data) {
			if(data.basic.status == 1) {
				if(data.data) {

					angular.forEach(data.data, function(itme, index) {
						if(itme.isMaster == 1) {
							$scope.onebank = itme;
							//console.log($scope.onebank.account);
							$scope.onebankaccount = $scope.onebank.account;
						}
					});
				} else {
					$scope.onebank.str = "选择银行卡";
				}

			} else {
				modal.loading(data.basic.msg, 1500);
			}

		});

		$scope.jsonWithdraw = {
			amount: "",
			bankNum: ""
		};
		$scope.gowithdrawmoney = function() {
			//提现申请
			///api/wallet/addWithdraw

			$scope.jsonWithdraw.bankNum = $scope.onebankaccount;
			ajax.post("/api/wallet/addWithdraw", $scope.jsonWithdraw, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();
					//console.log(data);
					//提现成功后，提醒，跳转回
					if(data.data.myStatus == "1") {

						$scope.showAlert = function() {
							var alertPopup = $ionicPopup.alert({
								title: '奖励提现',
								template: '奖励金已提现成功，请查收！'
							});
							alertPopup.then(function(res) {
								//console.log('Thank you for not eating my delicious ice cream cone');
								$rootScope.myBack('tab.index', 'true')
							})
						};
						$scope.showAlert();
					} else {
						$scope.errshowAlert = function() {
							var alertPopup = $ionicPopup.alert({
								title: '奖励提现',
								template: '奖励金提现失败，请重新操作！'
							});
							alertPopup.then(function(res) {
								//console.log('Thank you for not eating my delicious ice cream cone');

							})
						};
						$scope.errshowAlert();
					}
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);

			//console.log($scope.jsonWithdraw.amount)
		}

	}])

	.controller('friendrRequestsController', ["$scope", "$state", "ajax", "$interval", "$rootScope", "$location", function($scope, $state, ajax, $interval, $rootScope, $location) {

		var json = {};
		ajax.post("/api/daogou/applyPInviteCode", json, function(data) {
			if(data.basic.status == 1) {
				if(data.data) {
					//console.log(data);
					$scope.pInviteCode = data.data.pInviteCode;
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}
		});

		$scope.upid = {
			id: ""
		};
		$scope.upid.id = localStorage.getItem("upid");
		//console.log($scope.upid.id);
		//    /wx/getInviterInfo
		ajax.post("/wx/getInviterInfo", $scope.upid, function(data) {
			if(data.basic.status == 1) {
				if(data.data) {

					//$scope.setupid = data.data.id;
					//$scope.setinviteCode = data.data.inviteCode;
					//$scope.setupname = data.data.name;
					localStorage.setItem("setupid", data.data.id);
					//$rootScope.pInviteCode = data.data.inviteCode;
					//console.log($rootScope.pInviteCode);
					localStorage.setItem("setinviteCode", data.data.inviteCode);
					localStorage.setItem("setupname", data.data.name);
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}
		});
		var setinviteCodes = localStorage.getItem("setinviteCode");

		$scope.invitecode = function() {
			//$state.go("friendpartIn",setinviteCodes)
			$location.path('/friendpartIn/' + setinviteCodes);
		};

		$scope.golookrecord = function() {
			localStorage.setItem("typenum", "0");
			$state.go("inviterecordpage")
		};

		$scope.go_myShare = function() {
			$state.go("myShare")

		};

		var oldcententview = document.getElementById("oldcontent");
		$scope.sharetofriend = function() {
			oldcententview.style.opacity = 0.2;
			$scope.newcontentview = true;
		};
		$scope.newcontent = function() {
			oldcententview.style.opacity = 1;
			$scope.newcontentview = false;
		};

		//jsapi_ticket=kgt8ON7yVITDhtdwci0qec9rxSaxCF9r8t2bU5fEmPcszAFWN565348753NiEFUQOhGnArXpGqNwGNKnDU20bQ&noncestr=42770331-7afa-48e6-a864-aa2fc202082f&timestamp=1501155881&url=http://kuaibei.vicp.io/
		//timestamp, 1501155881
		//nonceStr, 42770331-7afa-48e6-a864-aa2fc202082f
		//jsapi_ticket, kgt8ON7yVITDhtdwci0qec9rxSaxCF9r8t2bU5fEmPcszAFWN565348753NiEFUQOhGnArXpGqNwGNKnDU20bQ
		//signature, a65c8565e0fab08c45932eb5a52cbbfadd668e30
		//url, http://kuaibei.vicp.io/

		//jsapi_ticket=kgt8ON7yVITDhtdwci0qec9rxSaxCF9r8t2bU5fEmPfY390c4J5t3KXLZVF5JN0fWnoAbt3mSOVTVGgU0pgqQg&noncestr=1a5d7d44-7d63-4b95-b03c-1a75b89681c4&timestamp=1501213635&url=http://kuaibei.vicp.io/#/invitecodepage
		//signature, f2369f792f47361a5cfeef09e7f121725b9a2381
		//jsapi_ticket, kgt8ON7yVITDhtdwci0qec9rxSaxCF9r8t2bU5fEmPfY390c4J5t3KXLZVF5JN0fWnoAbt3mSOVTVGgU0pgqQg
		//url, http://kuaibei.vicp.io/#/invitecodepage
		//nonceStr, 1a5d7d44-7d63-4b95-b03c-1a75b89681c4
		//timestamp, 1501213635

		//
		var jsonurl = window.location.href.split('#')[0];
		console.log(jsonurl);
		$scope.timer = $interval(function() {
			//  //getSign
			ajax.post("/wx/getSign", json, function(data) {

				if(data.basic.status == 1) {
					if(data.data) {
						console.log(data.data.result);
						localStorage.setItem("allsign", JSON.stringify(data.data.result));
						localStorage.setItem("alltimestamp", data.data.result.timestamp);
						localStorage.setItem("allnonceStr", data.data.result.nonceStr);
						localStorage.setItem("allsignature", data.data.result.signature);
					} else {}
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});
			//
		}, 7000000);

		//$scope.string1 = "jsapi_ticket=kgt8ON7yVITDhtdwci0qec9rxSaxCF9r8t2bU5fEmPcszAFWN565348753NiEFUQOhGnArXpGqNwGNKnDU20bQ&noncestr=xwzs3&timestamp=2017072717&url=http://kuaibei.vicp.io/";
		//
		//localStorage.setItem("allsign", "null");
		//$scope.allsign = eval('(' + localStorage.getItem("allsign") + ')');
		$scope.allsign = localStorage.getItem("allsign");
		//console.log($scope.allsign );
		if($scope.allsign == "null") {
			ajax.post("/wx/getSign", json, function(data) {
				console.log($scope.allsign);
				if(data.basic.status == 1) {
					if(data.data) {
						//console.log(data.data.result);
						localStorage.setItem("allsign", JSON.stringify(data.data.result));
						localStorage.setItem("alltimestamp", data.data.result.timestamp);
						localStorage.setItem("allnonceStr", data.data.result.nonceStr);
						localStorage.setItem("allsignature", data.data.result.signature);
					} else {}
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});
		}

		$scope.allsigntimestamp = localStorage.getItem("alltimestamp");
		$scope.allsignnonceStr = localStorage.getItem("allnonceStr");
		$scope.allsignsignature = localStorage.getItem("allsignature");
		//$scope.allsign = localStorage.getItem("allsign");

		//console.log($scope.allsigntimestamp);
		//console.log($scope.allsignnonceStr);
		//console.log($scope.allsignsignature);
		//console.log($scope.allsign);

		//if(localStorage.getItem("allsign") != null){
		//
		//}

		wx.config({
			debug: true,
			appId: 'wx133c35ab6532252f',
			timestamp: $scope.allsigntimestamp,
			nonceStr: $scope.allsignnonceStr,
			signature: $scope.allsignsignature,
			jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ']
		});

		//wx.config({
		//  debug: true,
		//  appId: 'wx133c35ab6532252f',
		//  timestamp: "1503642622",
		//  nonceStr: "b0cf37a5-df04-4aa4-9b07-ce25ba335fa4",
		//  signature:"ccf3ed859208f7f595471a696030871cf5815986" ,
		//  jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ']
		//});

		//console.log(sha1($scope.string1));
		wx.ready(function() {
			// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		});

		wx.error(function(res) {
			// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		});

		//http://platform.kuaibeikj.com/#/login
		//var setinviteCodes = localStorage.getItem("setinviteCode");
		//
		//$scope.invitecode = function(){
		//  //$state.go("friendpartIn",setinviteCodes)
		//  $location.path('/friendpartIn/'+ setinviteCodes);
		//};
		wx.onMenuShareAppMessage({
			title: '快贝分期', // 分享标题
			desc: '0首付0利息，办理方便快捷,邀请好友立得红包，快快加入吧！', // 分享描述
			link: 'http://platform.kuaibeikj.com/#/friendpartIn/' + setinviteCodes, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: 'http://www.kuaibeikj.cn/public/uploads/images/20170705/f66c415663aca76eb0e6345235f7ace4.png', // 分享图标
			type: '', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});

		wx.onMenuShareTimeline({
			title: '快贝分期', // 分享标题
			link: 'platform.kuaibeikj.com/#/friendpartIn/' + setinviteCodes, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			imgUrl: 'http://www.kuaibeikj.cn/public/uploads/images/20170705/f66c415663aca76eb0e6345235f7ace4.png', // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});

		wx.onMenuShareQQ({
			title: '快贝分期', // 分享标题
			desc: '0首付0利息，办理方便快捷,邀请好友立得红包，快快加入吧！', // 分享描述
			link: 'platform.kuaibeikj.com/#/friendpartIn/' + setinviteCodes, // 分享链接
			imgUrl: 'http://www.kuaibeikj.cn/public/uploads/images/20170705/f66c415663aca76eb0e6345235f7ace4.png', // 分享图标
			success: function() {
				// 用户确认分享后执行的回调函数
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		});

	}])

	.controller('myShareController', ["$scope", "$ionicPopup", "ajax", "modal", function($scope, $ionicPopup, ajax, modal, $rootScope) {

		//type 邀请类型，0普通邀请注册， 1导购邀请交易，2普通邀请交易
		$scope.json = {
			"type": "0"
		};
		$scope.midtextinfo = "邀请奖励";
		/////api/daogou/queryDaogouInviteRecords
		////$scope.json ={};
		ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.zsclientinfo = data.data.dgiList;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		$scope.json2 = {
			"type": "2"
		};
		/////api/daogou/queryDaogouInviteRecords
		////$scope.json ={};
		ajax.post("/api/daogou/queryDaogouInviteRecords", $scope.json2, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.zsclientinfo = data.data.dgiList;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		//功能：会员查看自己的所有红包
		//URL：/api/red/queryMyRed
		//参数：
		//无
		//返回值：
		//redUserVOList
		//{'myStatus':'0','myMsg':'您尚无红包'}
		$scope.MyRed = {};
		ajax.post("/api/red/queryMyRed", $scope.MyRed, function(data) {
			if(data.basic.status == 1) {
				modal.loadingHide();
				//console.log(data);
				$scope.myredpacketall = data.data;
			} else {
				modal.loading(data.basic.msg, 1500);
			}
		}, 1);

		////hongbao----记录
		//功能：红包兑换成优惠券，暂时只能兑换成管理费减免券，且1:1兑换
		//URL：/api/red/saveRedToCoupon
		//参数：
		//rId: 红包id
		//redUserId：红包用户关联的id
		//cId：优惠券id
		//返回值：
		//{'myStatus':'1','myMsg':'兑换成功！'}
		//{'myStatus':'0','myMsg':'兑换失败，红包已经使用！'}
		//{'myStatus':'-1','myMsg':'兑换失败，数据库未查到您有该红包！'}
		// rId: 红包id  不要的

		//cId:"1"  费用减免券

		$scope.redpacketdh = {
			//rId:"",
			redUserId: "",
			cId: "1"
		};

		$scope.duihuanquan1 = function(id) {

			$scope.redpacketdh.redUserId = id;

			ajax.post("/api/red/saveRedToCoupon", $scope.redpacketdh, function(data) {
				if(data.basic.status == 1) {
					modal.loadingHide();
					//console.log(data);

					$scope.showAlert();
				} else {
					modal.loading(data.basic.msg, 1500);
				}
			}, 1);

			$scope.showAlert = function() {
				var alertPopup = $ionicPopup.alert({
					title: '红包兑换',
					template: '红包兑换成平台优惠券成功，请在平台优惠券处查看！'
				});
				alertPopup.then(function(res) {
					//console.log('Thank you for not eating my delicious ice cream cone');
				})
			};

		}

	}])

	.controller('friendpartInController', ["$scope", "ajax", "$state", "modal", "REG", "$interval", "$rootScope", function($scope, ajax, $state, modal, REG, $interval, $rootScope) {

		//var test =   "http://platform.kuaibeikj.com/#/friendpartIn/p718210181"
		//var test = "http://localhost:8100/#/friendpartIn/p718210181";
		var test = window.location.href;
		//$scope.inviteparam =test.substring(37) ;

		$scope.inviteparam = test.substring(45);

		$scope.userpartin = {
			username: "",
			mobile: "",
			password: "",
			pInviteCode: "",
			code: ""
			//aid:"",
			//aname:""
		};
		$scope.user = {
			mobile: "",
			password: ""
		};
		//$scope.setinviteCode =  $rootScope.pInviteCode;
		//console.log($rootScope.pInviteCode);
		//console.log( $scope.setinviteCode)
		$scope.setinviteCode = localStorage.getItem("setinviteCode");
		// 重获验证码
		$scope.canClick = false;
		$scope.description = "获取验证码";
		var second = 59;
		var timerHandler;
		$scope.getTestCode = function() {
			if(!REG.isMobile($scope.userpartin.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);
				return
			}
			ajax.post("/api/sms/send", {
				"apkind": "register",
				"minute": "5",
				"mobile": $scope.userpartin.mobile
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

		$scope.setupid = localStorage.getItem("setupid");
		$scope.setupname = localStorage.getItem("setupname");

		$scope.gotoverifycode = function() {
			//var icode = $('#invite').val();
			//console.log(icode)
			//$scope.userpartin.pInviteCode =  $scope.inviteparam;
			$scope.userpartin.pInviteCode = $scope.setinviteCode;
			//$scope.userpartin.aid = $scope.setupid;
			$scope.userpartin.aid = $scope.setupid;
			$scope.userpartin.aname = $scope.setupname;
			if(!REG.isMobile($scope.userpartin.mobile)) {
				modal.loading("请输入正确的手机号码", 1500);
				return
			} else if(!REG.isPwd($scope.userpartin.password)) {
				modal.loading("请输入6-32位登录密码", 1500);
				return
			} else if(!$scope.userpartin.code) {
				modal.loading("请输入验证码", 1500);
				return
			}

			ajax.post("/register", $scope.userpartin, function(data) {
				//console.log(data);
				if(data.basic.status == 1) {
					modal.loading("注册成功，立即登入", 1500);

					//$timeout(function() {

					$scope.user.mobile = $scope.userpartin.mobile;
					$scope.user.password = $scope.userpartin.password;
					ajax.post("/login", $scope.user, function(data) {
						if(data.basic.status == 1) {
							//modal.loadingHide();
							localStorage.setItem("token", data.data.token);
							localStorage.setItem("username", $scope.user.username);
							localStorage.setItem("password", $scope.user.password);

							$state.go('tab.index');
						} else {
							modal.loading(data.basic.msg, 1500);
							//console.log(data.basic.msg)
						}
					}, 1);

					//}, 1000);

				} else {
					modal.loading(data.basic.msg, 1500);
				}
			});

		};

	}])

	.directive('onFinish', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attr) {
				if(scope.$last === true) {
					$timeout(function() {
						scope.$emit('ngRepeatFinished');
					});
				}
			}
		}
	})