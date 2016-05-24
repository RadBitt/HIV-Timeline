var active = window.location.pathname;

active = active.split('/')[3];

active = active.split('.')[0];

function searchRelated(searchString) {     
    var Event;
    var returnArr = [];

    for (var i = 0; i < timelineArray.length; i++) {
        var page = timelineArray[i].page; 
        if (page.search(new RegExp(searchString, "i")) >= 0){
            returnArr.push(timelineArray[i].id);
            console.log("searchPage() success");    
        }
    }
    return returnArr;
}

var element = $('.timeline-events'); 

if (element.length > 0) {

	var linkArray = searchRelated(active);

	for (var i = 0; i < linkArray.length; i++) {

		element.append('<li><a href="index.html?event=' + linkArray[i] + '">' + timelineArray[(linkArray[i]) - 1].category +  '</a></li>');

	}

}
