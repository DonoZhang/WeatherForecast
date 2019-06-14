		var selectedTarget;	
	
		$(document).ready(function(){
		
		$("#weatherBtn").on('click', getTheWeather);

		$("#radTempC").on('click', getTheWeather);

		$("#radTempF").on('click', getTheWeather);

		$("#radTempK").on('click', getTheWeather);
		
		$("#weatherBtnJSON").on('click', getTheWeatherJSON);

		$("#radTempCJSON").on('click', getTheWeatherJSON);

		$("#radTempFJSON").on('click', getTheWeatherJSON);

		$("#radTempKJSON").on('click', getTheWeatherJSON);
		
		$("#savePrefer").on('click', savePreferences);
		
		$("#resetPrefer").on('click', resetPreferences);
		
		getTheWeatherJSON();
			
		//display setting button
		selectedTarget = $(".results");
		$(".fa-cog").on("click",function(){
			$("#page3 .searchForm").css({"display": "inline-block", "width":"50%"});
			$(".setting").css("display", "inline-block");
			selectedTarget.css("border-style","solid");
			$(".setting")[0].scrollIntoView(true);
			$("#resultsJSON").bind("click", select);
			showPreferences();
		});
		$(".fa-times").on("click",function(){
			$("#page3 .searchForm").removeAttr("style");
			selectedTarget.css("border-style", "none");
			selectedTarget = $(".results");
			$(".setting").css("display", "none");
			$("#resultsJSON").unbind("click", select);
		});
	});

	/*................................XML.................................*/
	function getTheWeather()
	{
		loading(true);
		var city = $("#query").val();
		var url = "", ending = "";


		if( $("#radTempC").is(":checked") )
		{
			url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",AU&cnt=8&mode=xml&units=metric&APPID=f218cbbb0b02c7e49e39d98710036bb4";
			ending = "&deg;C"
		}
		else if( $("#radTempF").is(":checked") )
		{
			url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",AU&cnt=8&mode=xml&units=imperial&APPID=f218cbbb0b02c7e49e39d98710036bb4";
			ending = "&deg;F"
		}
		else
		{
			url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",AU&cnt=8&mode=xml&APPID=f218cbbb0b02c7e49e39d98710036bb4";
			ending = "&deg;K"
		}

		$.ajax({
			type: "GET",
			url: url,
			dataType: "text",
			success: function(data){
				
				//convert into a XML object
				var xmlDoc=$.parseXML(data);

				//convert into a js object
				var xml = $(xmlDoc);

				// To find a node (tag) - use the find() function
				// To get the node value - use the text() function
				// To get the attribute - use attr() function

				var str = "";

				$("#city").html(xml.find("name").text() + "<br>Sun Rise: " + getTheTime(xml.find("sun").attr("rise")) + "&nbsp;&nbsp;Sun Set: " + getTheTime(xml.find("sun").attr("set")));
				
				xml.find("time").each(function(){
					str += "<div class='col-md-3 col-sm-12 col-xs-12 col-lg-3 oneAnswer'>";
					str += "<section class = 'time'>" + getTheDay($(this).attr("to")) + " " + getTheTime($(this).attr("to")) + "</section>";
					str += getTheDate($(this).attr("to")) + "<br>";
					str += $(this).find("symbol").attr("name") + "<br>";
					str += "<img src='https://openweathermap.org/img/w/" + $(this).find("symbol").attr("var")+".png'/><br>";
					str += "<strong>Wind:</strong> " + $(this).find("windSpeed").attr("name") + "<br>";
					str += "<strong>Wind Direction:</strong> " + $(this).find("windDirection").attr("name") + "<br>";
					str += "<strong>Temperature:</strong> " + $(this).find("temperature").attr("value") + ending + "<br>";
					str += "<strong>Humidity:</strong> " + $(this).find("humidity").attr("value") + "%<br>";
					str += "<strong>Cloud:</strong> " + $(this).find("clouds").attr("value");
					str += "</div>"
				});

				$("#theResults").html(str);
				loading(false);
			},
			error: function(){
				loading(false);
				$("#city").html("Please enter a valid Australian city");
			}
		}); 
	}
	
	function getTheTime(aTime)
	{   
		var theDate = new Date(Date.UTC(aTime.substring(0,4), aTime.substring(5,7), aTime.substring(8,10), aTime.substring(11,13), aTime.substring(14,16), aTime.substring(17,19)));
		var str = "";

		if(theDate.getHours() < 12)
		{
			str += theDate.getHours();
			ending = "am";
		}
		else
		{
			str += theDate.getHours() - 12;
			ending = "pm"
		}

		if( theDate.getMinutes() < 10 )
			str += ":0" + theDate.getMinutes();
		else
			str += ":" + theDate.getMinutes();

		str += ending;

		return str;
	}
	
	function getTheDay(aTime)
	{   
		var theDate = new Date(Date.UTC(aTime.substring(0,4), aTime.substring(5,7), aTime.substring(8,10), aTime.substring(11,13), aTime.substring(14,16), aTime.substring(17,19)));
		var weekday = new Array(7);
		weekday[0] =  "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
	 	return weekday[(theDate.getDay()+5)%7];
	}

	function getTheDate(aTime)
	{   
		var theDate = new Date(Date.UTC(aTime.substring(0,4), aTime.substring(5,7), aTime.substring(8,10), aTime.substring(11,13), aTime.substring(14,16), aTime.substring(17,19)));
		return theDate.getDate() + "/" + (theDate.getMonth()+1) + "/" + theDate.getFullYear();
	}

	
	function loading(enabled)
	{
		if(enabled) // true
		{
			$("#loading").css('display', 'block');
			$("#results").css('display', 'block'); 
		}
		else
			$("#loading").css('display', 'none');
			$("#result").css('display', 'none');
	}
	
	
	
	/*................................JSON.................................*/
	function getTheWeatherJSON()
	{
		loadingJSON(true);
		var city = $("#queryJSON").val();
		var url = "", ending = "";
		var urlSun = "https://api.openweathermap.org/data/2.5/weather?q=" + city + ",AU&APPID=f218cbbb0b02c7e49e39d98710036bb4";

		if( $("#radTempCJSON").is(":checked") )
		{
			url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",AU&cnt=8&units=metric&APPID=f218cbbb0b02c7e49e39d98710036bb4";
			ending = "&deg;C"
		}
		else if( $("#radTempFJSON").is(":checked") )
		{
			url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",AU&cnt=8&units=imperial&APPID=f218cbbb0b02c7e49e39d98710036bb4";
			ending = "&deg;F"
		}
		else
		{
			url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",AU&cnt=8&APPID=f218cbbb0b02c7e49e39d98710036bb4";
			ending = "&deg;K"
		}
		$.ajax({
			type: "GET",
			url: urlSun,
			dataType: "json",
			success: function(data){
				$("#cityJSON").html(data.name +  "<br>Sun Rise: " + getTheTimeJSON(data.sys.sunrise) + "&nbsp;&nbsp;Sun Set: " + getTheTimeJSON(data.sys.sunset));
			},
			error: function(){
				loadingJSON(false);
				$("#cityJSON").html("Please enter a valid Australian city");
			}
		});
		$.ajax({
			type: "GET",
			url: url,
			dataType: "json",
			success: function(data){
				var str = "";
				for(let i = 0;i < data.list.length ; i++)
				{
					str += "<div class='col-md-3 col-sm-12 col-xs-12 col-lg-3 oneAnswer'>";
					str += "<section class = 'time'>" + getTheDayJSON(data.list[i].dt) + " " + getTheTimeJSON(data.list[i].dt) + "</section>";
					str += getTheDateJSON(data.list[i].dt) + "<br>";
					str += data.list[i].weather[0].description + "<br>";
					str += "<img src='https://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png'/><br>";
					str += "<strong>Wind:</strong> " + getWindSpeed(data.list[i].wind.speed) + "<br>";
					str += "<strong>Wind Direction:</strong> " + getWindDirect(data.list[i].wind.deg) + "<br>";
					str += "<strong>Temperature:</strong> " + data.list[i].main.temp + ending + "<br>";
					str += "<strong>Humidity:</strong> " + data.list[i].main.humidity + "%<br>";
					str += "<strong>Cloud:</strong> " + getCloud(data.list[i].clouds.all);
					str += "</div>"
				}

				$("#theResultsJSON").html(str);
				loadingJSON(false);
			},
			error: function(){
				loadingJSON(false);
				$("#cityJSON").html("Please enter a valid Australian city");
			},
			complete: applyPreferences
		});  // end of ajax
		

	}
	
	function getTheTimeJSON(aTime)
	{   
		aTime = parseInt(aTime) * 1000;
		var theDate = new Date(aTime);
		var str = "";

		if(theDate.getHours() < 12)
		{
			str += theDate.getHours();
			ending = "am";
		}
		else
		{
			str += theDate.getHours() - 12;
			ending = "pm"
		}

		if( theDate.getMinutes() < 10 )
			str += ":0" + theDate.getMinutes();
		else
			str += ":" + theDate.getMinutes();

		str += ending;

		return str;
	}
	
	function getTheDayJSON(aTime)
	{   
		aTime = parseInt(aTime) * 1000;
		var theDate = new Date(aTime);
		var weekday = new Array(7);
		weekday[0] =  "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";

	 	return weekday[theDate.getDay()];
	}

	function getTheDateJSON(aTime)
	{   
		aTime = parseInt(aTime) * 1000;
		var theDate = new Date(aTime);
		return theDate.getDate() + "/" + (theDate.getMonth()+1) + "/" + theDate.getFullYear();
	}

	function getWindSpeed(speed){
		switch(true){
			case speed < 0.3: return "Calm";
			case speed <1.5: return "Light Air";
			case speed < 3.3: return "Light Breeze";
			case speed < 5.5: return "Gentle Breeze";
			case speed < 7.9: return "Moderate Breeze";
			case speed < 10.7: return "Fresh Breeze";
			case speed <13.8: return "Strong Breeze";
			case speed < 17.1: return "Near Gale";
			case speed < 20.7: return "Gale";
			case speed < 24.4: return "Strong Gale";
			case speed < 28.4: return "Storm";
			case speed < 32.6: return "Violent Storm";
			default: return "Hurricane Force";	
		}
	}
	function getWindDirect(deg){
		var direction = ["North", "North-northeast", "Northeast", "East-northeast", "East", "East-southeast", "Southeast", "South-southeast", "South", "South-southwest", "Southwest", "West-southwest", "West", "West-northwest", "Northwest", "North-northwest"];
		var i = (deg >= 348.75) ? 0 : Math.floor(deg/22.5 + 0.5);
		return direction[i];
	}
	function getCloud(percent){
		switch(true){
			case percent < 11: return "Clear sky";
			case percent < 26: return "Few clouds";
			case percent < 51: return "Scattered clouds";
			case percent < 85: return "Broken clouds";
			default: return "Overcast clouds";
		}
	}
	
	function loadingJSON(enabled)
	{
		if(enabled) // true
		{
			$("#loadingJSON").css('display', 'block');
			$("#resultsJSON").css('display', 'block'); 
		}
		else
			$("#loadingJSON").css('display', 'none');
			$("#resultJSON").css('display', 'none');
	}

	/*................................User Preference.................................*/
	
	
	function select(e){
		selectedTarget.css("border-style", "none");
		$(".targetInfo").val("Class: \"" + $(e.target).attr('class') + "\"");
		var currentTarget = $(e.target);
		currentTarget.css({
			"border-style": "solid",
			"border-color": "aqua"
		});
		$(".setting")[0].scrollIntoView(true);
		selectedTarget = currentTarget;
		showPreferences();
	}
	$(".targetInfo").focus(function(){
		$("#theResultsJSON")[0].scrollIntoView(true);
	});
	
	//totally three element which could be customize: 
	//City name, time, detailed info
	function savePreferences(){
	
		var bgColor = $("#txtBGColor").val();
		var color = $("#txtFontColor").val();
		var fontSize = $("#txtFontSize").val();
		var target = selectedTarget;
		var userPreferText = {'color':color, 'fontSize':fontSize};
		var userPreferBg = {'bgColor':bgColor};
		
		if( 'localStorage' in window && window['localStorage'] != null )
		{
			switch(target.attr("class")){
				case "city":{
					try{
						localStorage.setItem('AppPrefer_Bg', JSON.stringify(userPreferBg));
						localStorage.setItem('AppPrefer_city', JSON.stringify(userPreferText));
						applyPreferences();
					}
					catch(e){
						if( e == QUOTA_EXCEEDED_ERR )
							console.log("You are out of local storage");
						else
							console.log("Some error");
					}
					break;
				}
				case "time":{
					try{
						localStorage.setItem('AppPrefer_Bg', JSON.stringify(userPreferBg));
						localStorage.setItem('AppPrefer_time', JSON.stringify(userPreferText));
						applyPreferences();
					}
					catch(e){
						if( e == QUOTA_EXCEEDED_ERR )
							console.log("You are out of local storage");
						else
							console.log("Some error");
					}
					break;
				}
				default:{ //"oneAns"
					try{
						localStorage.setItem('AppPrefer_Bg', JSON.stringify(userPreferBg));
						localStorage.setItem('AppPrefer_details', JSON.stringify(userPreferText));
						applyPreferences();
					}
					catch(e){
						if( e == QUOTA_EXCEEDED_ERR )
							console.log("You are out of local storage");
						else
							console.log("Some error");
					}
				}
			}
		}
		else
		{
			console.log("This browser does NOT support local storage");
		}
	}

	function applyPreferences(){

		var theBGColor = "#FFFFFF";
		var color_city = "#F47983", color_time = "#000077", color_details = "#000000";
		var fontSize_city = "20", fontSize_time = "16", fontSize_details = "12";

		if(localStorage.getItem("AppPrefer_city")!=null)
		{
			var userPrefer = JSON.parse(localStorage.getItem("AppPrefer_city"));
			color_city = userPrefer.color;
			fontSize_city = userPrefer.fontSize;
		}
		
		if(localStorage.getItem("AppPrefer_time")!=null)
		{
			var userPrefer = JSON.parse(localStorage.getItem("AppPrefer_time"));
			color_time = userPrefer.color;
			fontSize_time = userPrefer.fontSize;
		}
		
		if(localStorage.getItem("AppPrefer_details")!=null)
		{
			var userPrefer = JSON.parse(localStorage.getItem("AppPrefer_details"));
			color_details = userPrefer.color;
			fontSize_details = userPrefer.fontSize;
		}
		
		if(localStorage.getItem("AppPrefer_Bg")!=null)
		{
			var userPrefer = JSON.parse(localStorage.getItem("AppPrefer_Bg"));
			theBGColor = userPrefer.bgColor;
		}
				
		$(".results").css({"background-color": theBGColor});
		$(".city").css({"color": color_city, "font-size": fontSize_city + "px"});
		$(".time").css({"color": color_time, "font-size": fontSize_time + "px"});
		$(".oneAnswer").css({"color": color_details, "font-size": fontSize_details + "px"});
		
		showPreferences();
	}

	//Show User preference in the input panel
	function showPreferences(){
		document.querySelector("#txtBGColor").value = rgb2Hex($(".results").css("background-color"));		
		switch(selectedTarget.attr("class")){
				case "city":{
					document.querySelector("#txtFontColor").value = rgb2Hex($(".city").css("color"));
					$("#txtFontSize").val($(".city").css("fontSize").replace("px",""));
					break;
				}
				case "time":{
					document.querySelector("#txtFontColor").value = rgb2Hex($(".time").css("color"));
					$("#txtFontSize").val($(".time").css("fontSize").replace("px",""));
					break;
				}
				default:{ //"oneAns"
					document.querySelector("#txtFontColor").value = rgb2Hex($(".oneAnswer").css("color"));
					$("#txtFontSize").val($(".oneAnswer").css("fontSize").replace("px",""));
					break;
				}
		}
	}
	
	function rgb2Hex(rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}

	function resetPreferences(){

		if( 'localStorage' in window && window['localStorage'] != null )
		{
			localStorage.clear();
		}
		else
		{
			console.log("This browser does NOT support local storage");
		}
		applyPreferences();
	}
	