// Function to calculate the Standard Array based on fixed numbers
function getFixedStandardArrayDND() {
    return [15, 14, 13, 12, 10, 8];
}
function getFixedStandardArrayMARCHEN() {
    return [28, 26, 25, 24, 23, 22, 21, 21, 20, 19, 18, 18, 17, 16, 14, 12];
}
function getFixedStandardArrayTRAVELLER() {
    return [11, 10, 9, 8, 7, 5];
}
function getFixedStandardArrayTRAVELLERSUX() {
  return [10, 8, 7, 6, 5, 4];
}
function getFixedStandardArrayTRAVELLERSUXWITHPSI() {
  return [10, 8, 7, 6, 5, 4];
}


// Function to roll a 6-sided die
function rollD6() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Function to roll a 8-sided die
function rollD8() {
    return Math.floor(Math.random() * 8) + 1;
  }
    
// Function to calculate the Standard Array based on 4d6-drop-the-lowest method
function getRolledStandardArrayForDND() {
  let standardArray = [];

  for (let i = 0; i < 6; i++) {
    let rolls = [rollD6(), rollD6(), rollD6(), rollD6()];
    rolls.sort((a, b) => b - a); // Sort in descending order
    rolls.pop(); // Remove the lowest roll
    let sum = rolls.reduce((a, b) => a + b, 0); // Sum the remaining rolls
    standardArray.push(sum);
  }
  standardArray.sort((a, b) => b - a); // Sort the array in descending order
  return standardArray;
}

// Function to calculate the Standard Array based on 3d6-drop-the-lowest method
function getRolledStandardArrayForTRAVELLER() {
    let standardArray = [];
  
    for (let i = 0; i < 6; i++) {
      let rolls = [rollD6(), rollD6(), rollD6()];
      rolls.sort((a, b) => b - a); // Sort in descending order
      rolls.pop(); // Remove the lowest roll
      let sum = rolls.reduce((a, b) => a + b, 0); // Sum the remaining rolls
      standardArray.push(sum);
    }
    standardArray.sort((a, b) => b - a); // Sort the array in descending order
    return standardArray;
  }

// Function to calculate the Standard Array based on 2d6 method
function getRolledStandardArrayForTRAVELLERSUX() {
  let standardArray = [];

  for (let i = 0; i < 6; i++) {
    let rolls = [rollD6(), rollD6()];
    rolls.sort((a, b) => b - a); // Sort in descending order
    let sum = rolls.reduce((a, b) => a + b, 0); // Sum the remaining rolls
    standardArray.push(sum);
  }
  standardArray.sort((a, b) => b - a); // Sort the array in descending order
  return standardArray;
}
// Function to calculate the Standard Array based on 2d6 method
function getRolledStandardArrayForTRAVELLERSUXWITHPSI() {
  let standardArray = [];

  for (let i = 0; i < 7; i++) {
    let rolls = [rollD6(), rollD6()];
    rolls.sort((a, b) => b - a); // Sort in descending order
    let sum = rolls.reduce((a, b) => a + b, 0); // Sum the remaining rolls
    standardArray.push(sum);
  }
  standardArray.sort((a, b) => b - a); // Sort the array in descending order
  return standardArray;
}

  
  


// Function to calculate the Standard Array based on 5d8-drop-the-lowest method
function getRolledStandardArrayForMARCHEN() {
    let standardArray = [];
  
    for (let i = 0; i < 16; i++) {
      let rolls = [rollD8(), rollD8(), rollD8(), rollD8(), rollD8()];
      rolls.sort((a, b) => b - a); // Sort in descending order
      rolls.pop(); // Remove the lowest roll
      let sum = rolls.reduce((a, b) => a + b, 0); // Sum the remaining rolls
      standardArray.push(sum);
    }
    standardArray.sort((a, b) => b - a); // Sort the array in descending order
    return standardArray;
  }
  
// Initialize variables to hold the sum of ability scores
let sumDNDArray                                                                  = [0, 0, 0, 0, 0, 0];
let sumTRAVELLERArray                                                            = [0, 0, 0, 0, 0, 0];
let sumTRAVELLERSUXArray                                                         = [0, 0, 0, 0, 0, 0];
let sumTRAVELLERSUXArrayWITHPSI                                                  = [0, 0, 0, 0, 0, 0, 0];
let sumMARCHENArray                                                              = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const iterations                                                                 = 10000000;

// Display the fixed Standard Array                                                                                                 
console.log("D&D - Standard Array:",                                               getFixedStandardArrayDND()                      );
console.log("Märchen - Standard Array:",                                           getFixedStandardArrayMARCHEN()                  );
console.log("Traveller - Standard Array:",                                         getFixedStandardArrayTRAVELLER()                );
console.log("Traveller - SUX - Standard Array:",                                   getFixedStandardArrayTRAVELLERSUX()             );

// Run the getRolledStandardArray function 100,000 times and sum up the results
for (let i = 0; i < iterations; i++) {
  let rolledDNDArray =                                                             getRolledStandardArrayForDND();
  let rolledTRAVELLERArray =                                                       getRolledStandardArrayForTRAVELLER();
  let rolledTRAVELLERSUXArray =                                                    getRolledStandardArrayForTRAVELLERSUX();
  let rolledTRAVELLERSUXArrayWITHPSI =                                             getRolledStandardArrayForTRAVELLERSUXWITHPSI();
  let rolledMARCHENArray =                                                         getRolledStandardArrayForMARCHEN();
  for (let j = 0; j < 6; j++) {                       
    sumDNDArray[j] +=                                                              rolledDNDArray[j];
    sumTRAVELLERArray[j] +=                                                        rolledTRAVELLERArray[j];
    sumTRAVELLERSUXArray[j] +=                                                     rolledTRAVELLERSUXArray[j];
  }                                                                                                                                  
  for (let j = 0; j < 7; j++) {                       
    sumDNDArray[j] +=                                                              rolledDNDArray[j];
    sumTRAVELLERArray[j] +=                                                        rolledTRAVELLERArray[j];
    sumTRAVELLERSUXArrayWITHPSI[j] +=                                              rolledTRAVELLERSUXArrayWITHPSI[j];
  }                                                                                                                                  


  for(let j = 0; j < 16; j++) {                       
      sumMARCHENArray[j] +=                                                        rolledMARCHENArray[j];                           
  }                                                                                                                                 
}                                                                                                                                   

// Calculate the average for each ability score
let avgDNDArray                                                                  =                 sumDNDArray.map(sum => sum / iterations);
let avgMARCHENArray                                                              =             sumMARCHENArray.map(sum => sum / iterations);
let avgTRAVELLERArray                                                            =           sumTRAVELLERArray.map(sum => sum / iterations);
let avgTRAVELLERSUXArray                                                         =        sumTRAVELLERSUXArray.map(sum => sum / iterations);
let avgTRAVELLERSUXArrayWITHPSI                                                  = sumTRAVELLERSUXArrayWITHPSI.map(sum => sum / iterations);
                                                                                                                                    
console.log("Average Standard Array over 10,000,000 iterations of D&D:",           avgDNDArray                                     );
console.log("Average Standard Array over 10,000,000 iterations of Märchen:",       avgMARCHENArray                                 );
console.log("Average Standard Array over 10,000,000 iterations of Traveller:",     avgTRAVELLERArray                               );
console.log("Average Standard Array over 10,000,000 iterations of Traveller SUX:", avgTRAVELLERSUXArray                            );
console.log("Average Standard Array over 10,000,000 iterations of Traveller SUX:", avgTRAVELLERSUXArrayWITHPSI                     );