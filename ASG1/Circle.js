class Circle {
    constructor() {
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
        this.segments = 10;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        var radius = size / 400;

        var increment = 360 / this.segments;
        for (var angle = 0; angle < 360; angle += increment) {
            drawTriangle([xy[0], xy[1], xy[0]+radius*Math.cos(angle*2*Math.PI/360), xy[1]+radius*Math.sin(angle*2*Math.PI/360), xy[0]+radius*Math.cos((angle+increment)*2*Math.PI/360), xy[1]+radius*Math.sin((angle+increment)*2*Math.PI/360)]);
        }
        
    }
}