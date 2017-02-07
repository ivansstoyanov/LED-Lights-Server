App.factory('ColorManager', function () {

    return {
        hexToRgb(hex) {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        getRandomColor() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.round(Math.random() * 15)];
            }

            return color;
        },
        invertHex (hexnum) {
            if(hexnum.length != 6) {
                hexnum = hexnum.substring(1,7);
            }

            hexnum = hexnum.toUpperCase();
            var splitnum = hexnum.split("");
            var resultnum = "";
            var simplenum = "FEDCBA9876".split("");
            var complexnum = new Array();
            complexnum.A = "5";
            complexnum.B = "4";
            complexnum.C = "3";
            complexnum.D = "2";
            complexnum.E = "1";
            complexnum.F = "0";

            for(i=0; i<6; i++){
                if(!isNaN(splitnum[i])) {
                resultnum += simplenum[splitnum[i]]; 
                } else if(complexnum[splitnum[i]]){
                resultnum += complexnum[splitnum[i]]; 
                } else {
                console.error("Hex colors must only include hex numbers 0-9, and A-F");
                return false;
                }
            }

            return resultnum;
        }

    };
});