class SquarePyramid {
  constructor(name, scale, translation, rotation) {
    this.name = name;
    this.scale = scale;
    this.translation = translation;
    this.rotation = rotation;

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

    // Pyramid apex point
    vertices.push(0.0, 1.0, 0.0); // Pyramid's tip
    colors.push(1.0, 0.0, 0.0);

    // Pyramid base vertices and colors
    vertices.push(1.0, -1.0, 1.0); // Front-Right
    colors.push(0.0, 1.0, 0.0);
    vertices.push(-1.0, -1.0, 1.0); // Front-Left
    colors.push(0.0, 1.0, 0.0);
    vertices.push(-1.0, -1.0, -1.0); // Back-Left
    colors.push(0.0, 1.0, 0.0);
    vertices.push(1.0, -1.0, -1.0); // Back-Right
    colors.push(0.0, 1.0, 0.0);

    // Pyramid surface indices
    indices.push(0, 1, 2); // Front face
    indices.push(0, 2, 3); // Left face
    indices.push(0, 3, 4); // Back face
    indices.push(0, 4, 1); // Right face

    // Base surface indices
    indices.push(1, 2, 3);
    indices.push(1, 3, 4);

    // Create buffers
    const vertexBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const indexBuffer = gl.createBuffer();

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
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Assign the buffer object to a_Position and enable the assignment
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Write the vertex colors to the buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // Assign the buffer object to a_Color and enable the assignment
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    // Write the indices to the buffer object
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint8Array(indices),
      gl.STATIC_DRAW
    );

    return indices.length;
  }
}
