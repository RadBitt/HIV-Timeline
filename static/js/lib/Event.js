// Event Class

function Event(id, dateString, category, description, imgStringUrl) {

	this.category = category;

	this.id = id;

	this.date = new Date(dateString);

	this.eventText = description;

	this.imgURI = imgStringUrl;

	this.setId = function(newId) {
		this.id = newId; 
	}

	this.getId = function() {
		return this.id; 
	}

	this.getDate = function() {
		return this.date;
	}

	this.printDate = function() {
		var printDate; 
		var monthIndex; 
		var monthNames = [
		  "January", "February", "March",
		  "April", "May", "June", "July",
		  "August", "September", "October",
		  "November", "December"
		];

		monthIndex = this.date.getMonth();
		printDate = monthNames[monthIndex] + ' ' + this.date.getFullYear();
		return printDate; 
	}

	this.getType = function() {
		return this.category; 
	}

	this.getText = function() {
		return this.eventText;
	}

}