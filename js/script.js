let boxes = document.querySelectorAll(".box");
let wrapper = document.querySelector(".wrapper");
let currentIcon = 0;
let winX = 0;
let win0 = 0;

keyGame();
document.querySelector("button.restart").addEventListener("click", () => {
  restart();
});

function restart() {
  winX = 0;
  win0 = 0;
  updateScore(2);
  boxes.forEach((box) => {
    controlIcon(box, "");
  });
  restopWork();
  removeLine();
}

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    writeIn(box);
    checkWin();
  });
});

function keyGame() {
  document.addEventListener("keydown", function (e) {
    if (e.code == "KeyR") {
      restart();
    }
    // ===============================
    //     let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
    //     if (numbers.includes(e.key)) {
    //       writeIn(document.querySelector(`[data-number=box${e.key}]`));
    //       checkWin();
    //     }
  });
}

function writeIn(box) {
  if (!box.getAttribute("data-icon")) {
    // Нажимают на пустую клетку
    if (currentIcon === 0) {
      currentIcon = 1;
      controlIcon(box, "X");
    } else {
      currentIcon = 0;
      controlIcon(box, "0");
    }
  } else {
    // Нажимают на не пустую клетку
    alertBox(box);
  }
}

// Функция проверяющая победу
function checkWin() {
  i = 0;
  //                   г    в         г         в    г    в
  let combinations = [123, 147, 159, 456, 357, 258, 789, 369];
  for (let comb = 0; comb < combinations.length; comb++) {
    if (checkCombination(combinations[comb])) {
      //Определяем победил крест или ноль
      let winIcon = document.querySelector(`[data-number=box${String(combinations[comb]).split('')[0]}]`).getAttribute('data-icon');
      printTitle("Win " + winIcon);
      if (winIcon == "X") {
        winX += 1;
        updateScore(1);
      } else {
        win0 += 1;
        updateScore(0);
      }
      stopWork();
      printLine(combinations[comb]);
      buffer();
      break;
    } else {
      let sumIcon = 0;
      boxes.forEach((box) => {
        if (box.getAttribute("data-icon")) sumIcon += 1;
      });
      if (sumIcon === 9) {
        i++;
        if (i === 8) {
          printTitle("Draw");
          winX += 1;
          win0 += 1;
          updateScore(2);
          stopWork();
          buffer();
        }
      }
    }
  }
}

// true - если каждый элемент комбинации равен либо Х либо 0 и false - если не равен или пуст
function checkCombination(i) {
  let numbers = String(i).split(""); //создаем массив из трех цифра числа i
  let result = true;

  numbers.forEach((number) => {
    //если хоть один элемент пуст, возвращаем false
    if (
      !document
        .querySelector(`[data-number=box${number}]`)
        .getAttribute("data-icon")
    ) {
      result = false;
    }
  });

  let resultValue = document
    .querySelector(`[data-number=box${numbers[0]}]`)
    .getAttribute("data-icon");

  for (let number = 1; number <= 3; number++) {
    if (
      document
        .querySelector(`[data-number=box${numbers[number - 1]}]`)
        .getAttribute("data-icon") == resultValue
    ) {
      continue;
    } else {
      result = false;
      break;
    }
  }
  return result;
}

function printTitle(text) {
  document.querySelector("h1.title").style.opacity = 0;
  setTimeout(() => {
    document.querySelector("h1.title").innerHTML = text;
    document.querySelector("h1.title").style.opacity = 1;
  }, 300);
}

function updateScore(status) {
  let elementWinX = document.querySelector(".winX");
  let elementWin0 = document.querySelector(".win0");

  elementWinX.style.transition = "0.5s";
  elementWin0.style.transition = "0.5s";
  if (status === 0) {
    elementWin0.style.opacity = 0;
    elementWin0.style.transform = "translateY(-40px)";
  }
  if (status === 1) {
    elementWinX.style.opacity = 0;
    elementWinX.style.transform = "translateY(-40px)";
  }
  if (status === 2) {
    elementWin0.style.opacity = 0;
    elementWin0.style.transform = "translateY(-40px)";
    elementWinX.style.opacity = 0;
    elementWinX.style.transform = "translateY(-40px)";
  }

  setTimeout(() => {
    if (status === 0) {
      elementWin0.innerHTML = win0;
      elementWin0.style.opacity = 1;
      elementWin0.style.transform = "translateY(0px)";
    }
    if (status === 1) {
      elementWinX.innerHTML = winX;
      elementWinX.style.opacity = 1;
      elementWinX.style.transform = "translateY(0px)";
    }
    if (status === 2) {
      elementWin0.innerHTML = win0;
      elementWin0.style.opacity = 1;
      elementWin0.style.transform = "translateY(0px)";

      elementWinX.innerHTML = winX;
      elementWinX.style.opacity = 1;
      elementWinX.style.transform = "translateY(0px)";
    }
  }, 500);
}

function stopWork() {
  boxes.forEach((box) => {
    box.style.pointerEvents = "none";
  });

  wrapper.style.opacity = "0.6";
}

function restopWork() {
  boxes.forEach((box) => {
    box.style.pointerEvents = "auto";
    controlIcon(box, "");
  });
  document.querySelector(".wrapper").style.opacity = "";
}

function printLine(comb) {
  let numbers = String(comb).split("");
  let elementLine = document.querySelector(".winLine");
  // Для горизонтальных
  if (Number(numbers[1]) - Number(numbers[0]) === 1) {
    elementLine.style.width = "95%";
    elementLine.style.height = "4px";
    elementLine.style.top =
      document.querySelector(`[data-number=box${numbers[0]}]`).offsetTop +
      document.querySelector(`[data-number=box${numbers[0]}]`).offsetHeight /
        2 -
      2 +
      "px";
    elementLine.style.left = (wrapper.offsetWidth * 0.05) / 2 + "px";
    elementLine.style.transform = "";
  }
  // Для вертикальных
  else if (Number(numbers[1]) - Number(numbers[0]) === 3) {
    elementLine.style.width = "4px";
    elementLine.style.height = "95%";
    elementLine.style.top = (wrapper.offsetHeight * 0.05) / 2 + "px";
    elementLine.style.left =
      document.querySelector(`[data-number=box${numbers[0]}]`).offsetLeft +
      document.querySelector(`[data-number=box${numbers[0]}]`).offsetWidth / 2 -
      2 +
      "px";
    elementLine.style.transform = "";
  }
  // Наискось
  else if (comb === 159 || comb === 357) {
    let width = Math.floor((2 / Math.sqrt(2)) * wrapper.offsetWidth * 0.95);

    elementLine.style.width = width + "px";
    elementLine.style.height = "4px";
    elementLine.style.top = wrapper.offsetHeight * 0.5 - 1 + "px";
    // elementLine.style.left = "-" + Math.round(((1 - Math.sqrt(2) / 2) * width) / 2 - 8) + "px";
    elementLine.style.left = '-52px';
    elementLine.style.transform =
      comb === 159 ? "rotateZ(45deg)" : "rotateZ(-45deg)";
  }
  elementLine.classList.add("active");
  setTimeout(() => {
    elementLine.style.transition = "0.3s";
    elementLine.style.backgroundColor = "red";
  }, 1);
}

function removeLine() {
  let elementLine = document.querySelector(".winLine");
  elementLine.classList.remove("active");
  elementLine.style.transition = "";
  elementLine.style.backgroundColor = "";
}

function buffer() {
  let buffer = document.createElement("div");
  buffer.classList.add("buffer");
  wrapper.append(buffer);
  document.addEventListener("keydown", function (e) {
    if (e.code == "Enter" || e.code == "Space") {
      restopWork();
      removeLine();
      buffer.remove();
    }
  });
  buffer.addEventListener("click", () => {
    restopWork();
    removeLine();
    buffer.remove();
  });
}

function controlIcon(el, content) {
  el.setAttribute("data-icon", content);
  if (content == "0") {
    let circle = document.createElement("div");
    circle.classList.add("icon-circle");
    el.prepend(circle);
    setTimeout(() => {
      el.querySelector(".icon-circle").style.border =
        "7px solid rgba(59, 65, 219, 0.95)";
    }, 1);
  } else if (content == "" && el.querySelector(".icon-circle")) {
    el.querySelector(".icon-circle").remove();
  }
}

function alertBox(box) {
  box.classList.add('alert');
  setTimeout(() => {
    box.classList.remove('alert');
  }, 1000);
}
//

let gridLinesV = document.querySelectorAll(
  ".gridLine[data-position = vertical]"
);
gridLinesV.forEach((el) => {
  el.style.width = "4px";
  el.style.height = "95%";
});
gridLinesV[0].style.left =
  wrapper.offsetWidth / 3 - gridLinesV[0].offsetWidth / 2 + "px";
gridLinesV[0].style.top =
  (wrapper.offsetHeight - gridLinesV[0].offsetHeight) / 2 + "px";
gridLinesV[1].style.left =
  (wrapper.offsetWidth / 3) * 2 - gridLinesV[0].offsetWidth / 2 + "px";
gridLinesV[1].style.top =
  (wrapper.offsetHeight - gridLinesV[0].offsetHeight) / 2 + "px";

let gridLinesH = document.querySelectorAll(
  ".gridLine[data-position = horizontal]"
);
gridLinesH.forEach((el) => {
  el.style.height = "4px";
  el.style.width = "95%";
});

gridLinesH[0].style.left =
  (wrapper.offsetWidth - gridLinesH[0].offsetWidth) / 2 + "px";
gridLinesH[0].style.top =
  wrapper.offsetHeight / 3 - gridLinesH[0].offsetHeight / 2 + "px";
gridLinesH[1].style.left =
  (wrapper.offsetWidth - gridLinesH[0].offsetWidth) / 2 + "px";
gridLinesH[1].style.top =
  (wrapper.offsetHeight / 3) * 2 - gridLinesH[0].offsetHeight / 2 + "px";
