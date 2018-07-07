
var currentURL = "";
var count = 0;
var workingState= false;
var beginTime = "";
var importantURLS = ["test"];
var visitedTasks = [];



chrome.tabs.onActivated.addListener(function(activeInfo){
	examineURL();
});

chrome.webNavigation.onCompleted.addListener(function(activeInfo)
{
	
	//startMonitoringTask();
	examineURL();
});
chrome.runtime.onMessage.addListener(
    function(response, sender, sendResponse)
    {
    	if(response.txt=="startNewWorkSession")
    	{
    		console.log("time to start a new work session");
    		startWork();
    	}
    });

chrome.runtime.onMessage.addListener(
    function(response, sender, sendResponse)
    {
        if(response.txt=="loadingurls")
        {
        	console.log(response.arr);
        	var newArr = response.arr;
        	var tempArr1 = importantURLS;
        	var tempArr2 = [];
        	for(var i=0;i<tempArr1.length;i++)
        	{
        		tempArr2.push(tempArr1[i]);
        	}
        	//console.log("this is the new array "+tempArr2);
        	for(var j=0;j<newArr.length;j++)
        	{
        		if(jQuery.inArray(newArr[j],tempArr2)==-1) 
        		{
        			//console.log(newArr[j]+ " is not in the array");
        			tempArr2.push(newArr[j]);
        		}
        	}
        	importantURLS = tempArr2;
        	console.log(importantURLS);
    	}
    }
);
chrome.runtime.onMessage.addListener(
    function(response, sender, sendResponse)
    {
    	if(response.txt=="wasclicked")
    	{
        count = response.value;
        console.log(count);
    	}
    }
);

function examineURL()
{
	chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
    var URL = tabs[0].url;
    currentURL = URL;
    console.log(currentURL);
    if(currentURL=="https://worker.mturk.com/dashboard?ref=w_hdr_db")
	{
		//console.log("hello dashboard");\
		let msg = {txt:"getEarnings"}
		chrome.tabs.sendMessage(tabs[0].id, msg);
	}
	
	if((currentURL.indexOf("worker.mturk")!=-1)||searchArray(importantURLS,currentURL))
	{
		var isAMTPage = false;
		if(currentURL.indexOf("worker.mturk")!=-1)
		{
			isAMTPage= true;
		}
		console.log("this is a page we are watcing");
		let msg = {txt:"loadmonitors", amt:isAMTPage}
		chrome.tabs.sendMessage(tabs[0].id, msg);
		
		chrome.storage.sync.get(['amountClicks'], function(result) {
          	if(result.amountClicks==undefined)
          	{
          		console.log("there are no clicks");
          		chrome.storage.sync.set({'amountClicks':0}, function(){});
          	}
          	else
          	{
          		console.log(result.amountClicks);
          		var newClicks = parseInt(result.amountClicks)+1;
          		console.log(newClicks);
          		chrome.storage.sync.set({'amountClicks':newClicks}, function(){});
          	}

        	});
        	

		if(!workingState)
		{
			startWork();
		}
	}
	
	if((currentURL.indexOf("tasks")!=-1)||searchArray(importantURLS,currentURL))
	{	
		console.log(visitedTasks);
		console.log("this is a task");
	
		
		let msg = {txt:"getLinks"}
		chrome.tabs.sendMessage(tabs[0].id, msg);
	}
	
	
});
}

/*
function startMonitoringTask()
{
	chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
		
		if(tabs[0].url.indexOf("worker.mturk")!=-1)
		{
			
			let msg = {txt:"loadmonitors"}
			
			if(!workingState)
			{
				var c = new Date();
				workingState=true;
				console.log("start working");
				beginTime = c.getHours()+":"+c.getMinutes();
				console.log(beginTime);
			}
			chrome.tabs.sendMessage(tabs[0].id, msg);
			chrome.storage.sync.get(['amountClicks'], function(result) {
          	if(result.amountClicks==undefined)
          	{
          		console.log("there are no clicks");
          		chrome.storage.sync.set({'amountClicks':0}, function(){});
          	}
          	else
          	{
          		console.log(result.amountClicks);
          		var newClicks = parseInt(result.amountClicks)+1;
          		console.log(newClicks);
          		chrome.storage.sync.set({'amountClicks':newClicks}, function(){});
          	}
        	});

		}
		else
		{

		}
	});

}
*/

setInterval(function()
{ 
	if(workingState)
	{
		chrome.storage.sync.get(['amountClicks'], function(result) {
		console.log(result.amountClicks);
		var amount = parseInt(result.amountClicks);
		if(amount>0)
		{
			console.log("the person is working")
		}
		else
		{
			workingState=false;
			chrome.storage.sync.set({'isWorking':workingState});
			var c = new Date();
			endingTime = c.getHours()+":"+c.getMinutes();
			var todayDate= c.getMonth()+ "/"+c.getDate()+"/"+c.getFullYear();
			console.log("the person is not working");
			var timePassed = timeDiff(beginTime, endingTime);
			chrome.storage.sync.get(['wId'], function(result) {
				var id = result.wId
				ajax_createNewSession(id,todayDate, beginTime,endingTime,timePassed);
			});
			
		}
		});
		chrome.storage.sync.set({'amountClicks':0}, function(){});
	}

}, 60000);


function ajax_createNewSession(worker,date,start,end,time){
  var hr = new XMLHttpRequest();
  console.log(time);
  var url = "http:localhost/14/createWorkSession.php";
  var info = "workerID="+worker+"&Date="+date+"&startTime="+start+
  "&endTime="+end+"&workTime="+time;
  hr.open("POST", url,true);
  hr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  hr.onreadystatechange = function() {
    if(hr.readyState ==4 && hr.status == 200) {
      var return_data = hr.responseText;
      console.log(return_data);

    }
  }
  hr.send(info);
}

function timeDiff(timeone,timetwo)
{
	//var hourString= timeone.substring(0,timeone.indexOf(":"))
	var hourOne = parseInt(timeone.substring(0,timeone.indexOf(":")))*60;
	var hourTwo = parseInt(timetwo.substring(0,timeone.indexOf(":")))*60;
	var minuteOne=parseInt(timeone.substring(timeone.indexOf(":")+1));
	var minuteTwo=parseInt(timetwo.substring(timeone.indexOf(":")+1));
	var minTwo = minuteTwo+hourTwo;
	var minOne = minuteOne + hourOne;
	return (minTwo-minOne);
}


function searchArray(arr,word)
{
	var here = false;
	console.log("function called");
	
	for(var h =0; h<arr.length; h++)
	{
		if(word.indexOf(arr[h])!=-1)
		{
			here = true;
		}
	}
	return here;

}


function startWork()
{
	var c = new Date();
	workingState=true;
	console.log("start working");
	beginTime = c.getHours()+":"+c.getMinutes();
	console.log(beginTime);
	chrome.storage.sync.set({'isWorking':workingState});
}

