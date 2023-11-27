class Sphere {
    constructor(name, scale, translation, rotation) {
        this.name = name;
        this.scale = scale;
        this.translation = translation;
        this.rotation = rotation;

        this.modelMatrix = new Matrix4();
        this.modelMatrix.setTranslate(this.translation[0], this.translation[1], this.translation[2]);
        this.modelMatrix.scale(this.scale[0], this.scale[1], this.scale[2]);
        this.modelMatrix.rotate(this.rotation, 0, 0, 1);
    }

    initVertexBuffers(gl) {
        const latitudeBands = 20;
        const longitudeBands = 20;
        let vertices = [];
        let colors = [];
        let indices = [];

        for (let latNumber = 0; latNumber <= latitudeBands; latNumber++) {
            var theta = latNumber * Math.PI / latitudeBands;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) {
                var phi = longNumber * 2 * Math.PI / longitudeBands;
                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;

                vertices.push(x, y, z);
                colors.push(1.0, 1.0, 1.0); // Sphere color (white for example)
            }
        }

        for (let latNumber = 0; latNumber < latitudeBands; latNumber++) {
            for (let longNumber = 0; longNumber < longitudeBands; longNumber++) {
                var first = (latNumber * (longitudeBands + 1)) + longNumber;
                var second = first + longitudeBands + 1;
                indices.push(first);
                indices.push(second);
                indices.push(first + 1);

                indices.push(second);
                indices.push(second + 1);
                indices.push(first + 1);
            }
        }

        const vertexBuffer = gl.createBuffer();
        const colorBuffer = gl.createBuffer();
        const indexBuffer = gl.createBuffer();

        const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log("Failed to get the storage location of a_Position");
            return -1;
        }
        const a_Color = gl.getAttribLocation(gl.program, 'a_Color');
        if (a_Color < 0) {
            console.log("Failed to get the storage location of a_Color");
            return -1;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Color);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        return indices.length;
    }
}
