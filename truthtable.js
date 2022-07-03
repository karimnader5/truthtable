let sentenceLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M','N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
let connectors = ['¬', '∧', '∨', '→', '↔'];
let counter = 0; 
let solutionArray=[];

// TO DO: ACCEPT ALTERNATIVE CONNECTORS, CHECK FOR ERRORS (FORMULA BEGINS WITH CONNECTOR OTHER THAN NOT, FORMULA ENDS WITH CONNECTOR, MORE THAN ONE ATOMIC SENTENCE BACK TO BAK )

// THIS FUNCTION ADDS PARANTHESES IF THEY ARE MISSING FROM THE INPUT AND PRIORITIING THE CONNECTORS THAT HAVE PRIORITY 

function standardize(str) {

  str = str.toUpperCase();

  altNot1=/~/g;
  altNot2=/(NOT-)/g;
  str = str.replace(altNot1, "¬");
  str = str.replace(altNot2, "¬");

  altAnd1=/&/g;
  altAnd2=/(AND)/g;
  str = str.replace(altAnd1, "∧");
  str = str.replace(altAnd2, "∧");

  altOr=/(OR)/g;
  str = str.replace(altOr, "∨")

  altIff1=/(<>)/g;
  altIff2=/(IFF)/g;
  str = str.replace(altIff1, "↔");
  str = str.replace(altIff2, "↔");

  altIf1=/>/g;
  altIf2=/(THEN)/g;
  str = str.replace(altIf1, "→");
  str = str.replace(altIf2, "→");

  blankSpace = /\s/g;
  str = str.replace(blankSpace, "");

  negation = /¬(\w)/g;
  str = str.replace(negation, "(¬$1)");

  bigNegation = /¬(\()(.*?)(\))/g;
  str = str.replace(bigNegation, "(¬$1$2$3)");

  connector1 = /(\w|\(¬\w\))(∧|∨)(\w|\(¬\w\))/g;
  str = str.replace(connector1, "($1$2$3)");

  connector2 = /(\w|\(¬\w\))(→|↔)(\w|\(¬\w\))/g;
  str = str.replace(connector2, "($1$2$3)");

  bigconnector1 = /(\(+.*?\)|\w)(∧|∨)(\(.*?\)+|\w)/g;
  str = str.replace(bigconnector1, "($1$2$3)");

  bigconnector2 = /(\(+.*?\)|\w)(→|↔)(\(.*?\)+|\w)/g;
  str = str.replace(bigconnector2, "($1$2$3)");

  console.log(str);

  return(str);

}


// This function counts the number of unique letters and adds them to the array headerArray 

function numberOfheaderArray(input) {
  arrayOfInput = [...input];
  for (let i=0; i<arrayOfInput.length; i++) {
    if (sentenceLetters.includes(arrayOfInput[i]) == true && (headerArray.includes(arrayOfInput[i]) == false)) {
      headerArray.push(arrayOfInput[i]);
      counter = counter + 1;
    }
  }
  return counter;
}

// Now let's make a table with all acceptable truth values. This gives us an array of all unique letters (headerArray) and an array with their corresponding truth values (truthValueArray)

function makeTruthValueArray() {
  for (let j=0; j<headerArray.length; j++) {
    let square = (2**(headerArray.length));
    truthValueArray[j] = new Array ();
      for (l=0; l<(2**j); l++) {
        for (let k=0; k<(square/(2**(j+1))); k++) {
          truthValueArray[j].push("T");
        }
        for (let k=0; k<(square/(2**(j+1))); k++) {
          truthValueArray[j].push("F");  
        }
      }
    } 
  }


// THIS FUNCTION CREATES SUBSECTIONS FOR EACH SECTION BETWEEN PARANTHESES KEEPING THE ORDER OF THE SUBSECTIONS IN AN ARRAY CALLED SUBSECTIONS THAT EACH CONTAIN ONE MAIN CONNECTOR

function subsection(arr) {

  for (let i = 0; i<arr.length; i++) {
    if (arr[i] == ")") {
      for (let j = i; j>=0; j--) {
        if (arr[j] == "(") {
          let sub = arr.slice(j, (i+1));
          console.log(sub);
          if(sub.includes('¬')||sub.includes('∧')||sub.includes('∨')||sub.includes('→')||sub.includes('↔')){
            let range = (i-j+1);
            let subString = sub.join('');
            let newArr = arr.splice((j), range, subString);
            subsections.push(newArr);
            headerArray.push(subString);
            subsection(arr);

          }
          else {
            arr.splice(i, 1);
            arr.splice(j, 1);
            subsection(arr);
          }
        }
      }
    }
  }
}

// THIS FUNCTION DOES A LOT: 
// FIRST, IT GOES THROUGH THE ARRAY "SUBSECTIONS" THAT CONTAINS EACH SUBSECTION IN THE ORDER THEY SHOULD BE PROCESSED
// SECOND, IT IDENTIFIES THE MAIN CONNECTOR IN THAT SUBSECTION 
// THIRD, IT IDENTIFIES WHAT ELEMENTS THE MAIN CONNECTOR APPLIES TO AND CHECKS FOR THEIR TRUTH VALUES 
// FOURTH, IT CREATES AN ARRAY CONTAINING ALL OF THE NEW SUBSECTION IT PROCESSED (headerArray) AND A CORRESPONDING ARRAY WITH THEIR TRUTH VALUES (truthValueArray)

function cleanSubsesctions(arr) {
  for (let i = 0; i<arr.length; i++) {
  let sub = arr[i];
  console.log("This section is getting cleaned: " + sub);
    // IF THE MAIN CONNECTOR IS A NEGATION 
    if (sub.includes("¬")==true) {
      //headerArray.push(sub.join(""));
      let newTruthValues = [];
      // IDENTIFY THE NEGATED ELEMENT: sub[j+1]
      for(let j=0; j<sub.length; j++) {
        if(sub[j]=="¬") {
          //
          for(k=0;k<headerArray.length;k++) {
            if(sub[j+1]==headerArray[k]){
              for(l=0;l<truthValueArray[k].length;l++) {
                if(truthValueArray[k][l]=='T') {
                  newTruthValues.push("F");
                }
                else {
                  newTruthValues.push("T");
                }
              }
            }
          } 
        }
      }
      truthValueArray.push(newTruthValues);
    }

    // IF THE MAIN CONNECTOR IS A DISJUNCTION 
    if (sub.includes("∨")==true) {
      //headerArray.push(sub.join(""));
      let newTruthValues = [];
      // IDENTIFY THE DISJUNCTED ELEMENS: sub[j+1] and sub[j-1]
      for(let j=0; j<sub.length; j++) {
        if(sub[j]=="∨") {
            if((headerArray.includes(sub[j-1])) && (headerArray.includes(sub[j-1]))) {
                let index1 = headerArray.indexOf(sub[j-1]);
                let index2 = headerArray.indexOf(sub[j+1]);
                for(l=0;l<truthValueArray[0].length;l++) {
                  if(truthValueArray[index1][l]=='T'||truthValueArray[index2][l]=='T') {
                    newTruthValues.push("T");
                  }
                  else {
                    newTruthValues.push("F");
              }
            }
          }
        }
      }
      truthValueArray.push(newTruthValues);
    }

    // IF THE MAIN CONNECTOR IS A CONJUNCTION  
    if (sub.includes("∧")==true) {
      //headerArray.push(sub.join(""));
      let newTruthValues = [];
      // IDENTIFY THE DISJUNCTED ELEMENS: sub[j+1] and sub[j-1]
      for(let j=0; j<sub.length; j++) {
        if(sub[j]=="∧") {
            if((headerArray.includes(sub[j-1])) && (headerArray.includes(sub[j-1]))) {
                let index1 = headerArray.indexOf(sub[j-1]);
                let index2 = headerArray.indexOf(sub[j+1]);
                for(l=0;l<truthValueArray[0].length;l++) {
                  if(truthValueArray[index1][l]=='F'||truthValueArray[index2][l]=='F') {
                    newTruthValues.push("F");
                  }
                  else {
                    newTruthValues.push("T");
              }
            }
          }
        }
      }
    truthValueArray.push(newTruthValues);
    }

    // IF THE MAIN CONNECTOR IS AN IFF   
    if (sub.includes("↔")==true) {
      //headerArray.push(sub.join(""));
      let newTruthValues = [];
      // IDENTIFY THE DISJUNCTED ELEMENS: sub[j+1] and sub[j-1]
      for(let j=0; j<sub.length; j++) {
        if(sub[j]=="↔") {
            if((headerArray.includes(sub[j-1])) && (headerArray.includes(sub[j-1]))) {
                let index1 = headerArray.indexOf(sub[j-1]);
                let index2 = headerArray.indexOf(sub[j+1]);
                for(l=0;l<truthValueArray[0].length;l++) {
                  if((truthValueArray[index1][l]=='T' &&truthValueArray[index2][l]=='T')||(truthValueArray[index1][l]=='F' &&truthValueArray[index2][l]=='F')) {
                    newTruthValues.push("T");
                  }
                  else {
                    newTruthValues.push("F");
                  }
              }
            }
          }
        }
    truthValueArray.push(newTruthValues);
    }

    // IF THE MAIN CONNECTOR IS AN IFF   
    if (sub.includes("→")==true) {
      //headerArray.push(sub.join(""));
      let newTruthValues = [];
      // IDENTIFY THE IFF ELEMENS: sub[j+1] and sub[j-1]
      for(let j=0; j<sub.length; j++) {
        if(sub[j]=="→") {
            if((headerArray.includes(sub[j-1])) && (headerArray.includes(sub[j-1]))) {
                let index1 = headerArray.indexOf(sub[j-1]);
                let index2 = headerArray.indexOf(sub[j+1]);
                for(l=0;l<truthValueArray[0].length;l++) {
                  if(truthValueArray[index1][l]=='F'||(truthValueArray[index1][l]=='T' &&truthValueArray[index2][l]=='T')) {
                    newTruthValues.push("T");
                  }
                  else {
                    newTruthValues.push("F");
                  }
              }
            }
          }
        }
    truthValueArray.push(newTruthValues);
    }
  }
}

// MAKING THE VARIOUS TABLES

function makeTableHead() {
tableHead = tableHead + "<table class='table table-hover'>";
tableHead = tableHead + "<thead class='thead-dark'>"
  for (let i=0; i<headerArray.length; i++) {
    tableHead = tableHead + "<th>" + headerArray[i] + "</th>";
  }
tableHead = tableHead + "</thead>"
}

function makeTableBody() {
  for (let i=0; i<truthValueArray[0].length; i++) {
    tableBody = tableBody + "<tr>";
    for (let j=0; j<counter; j++){
      tableBody = tableBody + "<td class='table-active'>" + truthValueArray[j][i] + "</td>";
    }
    for (let j=counter; j<truthValueArray.length; j++){
      tableBody = tableBody + "<td>" + truthValueArray[j][i] + "</td>";
    }
    tableBody = tableBody + "</tr>";
  }
  tableBody = tableBody + "</table>";
}

function makeExerciseBody() {
  for (let i=0; i<truthValueArray[0].length; i++) {
    tableBody = tableBody + "<tr>";
    for (let j=0; j<counter; j++){
      tableBody = tableBody + "<td class='table-active'>" + truthValueArray[j][i] + "</td>";
    }
    for (let j=counter; j<truthValueArray.length; j++){
      console.log(counter);
      tableBody = tableBody + " <td id='"+i+j+"'>" + "<div class='form-check form-check-inline'>" + "<input type='radio' id='" +i+j+"t' name='answer"+i+j+"'><label for='" +i+j+"t'>True</label><br><input type='radio' id='"+i+j+"f' value='F'name='answer"+i+j+"'><label for='" +i+j+"f' >False</label><br>" + "</div>" + "</td>";
      console.log(i);
      console.log(j);
    }
    tableBody = tableBody + "</tr>";
  }
  tableBody = tableBody + "</table>";
}

function makeSolution() {
  console.log(truthValueArray);
  for (let i=0; i<truthValueArray[0].length; i++) {
    for (let j=counter; j<truthValueArray.length; j++){
      let id = ""+i+j;
      let idt = ""+ i + j + 't';
      if(document.getElementById(idt) !== null ){
        if(document.getElementById(idt).checked) {
          console.log("test true");
          solutionArray.push("T");
          if(truthValueArray[j][i] == "T") {
            console.log("correct");
            document.getElementById(id).style.backgroundColor = "#28a745"
            document.getElementById(id).style.borderRadius = "5px";
            document.getElementById(id).style.color = "white";
            document.getElementById(id).style.border = "solid 1px white";
          }
          else {
            console.log("incorrect");
            document.getElementById(id).style.backgroundColor = "#dc3545";
            document.getElementById(id).style.borderRadius = "5px";
            document.getElementById(id).style.color = "white";
            document.getElementById(id).style.border = "solid 1px white";
          }
        };
      let idf = ""+ i + j + 'f';
      if(document.getElementById(idf) !== null ){
        if(document.getElementById(idf).checked) {
          console.log("test false");
          solutionArray.push("F");
          if(truthValueArray[j][i] == "F") {
            console.log("correct");
            document.getElementById(id).style.backgroundColor = "#28a745";
            document.getElementById(id).style.borderRadius = "5px";
            document.getElementById(id).style.color = "white";
            document.getElementById(id).style.border = "solid 1px white";
          }
          else {
            console.log("incorrect");
            document.getElementById(id).style.backgroundColor = "#dc3545";
            document.getElementById(id).style.borderRadius = "5px";
            document.getElementById(id).style.color = "white";
            document.getElementById(id).style.border = "solid 1px white";
          }
      }
    }
  }
}
  }
}

function compareSolution() {

}

//ERRORS 
function checkError () {
  if(headerArray.length != truthValueArray.length) {
    tableBody = "<div class='alert alert-danger' role='alert'>Did you forget a paranthesis?</div>";
  }
}

// FUNCTION FOR EACH BUTTON 

function myFunction() {
  subsections =[];
  headerArray = [];
  truthValueArray=[];
  tableHead = "";
  tableBody = "";
  counter=0;
  let userFormula = document.getElementById("formula").value;
  let tt = document.getElementById("tt");
  standardize(userFormula);
  standardFormula = standardize(userFormula);
  numberOfheaderArray(standardFormula);
  makeTruthValueArray();
  array = [...standardFormula];
  array.unshift("(");
  array.push(")");
  console.log(array);
  subsection(array);
  console.log(subsections);
  console.log(headerArray);
  cleanSubsesctions(subsections);
  makeTableBody();
  makeTableHead();
  checkError();
  tt.innerHTML = (tableHead + tableBody);
  console.log(truthValueArray);
  console.log(headerArray);
}

function makeExercise() {
  subsections =[];
  headerArray = [];
  truthValueArray=[];
  tableHead = "";
  tableBody = "";
  counter = 0;
  let userFormula = document.getElementById("formula").value;
  let tt = document.getElementById("tt");
  standardize(userFormula);
  standardFormula = standardize(userFormula);
  numberOfheaderArray(standardFormula);
  makeTruthValueArray();
  array = [...standardFormula];
  array.unshift("(");
  array.push(")");
  subsection(array);
  cleanSubsesctions(subsections);
  makeExerciseBody();
  makeTableHead();
  tt.innerHTML = (tableHead + tableBody);
  console.log(truthValueArray);
}

function checkSolution() {
  makeSolution();
  console.log(solutionArray);
}

// CONNECTOR BUTTONS

function not() {
  let text = document.getElementById("formula");
  text.value = text.value + '¬';  
}
function and() {
  let text = document.getElementById("formula");
  text.value = text.value + '∧';  
}
function or() {
  let text = document.getElementById("formula");
  text.value = text.value + '∨';  
}
function ifthen() {
  let text = document.getElementById("formula");
  text.value = text.value + '→';  
}
function iff() {
  let text = document.getElementById("formula");
  text.value = text.value + '↔';  
}

//TEST 

