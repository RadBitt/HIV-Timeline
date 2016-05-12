var date,
	celebGroup,
	healthGroup,
	interGroup,
	poliGroup,
	sociGroup;

var id = 0;

var Timeline = new Timeline();
var Display = new Display(Timeline); 

for (var i = 0; i < timelineArray.length; i++) {
	id = timelineArray[i].id
	date = timelineArray[i].date + '';
	category = getCategory(timelineArray[i].category)
	title = timelineArray[i].title
	photos = timelineArray[i].photos
	description = timelineArray[i].description
	if (date.length == 4) {
		randMonth = getRandomArbitrary(1, 12);
		date = date + '-' + randMonth + '-1';
		// console.log(date); 
	}
		 
	Timeline.addEvent(id, date, category, description, photos);
}

Timeline.sortEvents(Timeline.getArray(), 1, Timeline.numOfEvents());
Timeline.resetIds();
Timeline.firstEvent();
Display.drawContainer();
Display.drawEventViewer();
Display.drawSegment();
Display.drawEvents(); 

function getCategory(string) {
	if (string == 'International Information')
		return 'international';
	else if (string == 'Political Events')
		return 'political';
	else if (string == 'Public Health and Medicine')
		return 'health';
	else if (string == 'Social Activism')
		return 'social';
	else if (string == 'Celebrities and AIDS')
		return 'celebrity';
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}