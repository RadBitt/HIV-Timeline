var doc = document;

function getID(id) {

	var node = doc.getElementById(id); 

	return node; 

}

Element.prototype.remove = function() {

    this.parentElement.removeChild(this);

}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {

    for(var i = 0, len = this.length; i < len; i++) {

        if(this[i] && this[i].parentElement) {

            this[i].parentElement.removeChild(this[i]);

        }

    }

}

Element.prototype.removeChildren = function() {

	while (this.firstChild)

    	this.removeChild(this.firstChild);

}

//function attributeArray() {}

function addElement(element, id, attributes) { 

	var newElement = doc.createElement(element); 

	if (attributes.constructor === Array) {

		for (var i = 0; i < attributes.length; i++) {

			newElement.setAttribute(attributes[i][0], attributes[i][1]);

		}

	}

	doc.getElementById(id).appendChild(newElement);

	return newElement; 

}