//Initialize array lists of different types of advice the chrome extension can display. 
//Is somewhat of a placeholder for know for testing purposes until backend is added

var hintCounter = 0; //keeps track of current hint element of current array
var currentList = [""];
ajax_getByType("quick");
var upVotes = 0;
var upVoted = false;


///////////////////////////Allows users to see Hints//////////////////////////////////

///////User Inteface\\\\\\\\

//Editing classes of page so textbox will work correctly
$(".text-muted div:eq(0)").removeClass("col-xs-7");
$(".text-muted div:eq(0)").addClass("col-xs-3");
$(".text-muted div:eq(1)").removeClass("col-xs-5");
$(".text-muted div:eq(1)").addClass("col-xs-3");


//Create hintDisplay to hold all of our hint data and display it at the top of the page
let hintDisplayer = document.createElement("div");
hintDisplayer.className = "col-xs-6";
hintDisplayer.id = "hintDisplayer";


//Hint Container holds all of our hint text data
let hintContainer = document.createElement("div");
hintContainer.className = "textContent";


//A selector so user can select what kind of advice they want to see
let selectAdvice = document.createElement("select");
selectAdvice.id = "SelectAdvice";
hintContainer.append(selectAdvice);

let displayQuickOption = document.createElement("option");
displayQuickOption.value = "quick";
displayQuickOption.id = "quick";
displayQuickOption.innerHTML = "Finding HITs quickly";
selectAdvice.append(displayQuickOption);

let goodDisplayOption = document.createElement("option");
goodDisplayOption.value = "good";
goodDisplayOption.id = "good";
goodDisplayOption.innerHTML = "How to find good HITs";
selectAdvice.append(goodDisplayOption);

let otherDisplayOption = document.createElement("option");
otherDisplayOption.value = "other";
otherDisplayOption.id = "other";
otherDisplayOption.innerHTML = "Other";
selectAdvice.append(otherDisplayOption);


//Displays the current hint of the current type of advice
let hintContent = document.createElement("div");
hintContent.id = "hintContent";
//hintContent.innerHTML = currentList[0];
hintContainer.append(hintContent);

/*========== feedback ==========*/
let feedbackContainer = document.createElement("div");

/*========== like button ==========*/
let likeButton = document.createElement("img");
let likeURL = chrome.runtime.getURL("img/like.svg");
likeButton.className = "feedbackButton";
likeButton.id= "likeButton";
likeButton.src = likeURL;
feedbackContainer.append(likeButton);

/*========== dislike button ==========*/
let dislikeButton = document.createElement("img");
let dislikeURL = chrome.runtime.getURL("img/dislike.svg");
dislikeButton.className = "feedbackButton";
dislikeButton.id = "dislikeButton";
dislikeButton.src = dislikeURL;
feedbackContainer.append(dislikeButton);

hintContainer.append(feedbackContainer);


/*========== left arrow button ==========*/
let leftHintButton = document.createElement("img");
let preURL = chrome.runtime.getURL("img/left_arrow.svg");
leftHintButton.className = "hintArrowButton";
leftHintButton.src = preURL;
leftHintButton.id = "left_arrow";

/*========== right arrow button ==========*/
let rightHintButton = document.createElement("img");
let nextURL = chrome.runtime.getURL("img/right_arrow.svg");
rightHintButton.className = "hintArrowButton";
rightHintButton.src = nextURL;
rightHintButton.id = "right_arrow";


//Adding buttons and text to the Hint Displayer
hintDisplayer.append(leftHintButton);
hintDisplayer.append(hintContainer);
hintDisplayer.append(rightHintButton);

$(".text-muted div:eq(1)").before(hintDisplayer); //adding hintDisplayer to page

//////////Navigating Hint Displayer//////////


//Allows user to select what kind of hints they want to see
function changeCurrentList()
{
    currentList = hitList;
   
    hintContent.innerHTML = hitList[hitCounter];
}

 jQuery('#SelectAdvice').on('change',  (function() {
    //console.log("select");
    //console.log($('#SelectAdvice').val());
    hitCounter=0;
    updateBySelector('#SelectAdvice');
}));

 function updateBySelector(wantedSelect)
 {
  if($(wantedSelect).val()=="good")
    {
      ajax_getByType("good");
    }
    else if ($(wantedSelect).val()=="quick") 
    { 
        ajax_getByType("quick");
    }
    else
    {
        ajax_getByType("other");
    }

 }


 //Allows users to click right and left buttons to see hints of the current selected type
 
$("#right_arrow").click(function()
{
    //console.log("Right Arrow clicked");
    hintCounter++;
    if(hintCounter>=currentList.length) {hintCounter=0;}
    hintContent.innerHTML = currentList[hintCounter];
});


$("#left_arrow").click(function()
{
    //console.log("Left Arrow clicked");
    hintCounter--;
    if(hintCounter<0) {hintCounter=  currentList.length-1;}
    hintContent.innerHTML = currentList[hintCounter];
    //ajax_get();

});

//Allows users to upvote or downvote hints they like or dislike

$("#likeButton").click(function()
{ 
    upVoted = true;
   ajax_getandUpdateVotes();
  });
 $("#dislikeButton").click(function()
 {
    upVoted = false;
    ajax_getandUpdateVotes();
 });


function ajax_updateVotes(){
  if(upVoted)
    {upVotes++;}
  else
    {upVotes--;}
  var hr = new XMLHttpRequest();
  var url = "http:localhost/14/updateVotes.php";

  if(upVotes<=-20)
  {
    url = "http:localhost/14/updateVotes2.php";
    //currentList[hintCounter]= "hidden";
   // hintContent.innerHTML = currentList[hintCounter];
  }
  console.log(currentList[hintCounter]);
  var adviceText = currentList[hintCounter];
  var votes = upVotes;
  var vars = "adviceText="+adviceText+"&votes="+votes;
  hr.open("POST", url,true);
  hr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  hr.onreadystatechange = function() {
    if(hr.readyState ==4 && hr.status == 200) {
      var return_data = hr.responseText;
      console.log(return_data);
    }
  }
  hr.send(vars);
}

function ajax_getandUpdateVotes(){
  var searchText = $("#hintContent").html();
  var hr = new XMLHttpRequest();
  var url = "http:localhost/14/getVotes.php";
  var type = "searchText="+searchText;
  hr.open("POST", url,true);
  hr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  hr.onreadystatechange = function() {
    if(hr.readyState ==4 && hr.status == 200) {
      var return_data = hr.responseText;
     console.log(return_data);
     var object= $.parseJSON(return_data);
     //var val = parseInt(object[0]);
     //console.log(val);
     upVotes =parseInt(object[0]);
     console.log(upVotes);
     ajax_updateVotes();
    }
  }
  hr.send(type);
}

///////////////////////////Allows users to add Hints/////////////////////////////////

///////User Inteface\\\\\\\\

//add Hint Button, red icon always displayed at bottom of page
let addHintButton = document.createElement("img");
var addURL = chrome.runtime.getURL("img/plus.svg");
addHintButton.id = "add_button";
addHintButton.className = "add_button";
addHintButton.src = addURL;


//Creates box to enter HIT
var enterTip = document.createElement("div");
enterTip.id = "enterTip";
$("#MainContent").append(enterTip);
$("#enterTip").toggle();

var tipLabel= document.createElement("p");
tipLabel.id = "tipLabel";
tipLabel.innerHTML = "Add your advice";

var tipText = document.createElement("textarea");
tipText.id = "tipText";

var addTipButton = document.createElement("button");
addTipButton.id = "addTipButton";
addTipButton.innerHTML= "Add Advice";


var addTipButton = document.createElement("button");
addTipButton.id = "addTipButton";
addTipButton.innerHTML= "Add Advice";

let typeLabel = document.createElement("p");
typeLabel.className = "label_type";
typeLabel.innerHTML = "Please classify the HIT";

let typeSelector = document.createElement("select");
typeSelector.id = "typeSelector";

let quickHitOption = document.createElement("option");
quickHitOption.value = "quick";
quickHitOption.innerHTML = "Finding HITs quickly";
typeSelector.append(quickHitOption);

let goodOption = document.createElement("option");
goodOption.value = "good";
goodOption.innerHTML = "How to find good HITs";
typeSelector.append(goodOption);

let otherOption = document.createElement("option");
otherOption.value = "other";
otherOption.innerHTML = "Other";
typeSelector.append(otherOption);


//append all of the items of the hint adder
$("#enterTip").append(tipLabel);
$("#enterTip").append(tipText);
$("#tipText").attr("placeholder","Type your advice here");
enterTip.append(typeLabel);
enterTip.append(typeSelector);
$("#MainContent").append(addHintButton);
$("#enterTip").append(addTipButton);



//////////Navigating Hint Adder//////////

//adds hint to the specified hint type list
$("#add_button").click(function()
{	
	//console.log("add clicked");
	$("#enterTip").toggle();
});


//Add hint to the type of hint list specified by the selector (does not allow repeat hints)
$("#addTipButton").click(function()
{ 
     var advice = $("#tipText").val();
     //console.log($('#typeSelector').val());
     //console.log($('#SelectAdvice').val());
     if(($('#typeSelector').val())===($('#SelectAdvice').val()))
     {
      //console.log("true");
      currentList.push(advice);
      hintContent.innerHTML = currentList[hintCounter];
     }
    
    //console.log($('#typeSelector').val());
    ajax_post();
    //updateBySelector("#typeSelector");


});


function ajax_post(){
  var hr = new XMLHttpRequest();
  var url = "http:localhost/14/newDataEntry.php";
  var adviceText = $("#tipText").val();
  var adviceType = $('#typeSelector').val();
  var vars = "adviceText=" +adviceText+"&workerId="+workerId+"&adviceType="+adviceType;
  hr.open("POST", url,true);
  hr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  hr.onreadystatechange = function() {
    if(hr.readyState ==4 && hr.status == 200) {
      var return_data = hr.responseText;
      console.log(return_data);
    }
  }
  hr.send(vars);
}

//console.log($("span[data-reactid= .0.1.0]"));
//console.log($('.copyable-content').first().html());
var first = $('.copyable-content').first().html().indexOf('A');
var second = $('.copyable-content').first().html().indexOf('<',2);
var workerId = $('.copyable-content').first().html().substring(first,second);
console.log(workerId);



function ajax_getAll(){
  var hr = new XMLHttpRequest();
  var url = "http:localhost/test7.php";
  hr.open("GET", url,true);
  hr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  hr.onreadystatechange = function() {
    if(hr.readyState ==4 && hr.status == 200) {
      var return_data = hr.responseText;
      console.log(return_data);
      var object= $.parseJSON(return_data);
      console.log(object[0]);
      currentList = object;
      hintContent.innerHTML = object[0];
      //hintContent.innerHTML = return_data;

    }
  }
  hr.send();
}


function ajax_getByType(selectedType){
  var hr = new XMLHttpRequest();
  var url = "http:localhost/14/getAdByType.php";
  var type = "type="+selectedType;
  hr.open("POST", url,true);
  hr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  hr.onreadystatechange = function() {
    if(hr.readyState ==4 && hr.status == 200) {
      var return_data = hr.responseText;
      var object= $.parseJSON(return_data);
      currentList = object;
      hintContent.innerHTML = object[0];
    }
  }
  hr.send(type);
}

/*
$('body').click(function(){
  console.log('clicked');
});
*/
