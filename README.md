# GPS坐标转换-火星坐标
龚宇


<html>
	<head>
		<style type="text/css">
			#ge
			{
				width: 750px;
				margin: 10px auto;
				padding: 20px 0px 50px 50px;
				position: relative;
			}
			#uls li a
			{
				display: block;
				widows: auto;
				margin: 20px 0;
				text-decoration: none;  /*删除下划线*/
				color: blue;
				/*transition: all 0.4s;*/
				transition: all 0.4s linear 0.1s;  /*延时执行鼠标放上去的效果*/
			}
			#uls li a:hover
			{
				color: white;
				background: black; /* 鼠标放上去背景变色*/
				zoom: 1;
				border-radius: 5px;  /*鼠标放上去让他有圆角边框*/
				margin-left: 30px;  /*鼠标放上去让他移动*/
			}
			#uls li
			{
				list-style: none;
			}
			#uls
			{
				padding: 0;
				margin-top: 0;
				display: inline-block;
			}
			#jisuan
			{
				width: 300px;
				position: absolute;
				top: 35px;
				right: 10px;
			}
			#jisuan p
			{
				margin: 0;
				font-size: 13px;
			}
			.intext
			{
				width: 150px;
			}
		</style>
	</head>
	<body>
		<fieldset id="ge">
			<legend style="color: red;">纠偏+度分秒(DMS)转度(DDD) 台湾地区不需要转为GCJ-02</legend>
			<ul id="uls">
				<li><a href="http://lbs.amap.com/api/webservice/guide/api/convert" target="_blank">高德地图的坐标转换</a></li>
				<li><a href="http://lbs.amap.com/console/show/picker" target="_blank">高德地图坐标恰取和坐标收索</a></li>
				<li><a href="http://www.265.me/" target="_blank">地球在线</a></li>
			</ul>
			<div id="jisuan">
				<p style="color: #FF7F50;">GPS接收的数据为:</p>
				<p>dddmm.mmmm&nbsp;&nbsp;经度 &nbsp;如:&nbsp;11345.2245 </p>
				<p>ddmm.mmmm&nbsp;&nbsp;&nbsp;&nbsp;纬度&nbsp;&nbsp;如:&nbsp;2234.1773</p>
				<p style="color: #FF7F50;">换算为ddmmss.ss</p>
				<p>ddd&nbsp;mm+0.mmmm*60&nbsp;=&nbsp;113°45′13.47″经度</p>
				<p>dd&nbsp;mm+0.mmmm*60&nbsp;=&nbsp;22°34′10.64″纬度</p>
				<p style="color: #FF7F50;">换ddmmss.ss到ddd</p>
				<p>ddd°mm′ss.ss″&nbsp;=&nbsp;ddd+(mm/60)+(ss.ss/3600)</p>
			</div>
			<br />
			<input type="text" name="" id="" class="intext" value="" placeholder="度°"/>°
			<input type="text" name="" id="" class="intext" value="" placeholder="分"/>′
			<input type="text" name="" id="" class="intext" value="" placeholder="秒"/>″ 经度&nbsp;&nbsp;&nbsp;&nbsp;
			<label><input type="radio" name="latitude" checked="checked"/>东经E</label>
			<label><input type="radio" name="latitude" />西经W</label>
			<br />
			<br />
			<input type="text" name="" id="" class="intext" value="" placeholder="度°"/>°
			<input type="text" name="" id="" class="intext" value="" placeholder="分"/>′
			<input type="text" name="" id="" class="intext" value="" placeholder="秒"/>″ 纬度&nbsp;&nbsp;&nbsp;&nbsp;
			<label><input type="radio" name="longitude" checked="checked"/>北纬N</label>
			<label><input type="radio" name="longitude" />南纬S</label>
			<br />
			<br />
			<input type="button" name="" id="" value="转换为DDD格式" />
			<br />
			<br />
			<span id="EN">0,0</span>（WGS-84 经纬度）
			<br />
			<br />
			<input type="button" name="sess" id="sess" value="WGS84转换火星坐标" />
			<br />
			<br />
			<span id="GEN">0,0</span>（GCJ-02 经纬度）
		</fieldset>
		
	</body>
	
	<script type="text/javascript">
		var inps = document.getElementsByTagName("input");
		var spa = document.getElementById("EN");
		var ens = new Array(0,0);
		
		inps[10].onclick=function()
		{
			var du = +inps[0].value;
			var fen = +inps[1].value/60;
			var mis = +inps[2].value/3600;
			if(inps[4].checked)
				ens[0]=-(du+fen+mis);
			else
				ens[0]=du+fen+mis;
			
			du = +inps[5].value;
			fen = +inps[6].value/60;
			mis = +inps[7].value/3600;
			if(inps[9].checked)
				ens[1]=-(du+fen+mis);
			else
				ens[1]=du+fen+mis;
				
			
			spa.innerText=ens.join();
		}
		
		inps[0].focus();  //获取光标
		
		
		var btn = document.getElementById("sess");//获取计算按钮
		var sge = document.getElementById("GEN");
		
		
		btn.onclick=function()  //火星坐标转换
		{
			var datess = transform(ens[1],ens[0]);
			
			sge.innerText=datess.join();
			
		}
		
		
		//
        // Krasovsky 1940
        //
        // a = 6378245.0, 1/f = 298.3
        // b = a * (1 - f)
        // ee = (a^2 - b^2) / a^2;
		
		var pi = 3.14159265358979324;
		var a = 6378245.0;
		var ee = 0.00669342162296594323;
		
		
		// World Geodetic System ==> Mars Geodetic System
		function transform(wgLat, wgLon)
		{
			if (outOfChina(wgLat, wgLon))  //判断是不是中国坐标  如果不是就返回原始数据  如果不是就转换
			{
				mgLat = wgLat;
				mgLon = wgLon;
				return ["不在中国大陆地区，无需转为GCJ-01坐标"];
			}
			var dLat = transformLat(wgLon - 105.0, wgLat - 35.0);
			var dLon = transformLon(wgLon - 105.0, wgLat - 35.0);
			var radLat = wgLat / 180.0 * pi;
			var magic = Math.sin(radLat);
			magic = 1 - ee * magic * magic;
			var sqrtMagic = Math.sqrt(magic);
			dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
			dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
			mgLat = wgLat + dLat;
			mgLon = wgLon + dLon;

			mgLat=mgLat + 0.00000009;
			mgLon=mgLon + 0.00000029;  //这两个最微距离纠偏 可能没太大用处
			
			return [mgLon,mgLat];
		}
		
		
		function outOfChina(lat,lon)  //判断是不是中国坐标  
		{
			if (lon < 72.004 || lon > 137.8347)
				return true;
			if (lat < 0.8293 || lat > 55.8271)
				return true;
			return false;
		}
		
		
		function transformLat(x,y)   //Latitude  维度计算
		{
			var ret =  -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x)); //平方根     绝对值
			ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;       
			ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
			//正弦值 
			ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
			return ret;
		}
		
		function transformLon(x,y)   //Longitude  经度计算
		{
			var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
			ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
			ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;        
			ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
			return ret;
		}
		
	</script>
</html>
