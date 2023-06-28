function handleSubmit() {
  let userInputDecimal = parseFloat(
    document.forms["form"]["decimalToConvert"].value
  );
  let userInputBits = parseInt(document.forms["form"]["bitSize"].value);

  let answer = decimalToIEEE754(userInputDecimal, userInputBits);
  document.getElementById("answer").innerHTML = answer;
  return false;
}

function decimalToIEEE754(number, bits) {
  let buffer = new ArrayBuffer(bits / 8);
  let floatArray =
    bits === 32 ? new Float32Array(buffer) : new Float64Array(buffer);
  floatArray[0] = number;

  let uintArray =
    bits === 32 ? new Uint32Array(buffer) : new BigUint64Array(buffer);
  let binary = uintArray[0].toString(2).padStart(bits, "0");

  let sign = binary[0];
  let exponent = binary.substring(1, bits === 32 ? 9 : 12);
  let mantissa = binary.substring(bits === 32 ? 9 : 12);

  return `${sign}-${exponent}-${mantissa}`;
}
