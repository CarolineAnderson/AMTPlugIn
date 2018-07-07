chrome.runtime.onMessage.addListener(trackActivityMethod);

function trackActivityMethod(message, sender, sendResponse)
{
  
	if(message.txt=="loadmonitors")
  {
    if(message.amt)
    {
      var first = $('.copyable-content').first().html().indexOf('A');
      var second = $('.copyable-content').first().html().indexOf('<',2);
      var workerId = $('.copyable-content').first().html().substring(first,second);
      console.log(workerId);
      chrome.storage.sync.set({'wId':workerId}, function(){});
    }
    var moves =0;
    $('body').click(function(){
      chrome.storage.sync.get(['isWorking'], function(result) {
        console.log(result.isWorking);
        if(!result.isWorking)
        {
          chrome.storage.sync.set({'isWorking':true}, function(){
            console.log("you are now working");
          });
          chrome.runtime.sendMessage({txt: "startNewWorkSession"}, function(response) { });
        }
      });
        console.log('clicked');
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


      });
     $('body').keyup(function(){
      chrome.storage.sync.get(['isWorking'], function(result) {
        console.log(result.isWorking);
        if(!result.isWorking)
        {
          chrome.storage.sync.set({'isWorking':true}, function(){
            console.log("you are now working");
          });
          chrome.runtime.sendMessage({txt: "startNewWorkSession"}, function(response) { });
        }
      });
        console.log('clicked');
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

      });
    
      $('body').mousemove(function(){
        moves++
        if(moves>50)
        {
      chrome.storage.sync.get(['isWorking'], function(result) {
        console.log(result.isWorking);
        if(!result.isWorking)
        {
          chrome.storage.sync.set({'isWorking':true}, function(){
            console.log("you are now working");
          });
          chrome.runtime.sendMessage({txt: "startNewWorkSession"}, function(response) { });
        }
      });
        console.log('clicked');
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
            moves=0;
        }
      });
     

    }
}