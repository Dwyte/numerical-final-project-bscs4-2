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
      bisection: bisectionMethod,
      falsi: falsiMethod,
    };

    const { root, iterations } = methods[methodInput](
      equationInput,
      precisionInput,
      xLeftInitial,
      xRightInitial
    );

    const decimalPlaces = Math.log10(1 / precisionInput);

    document.getElementById("solutions").innerHTML = `x ≈ ${root.toFixed(
      decimalPlaces + 1
    )}`;

    console.log(iterations);
    displayIterationsTable(
      [
        "i",
        "X<sub>L</sub>",
        "X<sub>R</sub>",
        "Y<sub>L</sub>",
        "Y<sub>R</sub>",
        "X<sub>M</sub>",
        "Y<sub>M</sub>",
      ],
      iterations.map((iteration) =>
        iteration.map((num) => num.toFixed(decimalPlaces + 1))
      )
    );
  } catch (error) {
    console.log(error);
  }

  return false;
}

function bisectionMethod(equation, precision, a, b, maxIterations = 1000) {
  // Define the function based on the equation string
  const f = math.parse(equation).compile();

  let iterations = [];
  let fC = Infinity;

  // Iterate until the desired precision is achieved
  for (let i = 0; i < maxIterations && Math.abs(fC) >= precision * 10; i++) {
    const c = (a + b) / 2; // Compute the midpoint

    const fA = f.evaluate({ x: a });
    const fB = f.evaluate({ x: b });
    fC = f.evaluate({ x: c });
    console.log(fC);

    let iteration = [a, b, fA, fB, c, fC];
    iterations.push(iteration);

    if (fC === 0) {
      return { root: c, iterations };
    } else if (fA * fC < 0) {
      b = c; // Update the interval to [a, c]
    } else {
      a = c; // Update the interval to [c, b]
    }
  }

  // Return the approximate root within the desired precision
  return { root: (a + b) / 2, iterations };
}

function falsiMethod(equation, precision, a, b, maxIterations = 1000) {
  // Define the function based on the equation string
  const f = math.parse(equation).compile();

  let iterations = [];
  let fC = Infinity;
  let c;

  // Iterate until the desired precision is achieved
  for (let i = 0; i < maxIterations && Math.abs(fC) >= precision * 10; i++) {
    const fA = f.evaluate({ x: a });
    const fB = f.evaluate({ x: b });

    c = (a * fB - b * fA) / (fB - fA); // Compute the false position
    fC = f.evaluate({ x: c });
    console.log([a, b, fA, fB, c, fC]);
    let iteration = [a, b, fA, fB, c, fC];
    iterations.push(iteration);

    if (fC === 0) {
      return { root: c, iterations };
    } else if (fA * fC < 0) {
      b = c; // Update the interval to [a, c]
    } else {
      a = c; // Update the interval to [c, b]
    }
  }

  // Return the approximate root within the desired precision
  return {
    root: c,
    iterations,
  };
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
