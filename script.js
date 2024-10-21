(function () {
  "use strict";

  const items = ["7️⃣", "❌", "🍓", "🍋", "🍉", "🍒", "💵", "🍊", "🍎"];

  //rigged version for testing
  //   const items = ["7️⃣", "7️⃣", "7️⃣", "7️⃣", "7️⃣", "7️⃣", "7️⃣", "7️⃣", "7️⃣"];
  document.querySelector(".info").textContent = items.join(" ");

  const doors = document.querySelectorAll(".door");
  document.querySelector("#spinner").addEventListener("click", spin);
  document.querySelector("#reseter").addEventListener("click", init);

  let totalWinCount = 0;

  async function spin() {
    const betInput = document.querySelector("#betAmount");
    const betAmount = parseInt(betInput.value, 10);

    if (isNaN(betAmount) || betAmount < 1) {
      alert("Please enter a valid bet amount.");
      return;
    }

    init(false, 1, 2);
    const results = [];
    for (const door of doors) {
      const boxes = door.querySelector(".boxes");
      const duration = parseInt(boxes.style.transitionDuration);
      boxes.style.transform = "translateY(0)";
      await new Promise((resolve) => setTimeout(resolve, duration * 100));

      const result = boxes.querySelector(".box").textContent;
      console.log(result);

      results.push(result);
    }
    checkWin(results, betAmount);

    setTimeout(() => {
      init(false, 1, 1);
    }, 1500);
  }

  function checkWin(results, betAmount) {
    const totalWin = document.querySelector(".totalWin");
    const doorsArray = Array.from(doors);

    doorsArray.forEach((door) => door.classList.remove("glow"));

    if (results.every((val) => val === results[0])) {
      const payout = betAmount * 2;
      totalWinCount += payout;
      doorsArray.forEach((door) => door.classList.add("glow"));
      totalWin.textContent = ` Jack Pot:  ${totalWinCount}`;
    } else if (checkThreeMatch(results)) {
      const payout = betAmount * 1.5;
      totalWinCount += payout;
      totalWin.textContent = `Total Win: ${totalWinCount} (3 matched!)`;
    } else {
      totalWin.textContent = `Total Win: ${totalWinCount}`;
    }

    setTimeout(() => {
      doorsArray.forEach((door) => door.classList.remove("glow"));
    }, 3000);
  }
  function checkThreeMatch(results) {
    const counts = {};

    results.forEach((item) => {
      counts[item] = (counts[item] || 0) + 1;
    });

    for (let key in counts) {
      if (counts[key] === 3) {
        return true;
      }
    }
    return false;
  }

  function init(firstInit = true, groups = 1, duration = 1) {
    for (const door of doors) {
      if (firstInit) {
        door.dataset.spinned = "0";
      } else if (door.dataset.spinned === "1") {
        return;
      }

      const boxes = door.querySelector(".boxes");
      const boxesClone = boxes.cloneNode(false);

      const pool = ["❓"];
      if (!firstInit) {
        const arr = [];
        for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
          arr.push(...items);
        }
        pool.push(...shuffle(arr));

        boxesClone.addEventListener(
          "transitionstart",
          function () {
            door.dataset.spinned = "1";
            this.querySelectorAll(".box").forEach((box) => {
              box.style.filter = "blur(1px)";
            });
          },
          { once: true }
        );

        boxesClone.addEventListener(
          "transitionend",
          function () {
            this.querySelectorAll(".box").forEach((box, index) => {
              box.style.filter = "blur(0)";
              if (index > 0) this.removeChild(box);
            });
          },
          { once: true }
        );
      }

      for (let i = pool.length - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.style.width = door.clientWidth + "px";
        box.style.height = door.clientHeight + "px";
        box.textContent = pool[i];
        boxesClone.appendChild(box);
      }
      boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
      boxesClone.style.transform = `translateY(-${
        door.clientHeight * (pool.length - 1)
      }px)`;
      door.replaceChild(boxesClone, boxes);
    }
  }

  function shuffle([...arr]) {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  }

  init();
})();
