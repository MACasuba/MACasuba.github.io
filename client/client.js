/*
  Code by Clayton Unicorn
  example used on https://swift.unicorn.tv/screencasts/introduction-to-tvos
*/

App.onLaunch = function(options) {
  // Create an object to store our catalog entries in
  var data = {
    "day"      : null,
    "night"    : null,
  };

  // Take an XML string and turn it into a parse into a proper DOM
  function parse(xml) {
    var parser = new DOMParser();
    return parser.parseFromString(xml, "application/xml");
  }

  // Display video media in full-screen
  function displayVideo(event) {
    var url = event.target.getAttribute("video", url);

    if (url) {
      var player = new Player();
      var playlist = new Playlist();
      var mediaItem = new MediaItem("video", url);
  
      player.playlist = playlist;
      player.playlist.push(mediaItem);
      player.present();
    }
  }

  function refreshCatalog() {
  //start XML header
      var catalog = '<?xml version="1.0" encoding="UTF-8" ?><document><catalogTemplate><banner><title>Aerial listing</title></banner><list>';
      
   for (topic in data)
       {
 				//add section day to xml 
   			if (data["day"]) { 

  //count the number of day vids
  			var countday = 0;
  //12 arrays in the JSON, cunt all day's
			  for (var yy = 0; yy < 12; yy++)
  	  			{
    	 			for (var day = 0; day < data[topic][yy]["assets"].length; day++)
  							{
  							if (data[topic][yy]["assets"][day].timeOfDay == "day")   
  							countday++;
  							} 			
   				 }             

catalog += `<section>
<listItemLockup>
<title>day</title>
<decorationLabel>${countday}</decorationLabel>
<relatedContent>
<grid>
<section>`;

//add the other arrays also
//there are 12 array's (xx)
					  for (var xx = 0; xx < 12; xx++)
								{




                 for (i = 0; i < data[topic][xx]["assets"].length; i++)
                     {
//only add the day videos to the XML section
                            if (data[topic][xx]["assets"][i].timeOfDay == "day")   {
                                //console.log('has video, create day lockup');
                                catalog += `<lockup video="${data[topic][xx]["assets"][i].url}">
                                <img src="https://macasuba.github.io/client/${data[topic][xx]["assets"][i].id}.jpg" width="550" height="275" />
                                <title>${data[topic][xx]["assets"][i].accessibilityLabel}</title>
                                </lockup>`;
                            }//einde if 
                        }//einde for
                        
                    }//einde xx    
                        
                }//einde if day
                  
                  
catalog += `</section>
</grid>
</relatedContent>
</listItemLockup>
<listItemLockup>
<title>night</title>`;
    }


     for (topic in data)
       {
        //add night to catalog
        if (data["night"]) {
//count videos with night scene
				var countnight = 0;
				for (var vv = 0; vv < 12; vv++)
						{
						for (var night = 0; night < data[topic][vv]["assets"].length; night++)
								{
								if (data[topic][vv]["assets"][night].timeOfDay == "night")   
								countnight++;
								}
						}
			
//build the XML between the two data topics day and night
catalog += `<decorationLabel>${countnight}</decorationLabel>
<relatedContent>
<grid>
<section>`;

//add the other arrays also
//there are 12 array's (xx)
// data[topic][xx]["assets"][0].id);
					  for (var ww = 0; ww < 12; ww++)
								{


//only count the night vids
                 for (j = 0; j < data[topic][ww]["assets"].length; j++)                 
                     {
                            if (data[topic][ww]["assets"][j].timeOfDay == "night")   {
                                catalog += `<lockup video="${data[topic][ww]["assets"][j].url}">
                                <img src="https://macasuba.github.io/client/${data[topic][ww]["assets"][j].id}.jpg" width="550" height="275" />
                                <title>${data[topic][ww]["assets"][j].accessibilityLabel}</title>
                                </lockup>`;
                            }//einde if 
                        }//einde for
                }//einde ww
        }//einde night
                
//close XML
catalog += `</section>
</grid>
</relatedContent>
</listItemLockup>
</section>`;
       	}//einde for

//afsluiten catalog
catalog += `</list>
</catalogTemplate>
</document>`;

      var catalogDoc = parse(catalog);
      catalogDoc.addEventListener("select", displayVideo);
      navigationDocument.pushDocument(catalogDoc);
    
}//end function


  // Fetch data from an API / server
  function fetchData(topic) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function()
    {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          data[topic] = JSON.parse(httpRequest.responseText);
          //console.log('--fetching url : ' + data[topic]["assets"][0].url);
          console.log('--fetching length assets 1 : ' + data[topic][1]["assets"].length);//geeft 17 vids
          console.log('--fetching length assets 0 : ' + data[topic][0]["assets"].length);//geeft 4 vids
          console.log('--fetching length id all   : ' + data[topic][0]["id"].length);//geeft 36 carracters van het id nr   
          
          refreshCatalog();
        }
      }
    }
    httpRequest.open('GET', 'http://a1.phobos.apple.com/us/r1000/000/Features/atv/AutumnResources/videos/entries.json');   
    httpRequest.send();
  }


  // Loop through the topics and fetch the results from the API
  for (topic in data) {
    fetchData(topic);
  }



}//end

