axisX = [];
axisY = [];
let beam = parseFloat(document.querySelector(".BLength").value);
document.querySelector(".BLength").addEventListener("input", function () {
  beam = parseFloat(this.value);
});
ExternalForce = [];
document.querySelector(".btnSupfix").addEventListener("click", function () {
  if (!axisX.some((force) => force.name === "Ax")) {
    addForce(axisX, { name: "Ax", force: undefined, position: 0 });
  }
  if (!axisY.some((force) => force.name === "Ay")) {
    addForce(axisY, { name: "Ay", force: undefined, position: 0 });
  }
});

document.querySelector(".btnSupRoller").addEventListener("click", function () {
  if (!axisY.some((force) => force.name === "Ay")) {
    addForce(axisY, { name: "Ay", force: undefined, position: 0 });
  }
});

document.querySelector(".btnSupWall").addEventListener("click", function () {
  if (!axisX.some((force) => force.name === "Ax")) {
    addForce(axisX, { name: "Ax", force: undefined, position: 0 });
  }
  if (!axisY.some((force) => force.name === "Ay")) {
    addForce(axisY, { name: "Ay", force: undefined, position: 0 });
  }
});

document.querySelector(".btnSupfix2").addEventListener("click", function () {
  if (!axisX.some((force) => force.name === "Bx")) {
    addForce(axisX, { name: "Bx", force: undefined, position: beam });
  }
  if (!axisY.some((force) => force.name === "By")) {
    addForce(axisY, { name: "By", force: undefined, position: beam });
  }
});

document.querySelector(".btnSupRoller2").addEventListener("click", function () {
  if (!axisY.some((force) => force.name === "By")) {
    addForce(axisY, { name: "By", force: undefined, position: beam });
  }
});

document.querySelector(".btnSupWall2").addEventListener("click", function () {
  if (!axisX.some((force) => force.name === "Bx")) {
    addForce(axisX, { name: "Bx", force: undefined, position: beam });
  }
  if (!axisY.some((force) => force.name === "By")) {
    addForce(axisY, { name: "By", force: undefined, position: beam });
  }
});

function handleAddForce() {
  let positionValue = parseFloat(
    document.querySelector(".position-input").value
  );
  let forceValue = parseFloat(document.querySelector(".force-input").value);
  let newForce = {
    name: "P",
    force: forceValue,
    startPoint: positionValue,
    EndPoint: positionValue,
    type: "Point",
  };
  addForce(ExternalForce, newForce);
}

function handleAddForce2() {
  var forceValue = parseFloat(document.querySelector(".square-input").value);
  var newForce = {
    name: "D",
    force: forceValue,
    startPoint: 0,
    EndPoint: beam,
    type: "Distributed",
  };
  addForce(ExternalForce, newForce);
}

function handleAddForce3() {
  var forceValue = parseFloat(document.querySelector(".Tri-input").value);
  var newForce = {
    name: "T",
    force: forceValue,
    startPoint: 0,
    EndPoint: beam,
    type: "Triangular",
  };
  addForce(ExternalForce, newForce);
}
var Fmoment;
// Add an event listener to the "Add" button
document.querySelector(".addforce2").addEventListener("click", function () {
  // Call the handleMoment function when the "Add" button is clicked
  Fmoment = handleMoment();
  if (Fmoment) {
    console.log(Fmoment);
    // Add any further actions you want to perform with Fmoment here
  } else {
    console.error("Error handling moment");
  }
});

// The handleMoment function remains the same as before
function handleMoment() {
  var MomentInput = document.querySelector(".Moment-input");
  var PositionInput = document.querySelector(".position-input2");

  if (!MomentInput || !PositionInput) {
    console.error("Input fields not found");
    return null;
  }

  var Moment = parseFloat(MomentInput.value);
  var Position = parseFloat(PositionInput.value);

  if (isNaN(Moment) || isNaN(Position)) {
    console.error("Invalid input values");
    return null;
  }

  return { force: Moment, pivotPosition: Position };
}

function addForce(axis, force) {
  axis.push(force);
}
function deleteForce(axis, force) {
  axis.pop(force);
}

//อาจจะต้องลบตัวติดลบออก
function findMoment(axis, moments, ExternalForce) {
  var devide;
  axis.forEach((force) => {
    if (force.position != moments.pivotPosition)
      devide = Math.abs(force.position - moments.pivotPosition);
  });
  totalMoment =
    ExternalForce.reduce((total, force) => {
      if (
        force.startpoint == force.EndPoint &&
        force.startpoint == moments.pivotPosition
      ) {
        return total;
      }
      total += MomentTypeForces(force, moments.pivotPosition);
      return total;
    }, 0) + moments.force;
  axis.map((unknown) => {
    if (
      unknown.force === undefined &&
      unknown.position !== moments.pivotPosition
    )
      unknown.force = -(totalMoment / devide);
    return unknown;
  });
  findUnknown(axis, ExternalForce);
}

function findUnknown(axis, ExternalForce) {
  var total = axis.reduce(
    (total, unknown) =>
      unknown.force !== undefined ? total + MomentTypeForces(unknown) : total,
    0
  );
  total += ExternalForce.reduce(
    (total, force) => total + MomentTypeForces(force),
    0
  );
  if (total != 0) total = total * -1;
  axis.map((unknown) => {
    if (unknown.force === undefined) unknown.force = total;
    return unknown;
  });
}

function MomentTypeForces(force, pivotPosition) {
  let result = 0;
  if (force.type == "Distributed") {
    let Forcelength = force.EndPoint - force.startPoint;
    if (pivotPosition !== undefined) {
      result =
        force.force * Forcelength * Math.abs(Forcelength / 2 - pivotPosition);
    } else {
      result = force.force * Forcelength;
    }
  } else if (force.type == "Triangular") {
    let Forcelength = force.EndPoint - force.startPoint;
    if (pivotPosition !== undefined) {
      result =
        (1 / 2) *
        Forcelength *
        force.force *
        Math.abs(Forcelength - Forcelength * (1 / 3) - pivotPosition);
    } else {
      result = (1 / 2) * Forcelength * force.force;
    }
  } else {
    if (pivotPosition !== undefined) {
      result = force.force * Math.abs(force.startPoint - pivotPosition);
    } else {
      result = force.force;
    }
  }
  return result;
}

function ShearEquation(BeamLength, Force, axis) {
  axis = axis.find((force) => force.position == 0);
  Force = Force[0];
  if (Force.type == "Distributed") {
    return `${-axis.force} - ${Force.force}X`;
  } else if (Force.type == "Triangular") {
    Wx = 0.5 * (Force.force / BeamLength);
    return `${-axis.force} - ${Wx}X^2`;
  } else {
    lengthX1 = -axis.force;
    lengthX2 = -axis.force - Force.force;
    return { x1: lengthX1, x2: lengthX2 };
  }
}

function MomentEquation(BeamLength, Force, axis) {
  axis = axis.find((force) => force.position == 0);
  Force = Force[0];
  if (Force.type == "Distributed") {
    return `${-axis.force}X - ${Force.force / 2}X^2`;
  } else if (Force.type == "Triangular") {
    Wx = 0.5 * (Force.force / BeamLength) * (1 / 3);
    return `${-axis.force}X - ${Wx}X^3`;
  } else {
    lengthX1 = `${-axis.force}X1`;
    lengthX2 =`${-axis.force - Force.force}X2-(${Force.force * -Force.startPoint})`;
    console.log(lengthX1,lengthX2)
    return { x1: lengthX1, x2: lengthX2 };
  }
}

function formatShearResult(result) {
  if (typeof result === "object") {
    return `Shear Force1 = <span style="color:red">${result.x1}</span> N, Shear Force2 = <span style="color:red">${result.x2}</span> N`;
  }
  else{
    return `Shear Force = <span style="color:red">${result}</span> N`;
  }
}

function formatMomentResult(result) {
  if (typeof result === "object") {
    return `Moment1 = <span style="color:red">${result.x1}</span> N*m, Moment2 = <span style="color:red">${result.x2}</span> N*m`;
  }
  return `Moment = ${result}`;
}


function Calculate() {
  console.log(beam);
  const resultDiv = document.querySelector(".result");

  // Calculate force values
  findMoment(axisY, Fmoment, ExternalForce);
  const shearResult = ShearEquation(beam, ExternalForce, axisY);
  const momentResult = MomentEquation(beam, ExternalForce, axisY);

  // Format force values
  const formattedForces = axisX
    .concat(axisY)
    .map((force) => {
      const forceValue =
        force.force !== undefined
          ? `<span style="color:red">${force.force.toFixed(3)}</span> N`
          : `<span style="color:red">0</span> N`;
      return `${force.name} = ${forceValue}`;
    })
    .join("<br>");

  // Append the results to the resultDiv
  resultDiv.innerHTML = `<p>${formattedForces}</p>
                         <p>${formatShearResult(shearResult)}</p>
                         <p>${formatMomentResult(momentResult)}</p>`;
}
