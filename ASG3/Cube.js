class Cube {
    static allData = [];
    static buffer = null;
    static vertexList = [
        0,0,0, 0,0,
        1,1,0, 1,1,
        1,0,0, 1,0,
        0,0,0, 0,0,
        0,1,0, 0,1,
        1,1,0, 1,1,
        0,0,1, 0,0,
        1,0,1, 1,0,
        1,1,1, 1,1,
        1,1,1, 1,1,
        0,1,1, 0,1,
        0,0,1, 0,0,
        0,0,0, 0,0,
        0,1,0, 1,0,
        0,0,1, 0,1,
        0,1,0, 1,0,
        0,1,1, 1,1,
        0,0,1, 0,1,
        1,0,0, 0,0,
        1,1,0, 1,0,
        1,1,1, 1,1,
        1,1,1, 1,1,
        1,0,1, 0,1,
        1,0,0, 0,0,
        0,0,0, 0,0,
        1,0,0, 1,0,
        1,0,1, 1,1,
        1,0,1, 1,1,
        0,0,1, 0,1,
        0,0,0, 0,0,
        0,1,0, 0,0,
        1,1,0, 1,0,
        1,1,1, 1,1,
        1,1,1, 1,1,
        0,1,1, 0,1,
        0,1,0, 0,0
    ];

    static renderAll() {
        if (Cube.buffer === null) {
            Cube.buffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, Cube.buffer);

        let converted = new Float32Array(Cube.allData);
        let FSIZE = converted.BYTES_PER_ELEMENT;

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 27, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE * 27, FSIZE * 3);
        gl.enableVertexAttribArray(a_UV);

        gl.vertexAttribPointer(a_BaseColor, 4, gl.FLOAT, false, FSIZE * 27, FSIZE * 5);
        gl.enableVertexAttribArray(a_BaseColor);

        gl.vertexAttribPointer(a_ModelMatrix0, 4, gl.FLOAT, false, FSIZE * 27, FSIZE * 9);
        gl.enableVertexAttribArray(a_ModelMatrix0);

        gl.vertexAttribPointer(a_ModelMatrix1, 4, gl.FLOAT, false, FSIZE * 27, FSIZE * 13);
        gl.enableVertexAttribArray(a_ModelMatrix1);

        gl.vertexAttribPointer(a_ModelMatrix2, 4, gl.FLOAT, false, FSIZE * 27, FSIZE * 17);
        gl.enableVertexAttribArray(a_ModelMatrix2);

        gl.vertexAttribPointer(a_ModelMatrix3, 4, gl.FLOAT, false, FSIZE * 27, FSIZE * 21);
        gl.enableVertexAttribArray(a_ModelMatrix3);

        gl.vertexAttribPointer(a_TexColorWeight0, 1, gl.FLOAT, false, FSIZE * 27, FSIZE * 25);
        gl.enableVertexAttribArray(a_TexColorWeight0);

        gl.vertexAttribPointer(a_TexColorWeight1, 1, gl.FLOAT, false, FSIZE * 27, FSIZE * 26);
        gl.enableVertexAttribArray(a_TexColorWeight1);

        gl.bufferData(gl.ARRAY_BUFFER, converted, gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, converted.length / 27);

        Cube.allData = [];
    }

    constructor() {
        this.matrix = new Matrix4();
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.textureWeight0 = 0;
        this.textureWeight1 = 0;
    }

    prepareRender() {
        for (var x = 0; x < 36; x++) {
            for (var i = 0; i < 5; i++) {
                Cube.allData.push(Cube.vertexList[5*x + i]);
            }
            Cube.allData.push(this.color[0], this.color[1], this.color[2], this.color[3]);
            for (var i = 0; i < 16; i++) {
                Cube.allData.push(this.matrix.elements[i]);
            }
            Cube.allData.push(this.textureWeight0);
            Cube.allData.push(this.textureWeight1);
        }
    }
}


// class Cube {
//     constructor() {
//         this.matrix = new Matrix4();
//         this.color = [1.0, 1.0, 1.0, 1.0];

//         this.vertexBuffer = null;
//         this.uvBuffer = null;
//         this.vertices = null;
//         this.uv = null;
//         this.textureWeight0 = 0;
//     }

//     setVertices() {
//         var vertices = [];
//         var uv = [];
//         vertices.push(
//             0,0,0, 1,1,0, 1,0,0,
//             0,0,0, 0,1,0, 1,1,0,

//             0,0,1, 1,0,1, 1,1,1,
//             1,1,1, 0,1,1, 0,0,1,

//             0,0,0, 0,1,0, 0,0,1,
//             0,1,0, 0,1,1, 0,0,1,

//             1,0,0, 1,1,0, 1,1,1,
//             1,1,1, 1,0,1, 1,0,0,

//             0,0,0, 1,0,0, 1,0,1,
//             1,0,1, 0,0,1, 0,0,0,

//             0,1,0, 1,1,0, 1,1,1,
//             1,1,1, 0,1,1, 0,1,0);
//         uv.push(
//             0,0, 1,1, 1,0,
//             0,0, 0,1, 1,1,

//             0,0, 1,0, 1,1,
//             1,1, 0,1, 0,0,

//             0,0, 1,0, 0,1,
//             1,0, 1,1, 0,1,

//             0,0, 1,0, 1,1,
//             1,1, 0,1, 0,0,

//             0,0, 1,0, 1,1,
//             1,1, 0,1, 0,0,
            
//             0,0, 1,0, 1,1,
//             1,1, 0,1, 0,0);
//         this.vertices = new Float32Array(vertices);
//         this.uv = new Float32Array(uv);
//     }

//     render() {
//         if (this.vertexBuffer === null) {
//             this.vertexBuffer = gl.createBuffer();
//         }

//         if (this.uvBuffer === null) {
//             this.uvBuffer = gl.createBuffer();
//         }

//         if (this.vertices === null) {
//             this.setVertices();
//         }

//         gl.uniform4f(u_BaseColor, this.color[0], this.color[1], this.color[2], this.color[3]);

//         gl.uniform1f(u_TexColorWeight, this.textureWeight0);

//         gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

//         gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

//         gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

//         gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);        
      
//         gl.enableVertexAttribArray(a_Position);

//         gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

//         gl.bufferData(gl.ARRAY_BUFFER, this.uv, gl.DYNAMIC_DRAW);

//         gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);

//         gl.enableVertexAttribArray(a_UV);
      
//         gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
//     }
// }