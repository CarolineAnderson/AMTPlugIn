//console.log("Chrome extension go?");


chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
	if(message.txt=="getEarnings")
  {
    var dayDataList = [""];
  var dateList = ["hi"];
  var needUpdated=[""];


  var first = $('.copyable-content').first().html().indexOf('A');
  var second = $('.copyable-content').first().html().indexOf('<',2);
  var workerId = $('.copyable-content').first().html().substring(first,second);
  var d = $('.daily_hit_statuses').filter('.hidden-xs-down col-sm-2 col-md-2');

  function dayActivity(date, numsubmit, numapprov, numrej, numpend, earnings) {
    this.Date = date;
    this.Submitted = numsubmit;
    this.Approved = numapprov;
    this.Rejected = numrej;
    this.Pending = numpend;
    this.Earned = earnings;
  }
  
  
  function iterateThrough()
  {
    for(var j = 0; j<d.prevObject.length; j++)
    { 
      var test2 = new dayActivity();
      var i = 0;

      for (var property1 in test2) 
      {
        var g = d.prevObject[j].cells[i].innerText;
        test2[property1] = g;
        i++;
      }
     dayDataList.push(test2);
     console.log(test2);
     
     }
   dayDataList.splice(0,1);
   
  }

  
  iterateThrough();
  ajax_getRecord();
  /*
  for(var k =0; k<dayDataList.length; k++)
  {
    
    ajax_createNewRecord(dayDataList[k].Date,dayDataList[k].Submitted,dayDataList[k].Approved, 
   dayDataList[k].Rejected,dayDataList[k].Pending,dayDataList[k].Earned);
  }
  */


  function scrapeDashboard()
  {
  for(var i = 0; i<dayDataList.length; i++)
  {
    if (jQuery.inArray(dayDataList[i].Date, dateList)!=-1)
    {
      console.log("it's in the database");
      ajax_updateRecord(dayDataList[i].Date,dayDataList[i].Earned,dayDataList[i].Submitted,
        dayDataList[i].Approved,dayDataList[i].Rejected,dayDataList[i].Pending);
    }
    else
    {
       console.log("it's not the database");
      ajax_createNewRecord(dayDataList[i].Date,dayDataList[i].Submitted,
        dayDataList[i].Approved,dayDataList[i].Rejected,dayDataList[i].Pending,dayDataList[i].Earned);
    }
  }
  }







  function ajax_createNewRecord(date,submits, approv, rej, pen,earns){
  var hr = new XMLHttpRequest();
  var url = "http:localhost/14/postNewEarningData.php";
  var info = "theDate="+ date+"&submit=" +submits + "&approve="+approv+"&reject="+rej
  +"&pend="+pen +"&earn="+earns;
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


  function ajax_updateRecord(date,earns,submits,approv,rej,pen){
  var hr = new XMLHttpRequest();
  var url = "http:localhost/14/updateEarningData.php";
  var info = "theDate="+ date+"&earn="+earns+"&submit="+submits+
  "&approve="+approv +"&reject="+rej +"&pend="+pen;
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


  function ajax_getRecord(){
  var hr = new XMLHttpRequest();
  var url = "http:localhost/14/getEarningData.php";
  hr.open("POST", url,true);
  hr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  hr.onreadystatechange = function() {
    if(hr.readyState ==4 && hr.status == 200) {
      var return_data = hr.responseText;
      var object= $.parseJSON(return_data)
      dateList = object;
      console.log(dateList);
      scrapeDashboard();
    }
  }
  hr.send();
}
}



  

  }
	