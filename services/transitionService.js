TransitionService = {
    data: {},
    nextColorIndex: 0,
    transHandler: null,

    setup(data) {
        console.log("setup");
        this.data = data;
    },

    start() {
        //endless cycle        
        //for (var i = 0; i < 3; i++) {
            // console.log('color1 ' + this.data[0].colorSet.r + " " + this.data[0].colorSet.g + " " + this.data[0].colorSet.b);
            // console.log('color2 ' + this.data[1].colorSet.r + " " + this.data[1].colorSet.g + " " + this.data[1].colorSet.b);
            // console.log('color3 ' + this.data[2].colorSet.r + " " + this.data[2].colorSet.g + " " + this.data[2].colorSet.b);
            // console.log('color4 ' + this.data[3].colorSet.r + " " + this.data[3].colorSet.g + " " + this.data[3].colorSet.b);

            this.startTransition();
        //}
    },
    
    startTransition() {
        if (this.transHandler) {
            clearInterval(this.transHandler);
        }

        var fps = 30;
        var duration = 2;
        
        var currentObject = JSON.parse(JSON.stringify(this.data[this.nextColorIndex]));
        var currentColor = currentObject.colorSet;

        var targetObject= null;
        if ((this.nextColorIndex + 1) >= this.data.length) {
            targetObject = JSON.parse(JSON.stringify(this.data[0]));
        } else {
            targetObject = JSON.parse(JSON.stringify(this.data[this.nextColorIndex + 1]));
        }

        var targetColor	= targetObject.colorSet;
        //console.log('target color ' + targetColor.r + " " + targetColor.g + " " + targetColor.b);
        
        var distance	= this.calculateDistance(currentColor, targetColor);
        var increment	= this.calculateIncrement(distance, fps, duration);

        // graph.updateTargetLines();
        // graph.updateStats();

        var that = this;
        this.transHandler = setInterval(function() {
            that.transition(currentColor, targetColor, increment);
        }, 1000/fps);
    },

    transition(currentColor, targetColor, increment) {
        // checking R
        if (currentColor.r > targetColor.r) {
            currentColor.r -= increment[1];
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

        //console.log('new color' + currentColor.r + " " + currentColor.g + " " + currentColor.b);

        // applying the new modified color
        // transElement.style.backgroundColor = rgb2hex(currentColor);

        // graph.updateFills();
        // graph.updateCurrentColor();

        // transition ended. start a new one
        if (increment[0] == 0 && increment[1] == 0 && increment[2] == 0) {
            this.nextColorIndex++;
            if(this.nextColorIndex >= this.data.length) {
                this.nextColorIndex = 0;
            }
            this.startTransition();
        }
    },

    calculateDistance(colorArray1, colorArray2) {
        var distance = [];

        distance.push(Math.abs(colorArray1.r - colorArray2.r));
        distance.push(Math.abs(colorArray1.g - colorArray2.g));
        distance.push(Math.abs(colorArray1.b - colorArray2.b));

        return distance;
    },

    // Calculates the increment values for R, G, and B using distance, fps, and duration.
    // This calculation can be made in many different ways.
    calculateIncrement(distanceArray, fps, duration) {
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