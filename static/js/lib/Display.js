
function Display(TimelineObject, optionsObject, controlObject) {

	var that = this;

	this.Options = setOptions();

	this.Control = setControls(); 

	this.container = this.Options.container;

	this.timelineContiner = this.Options.timelineContiner;

	this.eventViewContainer = this.Options.eventViewContainer; 

	this.Timeline = TimelineObject;
	
	this.drawContainer = function() {
	    d.getElementById(this.container).innerHTML += '<div id="timeline"></div>'; 
	};

	this.drawEventViewer = function() {
		var newElement;
	    d.getElementById(this.eventViewContainer).innerHTML += '<div id="event-viewer"></div>';
		this.Control.drawNextButton();
		this.Control.drawPrevButton(); 
	};

	this.drawSegment = function() {
		var lineRule, divsArr, unit;
		var segmL = this.Options.segmentLength;
		var line = d.getElementById(this.timelineContiner);
		var div = '<div class="vertical-line"></div>';
		var leftValue = 0;

		line.innerHTML += '<hr id="the-line">';

		for (var i = 0; i < segmL; i++) {
			line.innerHTML += div; 
		} 
		
		divsArr = d.getElementsByClassName('vertical-line');
		// container width divided by the..
		// segment length plus the width of a vertical line, 
		lineRule = (line.offsetWidth / (segmL + 1));
		unit = 'px';  

		for (var i = 0; i < divsArr.length; i++) {
			leftValue = (leftValue + lineRule);
			divsArr[i].style['left'] = leftValue + unit;
		}
	};

	this.drawEvents = function(direction) {
		var oldEvents, EventId;
		var segmL = this.Options.segmentLength;
		oldEvents = d.getElementsByClassName('event');

		if (direction == undefined)
			this.nextSegment(this.Timeline.firstEvent()); 
		else if (direction == 'next') {
			EventId = oldEvents[oldEvents.length-1].id; /* Last Event Id */
			this.Timeline.getId(parseInt(EventId)); 
			clearSegment(oldEvents);
			this.nextSegment(this.Timeline.nextEvent()); 
		} else if (direction == 'prev') {
			EventId = oldEvents[0].id; /* First Event Id */
			this.Timeline.getId(parseInt(EventId));
			clearSegment(oldEvents);
			this.prevSegment(this.Timeline.prevEvent());
		}

		drawText(); 

		$('.event').click(function() {
			drawEventView(this.id); 
		});

		addMobileText(); 
	};

	this.nextEvent = function() {
		var id = this.Timeline.getInt();
		checkEventView();
		checkEventControl(id-1);
		drawEventView(id+1);
	};

	this.prevEvent = function() {
		var id = this.Timeline.getInt();
		checkEventView(); 
		drawEventView(id-1);
		checkEventControl(id-1);
	};

	this.nextSegment = function(Event) { 
		var docFrag = d.createDocumentFragment(); 
		var eventElementString, lastElement, EventId;
		var segmL = this.Options.segmentLength;
		var startYear = getDecade(Event.getDate().getFullYear(), 'next');
		var endYear = startYear + segmL; 
		var line = d.getElementById(this.timelineContiner);
		var initialLeft = this.Options.width + 'px'; 

		$('.oldEvent').animate({left: -1, opacity: 0}, 1000, function() {
			$('.oldEvent').remove();
		});
		
		while (Event.getDate().getFullYear() <= endYear) {
			EventId = Event.getId(); 
			lastElement = d.createElement('div');
			lastElement.setAttribute('id', EventId);
			lastElement.setAttribute('class', Event.getType() + ' event');
			lastElement.style['left'] = initialLeft;
			lastElement.style['opacity'] = 0;
			docFrag.appendChild(lastElement);
			addMobileElement(lastElement);
			if (this.Timeline.isLast()) {
				this.Control.removeNextButton();
				break;
			} else if (this.Timeline.isFirst()) {
				this.Control.removePrevButton(); 
			} else {
				if ($(this.Control.nextButton).length == 0)
					this.Control.drawNextButton();
				if ($(this.Control.prevButton).length == 0)
					this.Control.drawPrevButton();
			}

			Event = this.Timeline.nextEvent();
		}

		line.appendChild(docFrag);

		animateEvents(); 

	};

	this.prevSegment = function(Event) {
		var docFrag = d.createDocumentFragment();
		var eventElementString, EventId, firstElement;
		var segmL = this.Options.segmentLength;
		var startYear = getDecade(Event.getDate().getFullYear(), 'prev');
		var endYear = startYear - segmL;
		var line = d.getElementById(this.timelineContiner);
		var initialLeft = this.Options.width; 

		$('.oldEvent').animate({left: initialLeft, opacity: 0}, 1000, function() {
			$('.oldEvent').remove();
		});

		while (Event.getDate().getFullYear() >= endYear) {
			EventId = Event.getId(); 
			firstElement = d.createElement('div'); 
			firstElement.setAttribute('id', EventId);
			firstElement.setAttribute('class', Event.getType() + ' event');
			firstElement.style['left'] = '0px';
			firstElement.style['opacity'] = 0;
			docFrag.insertBefore(firstElement, docFrag.childNodes[0]);
			addMobileElement(firstElement);
			if (this.Timeline.isFirst()) {
				this.Control.removePrevButton();
				break;
			} else if (this.Timeline.isLast()) {
				this.Control.removePrevButton(); 
			} else {
				if ($(this.Control.nextButton).length == 0)
					this.Control.drawNextButton();
				if ($(this.Control.prevButton).length == 0)
					this.Control.drawPrevButton();
			}
			Event = this.Timeline.prevEvent();
		}

		line.appendChild(docFrag);

		animateEvents(); 

	};

	function animateEvents() {
		var id;
		$('.event').each(function() {
			id = $(this).attr('id');
			Event = that.Timeline.getId(id); 
			$(this).animate({left: findPosition(Event), opacity: 1}, 1000);  
		});
	}

	function addMobileElement(Element) {
		var newElementString = '<div class="mobile-event"></div>';
		Element.innerHTML += newElementString;
	}

	function addMobileText() {
		var Event, mobileElement, id;
		$('.event').each(function(){
			id = $(this).attr('id'); 
			// console.log(id);
			Event = that.Timeline.getId(id);
			mobileElement = $(this).children(":first");
			mobileElement.append('<p class="date">' + Event.printDate() +  '</p>');
			mobileElement.append('<p class="type">' + Event.getType() +  '</p>');
			mobileElement.append('<p class="text">' + Event.getText() +  '</p>');
		});
	}

	function addMobileDecade(year) {
		var eventViewContainer = $('#'+that.Options.eventViewContainer);
		if ($('#mobile-decade').length > 0)
			$('#mobile-decade').html('' + year + ' - ' + (year + 9));
		else
			eventViewContainer.append('<p id="mobile-decade">' + year + ' - ' + (year + 9) + '</p>');
	}

	function drawEventView(id) {
		var eventView;
		var eventViewString = '<div id="event-view"></div>';
		var Event = that.Timeline.getId(id);

		checkEventView();

		eventView = $(eventViewString).appendTo('#event-viewer'); 
		eventView.append(''+
			'<div id="img" style="background-color: grey;"></div>' + 
			'<div class="event-text">' + 
			'<h3>' + Event.printDate() + 
			' - ' + Event.getType() +  '</h3>' +
			'<p>' + Event.getText() +  '</p>');
		that.Control.drawCloseButton(); 
		that.Control.drawNextEventButton();
		that.Control.drawPrevEventButton();
		hideDeathText();
		checkEventControl(id);
		highlightEvent(id); 
	}

	function highlightEvent(id) {
		var Element = $('#'+id);
		var oldElement = $('.event.highlighted').removeClass('highlighted');
		oldElement.animate({top: -17}, 500);
		if (window.innerWidth > 1000)
			Element.addClass('highlighted');
		Element.animate({top: -40}, 400);
	}

	function checkEventView() {
		var eventView = $('#event-view');
		if ( eventView.length == 1)
			eventView.remove();
	}

	function checkEventControl(id) {
		var firstInt = $('#timeline div.event').first().attr('id');
		var lastInt = $('#timeline div.event').last().attr('id');
		console.log(id + ' == ' + firstInt);
		console.log(id + ' == ' + lastInt);  
		if (id == lastInt && id == firstInt) { 
			that.Control.removeNextEventButton();
			that.Control.removePrevEventButton();
		} else if (id == firstInt) {
			that.Control.removePrevEventButton();
		} else if (id == lastInt) {
			that.Control.removeNextEventButton(); 
		} else {
			if ($(that.Control.nextEvent).length == 0)
				that.Control.drawNextEventButton();
			if ($(that.Control.prevEvent).length == 0)
				that.Control.drawPrevEventButton();
		}
	}

	function removeEventView() {
		eventView = $('#event-view').remove(); 
		showDeathText(); 
	}

	function clearSegment(oldEvents) {
		
		while (oldEvents.length > 0) {
			oldEvents[oldEvents.length-1].classList.add('oldEvent');
			oldEvents[oldEvents.length-1].classList.remove('event');
		}

		removeEventView();
	}

	function drawText() {
		var temp, year, newText, newDeath, lineHeight, mobileYear;
		var segmL = that.Options.segmentLength;
		var	viewHeight = that.Options.eventViewHeight; 
		var firstEventId = d.getElementsByClassName('event')[0].id;
		var Event = that.Timeline.getId(parseInt(firstEventId));
		var startYear = Event.getDate().getFullYear();
		var vLine = $('.vertical-line').first();

		$('.vertical-line p, #timeline p, .death-text').remove();

		if (startYear.toString().charAt(3) > 0) {
			var temp = parseInt(startYear.toString().charAt(3));
			startYear = startYear - temp; 
		}

		for (var i = 0; i <= segmL; i++) {
			year = startYear + i;
			newText = '<p class="rule-text">' + year + '</p>';
			lineHeight = Deaths[year] / Deaths.ratio; 
			if (i == 0) {
				vLine.before(newText);
				addMobileDecade(year); 
				if (deathText(year) != false) {
					$(deathText(year)).insertBefore(vLine).animate(
						{height: lineHeight+'px', top: -1*lineHeight}, 1000
					);
				}
			} else {
				vLine.append(newText);
				if (deathText(year) != false) {
					$(deathText(year)).appendTo(vLine).animate(
						{height: lineHeight+'px', top: -1*lineHeight}, 1000
					);
				}					
				vLine = vLine.next();
			}		
		}

	}

	function deathText(year) {
		if (Deaths[year] != null) {
			newDeath = '<div style="height: 0px; top: 0" class="death-text">';
			newDeath += '<p>' + Deaths[year] + '</p></div>';
			return newDeath;
		} else return false; 
	}

	function hideDeathText() {
		$('.death-text').hide(500);
	}

	function showDeathText() {
		$('.death-text').show(500);
	}

	function findPosition(Event) {
		var eventYear, eventPos;
		var segmL = that.Options.segmentLength;
		var displayWidth = parseInt(that.Options.width);
		var pixelsPerSeg = (displayWidth / segmL);//
		var pixelsPerMonth = Event.getDate().getMonth() * (pixelsPerSeg / 12); // 
		eventYear = parseInt(Event.getDate().getFullYear().toString().charAt(3)); //
		eventPos = pixelsPerSeg * eventYear + pixelsPerMonth;
		// console.log(pixelsPerSeg + ' * ' + eventYear + ' + ' + pixelsPerMonth); 
		if (eventPos > displayWidth) { 
			// console.log(displayWidth - pixelsPerMonth);
			return displayWidth - 22; 
		} else {
			// console.log(eventPos);
			return eventPos;
		}		
		// console.log(eventPos);
		return eventPos; 
	}

	function getDecade(year, direction) {
		var ones;
		if (direction == 'next') {
			ones = parseInt(year.toString().charAt(3));
			year = year - ones;
			return year;
		} else if (direction == 'prev') {
			return year;
		} 
	}

	function setOptions() {
		if (optionsObject == undefined)
			return new DisplayOptions();
		else
			return optionsObject; 
	}

	function setControls() {
		if (controlObject == undefined)
			return new Control(that);
		else
			return controlObject; 
	}

	function DisplayOptions() {
		this.width = d.getElementById('event-viewer-container').offsetWidth; 
		this.height = '100px';
		this.eventViewWidth = this.width;
		this.eventViewHeight = '400px';
		this.segmentLength = 9;
		this.firstRulePos = parseInt(this.width) / this.segmentLength; 
		this.container = 'timeline-container';
		this.timelineContiner = 'timeline';
		this.eventViewContainer = 'event-viewer-container';

	}

	function Control(display) {
		
		this.filterContainer = '#filter-container';
		this.closeEventView = '#close-button';
		this.nextEvent = '#next-event';
		this.prevEvent = '#prev-event'; 
		this.nextButton = '#next-button';
		this.prevButton = '#prev-button';

		this.drawNextEventButton = function() {
			var eventView = '#event-view';
			var newElement = '<div id="next-event"></div>';
			var styles = {
				position: 'absolute',
				width: '17px',
				height: '30px',
				top: '40%',
				right: '8%',
			};
			
			$(eventView).append(newElement); 
			$(this.nextEvent).css(styles);
			$(this.nextEvent).click(function() {
				that.nextEvent(); 
			});
		};

		this.drawPrevEventButton = function() {
			var eventView = '#event-view';
			var newElement = '<div id="prev-event"></div>';
			var styles = {
				position: 'absolute',
				width: '17px',
				height: '30px',
				top: '40%',
				left: '8%',
			};
			
			$(eventView).append(newElement); 
			$(this.prevEvent).css(styles);
			$(this.prevEvent).click(function() {
				that.prevEvent(); 
			});
		};

		this.drawCloseButton = function() {
			var eventView = '#event-view';
			var newElement = '<div id="close-button"></div>';
			var closeStyles = {
				position: 'absolute',
				width: '25px',
				height: '25px',
				top: '20px',
				right: '85px',
			};
			
			$(eventView).append(newElement); 
			$(this.closeEventView).css(closeStyles);
			$(this.closeEventView).click(function() {
				removeEventView(); 
			});

		};
		
		this.drawNextButton = function() {
			var eventView = that.eventViewContainer
			var newElement = '<div id="next-button"></div>';
			var nextStyles = {
			};
			
			$('#'+eventView).append(newElement); 
			$(this.nextButton).css(nextStyles);
			$(this.nextButton).click(function() {
				that.drawEvents('next'); 
			});

		};

		this.drawPrevButton = function() {
			var eventView = that.eventViewContainer
			var newElement = '<div id="prev-button"></div>';
			var prevStyles = {
			};
			
			$('#'+eventView).append(newElement); 
			$(this.prevButton).css(prevStyles);
			$(this.prevButton).click(function() {
				that.drawEvents('prev'); 
			});
		};

		this.removeNextEventButton = function () {
			$(this.nextEvent).remove();
		};

		this.removePrevEventButton = function () {
			$(this.prevEvent).remove(); 
		};

		this.removeNextButton = function() {
			$(this.nextButton).remove();
		};
		
		this.removePrevButton = function() {
			$(this.prevButton).remove();
		};

		this.drawFilter = function() {

		};

	}

}

