module.exports = {
    initialData: {},
    SetLedColor: null,
    transHandler: null,

    setup: function (data, SetLedColor) {
        this.initialData = data;
        this.SetLedColor = SetLedColor;
    },

    start: function () {
        // console.log('new color' + this.initialData[0].colorSet.r + " " + this.initialData[0].colorSet.g + " " + this.initialData[0].colorSet.b);
        // console.log('new color' + this.initialData[1].colorSet.r + " " + this.initialData[1].colorSet.g + " " + this.initialData[1].colorSet.b);
        // console.log('new color' + this.initialData[2].colorSet.r + " " + this.initialData[2].colorSet.g + " " + this.initialData[2].colorSet.b);
        var startData = JSON.parse(JSON.stringify(this.initialData));
        this.startTransition(startData, 0);
    },
    
    startTransition: function (data, index) {
        if (this.transHandler) {
            clearInterval(this.transHandler);
        }

        //type, repeatValue, count
        
        var currentObject = JSON.parse(JSON.stringify(data[index]));

        var targetObject= null;
        if ((index + 1) >= data.length) {
            targetObject = JSON.parse(JSON.stringify(data[0]));
        } else {
            targetObject = JSON.parse(JSON.stringify(data[index + 1]));
        }

        console.log('target color ' + targetObject.colorSet.r + " " + targetObject.colorSet.g + " " + targetObject.colorSet.b);

        var fps = 30;
        var duration = targetObject.speed;
        var refreshRate = targetObject.refresh;
        
        var currentColor = JSON.parse(JSON.stringify(currentObject.colorSet));
        var targetColor = JSON.parse(JSON.stringify(targetObject.colorSet));
        var distance	= this.calculateDistance(currentColor, targetColor);
        var increment	= this.calculateIncrement(distance, fps, duration);

        //this.SetLedColor(JSON.parse(JSON.stringify(currentObject.colorSet)));

        var that = this;
        this.transHandler = setInterval(function() {
            that.transition(data, index, currentColor, targetColor, increment);
        }, refreshRate/fps);
    },

    transition: function (data, index, currentColor, targetColor, increment) {
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

        //this.SetLedColor(JSON.parse(JSON.stringify(currentColor)));
        //console.log('new color' + currentColor.r + " " + currentColor.g + " " + currentColor.b);

        // transition ended. start a new one
        if (increment[0] == 0 && increment[1] == 0 && increment[2] == 0) {
            index++;
            if(index >= data.length) {
                index = 0;
            }
            this.startTransition(data, index);
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