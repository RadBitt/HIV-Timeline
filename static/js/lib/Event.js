// Event Class

function Event(id, dateString, category, description, imgStringUrl, page) {

	this.category = category;

	this.id = id;

	this.date = new Date(dateString);

	this.eventText = description;

	this.photo = imgStringUrl;

	this.page = page;

	this.setId = function(newId) {
		this.id = newId; 
	}

	this.getId = function() {
		return this.id; 
	}

	this.getPage = function() {
		return this.page; 	
	}

	this.getDate = function() {
		return this.date;
	}

	this.getPhoto = function() {
		return this.photo;
	}
	
	this.getType = function() {
		return this.category; 
	}

	this.getText = function() {
		return this.eventText;
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

}
