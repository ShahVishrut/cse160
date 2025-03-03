class Camera {
    constructor() {
        this.fov = 60;
        this.eye = new Vector3([16,0,10]);
        this.at = new Vector3([16,16,0]);
        this.up = new Vector3([0,0,1]);
        this.viewMatrix = new Matrix4();
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        this.projection = new Matrix4();
        this.projection.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
        this.speed = 0.1;
        this.aspeed = 1;
    }

    reset() {
        this.at = new Vector3([16,16,0]);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    moveForward() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(this.speed);
        this.eye.add(f);
        this.at.add(f);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    moveBackwards() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        f.normalize();
        f.mul(-this.speed);
        this.eye.add(f);
        this.at.add(f);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    moveLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(-this.speed);
        this.eye.add(s);
        this.at.add(s);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    moveRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        s.mul(this.speed);
        this.eye.add(s);
        this.at.add(s);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panLeft() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(this.aspeed, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        f = rotationMatrix.multiplyVector3(f);
        f.add(this.eye);
        this.at.set(f);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panRight() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-this.aspeed, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        f = rotationMatrix.multiplyVector3(f);
        f.add(this.eye);
        this.at.set(f);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panUp() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(this.aspeed, s.elements[0], s.elements[1], s.elements[2]);
        f = rotationMatrix.multiplyVector3(f);
        f.add(this.eye);
        this.at.set(f);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panDown() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-this.aspeed, s.elements[0], s.elements[1], s.elements[2]);
        f = rotationMatrix.multiplyVector3(f);
        f.add(this.eye);
        this.at.set(f);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panSideways(dx) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(dx, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        f = rotationMatrix.multiplyVector3(f);
        f.add(this.eye);
        this.at.set(f);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    panUpwards(dy) {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(dy, s.elements[0], s.elements[1], s.elements[2]);
        f = rotationMatrix.multiplyVector3(f);
        f.add(this.eye);
        this.at.set(f);
        this.viewMatrix.setLookAt(this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], this.at.elements[0], this.at.elements[1], this.at.elements[2], this.up.elements[0], this.up.elements[1], this.up.elements[2]);
    }

    getMapPosition() {
        let f = new Vector3();
        f.set(this.at);
        f.sub(this.eye);
        let scale = -this.eye.elements[2] / f.elements[2];
        f.mul(scale);
        f.add(this.eye);
        return [Math.floor(f.elements[0]), Math.floor(f.elements[1])];
    }
}