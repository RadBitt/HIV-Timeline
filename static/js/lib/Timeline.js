// Timeline Class

function Timeline() {

    EventArray.call(this); 

	this.sortEvents = function(items, left, right) {

        var index;

        if (items.length > 1) {
            index = partition(items, left, right);
            if (left < index - 1)
                this.sortEvents(items, left, index - 1);
            if (index < right)
                this.sortEvents(items, index, right);
        }

        return items;

        function swap(items, firstIndex, secondIndex){
            var temp = items[firstIndex];
            items[firstIndex] = items[secondIndex];
            items[secondIndex] = temp;
        }

        function partition(items, left, right) {

            var pivot   = items[Math.floor((right + left) / 2)].getDate(),
                i       = left,
                j       = right;

                console.log('======new pivot=========');

            while (i <= j) {
                while (items[i].getDate() < pivot) {
                    console.log(items[i].getDate() + ' > ' + pivot);
                    console.log(items[i].getDate() > pivot);
                    i++;
                }
                    
                while (items[j].getDate() > pivot) {
                    console.log(items[j].getDate() + ' > ' + pivot);
                    console.log(items[j].getDate() > pivot);
                    j--;
                }
                    
                if (i <= j) {
                    swap(items, i, j);
                    i++;
                    j--;
                }
            }

            return i;
        }
    }

    this.resetIds = function() {
        var first = this.firstEventInt;
        var last = this.numOfEvents();
        var Event = this.firstEvent(); 
        console.log(first);
        console.log(last);
        for(var i = first; i <= last; i++) {
            Event.setId(i);
            Event = this.nextEvent(); 
        }
        console.log(Event); 
    }

}

Timeline.prototype = Object.create(EventArray.prototype);
Timeline.prototype.constructor = Timeline; 