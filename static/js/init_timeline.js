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
	photos = timelineArray[i].photo
	description = timelineArray[i].description
	if (date.length == 4) {
		randMonth = getRandomArbitrary(1, 12);
		date = date + '/' + randMonth + '/1';
		// console.log(date); 
	}
		 
	Timeline.addEvent(id, date, category, description, photos);
}

Timeline.sortEvents(Timeline.getArray(), 1, Timeline.numOfEvents());
Timeline.resetIds();
Display.drawContainer();
Display.drawFilter(); 
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

function printType(string) {
	if (string == 'international')
		return 'International Information';
	else if (string == 'political')
		return 'Political Events';
	else if (string == 'health')
		return 'Public Health and Medicine';
	else if (string == 'social')
		return 'Social Activism';
	else if (string == 'celebrity')
		return 'Celebrities and AIDS';
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
