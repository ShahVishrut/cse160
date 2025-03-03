class Aggregate {
    static allData = [];
    static buffer = null;

    static renderAll() {
        if (Aggregate.buffer === null) {
            Aggregate.buffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, Aggregate.buffer);

        let converted = new Float32Array(Aggregate.allData);
        let FSIZE = converted.BYTES_PER_ELEMENT;

        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 46, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, FSIZE * 46, FSIZE * 3);
        gl.enableVertexAttribArray(a_UV);

        gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, FSIZE * 46, FSIZE * 5);
        gl.enableVertexAttribArray(a_Normal);

        gl.vertexAttribPointer(a_BaseColor, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 8);
        gl.enableVertexAttribArray(a_BaseColor);

        gl.vertexAttribPointer(a_ModelMatrix0, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 12);
        gl.enableVertexAttribArray(a_ModelMatrix0);

        gl.vertexAttribPointer(a_ModelMatrix1, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 16);
        gl.enableVertexAttribArray(a_ModelMatrix1);

        gl.vertexAttribPointer(a_ModelMatrix2, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 20);
        gl.enableVertexAttribArray(a_ModelMatrix2);

        gl.vertexAttribPointer(a_ModelMatrix3, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 24);
        gl.enableVertexAttribArray(a_ModelMatrix3);

        gl.vertexAttribPointer(a_NormalMatrix0, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 28);
        gl.enableVertexAttribArray(a_NormalMatrix0);

        gl.vertexAttribPointer(a_NormalMatrix1, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 32);
        gl.enableVertexAttribArray(a_NormalMatrix1);

        gl.vertexAttribPointer(a_NormalMatrix2, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 36);
        gl.enableVertexAttribArray(a_NormalMatrix2);

        gl.vertexAttribPointer(a_NormalMatrix3, 4, gl.FLOAT, false, FSIZE * 46, FSIZE * 40);
        gl.enableVertexAttribArray(a_NormalMatrix3);

        gl.vertexAttribPointer(a_TexColorWeight0, 1, gl.FLOAT, false, FSIZE * 46, FSIZE * 44);
        gl.enableVertexAttribArray(a_TexColorWeight0);

        gl.vertexAttribPointer(a_TexColorWeight1, 1, gl.FLOAT, false, FSIZE * 46, FSIZE * 45);
        gl.enableVertexAttribArray(a_TexColorWeight1);

        gl.bufferData(gl.ARRAY_BUFFER, converted, gl.DYNAMIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, converted.length / 46);

        Aggregate.allData = [];
    }
}