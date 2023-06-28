function round(number, decimalPlaces) {
  let h = 10 ** decimalPlaces;
  return Math.round(number * h) / h;
}

function handleSubmit() {
  try {
    let systemOfEquationsInput = document.forms["form"][
      "systemOfEquations"
    ].value
      .replace(" ", "")
      .split("\n");

    let systemOfEquations = [];
    for (equation of systemOfEquationsInput) {
      let coefficients = [];
      console.log(equation);
      for (e of equation.split(",")) {
        coefficients.push(parseFloat(e));
      }
      systemOfEquations.push(coefficients);
    }

    let firstAssumptions = document.forms["form"]["firstAssumptions"].value
      .split(",")
      .map((number) => parseFloat(number));

    var precision = 0.001;

    let jacobiAnswer = jacobiMethod(
      systemOfEquations,
      precision,
      firstAssumptions
    );

    console.log(jacobiAnswer);

    displaySolutions(jacobiAnswer.solution);
    displayIterationsTable(jacobiAnswer.iterationResults);
  } catch (error) {
    console.log(error);
  }

  return false;
}

function displaySolutions(solution) {
  let variables = ["x", "y", "z"];
  let solutionsHTML = "";
  for (v in variables) {
    solutionsHTML += `${variables[v]} ≈ ${round(solution[v], 3)}, `;
  }

  document.getElementById("solutions").innerHTML = solutionsHTML;
}

function displayIterationsTable(iterations) {
  let table = "<tr><th>i</th><th>x</th><th>y</th><th>z</th></tr>";

  for (let i in iterations) {
    table += `<tr><td>${parseInt(i) + 1}</td>`;
    for (let j in iterations[i]) {
      table += `<td>${round(iterations[i][j], 5)}</td>`;
    }
    table += "</tr>";
  }
  console.log(table);
  document.getElementById("table").innerHTML = table;
}

function jacobiMethod(equations, precision, initialAssumption) {
  var numEquations = equations.length;
  var numVariables = equations[0].length - 1; // Last column is the constant term
  var solution = initialAssumption.slice(); // Use initial assumption as the starting solution
  var prevSolution = new Array(numVariables).fill(0); // Initialize previous solution array with zeros
  var iteration = 0;
  var iterationResults = []; // Array to store the results of each iteration

  while (true) {
    iteration++;
    for (var i = 0; i < numEquations; i++) {
      var sum = 0;
      for (var j = 0; j < numVariables; j++) {
        if (j !== i) {
          sum += equations[i][j] * prevSolution[j];
        }
      }
      solution[i] = (equations[i][numVariables] - sum) / equations[i][i];
    }

    var maxDiff = Math.abs(solution[0] - prevSolution[0]);
    for (var k = 1; k < numVariables; k++) {
      var diff = Math.abs(solution[k] - prevSolution[k]);
      if (diff > maxDiff) {
        maxDiff = diff;
      }
    }

    iterationResults.push(solution.slice()); // Store current solution in the iteration results array

    if (maxDiff < precision) {
      break;
    }

    prevSolution = solution.slice(); // Update previous solution with current solution
  }

  return { solution, iteration, iterationResults };
}
