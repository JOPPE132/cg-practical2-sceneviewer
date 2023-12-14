class Sphere {
  constructor(name, radius, translation, rotation) {
    this.name = name;
    this.shape = shape;
    this.scale = [0, 0, 0];
    this.radius = radius;
    this.translation = translation;
    this.rotation = rotation;

    this.modelMatrix = new Matrix4();
    this.modelMatrix.setTranslate(
      this.translation[0],
      this.translation[1],
      this.translation[2]
    );
    // this.modelMatrix.scale(this.scale[0], this.scale[1], this.scale[2]);
    this.modelMatrix.rotate(this.rotation, 0, 0, 1);
  }

  initVertexBuffers(gl) {
    const sectors = 20;
    const stacks = 20;
    const vertices = [];
    const colors = [];
    const indices = [];

    for (let lat = 0; lat <= stacks; lat++) {
      const phi = Math.PI / 2 - Math.PI * (lat / stacks);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      for (let long = 0; long <= sectors; long++) {
        const theta = 2 * Math.PI * (long / sectors);
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        const x = this.radius * cosPhi * cosTheta;
        const y = this.radius * cosPhi * sinTheta;
        const z = this.radius * sinPhi;

        vertices.push(x, y, z);
        colors.push(1.0, 0.2, 1.0);
      }
    }

    for (let lat = 0; lat < stacks; lat++) {
      let first = lat * (sectors + 1);
      let second = first + sectors + 1;

      for (let long = 0; long < sectors; long++, first++, second++) {
        if (lat != 0) {
          indices.push(first);
          indices.push(second);
          indices.push(first + 1);
        }

        if (lat != stacks - 1) {
          indices.push(first + 1);
          indices.push(second);
          indices.push(second + 1);
        }
      }
    }

    // Create buffers
    const vertexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();
    if (!vertexBuffer || !colorBuffer || !indexBuffer) {
      console.log("Failed to create the buffer object");
      return -1;
    }

    // Get attribute variables
    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    if (a_Position < 0) {
      console.log("Failed to get the storage location of a_Position");
      return -1;
    }
    const a_Color = gl.getAttribLocation(gl.program, "a_Color");
    if (a_Color < 0) {
      console.log("Failed to get the storage location of a_Color");
      return -1;
    }

    // Write vertex coordinates to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Write vertex colors to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    // Write indices for the base to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint8Array(indices),
      gl.STATIC_DRAW
    );

    return indices.length;
  }
  resetTransform() {
    this.scale = [0.1, 0.1, 0.1];
    this.translation = [0, 0, 0];
    this.rotation = 0;
    this.radius = 1;
    this.updateModelMatrix();
  }

  translate(translate) {
    this.translation[0] += translate[0];
    this.translation[1] += translate[1];
    this.translation[2] += translate[2];
    this.updateModelMatrix();
  }

  scaleObject(scale) {
    this.scale[0] += scale;
    this.scale[1] += scale;
    this.scale[2] += scale;
    this.updateModelMatrix();
  }

  rotateObject(rotation) {
    this.rotation += rotation;
    this.updateModelMatrix();
  }

  updateModelMatrix() {
    this.modelMatrix.setTranslate(
      this.translation[0],
      this.translation[1],
      this.translation[2]
    );
    this.modelMatrix.scale(this.scale[0], this.scale[1], this.scale[2]);
    this.modelMatrix.rotate(this.rotation, 0, 0, 1);
  }
}
