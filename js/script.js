const box = document.querySelector(".box");

let winX = 0,
  win0 = 0;

// [0, 1] = [0, x]
let currSign = Math.round(Math.random());

box.addEventListener("click", (e) => {
  let item = e.target.closest(".item");
  if (!item) return;

  if (box.classList.contains("box-restart")) {
    reloadGame();
    return;
  }

  if (!item.classList.contains("sign")) {
    giveSignToItem(item, currSign);
    currSign = currSign ? 0 : 1;

    let [winComb, sign] = getWinCombs();
    if (winComb) {
      // Win X or 0
      setTitle(sign);

      sign ? ++winX : ++win0;
      updateScore();
      box.classList.add("box-restart");
      lightWinComb(winComb);
    } else if (box.querySelectorAll(".item.sign").length === 9) {
      // Draw
      setTitle(2);

      ++win0;
      ++winX;
      updateScore();
      box.classList.add("box-restart");
    }
  } else if (!item.classList.contains("alert")) {
    alertItem(item);
  }
});

document.querySelector(".btn-restart").addEventListener("click", () => {
  reloadGame();

  winX = win0 = 0;
  updateScore();
  setTitle();
});

function getWinCombs() {
  const itemsCrosses = document.querySelectorAll(".item.sign.cross");
  const itemsNoughts = document.querySelectorAll(".item.sign.nought");

  if (itemsCrosses.length <= 2 && itemsNoughts.length <= 2)
    return [false, false];
  const winCombs = ["123", "456", "789", "147", "258", "369", "159", "357"];

  let combsCrosses = [...itemsCrosses].map((el) => el.dataset.id);
  let combsNoughts = [...itemsNoughts].map((el) => el.dataset.id);

  let answer;
  for (let winComb of winCombs) {
    if (
      combsCrosses.includes(winComb[0]) &&
      combsCrosses.includes(winComb[1]) &&
      combsCrosses.includes(winComb[2])
    ) {
      answer = [winComb, 1];
    }
  }

  if (!answer) {
    for (let winComb of winCombs) {
      if (
        combsNoughts.includes(winComb[0]) &&
        combsNoughts.includes(winComb[1]) &&
        combsNoughts.includes(winComb[2])
      ) {
        answer = [winComb, 0];
      }
    }
  }

  return answer || [false, false];
}

function giveSignToItem(el, sign) {
  el.classList.add("sign", sign ? "cross" : "nought");

  const elSign = document.createElement("div");
  elSign.classList.add(sign ? "icon-cross" : "icon-nought");
  el.prepend(elSign);
}

function alertItem(el) {
  el.classList.add("alert");
  setTimeout(() => {
    el.classList.remove("alert");
  }, 1500);
}

function setTitle(st = 3) {
  const title = document.querySelector(".title");
  const content = ["Win 0", "Win X", "Draw", "x0"];

  title.style.opacity = 0;
  setTimeout(() => {
    title.innerHTML = content[st];
    title.style.opacity = 1;
  }, 300);
}

function updateScore() {
  const elWinX = document.querySelector(".winX");
  const elWin0 = document.querySelector(".win0");

  elWinX.style.transition = "0.5s";
  elWin0.style.transition = "0.5s";

  if (elWinX.innerHTML != winX) {
    elWinX.style.opacity = 0;
    elWinX.style.transform = "translateY(-40px)";
    setTimeout(() => {
      elWinX.innerHTML = winX;
      elWinX.style.opacity = 1;
      elWinX.style.transform = "translateY(0px)";
    }, 500);
  }
  if (elWin0.innerHTML != win0) {
    elWin0.style.opacity = 0;
    elWin0.style.transform = "translateY(-40px)";
    setTimeout(() => {
      elWin0.innerHTML = win0;
      elWin0.style.opacity = 1;
      elWin0.style.transform = "translateY(0px)";
    }, 500);
  }
}

function reloadGame() {
  box.classList.remove("box-restart");

  const items = document.querySelectorAll(".item.sign");
  items.forEach((item) => {
    item.classList.remove("sign", "cross", "nought");
    item.innerHTML = "";
  });

  delightWinComb();
}

function lightWinComb(comb) {
  [...comb].forEach((el) => {
    document
      .querySelector(`.item.sign[data-id = "${el}"]`)
      .classList.add("light");
  });
}

function delightWinComb() {
  document.querySelectorAll(`.item.light`).forEach((el) => {
    el.classList.remove("light");
  });
}
