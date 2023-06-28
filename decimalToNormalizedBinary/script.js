function handleSubmit() {
  let userInputDecimal = parseFloat(
    document.forms["form"]["decimalToConvert"].value
  );

  let answer = decimalToBinaryNormalized(userInputDecimal);
  document.getElementById("answer").innerHTML = answer;
  return false;
}

function decimalToBinaryNormalized(number) {
  // Handle the sign
  var sign = "";
  if (number < 0) {
    sign = "-";
    number = Math.abs(number);
  }

  // Convert the number to binary
  var binary = "";
  var exponent = 0;
  var mantissa = number;

  if (number >= 1) {
    while (mantissa >= 2) {
      mantissa /= 2;
      exponent++;
    }
  } else {
    while (mantissa < 1) {
      mantissa *= 2;
      exponent--;
    }
  }

  // Convert mantissa to binary string
  binary += mantissa.toString(2).substring(1);

  // Construct the normalized notation
  var normalized = sign + "1" + binary + " * 2^" + exponent;

  return normalized;
}
