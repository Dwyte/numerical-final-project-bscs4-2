function handleSelectChange() {
  let methodInput = document.forms["form"]["method"].value;
  if (methodInput === "newton") {
    document.getElementById("initialGuessInputLabel").style.display = "block";
    document.getElementById("xLeftInitialInputLabel").style.display = "none";
    document.getElementById("xRightInitialInputLabel").style.display = "none";
  } else {
    document.getElementById("initialGuessInputLabel").style.display = "none";
    document.getElementById("xLeftInitialInputLabel").style.display = "block";
    document.getElementById("xRightInitialInputLabel").style.display = "block";
  }
}

function handleSubmit() {
  try {
    let equationInput = document.forms["form"]["equation"].value;
    let methodInput = document.forms["form"]["method"].value;
    let precisionInput = parseFloat(document.forms["form"]["precision"].value);

    let tableHeader;
    if (methodInput === "secant") {
      let xLeftInitial = parseFloat(
        document.forms["form"]["xLeftInitial"].value
      );
      let xRightInitial = parseFloat(
        document.forms["form"]["xRightInitial"].value
      );

      answer = secantMethod(
        equationInput,
        precisionInput,
        xLeftInitial,
        xRightInitial
      );

      tableHeader = [
        "i",
        "X<sub>a</sub>",
        "X<sub>b</sub>",
        "X<sub>n</sub>",
        "Y<sub>a</sub>",
        "Y<sub>b</sub>",
        "Y<sub>n</sub>",
      ];
    } else {
      let initialGuess = parseFloat(
        document.forms["form"]["initialGuess"].value
      );

      answer = newtonRaphsonMethod(equationInput, precisionInput, initialGuess);

      tableHeader = [
        "i",
        "X<sub>n</sub>",
        "X<sub>o</sub>",
        "Y<sub>n</sub>",
        "Y<sub>o</sub>",
      ];
    }

    const { root, iterations } = answer;

    const decimalPlaces = Math.log10(1 / precisionInput);
    console.log(decimalPlaces);

    document.getElementById("solutions").innerHTML = `x ≈ ${root.toFixed(
      decimalPlaces + 1
    )}`;

    displayIterationsTable(
      tableHeader,
      iterations.map((iteration) =>
        iteration.map((num) => num.toFixed(decimalPlaces + 1))
      )
    );
  } catch (error) {
    console.log(error);
  }

  return false;
}

function secantMethod(equation, precision, x0, x1, maxIterations = 100) {
  // Define the function based on the equation string
  const f = math.parse(equation).compile();

  let iterations = [];

  let x2 = x1;
  let fX1 = f.evaluate({ x: x1 });

  // Iterate until the desired precision is achieved or maximum iterations reached
  for (let i = 0; i < maxIterations; i++) {
    const fX0 = f.evaluate({ x: x0 });

    const x3 = x1 - (fX1 * (x1 - x0)) / (fX1 - fX0); // Compute the next approximation
    const fX3 = f.evaluate({ x: x3 });

    let iteration = [x0, x1, x3, fX0, fX1, fX3];
    iterations.push(iteration);
    console.log(fX3, precision);
    if (Math.abs(fX3) < precision * 10) {
      return { root: x3, iterations };
    }

    x0 = x1;
    x1 = x3;
    fX1 = f.evaluate({ x: x1 });
  }

  // Return the approximate root within the desired precision
  return { root: x1, iterations };
}

function newtonRaphsonMethod(
  equation,
  precision,
  initialGuess,
  _,
  maxIterations = 100
) {
  // Define the function and its derivative based on the equation string
  const f = math.parse(equation).compile();
  const fDerivative = math.derivative(equation, "x").compile();

  let iterations = [];

  let x = initialGuess;

  // Iterate until the desired precision is achieved or maximum iterations reached
  for (let i = 0; i < maxIterations; i++) {
    const fX = f.evaluate({ x });
    const fXDerivative = fDerivative.evaluate({ x });

    const xNext = x - fX / fXDerivative; // Compute the next approximation

    let iteration = [xNext, x, f.evaluate({ x: xNext }), fX];
    iterations.push(iteration);

    if (Math.abs(xNext - x) < precision) {
      return { root: xNext, iterations };
    }

    x = xNext;
  }

  // Return the approximate root within the desired precision
  return { root: x, iterations };
}

function displayIterationsTable(header, body) {
  let table = "<tr>";

  for (let columnTitle of header) {
    table += `<th>${columnTitle}</th>`;
  }

  table += "</tr>";

  for (let i in body) {
    table += `<tr><td>${parseInt(i) + 1}</td>`;
    for (let j in body[i]) {
      table += `<td>${body[i][j]}</td>`;
    }
    table += "</tr>";
  }
  document.getElementById("table").innerHTML = table;
}
