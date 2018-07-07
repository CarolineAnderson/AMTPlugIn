chrome.runtime.onMessage.addListener(returnLinks);

function returnLinks(message, sender, sendResponse)
{
	if(message.txt=="getLinks")
	{
		console.log("one day I will get links");
		/*
		var arr = [], 
		l = document.links;
		for(var i=0; i<l.length; i++) {
  		arr.push(l[i].href);
		}
		console.log(arr);
		*/
	var scripts = document.getElementsByTagName("iframe");
	//console.log(scripts);
	var doc = document.getElementsByName("#document");
	var c = document.getElementsByClassName('embed-responsive-item');
	//console.log(c[0]);
	var iframe = c[0];
	//var doc = iframe.contentWindow.document.body.innerHTML;
	var h = String(c.innerHTML);
	//console.log(h);
	var taskInfo= JSON.parse($($(document).xpathEvaluate('//*[contains(@data-react-class,"ShowModal")]')[0]).attr("data-react-props"))
		//console.log(taskInfo);
	var data = {};
	if($(".embed-responsive-item").length)
		data["hit_id"] = $("iframe")[0].src
	else
		data["hit_id"] = "";

	//console.log(data["hit_id"]);
	//httpGet(data["hit_id"]);

	//doc.open();
	//console.log(c.contentDocument);
	//var i = $('.embed-responsive-item');
	//var k = i.contents();
	//console.log(k.find("scripts"));
	
	$.ajax({
    url : data["hit_id"],
    dataType:"html",
    success : function(result)
    {
        //console.log(result);
        var newhtml = result;

        var pageURLS = [];
        var g = JSON.stringify(result)
        var stuff = g.indexOf("href=");
        //console.log(g.substring(stuff+7));
        for(var i=0; i<g.length; i++)
        {
        	if(g.substring(i,i+4)==="http")
        	{
        		//console.log("element found");
        		var k = g.substring(i);
                //console.log(k);
        		//console.log(k);
                var endings = [];
        		if(k.indexOf('"')!=-1)endings.push(k.indexOf('"'));
                if(k.indexOf("'")!=-1) endings.push(k.indexOf("'"));
                if(k.indexOf("<")!=-1) endings.push(k.indexOf("<"));
                var correctEnding = endings[0];

                for(var d =1; d<endings.length; d++)
                {
                    if(endings[d]<correctEnding)
                    {
                        correctEnding = endings[d];
                    }
                }
        		//console.log(k.substring(0,ending));
        		pageURLS.push(k.substring(0,correctEnding));
        		//console.log(k.substring(0,end+1));

        	}
        }
        //console.log(pageURLS);
        for(var j =0; j<pageURLS.length;j++)
        {
        	if((pageURLS[j].indexOf("turk")!=-1)||(pageURLS[j].indexOf("bootstrap")!=-1)
        	||(pageURLS[j].indexOf("jquery")!=-1)||(pageURLS[j].indexOf("http-equiv=")!=-1))
        	{
        		//console.log("unnecessary link found");
        		pageURLS.splice(j,1);
        		j--;
        	}
        }
        console.log(pageURLS);

        
		chrome.runtime.sendMessage({arr:pageURLS,txt:"loadingurls"});
 /*
        var shortest = pageURLS[0];
        for(var s = 0; s<pageURLS.length; s++)
        {	
        	if(pageURLS[s].length<shortest.length&&(pageURLS[s]!=""))
        	{
        		shortest = pageURLS[s];
        		//console.log(shortest);
        	}
        }
       
        console.log(shortest);
        for(var n =0; n<pageURLS.length; n++)
        {
        	if((pageURLS[n].indexOf(shortest)!=-1)&&page[n]
        	{
        		console.log("repeat");
        	}
        }
        */
       

        
    }
});
		
	}
}

$.fn.xpathEvaluate = function (xpathExpression) {
	// NOTE: vars not declared local for debug purposes
	$this = this.first(); // Don't make me deal with multiples before coffee
	
	// Evaluate xpath and retrieve matching nodes
	xpathResult = this[0].evaluate(xpathExpression, this[0], null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	
	result = [];
	while (elem = xpathResult.iterateNext()) {
		result.push(elem);
	}
	
	$result = jQuery([]).pushStack( result );
	return $result;
}


