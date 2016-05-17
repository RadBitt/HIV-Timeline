function EventArray() {

	this.eventsArray = [null];

	this.firstEventInt = 1; 

	this.currentEventInt = 0;

	this.getName = function() {
		return this.name; 
	}

	this.numOfEvents = function() {
		return this.eventsArray.length-1; 
	}

	this.addEvent = function(id, date, category, description, imgUrl) {
		var newEvent = new Event(id, date, category, description, imgUrl);
		this.eventsArray.push(newEvent);
		this.currentEventInt++; 
		return newEvent;  
	}

	this.firstEvent = function() {
		this.currentEventInt = this.firstEventInt;
		return this.eventsArray[this.currentEventInt]; 
	}

	this.lastEvent = function() {
        this.currentEventInt = this.eventsArray.length-1;
        return this.eventsArray[this.currentEventInt]; 
    }

	this.currentEvent = function() {
		return this.eventsArray[this.currentEventInt]; 
	}

	this.nextEvent = function() {
		this.currentEventInt = this.currentEventInt + 1;
		if (this.currentEventInt > this.numOfEvents())
			this.currentEventInt = this.firstEventInt; 
		return this.eventsArray[this.currentEventInt]; 
	}

	this.prevEvent = function() {
		this.currentEventInt = this.currentEventInt - 1;
		if (this.currentEventInt == 0)
			this.currentEventInt = this.numOfEvents(); 
		return this.eventsArray[this.currentEventInt]; 
	}

	this.isLast = function() {
		if (this.currentEventInt == this.numOfEvents())
			return true;
		else
			return false; 
	}

	this.isFirst = function() {
		if (this.currentEventInt == this.firstEventInt)
			return true;
		else 
			return false; 
	}

	this.getArray = function() {
		return this.eventsArray; 
	}

	this.getId = function(id) {
		id = parseInt(id);
		if (id == 0)
			return this.prevEvent();
		else if (id > this.numOfEvents())
			return this.nextEvent()
		else {
			this.currentEventInt = id; 
			return this.eventsArray[id]; 
		}
		
	}

	this.skipTo = function(id) {
		if (id > 0 && id < this.numOfEvents()) {
			this.currentEventInt = id;
			return this.eventsArray[this.currentEventInt]; 
		} else if (id <= 0) {
			return this.eventsArray[this.firstEventInt];
		} else if (id > this.numOfEvents()) {
			return this.eventsArray[this.numOfEvents()];
		}
		    
	}

	this.getInt = function() {
		return this.currentEventInt; 
	}
	
}