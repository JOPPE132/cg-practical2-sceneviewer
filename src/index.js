const addButton = document.getElementById("add-button");
const removeButton = document.getElementById("remove-button");
const resetButton = document.getElementById("reset-button");
const shape = document.getElementById("shape");
const scaleX = document.getElementById("scale-x");
const scaleY = document.getElementById("scale-y");
const scaleZ = document.getElementById("scale-z");
const radi = document.getElementById("radius");
const translationX = document.getElementById("translation-x");
const translationY = document.getElementById("translation-y");
const translationZ = document.getElementById("translation-z");
const rotationZ = document.getElementById("rotation-z");
const objects = document.getElementById("objects");

const scene = new Scene();

addButton.onclick = function () {
  const name = "object_".concat(shape.value).concat(String(Date.now()));
  const translation = [
    Number(translationX.value),
    Number(translationY.value),
    Number(translationZ.value),
  ];
  const scale = [
    Number(scaleX.value),
    Number(scaleY.value),
    Number(scaleZ.value),
  ];
  const rotation = Number(rotationZ.value);
  const radius = Number(radi.value);

  if (shape.value == "quad") {
    scene.addObject(new Quad(name, scale, translation, rotation));
  } else if (shape.value == "cube") {
    scene.addObject(new Cube(name, scale, translation, rotation));
  } else if (shape.value == "square-pyramid") {
    scene.addObject(new SquarePyramid(name, scale, translation, rotation));
  } else if (shape.value == "cone") {
    scene.addObject(new Cone(name, scale, translation, rotation));
  } else if (shape.value == "sphere") {
    scene.addObject(new Sphere(name, radius, translation, rotation)); //TODO FIKS RADIUS input element
  } else if (shape.value == "cylinder") {
    scene.addObject(new Cylinder(name, scale, translation, rotation, 100));
  } else if ((shape.value = "disk")) {
    scene.addObject(new Disk(name, radius, translation, rotation));
  }
  scene.draw();

  updateObjectList();
};

removeButton.onclick = function () {
  scene.removeObject(objects.value);
  scene.draw();

  updateObjectList();
};

resetButton.onclick = function () {
  const selectedObjects = objects.selectedOptions;
  resetTransformations(selectedObjects);
  scene.draw();
};

function updateObjectList() {
  objects.innerHTML = "";
  objects.setAttribute("multiple", "multiple");

  for (let object of scene.objects) {
    const option = document.createElement("option");
    option.value = object.name;
    option.innerHTML = object.name;
    objects.appendChild(option);
  }
}

document.addEventListener("keydown", function (event) {
  const selectedObjects = objects.selectedOptions;

  switch (event.key) {
    case "ArrowUp": // Translate up
      translateObjects(selectedObjects, [0, 0.1, 0]);
      break;
    case "ArrowDown": // Translate down
      translateObjects(selectedObjects, [0, -0.1, 0]);
      break;
    case "ArrowLeft": // Translate left
      translateObjects(selectedObjects, [-0.1, 0, 0]);
      break;
    case "ArrowRight": // Translate right
      translateObjects(selectedObjects, [0.1, 0, 0]);
      break;
    case "w": // Translate forward
      translateObjects(selectedObjects, [0, 0, 0.1]);
      break;
    case "x": // Translate backward
      translateObjects(selectedObjects, [0, 0, -0.1]);
      break;
    case "r": // Rotate
      rotateObjects(selectedObjects, -10);
      break;
    case "e": // Rotate
      rotateObjects(selectedObjects, 10);
      break;
    case "s": // Scale up
      scaleObjects(selectedObjects, 0.1);
      break;
    case "d": // Scale down
      scaleObjects(selectedObjects, -0.1);
      break;
  }

  scene.draw();
});

function translateObjects(names, translation) {
  for (let i = 0; i < names.length; i++) {
    let obj = scene.getObjectByName(names[i].value);
    if (obj) {
      obj.translate(translation);
    }
  }
}

function scaleObjects(names, scale) {
  for (let i = 0; i < names.length; i++) {
    let obj = scene.getObjectByName(names[i].value);
    if (obj) {
      obj.scaleObject(scale);
    }
  }
}

function rotateObjects(names, rotation) {
  for (let i = 0; i < names.length; i++) {
    let obj = scene.getObjectByName(names[i].value);
    if (obj) {
      obj.rotateObject(rotation);
    }
  }
}

function resetTransformations(names) {
  for (let i = 0; i < names.length; i++) {
    let obj = scene.getObjectByName(names[i].value);
    if (obj) {
      obj.resetTransform();
    }
  }
}
