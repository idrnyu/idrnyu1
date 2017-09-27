angular.module('starter.seller', [])
    /**
     * 商家搜索控制器  龚宇 2017年9月7日17:54:15 添加
     */
    .controller('SearchCtrl', ["$scope", "modal", "ajax", "FinancList", "$timeout", "$state", "focus", "$controller", "$rootScope", function($scope, modal, ajax, FinancList, $timeout, $state, focus, $controller, $rootScope) {
        $scope.searText = [];
        
        //获取列表
        function getData() {
            var json = {
                "page": 1,
                "pageSize": 10
            };

            var url = "/api/shop/list";
            ajax.post(url, json, function(data) {
                console.log(data); //*********后台数据*********** */
                if (data.basic.status == 1) { //获取后台数据成功标志
                    $scope.articles = data.data.items; // 取数据
                    if (json.page <= data.data.paged.pageCount && data.data.paged.total > json.pageSize) {
                        FinancList.param.curPage = 1; //进来时初始化请求数据
                        $rootScope.orderlist = []; // 进来时初始化请求数据  以便二次调用
                        FinancList.param.hasmore = true;
                    } else {
                        FinancList.param.hasmore = false;
                    }
                } else {
                    modal.loading(data.basic.msg, 1000);
                }
            });

            //上拉触发函数
            $scope.loadMore = function() {
                //这里使用定时器是为了缓存一下加载过程，防止加载过快
                $timeout(function() {
                    if (!FinancList.param.hasmore) {
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
            };
        };

        $rootScope.loac = window.location.hash;
        $scope.$watch('loac', function(newValue, oldValue) {
            // alert(newValue);
            if (newValue == "#/tab/seller") {
                $(".listbox").remove(); //删除遍历后的元素们
                getData();
            }
        });


        // 搜索按钮
        $scope.sear = function() {
            console.log("搜索：" + this.searText);
            modal.loading('努力加载中...', 1000);
        };

        // 小的字符串清空按钮
        $scope.colText = function() {
            $scope.searText = ""; //清空输入框
            focus("searchText"); //聚焦到输入框
        };

        // 筛选按钮
        $scope.sScreen = function() {
            alert('弹出选择框');
        };

        // 侧边分类选中
        $(".conte").on('click', function(ev) {
            FinancList.param.hasmore = false;
            FinancList.param.curPage = 1; //进来时初始化请求数据
            $rootScope.orderlist = []; // 进来时初始化请求数据  以便二次调用
            $(".listbox").remove(); //删除遍历后的元素们
            var delay = 0; // 做点击延迟加载视图
            $timeout(function() {
                delay = 1;
                if (angular.element(tag).attr('name') == 'all' && delay) { //
                    console.log(123);
                    getData(); // 获取后台列表
                } else {
                    $(".listbox").remove(); //删除遍历后的元素们
                }
            }, 500);
            var tag = ev.target;
            console.log(tag);
            angular.element(tag).addClass('myActive').siblings().removeClass('myActive');
        });

        // 设定旁边固定高度 以及视图的宽高
        $("#conte").css('top', $("#topbar").outerHeight() + $("#SearchBox").outerHeight());
        $("#conte").css('width', $(window).width() - $("#SellerList").outerWidth());
        $("#conte").css('height', $(document).height() - $("#topbar").outerHeight() - 94);
        $("#ContBox").css('margin-top', $("#SearchBox").outerHeight() - 1);
    }])