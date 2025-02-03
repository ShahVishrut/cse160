class Cylinder {
    constructor() {
        this.matrix = new Matrix4();
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.vertices = null;
    }

    // drawCylinder() {
    //     var rgba = this.color;
    //     gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    //     gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //     var increment = 1;
    //     for (var angle = 0; angle < 360; angle += increment) {
    //         drawTriangle3D([0,0,0, Math.cos(angle*2*Math.PI/360),Math.sin(angle*2*Math.PI/360),0, Math.cos(angle*2*Math.PI/360),Math.sin(angle*2*Math.PI/360),1]);
    //         drawTriangle3D([0,0,0, Math.cos(angle*2*Math.PI/360),Math.sin(angle*2*Math.PI/360),1, 0,0,1]);
    //     }
    // }

    drawCylinderHelper() {
        
        var increment = 1;
        var v = [];
        for (var angle = 0; angle < 360; angle += increment) {
            v.push(0,0,0, Math.cos(angle*2*Math.PI/360),Math.sin(angle*2*Math.PI/360),0, Math.cos(angle*2*Math.PI/360),Math.sin(angle*2*Math.PI/360),1);
            v.push(0,0,0, Math.cos(angle*2*Math.PI/360),Math.sin(angle*2*Math.PI/360),1, 0,0,1);
        }
        this.vertices = v;
    }

    drawCylinder() {

        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        // Create a buffer object
        if (!vertexBuffer) {
          console.log('Failed to create the buffer object');
          return -1;
        }

        if (this.vertices === null) {
            this.drawCylinderHelper();
        }
      
        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object


        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
          console.log('Failed to get the storage location of a_Position');
          return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
      
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
      
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
      }
}

