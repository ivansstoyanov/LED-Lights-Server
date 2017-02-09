module.exports = {
    initialData: {},
    SetLedColor: null,
    transHandler: null,

    allClearHandlers: [],
    repeaterDepthCount: -1,

    setup: function (data, SetLedColor) {
        this.initialData = data;
        this.SetLedColor = SetLedColor;
    },

    start: function () {
        // console.log('new color' + this.initialData[0].colorSet.r + " " + this.initialData[0].colorSet.g + " " + this.initialData[0].colorSet.b);
        // console.log('new color' + this.initialData[1].colorSet.r + " " + this.initialData[1].colorSet.g + " " + this.initialData[1].colorSet.b);
        // console.log('new color' + this.initialData[2].colorSet.r + " " + this.initialData[2].colorSet.g + " " + this.initialData[2].colorSet.b);
        var counterTarget = 3;
        var startData = JSON.parse(JSON.stringify(this.initialData));

        this.repeaterDepthCount++;
        this.allClearHandlers.push(this.startTransition(startData, 0, 0, counterTarget));
    },
    
    startTransition: function (data, index, counter, counterTarget) {
        data = JSON.parse(JSON.stringify(data));
        // console.log("all calls length" + this.allClearHandlers.length);
        // console.log("repeat depth" + this.repeaterDepthCount);

        if (this.allClearHandlers[this.repeaterDepthCount - 1]) {
            clearInterval(this.allClearHandlers[this.repeaterDepthCount - 1]);
            this.allClearHandlers.pop();
            this.repeaterDepthCount--;
        }

        if (counter >= counterTarget) {
            console.log('end of story');
            // console.log("all calls length" + this.allClearHandlers.length);
            // console.log("repeat depth" + this.repeaterDepthCount);
            return;
            
            //zanulate clearhandlers and counters?
            //continue with next saved transition
        }
        
        var currentObject = JSON.parse(JSON.stringify(data[index]));

        var targetObject= null;
        if ((index + 1) >= data.length) {
            targetObject = JSON.parse(JSON.stringify(data[0]));
            counter++;
        } else {
            targetObject = JSON.parse(JSON.stringify(data[index + 1]));
        }

        console.log('target color ' + targetObject.colorSet.r + " " + targetObject.colorSet.g + " " + targetObject.colorSet.b);

        var fps = 30;
        var duration = currentObject.speed;
        var refreshRate = currentObject.refresh;
        
        var currentColor = JSON.parse(JSON.stringify(currentObject.colorSet));
        var targetColor = JSON.parse(JSON.stringify(targetObject.colorSet));
        var distance	= this.calculateDistance(currentColor, targetColor);
        var increment	= this.calculateIncrement(distance, fps, duration);
        
        var that = this;
        return setInterval(function() {
            that.transition(data, index, counter, counterTarget, currentColor, targetColor, increment);
        }, refreshRate/fps);
    },

    transition: function (data, index, counter, counterTarget, currentColor, targetColor, increment) {
        // checking R
        if (currentColor.r > targetColor.r) {
            currentColor.r -= increment[0];
            if (currentColor.r <= targetColor.r) {
                increment[0] = 0;
            }
        } else {
            currentColor.r += increment[0];
            if (currentColor.r >= targetColor.r) {
                increment[0] = 0;
            }
        }

        // checking G
        if (currentColor.g > targetColor.g) {
            currentColor.g -= increment[1];
            if (currentColor.g <= targetColor.g) {
                increment[1] = 0;
            }
        } else {
            currentColor.g += increment[1];
            if (currentColor.g >= targetColor.g) {
                increment[1] = 0;
            }
        }

        // checking B
        if (currentColor.b > targetColor.b) {
            currentColor.b -= increment[2];
            if (currentColor.b <= targetColor.b) {
                increment[2] = 0;
            }
        } else {
            currentColor.b += increment[2];
            if (currentColor.b >= targetColor.b) {
                increment[2] = 0;
            }
        }

        this.SetLedColor(JSON.parse(JSON.stringify(currentColor)));
        //console.log('new color' + currentColor.r + " " + currentColor.g + " " + currentColor.b);

        // transition ended. start a new one
        if (increment[0] == 0 && increment[1] == 0 && increment[2] == 0) {
            index++;
            if(index >= data.length) {
                index = 0;
            }
            this.repeaterDepthCount++;
            this.allClearHandlers.push(this.startTransition(data, index, counter, counterTarget));
        }
    },

    calculateDistance: function (colorArray1, colorArray2) {
        var distance = [];

        distance.push(Math.abs(colorArray1.r - colorArray2.r));
        distance.push(Math.abs(colorArray1.g - colorArray2.g));
        distance.push(Math.abs(colorArray1.b - colorArray2.b));

        return distance;
    },

    // Calculates the increment values for R, G, and B using distance, fps, and duration.
    // This calculation can be made in many different ways.
    calculateIncrement: function (distanceArray, fps, duration) {
        var fps			= fps || 30;
        var duration	= duration || 1;
        var increment	= [];

        for (var i = 0; i < distanceArray.length; i++) {
            var incr = Math.abs(Math.floor(distanceArray[i] / (fps * duration)));
            if (incr == 0) {
                incr = 1;
            }

            increment.push(incr);
        }

        return increment;
    }
};