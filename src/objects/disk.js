class Disk {
    constructor(name, scale, translation, rotation, segments) {
        this.name = name;
        this.scale = scale;
        this.translation = translation;
        this.rotation = rotation;
        this.segments = segments; // Number of segments to make the disk smooth

        this.modelMatrix = new Matrix4();
        this.modelMatrix.setTranslate(this.translation[0], this.translation[1], this.translation[2]);
        this.modelMatrix.scale(this.scale[0], this.scale[1], this.scale[2]);
        this.modelMatrix.rotate(this.rotation, 0, 0, 1);
    }

    initVertexBuffers(gl) {
        // Vertices and colors arrays
        const vertices = [];
        const colors = [];
        const indices = [];

        // Center of the disk
        vertices.push(0.0, 0.0);
        colors.push(1.0, 1.0, 1.0); // Color for the center

        // Generate points around the disk
        for (let i = 0; i <= this.segments; i++) {
            const angle = (i * 2 * Math.PI) / this.segments;
            const x = Math.cos(angle);
            const y = Math.sin(angle);

            vertices.push(x, y);
            // Define color for each vertex here, e.g., random or based on some pattern
            colors.push(Math.random(), Math.random(), Math.random());
        }

        // Generate indices for triangle fan
        for (let i = 1; i <= this.segments; i++) {
            indices.push(0, i, i + 1);
        }
        indices.push(0, this.segments, 1); // Close the disk

        const verticesFloat32Array = new Float32Array(vertices);
        const colorsFloat32Array = new Float32Array(colors);
        const indicesUint8Array = new Uint8Array(indices);

        // Create buffers
        const vertexBuffer = gl.createBuffer();
        const colorBuffer = gl.createBuffer();
        const indexBuffer = gl.createBuffer();
        if (!vertexBuffer || !colorBuffer || !indexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        // Get a_Position and a_Color attribute variables
        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if(a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        if(a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }

        // Write the vertex coordinates to the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, verticesFloat32Array, gl.STATIC_DRAW);

        // Assign the buffer object to a_Position and enable the assignment
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        // Write the vertex colors to the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, colorsFloat32Array, gl.STATIC_DRAW);

        // Assign the buffer object to a_Color and enable the assignment
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        // Write the indices to the buffer object
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesUint8Array, gl.STATIC_DRAW);

        return indices.length;
    }
}
