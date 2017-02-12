module.exports = {
    initialData: {},
    SetLedColor: null,
    allClearHandlers: [],
    repeaterDepthCount: -1,

    setup: function (data, SetLedColor) {
        this.stop();
        this.initialData = data;
        this.SetLedColor = SetLedColor;
    },

    start: function (index) {        
        var effectIndex = index || 0;
        var allData = JSON.parse(JSON.stringify(this.initialData));
        var startData = allData[effectIndex];
        var counterTarget = startData.refresh || 10000;

        if (effectIndex >= this.initialData.length) {
            console.log('end of effect');
            return;
        }

        this.repeaterDepthCount++;
        this.allClearHandlers.push(this.startTransition(startData.data, 0, 0, counterTarget, effectIndex));
    },

    stop: function() {
        for (var i = 0; i < this.allClearHandlers.length; i++) {
            clearInterval(this.allClearHandlers[i]);
        }

        this.allClearHandlers = [];
        this.repeaterDepthCount = -1;
    },
    
    startTransition: function (data, index, counter, counterTarget, effectIndex) {
        data = JSON.parse(JSON.stringify(data));

        if (this.allClearHandlers[this.repeaterDepthCount - 1]) {
            clearInterval(this.allClearHandlers[this.repeaterDepthCount - 1]);
            this.allClearHandlers.pop();
            this.repeaterDepthCount--;
        }

        if (counter >= counterTarget) {
            console.log('end of story');
            this.stop();
            this.start(effectIndex+1);
            return;
        }
        
        var currentObject = JSON.parse(JSON.stringify(data[index]));

        var targetObject= null;
        if ((index + 1) >= data.length) {
            targetObject = JSON.parse(JSON.stringify(data[0]));
            counter++;
        } else {
            targetObject = JSON.parse(JSON.stringify(data[index + 1]));
        }

        //console.log('target color ' + targetObject.colorSet.r + " " + targetObject.colorSet.g + " " + targetObject.colorSet.b);

        var fps = 30;
        var duration = currentObject.speed;
        var refreshRate = currentObject.refresh;
        
        var currentColor = JSON.parse(JSON.stringify(currentObject.colorSet));
        var targetColor = JSON.parse(JSON.stringify(targetObject.colorSet));
        var distance	= this.calculateDistance(currentColor, targetColor);
        var increment	= this.calculateIncrement(distance, fps, duration);
        
        var that = this;
        return setInterval(function() {
            that.transition(data, index, counter, effectIndex, counterTarget, currentColor, targetColor, increment);
        }, refreshRate/fps);
    },

    transition: function (data, index, counter, effectIndex, counterTarget, currentColor, targetColor, increment) {
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

        // transition ended. start a new one
        if (increment[0] == 0 && increment[1] == 0 && increment[2] == 0) {
            index++;
            if(index >= data.length) {
                index = 0;
            }
            this.repeaterDepthCount++;
            this.allClearHandlers.push(this.startTransition(data, index, counter, counterTarget, effectIndex));
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