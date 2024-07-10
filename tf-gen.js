const { removeStopwords } = require("stopword");
const removePunc = require("remove-punctuation");

let documents = [];
const fs = require("fs");
const path = require("path");
// const { Console } = require("console");
// const { FORMERR } = require("dns");
const N = 2874;
for (let i = 1; i <= N; i++) {
  const str = path.join(__dirname, "Problems");
  const str1 = path.join(str, `problem_text_${i}.txt`);
  console.log(str1);
  const question = fs.readFileSync(str1).toString();
  //   console.log(question);
  documents.push(question);
  // console.log(str1);
}

let docKeywords = [];
for (let i = 0; i < documents.length; i++) {
  const lines = documents[i].split("\n");
  // console.log(lines);
  const docWords = [];
  for (let k = 0; k < lines.length; k++) {
    const temp1 = lines[k].split(" ");

    temp1.forEach((e) => {
      e = e.split("\r");
      if (e[0].length) docWords.push(e[0]);
    });
  }
  // const oldString = documents[i].split(" ");
  const newString = removeStopwords(docWords);
  newString.sort();
  let temp = [];
  for (let j = 0; j < newString.length; j++) {
    newString[j] = newString[j].toLowerCase();
    newString[j] = removePunc(newString[j]);
    if (newString[j] !== "") temp.push(newString[j]);
  }

  docKeywords.push(temp);
}

// // console.log(docKeywords[4]);

let sum = 0;

for (let i = 0; i < N; i++) {
  const length = docKeywords[i].length;
  sum += length;
  fs.appendFileSync("length.txt", length + "\n");
  console.log(length);
}

// // console.log("LENGTH DONE");
// console.log(sum / N);

let keywords = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < docKeywords[i].length; j++) {
    if (keywords.indexOf(docKeywords[i][j]) === -1)
      keywords.push(docKeywords[i][j]);
  }
}

keywords.sort();
// // // console.log(keywords);
const W = keywords.length;
keywords.forEach((word) => {
  fs.appendFileSync("keywords.txt", word + "\n");
});

// // console.log(W);
let TF = new Array(N);
for (let i = 0; i < N; i++) {
  TF[i] = new Array(W).fill(0); //making all zero
  let map = new Map();
  docKeywords[i].forEach((key) => {
    return map.set(key, 0);
  });

  //   // console.log(map);
  docKeywords[i].forEach((key) => {
    let cnt = map.get(key);
    cnt++;
    return map.set(key, cnt);
  });

  //   // console.log(map);
  docKeywords[i].forEach((key) => {
    const id = keywords.indexOf(key);
    if (id !== -1) {
      TF[i][id] = map.get(key) / docKeywords[i].length;
    }
  });
}

// // // console.log(keywords);
// console.log("TF cal done");
for (let i = 0; i < N; i++) {
  for (let j = 0; j < W; j++) {
    if (TF[i][j] != 0)
      fs.appendFileSync("TF.txt", i + " " + j + " " + TF[i][j] + "\n");
  }

  // fs.appendFileSync("TFIDF.txt", '\n'.toString());
}

// // console.log("TF Call done!");

let IDF = new Array(W);
for (let i = 0; i < W; i++) {
  let cnt = 0;
  for (let j = 0; j < N; j++) {
    if (TF[j][i]) {
      cnt++;
    }
  }

  if (cnt) IDF[i] = Math.log((N - cnt + 0.5) / (cnt + 0.5) + 1) + 1;
}

// // console.log("IDF cal done");

IDF.forEach((word) => {
  fs.appendFileSync("IDF.txt", word + "\n");
});
