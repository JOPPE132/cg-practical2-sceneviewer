class Cylinder {
  constructor(name, scale, translation, rotation, numSides) {
    this.name = name;
    this.scale = scale;
    this.translation = translation;
    this.rotation = rotation;
    this.numSides = numSides;

    this.modelMatrix = new Matrix4();
    this.modelMatrix.setTranslate(
      this.translation[0],
      this.translation[1],
      this.translation[2]
    );
    this.modelMatrix.scale(this.scale[0], this.scale[1], this.scale[2]);
    this.modelMatrix.rotate(this.rotation, 0, 0, 1);
  }

  initVertexBuffers(gl) {
    let vertices = [];
    let colors = [];
    let indices = [];

    for (let i = 0; i < this.numSides; i++) {
      let angle = (2 * Math.PI * i) / this.numSides;
      let x = Math.cos(angle);
      let z = Math.sin(angle);

      // Top circle vertex
      vertices.push(x, 0.5, z);
      colors.push(1.0, 0.0, 0.0); // Red color

      // Bottom circle vertex
      vertices.push(x, -0.5, z);
      colors.push(0.0, 1.0, 0.0); // Green color
    }

    // Indices for the side surface
    for (let i = 0; i < this.numSides; i++) {
      let nextIndex = (i + 1) % this.numSides;
      indices.push(i * 2, i * 2 + 1, nextIndex * 2);
      indices.push(i * 2 + 1, nextIndex * 2 + 1, nextIndex * 2);
    }

    // Indices for the top and bottom circle
    for (let i = 0; i < this.numSides; i++) {
      // Top circle
      indices.push(this.numSides * 2, i * 2, ((i + 1) % this.numSides) * 2);

      // Bottom circle
      indices.push(
        this.numSides * 2 + 1,
        i * 2 + 1,
        ((i + 1) % this.numSides) * 2 + 1
      );
    }

    // Adding the center vertices for the top and bottom circles
    vertices.push(0, 0.5, 0); // Center vertex for the top circle
    colors.push(1.0, 1.0, 1.0); // White color
    vertices.push(0, -0.5, 0); // Center vertex for the bottom circle
    colors.push(1.0, 1.0, 1.0); // White color

    vertices = new Float32Array(vertices);
    colors = new Float32Array(colors);
    indices = new Uint16Array(indices);

    // Create buffers
    const vertexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

    if (!vertexBuffer || !colorBuffer || !indexBuffer) {
      console.log("Failed to create buffers.");
      return -1;
    }

    // Get a_Position and a_Color attribute variables
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

    // Write the vertex coordinates to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the buffer object to a_Position and enable the assignment
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Write the vertex colors to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    // Assign the buffer object to a_Color and enable the assignment
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    return indices.length;
  }

  resetTransform() {
    this.scale = [0.1, 0.1, 0.1];
    this.translation = [0, 0, 0];
    this.rotation = 0;
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
