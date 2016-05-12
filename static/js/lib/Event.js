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

	this.getType = function() {
		return this.category; 
	}

	this.getText = function() {
		return this.eventText;
	}

}