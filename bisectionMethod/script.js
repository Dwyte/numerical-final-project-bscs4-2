function handleSubmit() {
  try {
    let equationInput = document.forms["form"]["equation"].value;
    let precisionInput = parseFloat(document.forms["form"]["precision"].value);
    let xLeftInitial = parseFloat(document.forms["form"]["xLeftInitial"].value);
    let xRightInitial = parseFloat(
      document.forms["form"]["xRightInitial"].value
    );

    const { root, iterations } = bisectionMethod(
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
      ["i", "XL", "XR", "f(XL)", "f(XR)", "XM", "f(XM)"],
      iterations.map((iteration) =>
        iteration.map((num) => num.toFixed(decimalPlaces))
      )
    );
  } catch (error) {
    console.log(error);
  }

  return false;
}

function bisectionMethod(equation, precision, a, b) {
  // Define the function based on the equation string
  const f = math.parse(equation).compile();

  let iterations = [];

  // Iterate until the desired precision is achieved
  while (b - a > precision) {
    const c = (a + b) / 2; // Compute the midpoint

    const fA = f.evaluate({ x: a });
    const fB = f.evaluate({ x: b });
    const fC = f.evaluate({ x: c });

    if (fC === 0) {
      return { root: c, iterations };
    } else if (fA * fC < 0) {
      b = c; // Update the interval to [a, c]
    } else {
      a = c; // Update the interval to [c, b]
    }

    let iteration = [a, b, fA, fB, c, fC];
    iterations.push(iteration);
  }

  // Return the approximate root within the desired precision
  return { root: (a + b) / 2, iterations };
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
