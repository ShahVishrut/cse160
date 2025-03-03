class Sphere {
    static vertexList = null;

    constructor() {
        this.matrix = new Matrix4();
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.textureWeight0 = 0;
        this.textureWeight1 = 0;
        this.normalMatrix = new Matrix4();
    }

    prepareRender() {
        if (Sphere.vertexList == null) {
            Sphere.vertexList = [];
            var increment = 0.1;
            for (var theta = 0; theta <= Math.PI; theta += increment) {
                for (var phi = 0; phi < 2 * Math.PI; phi += increment) {
                    Sphere.vertexList.push(Math.sin(theta)*Math.cos(phi), Math.sin(theta)*Math.sin(phi), Math.cos(theta), 0,0, Math.sin(theta)*Math.cos(phi), Math.sin(theta)*Math.sin(phi), Math.cos(theta));
                    Sphere.vertexList.push(Math.sin(theta+increment)*Math.cos(phi), Math.sin(theta+increment)*Math.sin(phi), Math.cos(theta+increment), 0,0, Math.sin(theta+increment)*Math.cos(phi), Math.sin(theta+increment)*Math.sin(phi), Math.cos(theta+increment));
                    Sphere.vertexList.push(Math.sin(theta+increment)*Math.cos(phi+increment), Math.sin(theta+increment)*Math.sin(phi+increment), Math.cos(theta+increment), 0,0, Math.sin(theta+increment)*Math.cos(phi+increment), Math.sin(theta+increment)*Math.sin(phi+increment), Math.cos(theta+increment));
                    Sphere.vertexList.push(Math.sin(theta)*Math.cos(phi), Math.sin(theta)*Math.sin(phi), Math.cos(theta), 0,0, Math.sin(theta)*Math.cos(phi), Math.sin(theta)*Math.sin(phi), Math.cos(theta));
                    Sphere.vertexList.push(Math.sin(theta)*Math.cos(phi+increment), Math.sin(theta)*Math.sin(phi+increment), Math.cos(theta), 0,0, Math.sin(theta)*Math.cos(phi+increment), Math.sin(theta)*Math.sin(phi+increment), Math.cos(theta));
                    Sphere.vertexList.push(Math.sin(theta+increment)*Math.cos(phi+increment), Math.sin(theta+increment)*Math.sin(phi+increment), Math.cos(theta+increment), 0,0, Math.sin(theta+increment)*Math.cos(phi+increment), Math.sin(theta+increment)*Math.sin(phi+increment), Math.cos(theta+increment));
                }
            }
        }
        for (var x = 0; x < Sphere.vertexList.length / 8; x++) {
            for (var i = 0; i < 8; i++) {
                Aggregate.allData.push(Sphere.vertexList[8*x + i]);
            }
            Aggregate.allData.push(this.color[0], this.color[1], this.color[2], this.color[3]);
            for (var i = 0; i < 16; i++) {
                Aggregate.allData.push(this.matrix.elements[i]);
            }
            this.normalMatrix.setInverseOf(this.matrix);
            this.normalMatrix.transpose();
            for (var i = 0; i < 16; i++) {
                Aggregate.allData.push(this.normalMatrix.elements[i]);
            }
            Aggregate.allData.push(this.textureWeight0);
            Aggregate.allData.push(this.textureWeight1);
        }
    }
}