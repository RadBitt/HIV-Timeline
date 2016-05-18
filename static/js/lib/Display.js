
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
		var h3 = d.createElement('h3');
		var container = d.getElementById(this.filterContainer); 
		h3.appendChild(d.createTextNode('filter events'));
		container.appendChild(h3);
		container.appendChild(this.Control.filter());
		// this.Control.drawFilterButton();
	}

	this.drawEventViewer = function() {
		var eventViewer = d.createElement('div');
		eventViewer.setAttribute('id', 'event-viewer'); 
		eventViewer.appendChild(that.Control.drawEventShare());
	    d.getElementById(this.eventViewContainer).appendChild(eventViewer);
		this.Control.drawNextButton();
		this.Control.drawPrevButton();  
	};

	this.drawSegment = function() {
		var lineRule, divsArr, unit, div, hr, para, txt, uList;
		var segmL = this.Options.segmentLength;
		var line = d.getElementById(this.timelineContiner); 
		var leftValue = 0;
		var yoLine = d.createElement('div');
		uList = d.createElement('ul'); 
		hr = d.createElement('hr');
		hr.setAttribute('id', 'x-line'); 
		yoLine.setAttribute('id', 'y-line');
		line.appendChild(yoLine);
		line.appendChild(hr);
		para = d.createElement('li'); 
		para.setAttribute('class', 'red-txt');
		txt = d.createTextNode('death rate');
		para.appendChild(txt);
		uList.appendChild(para);


		for (var i = 5000; i < 48000; i = i + 5000) {
			para = d.createElement('li'); 
			para.setAttribute('class', 'red-txt');
			txt = d.createTextNode(i / 1000 + 'k');
			para.appendChild(txt);
			uList.insertBefore(para, uList.childNodes[1]);  
		}

		yoLine.appendChild(uList);

		for (var i = 0; i < segmL; i++) {
			div = d.createElement('div');
			div.setAttribute('class', 'vertical-line');
			line.appendChild(div);
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

	this.drawEvents = function(direction, docFrag) {
		var oldEvents, EventId, docFrag;
		var line = d.getElementById(this.timelineContiner);
		oldEvents = d.getElementsByClassName('event');

		if (direction == undefined && docFrag == undefined)
			docFrag = this.nextSegment(this.Timeline.firstEvent());
		else if (direction == null && docFrag != undefined) {
			clearSegment(oldEvents);
			removeAnimation(null);
		} else if (direction == 'next') {
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
		addMobileText(); 
		addEventUiTitles(); 

		$('.event').click(function() {
			drawEventView(this.id); 
		});

		if (window.location.href.indexOf("?") > -1) {
			if (this.Control.hrefBreaker) {
				var id = document.location.search.split('=')[1];
				id = parseInt(id); 
				drawEventView(id);
				this.Control.hrefBreaker = false;
			}
		}

		if (window.innerWidth < 1200) {
			$("html, body").animate({ scrollTop: 0 }, 600);
		}

		checkSegmentControl();

	};

	this.nextEvent = function() {
		this.Timeline.nextEvent();
		var id = this.Timeline.getInt();
		var Event = $('#'+id);
		if (Event.length == 0) {
			this.Control.preventEventView = false;
			drawEventView(id);  
		} else if (Event.hasClass('hidden')) { 
			this.nextEvent();
		} else if (!Event.hasClass('hidden')) {
			checkEventView();
			drawEventView(id);
			checkEventControl(id);
		} 
	};

	this.prevEvent = function() {
		this.Timeline.prevEvent();
		var id = this.Timeline.getInt();
		var Event = $('#'+id);
		if (Event.length == 0) {
			this.Control.preventEventView = false;
			drawEventView(id); 
		} else if (Event.hasClass('hidden')) { 
			this.prevEvent();
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

		if (d.getElementsByClassName('oldEvent').length > 0) {
			removeAnimation('next');
		}
			
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
			if (this.Timeline.isLast())
				break;

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

		if (d.getElementsByClassName('oldEvent').length > 0) { 
			removeAnimation('prev');
		}

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

			if (this.Timeline.isFirst())
				break;

			Event = this.Timeline.prevEvent();
		
		}

		return docFrag;
		// line.appendChild(docFrag);	 

	};

	this.drawSearchResults = function(array) {
		var eventCard, resultViewElement, i;
		var resultList, resultElement, resultTxt, Event;
		var docFrag = d.createDocumentFragment(); 

		checkEventView();
		eventCard = d.createElement('div');
		resultViewElement = d.createElement('div');
		resultList = d.createElement('ul');
		eventCard.setAttribute('id', 'event-card');
		resultViewElement.setAttribute('id', 'event-view');
		resultViewElement.setAttribute('class', 'seach-view');
		resultList.setAttribute('id', 'result-list'); 
		if (array.length > 0) {
			resultTxt = d.createTextNode('Click a search result to view it\'s event card');
			resultViewElement.appendChild(resultTxt); 
			for (var i = 0; i < array.length; i++) {
				Event = this.Timeline.getId(array[i]);
				resultElement = d.createElement('li');
				resultTxt = d.createTextNode(Event.getText()); 
				resultElement.setAttribute('class', Event.getType());
				resultElement.setAttribute('data-id', Event.getId()); 
				resultElement.appendChild(resultTxt);
				resultElement.addEventListener('click', function(e) {
					var element = e.target;
					that.Control.preventEventView = false;
					drawEventView(element.dataset['id']);
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
		this.Control.removeNextEventButton();
		this.Control.removePrevEventButton();
		resultViewElement.appendChild(resultList);
		eventCard.appendChild(resultViewElement); 
		docFrag.appendChild(eventCard);
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
		var imgDiv, h3, p, eventText; 
		var docFrag = d.createDocumentFragment(); 
		var Event = that.Timeline.getId(id);
		var eventView = d.createElement('div')
		var anotherContainer = d.createElement('div');
		var imgElement = d.createElement('img');
		var eventViewer = d.getElementById('event-viewer'); 
		var eventElement = d.getElementById(id.toString());
		var imgURL = Event.getPhoto(id);
		var imageStyle = 'background-image: url(' + imgURL + ');';

		if (imgURL.length == 0) {
			imgURL = 'static/img/icons/logo.png';
			imageStyle = 'background-image: url(' + imgURL + ');background-size: inherit;';
			imageStyle += ' background-position: 50%; border: 1px solid #EDEDED'; 
		}
			
		checkEventView();

		anotherContainer.setAttribute('id', 'event-card')
		eventView.setAttribute('id', 'event-view'); 
		imgDiv = d.createElement('div');
		h3 = d.createElement('h3');
		p = d.createElement('p');
		eventText = d.createElement('div');
		eventText.setAttribute('class', 'event-text'); 
		imgElement.setAttribute('src', imgURL);
		imgElement.setAttribute('style', 'display: none;');
		imgElement.setAttribute('alt', 'An image related to the event.');
		imgDiv.setAttribute('id', 'event-card-img');
		imgDiv.setAttribute('style', imageStyle);
		imgDiv.appendChild(imgElement);
		h3.appendChild(d.createTextNode(Event.printDate() + ' - ' + Event.getType()));
		p.appendChild(d.createTextNode(Event.getText()));
		eventText.appendChild(h3);
		eventText.appendChild(p);
		eventView.appendChild(imgDiv);
		eventView.appendChild(eventText);
		anotherContainer.appendChild(eventView);
		docFrag.appendChild(anotherContainer);
		eventViewer.appendChild(docFrag);
		that.Control.drawCloseButton(); 
		that.Control.drawNextEventButton();
		that.Control.drawPrevEventButton();
		checkEventControl(id);

		if (eventElement == null) {
			console.log(eventElement);
			console.log(id); 
			adjustTimelinePosition(id);
			this.Timeline.getId(id); 
		}

		hideDeathText(); 
		updateSelectedEvent(id); 
	}

	function adjustTimelinePosition(id, docFrag, count) {
		var first, last, Event, docFrag;
		var firstElement, lastElement, firstEvent, lastEvent;
		
		console.log(docFrag);

		if (docFrag == undefined) {
			docFrag = d.createDocumentFragment();
			eventArr = d.getElementsByClassName('event');
			for (var i = 0; i < eventArr.length; i++) {
			    docFrag.appendChild(eventArr[i]);
			}
		}
 
		firstElement = docFrag.childNodes[0];
		lastElement = docFrag.childNodes[docFrag.childNodes.length-1]; 
		first = parseInt(firstElement['id']);
		last = parseInt(lastElement['id']);
		console.log('F: ' + first + ' < (' + id + ') > L: ' + last); 
		if (id < first) {
			firstEvent = that.Timeline.skipTo(first-1);
			docFrag = that.prevSegment(firstEvent, 'search');
			adjustTimelinePosition(id, docFrag, count+1);
		} else if (id > last) {
			lastEvent = that.Timeline.skipTo(last+1);
			docFrag = that.nextSegment(lastEvent, 'search');
			adjustTimelinePosition(id, docFrag, count+1);
		} else if (id <= last && id >= first) {
			that.drawEvents(null, docFrag);
			return
		}

	}

	function checkEventControl() {
		var eventArr = d.getElementsByClassName('event');
		var currentInt = that.Timeline.currentEventInt;  

		if (currentInt <= that.Timeline.firstEventInt) {
			that.Control.removePrevEventButton();
		} else if (currentInt >= that.Timeline.numOfEvents()) {
			that.Control.removeNextEventButton(); 
		} else {
			if ($(that.Control.nextEvent).length == 0)
				that.Control.drawNextEventButton();
			if ($(that.Control.prevEvent).length == 0)
				that.Control.drawPrevEventButton();
		}
	}

	function checkSegmentControl() {
		var eventArr = d.getElementsByClassName('event');
		var firstInt = eventArr[0]['id'];
		var lastInt = eventArr[eventArr.length-1]['id'];

		if (firstInt <= that.Timeline.firstEventInt) { 
			console.log(firstInt + '<=' + that.Timeline.firstEventInt);
			that.Control.removePrevButton();
		} else if (lastInt >= that.Timeline.numOfEvents()) {
			that.Control.removeNextButton(); 
		} else {
			if ($(that.Control.nextButton).length == 0)
				that.Control.drawNextButton();
			if ($(that.Control.prevButton).length == 0)
				that.Control.drawPrevButton();
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
		var eventView = $('#event-card');
		if ( eventView.length == 1)
			eventView.remove();
	}

	function updateSelectedEvent(id) {
		var Element = $('#'+id);
		var oldElement = $('.event.highlighted').removeClass('highlighted');
		oldElement.animate({top: -17}, 500);
		if (window.innerWidth > 1000)
			Element.addClass('highlighted');
		Element.animate({top: -40}, 500, function() {
			that.Control.updateEventShare(id);
		});
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
		if (that.Control.preventEventView) {
			removeEventView();	
			that.Control.preventEventView = true; 
		}	
	}

	function animateEvents() {
		var id;
		$('.event').each(function() {
			id = $(this).attr('id');
			Event = that.Timeline.getId(id); 
			$(this).animate({left: findPosition(Event), opacity: 1}, 1000);  
		});
	}

	function removeAnimation(direction) {
		var initialLeft = that.Options.width; 
		if (direction == 'next') {
			$('.oldEvent').animate({left: -1, opacity: 0}, 1000, function() {
				$('.oldEvent').remove();
			});
		} else if (direction == 'prev') {
			$('.oldEvent').animate({left: initialLeft, opacity: 0}, 1000, function() {
				$('.oldEvent').remove();
			});
		} else if (direction == null) {
			$('.oldEvent').animate({ opacity: 0}, 500, function() {
				$('.oldEvent').remove();
			});
		}	
	}

	function removeEventView() {
		var oldElement = $('.event.highlighted').removeClass('highlighted');
		eventView = $('#event-card').remove();
		eventView = $('#event-view').remove(); 
		oldElement.animate({top: -17}, 500);
		showDeathText();
	}

	function hideDeathText() {
		$('.death-text').hide(500);
	}

	function showDeathText() {
		$('.death-text').show(500);
	}

	function addEventUiTitles() {
		var eventArr = d.getElementsByClassName('event');
		for(var i = 0; i < eventArr.length; i++) {
			eventArr[i].setAttribute('title', 'Click to read about this event.');
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
		this.hrefBreaker = true;
		this.preventEventView = true;
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
			i.setAttribute('placeholder', 'Search events');
			i.setAttribute('alt', 'search events'); 
			i.setAttribute('title', 'Search the timeline by keywords'); 
			f.appendChild(i);

			s = d.createElement("input"); //input element, Submit button
			s.setAttribute('type',"submit");
			s.setAttribute('value',"Submit");
       		s.setAttribute('style', submitStyles);
       		s.setAttribute('tabindex', '1');
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
				la.setAttribute('title', 'Hide these events');
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
				top: '50%',
				right: '-31px',
			};
			
			$(eventView).append(newElement);
			$(this.nextEvent).css(styles);
			$(this.nextEvent).click(function() {
				that.nextEvent(); 
			});
			d.getElementById('next-event').setAttribute('title', 'Next event');
		};

		this.drawPrevEventButton = function() {
			var eventView = '#event-view';
			var newElement = '<div id="prev-event"></div>';
			var styles = {
				position: 'absolute',
				width: '17px',
				height: '30px',
				top: '50%',
				left: '-31px',
			};
			
			$(eventView).append(newElement); 
			$(this.prevEvent).css(styles);
			$(this.prevEvent).click(function() {
				that.prevEvent(); 
			});
			d.getElementById('prev-event').setAttribute('title', 'Prev event');
		};

		this.drawCloseButton = function() {
			var eventView = '#event-view';
			var newElement = '<div id="close-button"></div>';
			var closeStyles = {
				position: 'absolute',
				width: '18px',
				height: '18px',
				top: '20px',
				right: '-31px',
			};
			
			$(eventView).append(newElement); 
			$(this.closeEventView).css(closeStyles);
			$(this.closeEventView).click(function() {
				removeEventView(); 
			});

		};
		
		this.drawNextButton = function() {
			var eventView = that.eventViewContainer
			var newElement = d.createElement('div');
			newElement.setAttribute('id', 'next-button');

			newElement.setAttribute('title', 'Next Decade');
			d.getElementById(eventView).appendChild(newElement); 
			$(this.nextButton).click(function() {
				that.drawEvents('next'); 
			});

		};

		this.drawPrevButton = function() {
			var eventView = that.eventViewContainer
			var newElement = d.createElement('div');
			newElement.setAttribute('id', 'prev-button');

			newElement.setAttribute('title', 'Previous Decade'); 
			d.getElementById(eventView).appendChild(newElement); 
			$(this.prevButton).click(function() {
				that.drawEvents('prev'); 
			});
		};

		this.drawEventShare = function() {
			var href = 'http://www.ccsf.edu/Departments/HIV_AIDS_Timeline/'; 
			var fDiv = d.createElement('div');
			fDiv.setAttribute('id', 'share-button');
			fDiv.setAttribute('class', 'fb-share-button');
			fDiv.setAttribute('data-href', href); 
			fDiv.setAttribute('data-layout', 'button_count');
			fDiv.setAttribute('data-mobile-iframe', 'false');
			return fDiv;
		}

		this.updateEventShare = function(id) {
			if (d.getElementById('share-button') != null) {
				var href = 'http://www.ccsf.edu/Departments/HIV_AIDS_Timeline/?event=';
				var fDiv = d.getElementById('share-button');
				fDiv.setAttribute('data-href', href + id); 
				FB.XFBML.parse(d.getElementById('event-viewer'));
			}
		}

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
			console.log(that.Timeline.currentEvent()); 
			console.log(string); 
			var condition = d.forms['search-form'].elements[string].checked;
			if(condition) return true; else return false; 
		}

		function searchEvents(string) {
			return that.Timeline.searchText(string); 
		}

	}

}

