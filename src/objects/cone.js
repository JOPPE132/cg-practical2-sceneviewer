class Cone {
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
    const nSides = 20; // Fixed number of sides for the cone's base
    let vertices = [];
    let colors = [];
    let indices = [];

    // Cone apex point
    vertices.push(0.0, 1.0, 0.0); // Cone's tip (centered above base)
    colors.push(1.0, 0.0, 0.0); // Cone tip color (red for example)

    // Cone base vertices and colors
    for (let i = 0; i <= nSides; i++) {
      let angle = (2 * Math.PI * i) / nSides;
      let x = Math.cos(angle);
      let z = Math.sin(angle);
      vertices.push(x, -1.0, z); // Base circle points
      colors.push(0.0, 1.0, 0.0); // Base color (green for example)
    }

    // Cone surface indices
    for (let i = 1; i <= nSides; i++) {
      indices.push(0, i, (i % nSides) + 1);
    }

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
