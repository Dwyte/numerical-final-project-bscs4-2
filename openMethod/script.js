function handleSubmit() {
  try {
    let equationInput = document.forms["form"]["equation"].value;
    let methodInput = document.forms["form"]["method"].value;
    let precisionInput = parseFloat(document.forms["form"]["precision"].value);
    let xLeftInitial = parseFloat(document.forms["form"]["xLeftInitial"].value);
    let xRightInitial = parseFloat(
      document.forms["form"]["xRightInitial"].value
    );

    const methods = {
      secant: secantMethod,
      newton: newtonRaphsonMethod,
    };

    const { root, iterations } = methods[methodInput](
      equationInput,
      precisionInput,
      xLeftInitial,
      xRightInitial
    );

    const decimalPlaces = Math.log10(1 / precisionInput);
    console.log(decimalPlaces);

    document.getElementById("solutions").innerHTML = `x ≈ ${root.toFixed(
      decimalPlaces
    )}`;
    console.log(iterations);
    displayIterationsTable(
      [
        "i",
        "X<sub>a</sub>",
        "X<sub>b</sub>",
        "f(X<sub>a</sub>)",
        "f(X<sub>b</sub>)",
        "X<sub>n</sub>",
        "f(X<sub>n</sub>)",
      ],
      iterations.map((iteration) =>
        iteration.map((num) => num.toFixed(decimalPlaces))
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

    if (Math.abs(fX1 - fX0) < precision) {
      return { root: x1, iterations };
    }

    const x3 = x1 - (fX1 * (x1 - x0)) / (fX1 - fX0); // Compute the next approximation

    let iteration = [x0, x1, fX0, fX1, x3, f.evaluate({ x: x3 })];
    iterations.push(iteration);

    x0 = x1;
    x1 = x3;
    fX1 = f.evaluate({ x: x1 });
  }

  // Return the approximate root within the desired precision
  return { root: x1, iterations };
}

function newtonRaphsonMethod(equation, precision, x0, x1, maxIterations = 100) {
  //
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
  console.log(table);
  document.getElementById("table").innerHTML = table;
}
