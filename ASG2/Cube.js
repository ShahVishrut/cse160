function drawCube(matrix, color) {
    var rgba = color;

    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, matrix.elements);

    drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
    drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

    drawTriangle3D([0,0,1, 1,0,1, 1,1,1]);
    drawTriangle3D([1,1,1, 0,1,1, 0,0,1]);

    gl.uniform4f(u_FragColor, 0.8*rgba[0], 0.8*rgba[1], 0.8*rgba[2], rgba[3]);
    drawTriangle3D([0,0,0, 0,1,0, 0,0,1]);
    drawTriangle3D([0,1,0, 0,1,1, 0,0,1]);

    drawTriangle3D([1,0,0, 1,1,0, 1,1,1]);
    drawTriangle3D([1,1,1, 1,0,1, 1,0,0]);

    gl.uniform4f(u_FragColor, 0.6*rgba[0], 0.6*rgba[1], 0.6*rgba[2], rgba[3]);
    drawTriangle3D([0,0,0, 1,0,0, 1,0,1]);
    drawTriangle3D([1,0,1, 0,0,1, 0,0,0]);

    drawTriangle3D([0,1,0, 1,1,0, 1,1,1]);
    drawTriangle3D([1,1,1, 0,1,1, 0,1,0]);
}