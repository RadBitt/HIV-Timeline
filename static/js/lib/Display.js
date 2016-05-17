
function Display(TimelineObject, optionsObject, controlObject) {

	var that = this;

	this.Options = setOptions();

	this.Control = setControls(); 

	this.container = this.Options.container;

	this.timelineContiner = this.Options.timelineContiner;

	this.eventViewContainer = this.Options.eventViewContainer; 

	this.filterContainer = this.Control.filterContainer; 

	this.Timeline = TimelineObject;
	
	this.drawContainer = function() {
	    d.getElementById(this.container).innerHTML += '<div id="timeline"></div>'; 
	};

	this.drawFilter = function() {
		var container = d.getElementById(this.filterContainer); 
		container.appendChild(this.Control.filter());
		// this.Control.drawFilterButton();
	}

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

		line.innerHTML += '<div id="y-line">';
		line.innerHTML += '<hr id="x-line">';

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
		var oldEvents, EventId, docFrag;
		var line = d.getElementById(this.timelineContiner);
		oldEvents = d.getElementsByClassName('event');

		if (direction == undefined)
			docFrag = this.nextSegment(this.Timeline.firstEvent()); 
		else if (direction == 'next') {
			EventId = oldEvents[oldEvents.length-1].id; /* Last Event Id */
			this.Timeline.getId(parseInt(EventId)); 
			clearSegment(oldEvents);
			docFrag = this.nextSegment(this.Timeline.nextEvent());
		} else if (direction == 'prev') {
			EventId = oldEvents[0].id; /* First Event Id */
			this.Timeline.getId(parseInt(EventId));
			clearSegment(oldEvents);
			docFrag = this.prevSegment(this.Timeline.prevEvent());
		}

		line.appendChild(docFrag); 
		animateEvents();
		drawText(); 

		$('.event').click(function() {
			drawEventView(this.id); 
		});

		addMobileText(); 

		if (window.location.href.indexOf("?") > -1) {
			var id = document.location.search.split('=')[1];
			id = parseInt(id);
			console.log(id); 
			drawEventView(id); 
		}
	};

	this.nextEvent = function() {
		this.Timeline.nextEvent();
		var id = this.Timeline.getInt();
		var Event = $('#'+id);
		if(Event.length == 0) {
			this.Control.removeNextEventButton();
			return
		} else if (Event.hasClass('hidden')) { 
			this.nextEvent();
			return
		} else if (!Event.hasClass('hidden')) {
			checkEventView();
			drawEventView(id);
			checkEventControl(id-1);
		} 
	};

	this.prevEvent = function() {
		this.Timeline.prevEvent();
		var id = this.Timeline.getInt();
		var Event = $('#'+id);
		if(Event.length == 0) {
			this.Control.removePrevEventButton();
			return
		} else if (Event.hasClass('hidden')) { 
			this.prevEvent();
			return
		} else if (!Event.hasClass('hidden')) {
			checkEventView();
			drawEventView(id);
			checkEventControl(id);
		} 
	};

	this.nextSegment = function(Event) { 
		var docFrag = d.createDocumentFragment(); 
		var eventElementString, lastElement, EventId, EventType, classString;
		var segmL = this.Options.segmentLength;
		var startYear = getDecade(Event.getDate().getFullYear(), 'next');
		var endYear = startYear + segmL; 
		var initialLeft = this.Options.width + 'px'; 

		$('.oldEvent').animate({left: -1, opacity: 0}, 1000, function() {
			$('.oldEvent').remove();
		});
		
		while (Event.getDate().getFullYear() <= endYear) {
			EventId = Event.getId();
			EventType = Event.getType();
			lastElement = d.createElement('div');
			lastElement.setAttribute('id', EventId);
			if (!this.Control.isFilter(EventType))
				classString = EventType + ' event hidden';
			else
				classString = EventType + ' event'; 
			lastElement.setAttribute('class', classString);
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

		return docFrag;

		// line.appendChild(docFrag);

	};

	this.prevSegment = function(Event) {
		var docFrag = d.createDocumentFragment();
		var eventElementString, EventId, EventType, firstElement, classString;
		var segmL = this.Options.segmentLength;
		var startYear = getDecade(Event.getDate().getFullYear(), 'prev');
		var endYear = startYear - segmL;
		var initialLeft = this.Options.width; 

		$('.oldEvent').animate({left: initialLeft, opacity: 0}, 1000, function() {
			$('.oldEvent').remove();
		});

		while (Event.getDate().getFullYear() >= endYear) {
			EventId = Event.getId();
			EventType = Event.getType(); 
			firstElement = d.createElement('div'); 
			firstElement.setAttribute('id', EventId);
			if (!this.Control.isFilter(EventType))
				classString = EventType + ' event hidden';
			else
				classString = EventType + ' event'; 
			firstElement.setAttribute('class', classString);
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

		return docFrag;
		// line.appendChild(docFrag);	 

	};

	this.drawSearchResults = function(array) {
		var resultViewElement;
		var resultList, resultElement, resultTxt, Event;
		var docFrag = d.createDocumentFragment(); 

		checkEventView();
		resultViewElement = d.createElement('div');
		resultList = d.createElement('ul'); 
		resultViewElement.setAttribute('id', 'event-view');
		resultViewElement.setAttribute('class', 'seach-view');
		resultList.setAttribute('id', 'result-list'); 
		if (array.length > 0) {
			for (var i = 0; i < array.length; i++) {
				Event = this.Timeline.getId(array[i]);
				resultElement = d.createElement('li');
				resultTxt = d.createTextNode(Event.getText()); 
				resultElement.setAttribute('class', Event.getType());
				resultElement.appendChild(resultTxt);
				resultElement.addEventListener('click', function() {
					drawEventView(Event.getId()); 
				});
				resultList.appendChild(resultElement);
			}
		} else {
			resultElement = d.createElement('li');
			resultTxt = d.createTextNode('No events where found within this timeline.'); 
			resultElement.setAttribute('class', 'error-txt');
			resultElement.appendChild(resultTxt); 
			resultList.appendChild(resultElement);
		}
		hideDeathText();
		this.Control.removeNextEventButton();
		this.Control.removePrevEventButton();
		resultViewElement.appendChild(resultList); 
		docFrag.appendChild(resultViewElement);
		d.getElementById('event-viewer').appendChild(docFrag);
		// that.Control.hideFilter();
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

	function drawEventView(id) {
		var eventView;
		var eventViewString = '<div id="event-view"></div>';
		var Event = that.Timeline.getId(id);
		var eventElement = d.getElementById(id.toString()); 

		checkEventView();

		eventView = $(eventViewString).appendTo('#event-viewer'); 
		eventView.append(''+
			'<div id="img" style="background-color: grey;"></div>' + 
			'<div class="event-text">' + 
			'<h3>' + Event.printDate() + 
			' - ' + Event.getType() +  '</h3>' +
			'<p>' + Event.getText() +  '</p>' + 
			// '<div class="fb-share-button"' + 
			// 'data-href="http://www.ccsf.edu/Departments/HIV_AIDS_Timeline/"' + 
			// shareUrl(id) + 
			// ' data-layout="box_count" data-mobile-iframe="false">
			'</div>');
		that.Control.drawCloseButton(); 
		that.Control.drawNextEventButton();
		that.Control.drawPrevEventButton();
		// that.Control.hideFilter();
		hideDeathText(); 
		checkEventControl(id);
		highlightEvent(id);

		if (eventElement == null) {
			console.log(eventElement);
			console.log(id); 
			adjustTimelinePosition(id);
		}

	}

	function adjustTimelinePosition(id, docFrag) {
		var first, last, Event, docFrag;
		var firstElement, lastElement, firstEvent, lastEvent;

		if (docFrag == undefined) {
			docFrag = d.createDocumentFragment();
			eventArr = d.getElementsByClassName('event');
			for (var i = 0; i < eventArr.length; i++) {
			    docFrag.appendChild(eventArr[i]);
			}
		}
			
		console.log(docFrag); 
		firstElement = docFrag.childNodes[0];
		lastElement = docFrag.childNodes[docFrag.childNodes.length-1]; 
		first = firstElement['id'];
		last = lastElement['id'];
		firstEvent = that.Timeline.getId(first);
		lastEvent = that.Timeline.getId(last); 

		if (id < first) {
			docFrag = that.prevSegment(firstEvent);
			adjustTimelinePosition(docFrag);
		} else if (id > last) {
			console.log('made it here'); 
			
			docFrag = that.nextSegment(lastEvent);
			adjustTimelinePosition(last, docFrag);
		} else if (id <= last && id >= first) {
			console.log(docFrag); 
			return docFrag
		}

	}

	function checkEventControl(id) {
		var firstInt = $('.event').first().attr('id');
		var lastInt = $('.event').last().attr('id'); 
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

	function shareUrl(id) {
		if (document.location.href.indexOf)
		var url = document.location.href + '?event=' + id;
		return url;
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

	function addMobileElement(Element) {
		var newElementString = '<div class="mobile-event"></div>';
		Element.innerHTML += newElementString;
	}

	function checkEventView() {
		var eventView = $('#event-view');
		if ( eventView.length == 1)
			eventView.remove();
	}

	function highlightEvent(id) {
		var Element = $('#'+id);
		var oldElement = $('.event.highlighted').removeClass('highlighted');
		oldElement.animate({top: -17}, 500);
		if (window.innerWidth > 1000)
			Element.addClass('highlighted');
		Element.animate({top: -40}, 400);
	}

	function deathText(year) {
		if (Deaths[year] != null) {
			newDeath = '<div style="height: 0px; top: 0" class="death-text">';
			newDeath += '<p>' + Deaths[year] + '</p></div>';
			return newDeath;
		} else return false; 
	}

	function clearSegment(oldEvents) {
		while (oldEvents.length > 0) {
			oldEvents[oldEvents.length-1].classList.add('oldEvent');
			oldEvents[oldEvents.length-1].classList.remove('event');
		}
		removeEventView();
	}

	function animateEvents() {
		var id;
		$('.event').each(function() {
			id = $(this).attr('id');
			Event = that.Timeline.getId(id); 
			$(this).animate({left: findPosition(Event), opacity: 1}, 1000);  
		});
	}

	function removeEventView() {
		eventView = $('#event-view').remove(); 
		showDeathText();
	}

	function hideDeathText() {
		$('.death-text').hide(500);
	}

	function showDeathText() {
		$('.death-text').show(500);
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
		this.width = d.getElementById('timeline-container').offsetWidth; 
		this.height = '100px';
		this.eventViewWidth = this.width;
		this.eventViewHeight = '400px';
		this.segmentLength = 9;
		this.firstRulePos = parseInt(this.width) / this.segmentLength;
		this.masterContainer = 'hiv-timeline-container';
		this.timelineHeading = 'timeline-heading'; 
		this.container = 'timeline-container';
		this.timelineContiner = 'timeline';
		this.eventViewContainer = 'event-viewer-container';

	}

	function Control(display) {
		this.filterContainer = 'filter-container';
		this.filterButton = 'filter-button'; 
		this.closeEventView = '#close-button';
		this.nextEvent = '#next-event';
		this.prevEvent = '#prev-event'; 
		this.nextButton = '#next-button';
		this.prevButton = '#prev-button';

		// this.drawFilterButton = function() {
		// 	var container = d.getElementById(that.Options.masterContainer); 
		// 	var heading = d.getElementById(that.Options.timelineHeading);
		// 	var newElement = d.createElement('div');
		// 	newElement.setAttribute('id', this.filterButton); 
		// 	newElement.addEventListener("click", function(e) {
		// 		that.Control.toggleFilter(); 
		// 	});
		// 	container.insertBefore(newElement, heading);
		// }

		this.filter = function() {
			var f, i, s, u, l, la, txt, checkbox;
			var docFrag = d.createDocumentFragment(); 
			var attrArr = ['political', 'celebrity', 'health', 'social', 'international'];
			var submitStyles = "position: absolute; left: -9999px; width: 1px; height: 1px;";

			f = d.createElement('form');
			f.setAttribute('name', 'search-form')
			f.addEventListener('submit', function(e) {
				var form = e.target;
				var string = form.elements['search'].value;
				e.preventDefault();
				that.drawSearchResults(searchEvents(string)); 
			});

			i = d.createElement('input');
			i.setAttribute('type', 'text');
			i.setAttribute('name', 'search');
			f.appendChild(i);

			s = d.createElement("input"); //input element, Submit button
			s.setAttribute('type',"submit");
			s.setAttribute('value',"Submit");
       		s.setAttribute('style', submitStyles);
       		s.setAttribute('tabindex', '-1');
			f.appendChild(s);
			
			u = d.createElement('ul');
			attrArr.forEach(function(e) {
				checkbox = d.createElement("input"); //input element, text
				checkbox.setAttribute('id', 'filter-' + e); 
				checkbox.setAttribute('name', 'filter-' + e);
				checkbox.setAttribute('type', "checkbox");
				checkbox.setAttribute('checked', true); 
				checkbox.setAttribute('value', e);
				l = d.createElement('li');
				la = d.createElement('label'); 
				txt = d.createTextNode(e);
				la.setAttribute('for', 'filter-' + e);
				la.addEventListener('click', function(e) {
					var element = e.target;
					that.Control.toggleFilter(element.outerText); 
				});
				la.appendChild(txt); 
				l.appendChild(checkbox);
				l.appendChild(la); 
				u.appendChild(l);
			})
			f.appendChild(u);

			docFrag.appendChild(f);
			return docFrag;
		};

		this.drawNextEventButton = function() {
			var eventView = '#event-view';
			var newElement = '<div id="next-event"></div>';
			var styles = {
				position: 'absolute',
				width: '17px',
				height: '30px',
				top: '40%',
				right: '1%',
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
				left: '1%',
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
				width: '18px',
				height: '18px',
				top: '20px',
				right: '20px',
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

		this.toggleFilter = function(typeToFilter) {
			var string = typeToFilter.toLowerCase()
			string = '.'+string; 
			$(string).toggleClass('hidden');
		}

		this.isFilter = function(typeOfEvent) {
			var string = 'filter-' + typeOfEvent;
			var condition = d.forms['search-form'].elements[string].checked;
			if(condition) return true; else return false; 
		}

		function searchEvents(string) {
			return that.Timeline.searchText(string); 
		}

	}

}

