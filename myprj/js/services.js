angular.module('starter.services', [])

.factory("ajax", ["$http", "$ionicPopup", "modal", "$state", "$timeout", function($http, $ionicPopup, modal, $state, $timeout) {
            //---数据签名
            var dataSign = function(json) {
                var jsonKeysArr = [];
                for (var p in json) {
                    jsonKeysArr.push(p);
                }
                jsonKeysArr.sort();
                var newJson = {};
                for (var keyIndex in jsonKeysArr) {
                    var key = jsonKeysArr[keyIndex];
                    newJson[key] = json[key];
                }
                var requestDataPackage = {};
                var os;
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    os = 0;
                } else if (/(Android)/i.test(navigator.userAgent)) {
                    os = 1;
                } else if (is_weixin()) {
                    os = 2;
                } else {
                    os = 3;
                }
                var global = {
                    "os": os,
                    "appKey": "a8b40126116cf2ea",
                    "token": localStorage.getItem("token"),
                    "sign": ""
                };

                requestDataPackage.global = global;
                requestDataPackage.data = newJson;
                var globalVariable = {
                        'secretKey': '7re6NRDNAjfNFd0'
                    };
                    //marking sign
                var signData = JSON.stringify(requestDataPackage.data);
                var sign = MD5(globalVariable.secretKey + signData).toUpperCase();
                requestDataPackage.global.sign = sign;

                var jsonData = JSON.stringify(requestDataPackage);

                function is_weixin() {
                    var ua = navigator.userAgent.toLowerCase();
                    if (ua.match(/MicroMessenger/i) == "micromessenger") {
                        return true;
                    } else {
                        return false;
                    }
                }
                return jsonData;
            };
            var startTime = new Date().getTime();
            return {
                //http://172.13.31.75:8080//kuaibeiPro  本地
                //http://platform.kuaibeikj.com/kuaibei 正式
                post: function(url, data, callbake, type) {
                    $http.post('http://platform.kuaibeikj.com/kuaibei' + url, dataSign(data), {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }).success(function(data) {

                      //console.log(dataSign(data));

                        if (type) {
                            modal.loading('努力中...', 300);
                            $timeout(function() {
                                if (data.basic.status == 1) {
                                    modal.loadingHide();
                                    callbake(data);
                                } else if (data.basic.status == "-110") {
                                    $state.go("login");
                                    modal.loadingHide();
                                } else {
                                    modal.loading(data.basic.msg, 1500);
                                    // modal.loadingHide();
                                }
                            }, 300)
                        } else {
                            modal.loading('努力中...');
                            if (data.basic.status == 1) {
                                modal.loadingHide();
                                callbake(data);
                            } else if (data.basic.status == "-110") {
                                console.log(data.basic.msg);
                                $state.go("login");
                                modal.loadingHide();

                            } else {
                                modal.loading(data.basic.msg, 1500);
                            }
                        }
                    }).error(function(data, status,jqXHR, textStatus, errorThrown) {
                        var respTime = new Date().getTime() - startTime;
                        if (respTime >= 60000) {
                            modal.loading('请求已超时~', 1200);
                        } else {
                            modal.loading('请求失败，请重试！', 1200);
                        }
                    })
                }

            }
        }
    ])
    .factory("modal", ["$ionicLoading",function($ionicLoading) {
        return {
            loading: function(template, time) {
                var deTpl = '<ion-spinner  icon="ios-small"></ion-spinner>';
                if (template) {
                    deTpl = template;
                }
                $ionicLoading.show({
                    template: '<div style="position:relative;">' + deTpl + '</div>',
                    noBackdrop: true,
                    duration: time
                });
            },
            loadingHide: function() {
                $ionicLoading.hide();
            }
        }
    }])
    .factory("REG", function() {
        return {
            isNumber: function(str) {
                return /^[0-9]*$/.test(str);
            },
            isArray: function(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            },
            isVcode: function(str) {
                return /^[a-z0-9A-Z]{4}$/.test(str);
            },
            isCode: function(str) {
                return /^\d{4}$/.test(str);
            },
            isPwd: function(str) {
                return /^\s*\S{6,32}$/.test(str);
            },
            isJyPwd: function(str) {
                return /^\s*\S{5,16}$/.test(str);
            },
            isMobile: function(str) {
                return /^1\d{10}$/.test(str);
            },
            isRealName: function(str) {
                return /^\s*[\u4e00-\u9fa5]{1,}[\u4e00-\u9fa5.·]{0,15}[\u4e00-\u9fa5]{1,}\s*$/.test(str);
            },
            isMoney: function(str) {
                return /^\d+(\.\d+)?$/.test(str);
            },
            isIdcard: function(str) {
                return /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/.test(str)
            },
            isEmail: function(str) {
                return /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/.test(str);
            },
            //金额格式化：s金额，n：小数位数-默认两位
            formatMoney: function(s, n) {
                n = n > 0 && n <= 20 ? n : 0;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var l = s.split(".")[0].split("").reverse(),
                    r = s.split(".")[1];
                var t = "";
                for (var i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                var result = t.split("").reverse().join("");
                if (n && r) result = result + "." + r || '';
                return result;
            },
            //格式化身份证
            formatIdCard: function(s) {
                var len = s.length;
                var asterisk = len == 15 ? '******' : '*********';
                return s.toString().substring(0, 5) + asterisk + s.toString().substring(len - 4);
            },
            //格式化手机号
            formatPhoneNumber: function(s) {
                if (!REG.isMobile(s)) return '';
                var reg = /(\d{3})\d{4}(\d{4})/;
                return s.toString().replace(reg, '$1****$2');
            },
            //格式化银行卡
            formatBankCardNo: function(s) {
                var num = s.split('').length,
                    str = '';
                for (var i = 0; i < num; i++) {
                    str += '*';
                    if (i + 1 >= num - 4) break;
                };
                return str += s.substring(num - 4);
            }
        };
    })
    .factory("FinancList", ["ajax", "modal", "$rootScope",function(ajax, modal, $rootScope) {
            var param = {};
            //页码
            param.curPage = 1;
            param.hasmore = false;
            $rootScope.orderlist = [];

            function getList(url, num) {
                var json = {
                    "page": param.curPage + 1,
                    "pageSize": 10
                };
                if (num) {
                    json.orderStatus = status;
                }

                ajax.post(url, json, function(data) {
                    if (data.basic.status == 1) {
                        if (json.page <= data.data.paged.pageCount && data.data.paged.total > json.pageSize) {
                            param.hasmore = true;
                            $rootScope.orderlist = data.data.items;
                        } else {
                            param.hasmore = false;
                            orderlist = [];
                        }
                    } else {
                        modal.loading(data.basic.msg, 1500);
                    }
                });
                return $rootScope.orderlist
            }
            return {
                getList: getList,
                param: param
            };
        }
    ])
    
    
    // 输入框自动聚焦服务 用法 focus(id)  gong
    .factory('focus',["$timeout","$window",function($timeout,$window){
        return function(id){
            $timeout(function(){
                var element=$window.document.getElementById(id);
                if(element)
                    element.focus();
            });
        };
    }])
