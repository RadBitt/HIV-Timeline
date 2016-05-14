
function Display(TimelineObject, optionsObject, controlObject) {

	var that = this;

	this.Options = setOptions();

	this.Control = setControls(); 

	this.container = this.Options.container;

	this.timelineContiner = this.Options.timelineContiner;

	this.eventViewContainer = this.Options.eventViewContainer; 

	this.Timeline = TimelineObject;
	
	this.drawContainer = function() {
		var newElement; 
		var styles = {
	      // width: 100%,
	      // height: this.Options.height
	    };

	    this.container = $(this.container).append('<div id="timeline"></div>');
	    newElement = $(this.timelineContiner);
	    this.container.css(styles); 
		newElement.css(styles);
	};

	this.drawEventViewer = function() {
		var newElement;
		var styles = {
	      // width: this.Options.eventViewWidth,
	      // height: this.Options.eventViewHeight
	    };

	    this.eventViewContainer = $(this.eventViewContainer).append('<div id="event-viewer"></div>');
	    this.eventViewContainer.css(styles); 
	    newElement = $('#event-viewer');
		newElement.css(styles);
		this.Control.drawNextButton();
		this.Control.drawPrevButton(); 
	};

	this.drawSegment = function() {
		var vLine, lineRule; 
		var segmL = this.Options.segmentLength;
		var line = $(this.timelineContiner);
		var div = '<div class="vertical-line"></div>';
		var vLineStyles = {
			left: 0		
		};

		line.append('<hr id="the-line">');

		for (var i = 0; i < segmL; i++) {
			vLine = line.append(div)
		}

		// container width divided by the..
		// segment length plus the width of a vertical line, 
		lineRule = (line.outerWidth() / (segmL + 1));

		$.each($('#timeline div'), function() {
			vLineStyles.left = (vLineStyles.left + lineRule); 
			$(this).css(vLineStyles); 
		});
	};

	this.drawEvents = function(direction) {

		var segmL = this.Options.segmentLength;

		if (direction == undefined)
			this.nextSegment(this.Timeline.currentEvent()); 
		else if (direction == 'next') {
			var lastEvent = $('#timeline div.event').last();
			this.Timeline.getId(parseInt(lastEvent.attr('id')));
			// console.log(Event); 
			clearSegment();
			this.nextSegment(this.Timeline.nextEvent()); 
		} else if (direction == 'prev') {
			var firstEvent = $('#timeline div.event').first();
			this.Timeline.getId(parseInt(firstEvent.attr('id')));
			// console.log(Event); 
			clearSegment();
			this.prevSegment(this.Timeline.prevEvent());
		}

		drawText(); 

		$('#timeline div.event').click(function() {
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
		var segmL = this.Options.segmentLength;
		var startYear = getDecade(Event.getDate().getFullYear(), 'next');
		var endYear = startYear + segmL; 
		var line = $(this.timelineContiner);
		var eventElementString, thisElement, EventId, endCondition;
		var eventStyles = {left: parseInt(this.Options.width)}; 

		$('#timeline div.oldEvent').animate({left: -1, opacity: 0}, 1000, function() {
			$('#timeline div.oldEvent').remove();
		});
		
		while (Event.getDate().getFullYear() <= endYear) {
			console.log(startYear + ' < ' + endYear)
			EventId = Event.getId(); 
			eventElementString = '<div id="' + EventId + '" class="' + Event.getType() + ' event"></div>';
			line.append(eventElementString);
			thisElement = $('#timeline div.event').last();
			eventStyles.left = parseInt(this.Options.width);
			eventStyles.opacity = 0; 
			thisElement.css(eventStyles);
			thisElement.animate({left: findPosition(that, Event), opacity: 1}, 1000);
			addMobileElement(thisElement);
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

	};

	this.prevSegment = function(Event) {
		var segmL = this.Options.segmentLength;
		var startYear = getDecade(Event.getDate().getFullYear(), 'prev');
		var endYear = startYear - segmL;
		var line = $(this.timelineContiner);
		var eventElementString, thisElement, EventId, endCondition, firstEvent;
		var eventStyles = {}; 
		
		$('#timeline div.oldEvent').animate({left: parseInt(this.Options.width), opacity: 0}, 1000, function() {
			$('#timeline div.oldEvent').remove();
		});

		console.log(Event.getDate().getFullYear() + '>=' + endYear)
		while (Event.getDate().getFullYear() >= endYear) {
			EventId = Event.getId(); 
			eventElementString = '<div id="' + EventId + '" class="' + Event.getType() + ' event"></div>';
			firstEvent = $('#timeline div.event');
			if (firstEvent.length == 0) {
				line.append(eventElementString);
			} else {
				firstEvent = firstEvent.first();
				firstEvent.before(eventElementString);
			}
			thisElement = $('#timeline div.event').first();
			eventStyles.left = 0;
			eventStyles.opacity = 0; 
			thisElement.css(eventStyles);
			thisElement.animate({left: findPosition(that, Event), opacity: 1}, 1000);
			addMobileElement(thisElement);
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
	};

	function addMobileElement(Element) {
		var newElement;
		var newElementString = '<div class="mobile-event"></div>';
		newElement = $(newElementString).appendTo(Element);
	}

	function addMobileText() {
		var Event, mobileElement, id;
		$('.event').each(function(){
			id = $(this).attr('id'); 
			// console.log(id);
			Event = that.Timeline.getId(id);
			mobileElement = $(this).children(":first");
			mobileElement.append('<p>' + Event.getDate() +  '</p>');
			mobileElement.append('<p>' + Event.getType() +  '</p>');
			mobileElement.append('<p>' + Event.getText() +  '</p>');
		});
	}

	function addMobileDecade(year) {
		var eventViewContainer = $(that.Options.eventViewContainer);
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
		eventView.append('<p>' + Event.getDate() +  '</p>');
		eventView.append('<p>' + Event.getType() +  '</p>');
		eventView.append('<p>' + Event.getText() +  '</p>');
		that.Control.drawCloseButton(); 
		that.Control.drawNextEventButton();
		that.Control.drawPrevEventButton();
		hideDeathText();
		checkEventControl(id);
		highlightEvent(id); 
	}

	function highlightEvent(id) {
		var Element = $('#'+id);
		var oldElement = $('#timeline div.event.highlighted').removeClass('highlighted');

		oldElement.animate({top: -17}, 500);

		Element.animate({top: -40}, 500, function() {
			Element.addClass('highlighted'); 
		});
		
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

	function clearSegment() {
		var amountLeft;
		var oldEvents = $('#timeline div.event')
		
		$.each(oldEvents, function() {
			amountLeft = parseInt($(this).css('left'));
			$(this).addClass('oldEvent').removeClass('event');
		});

		removeEventView();
	}

	function drawText() {
		var temp, year, newText, newDeath, lineHeight, mobileYear;
		var segmL = that.Options.segmentLength;
		var	viewHeight = that.Options.eventViewHeight; 
		var firstEvent = $('#timeline div.event').first();
		var Event = that.Timeline.getId(parseInt(firstEvent.attr('id')));
		var startYear = Event.getDate().getFullYear();
		var vLine = $('#timeline div.vertical-line').first();

		$('#timeline div.vertical-line p, #timeline p, .death-text').remove();

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

	function findPosition(that, Event) {
		var eventYear, eventPos;
		var segmL = that.Options.segmentLength;
		var displayWidth = parseInt(that.Options.width);
		var pixelsPerSeg = (displayWidth / segmL);//
		var pixelsPerMonth = Event.getDate().getMonth() * (pixelsPerSeg / 12); // 
		eventYear = parseInt(Event.getDate().getFullYear().toString().charAt(3)); //
		eventPos = pixelsPerSeg * eventYear + pixelsPerMonth;
		// console.log(pixelsPerSeg + ' * ' + eventYear + ' + ' + pixelsPerMonth); 
		if (eventPos > displayWidth) return displayWidth - pixelsPerMonth; else return eventPos;
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
		this.width = $('#event-viewer-container').innerWidth();
		this.height = '100px';
		this.eventViewWidth = this.width;
		this.eventViewHeight = '400px';
		this.segmentLength = 9;
		this.firstRulePos = parseInt(this.width) / this.segmentLength; 
		this.container = '#timeline-container';
		this.timelineContiner = '#timeline';
		this.eventViewContainer = '#event-viewer-container';

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
				width: '30px',
				height: '20px',
				top: '10px',
				right: '20px',
				background: 'red'
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
				// position: 'absolute',
				// width: '14px',
				// height: '23px',
				// bottom: '0',
				// right: '-28px'
			};
			
			$(eventView).append(newElement); 
			$(this.nextButton).css(nextStyles);
			$(this.nextButton).click(function() {
				that.drawEvents('next'); 
			});

		};

		this.drawPrevButton = function() {
			var eventView = that.eventViewContainer
			var newElement = '<div id="prev-button"></div>';
			var prevStyles = {
				// position: 'absolute',
				// width: '14px',
				// height: '23px',
				// bottom: '0',
				// left: '-28px'
			};
			
			$(eventView).append(newElement); 
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

