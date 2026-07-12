const inviteCard = document.querySelector("#inviteCard");
const enterCard = document.querySelector("#enterCard");
const timeCard = document.querySelector("#timeCard");
const foodCard = document.querySelector("#foodCard");
const placeCard = document.querySelector("#placeCard");
const summaryCard = document.querySelector("#summaryCard");
const buttonStage = document.querySelector("#buttonStage");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const questionTitle = document.querySelector("#questionTitle");
const questionMessage = document.querySelector("#questionMessage");
const bgUpload = document.querySelector("#bgUpload");
const backgroundButtons = document.querySelectorAll(".bg-presets button");
const startPlanButton = document.querySelector("#startPlanButton");
const dateInput = document.querySelector("#dateInput");
const timeInput = document.querySelector("#timeInput");
const toFoodButton = document.querySelector("#toFoodButton");
const foodGrid = document.querySelector("#foodGrid");
const toPlaceButton = document.querySelector("#toPlaceButton");
const placeGrid = document.querySelector("#placeGrid");
const toSummaryButton = document.querySelector("#toSummaryButton");
const summaryDate = document.querySelector("#summaryDate");
const summaryTime = document.querySelector("#summaryTime");
const summaryFood = document.querySelector("#summaryFood");
const summaryPlace = document.querySelector("#summaryPlace");
const downloadButton = document.querySelector("#downloadButton");
const downloadNote = document.querySelector("#downloadNote");
const restartButton = document.querySelector("#restartButton");

const teasingCopy = [
  ["点不到吧", "再想一下嘛，粉色小队已经准备好啦。"],
  ["不要按钮开始害羞了", "它觉得这个答案不太适合今天。"],
  ["真的不选愿意吗？", "这里还有一整份可爱在等你。"],
];

const steps = [inviteCard, enterCard, timeCard, foodCard, placeCard, summaryCard];
const selectedPlan = {
  date: "",
  time: "",
  food: "",
  place: "",
};

let dodgeCount = 0;

function showStep(activeStep) {
  steps.forEach((step) => {
    step.hidden = step !== activeStep;
  });
}

function setBackground(bgName) {
  document.body.style.backgroundImage = "";
  document.body.dataset.bg = bgName;
  localStorage.setItem("inviteBackground", bgName);

  backgroundButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.bg === bgName);
  });
}

function setCustomBackground(dataUrl) {
  document.body.removeAttribute("data-bg");
  document.body.style.backgroundImage = `linear-gradient(rgba(255, 248, 233, 0.5), rgba(255, 240, 246, 0.62)), url("${dataUrl}")`;
  document.body.style.backgroundAttachment = "fixed";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundSize = "cover";
  localStorage.setItem("inviteBackground", "custom");
  localStorage.setItem("inviteCustomBackground", dataUrl);

  backgroundButtons.forEach((button) => {
    button.classList.remove("is-selected");
  });
}

function restoreBackground() {
  const savedBackground = localStorage.getItem("inviteBackground") || "pink";

  if (savedBackground === "custom") {
    const customBackground = localStorage.getItem("inviteCustomBackground");

    if (customBackground) {
      setCustomBackground(customBackground);
      return;
    }
  }

  setBackground(savedBackground);
}

function getTodayValue() {
  const today = new Date();
  const offsetDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "-";
  }

  const [year, month, day] = dateValue.split("-");
  return `${Number(month)}月${Number(day)}日`;
}

function placeNoButtonRandomly() {
  buttonStage.classList.add("is-dodging");
  noButton.classList.add("is-running");
  noButton.style.transform = "none";

  const stageRect = buttonStage.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();
  const yesRect = yesButton.getBoundingClientRect();
  const padding = 8;
  const maxX = Math.max(padding, stageRect.width - buttonRect.width - padding);
  const maxY = Math.max(padding, stageRect.height - buttonRect.height - padding);
  const yesBounds = {
    left: yesRect.left - stageRect.left - 12,
    right: yesRect.right - stageRect.left + 12,
    top: yesRect.top - stageRect.top - 12,
    bottom: yesRect.bottom - stageRect.top + 12,
  };
  let x = padding;
  let y = padding;

  for (let i = 0; i < 24; i += 1) {
    x = padding + Math.random() * (maxX - padding);
    y = padding + Math.random() * (maxY - padding);

    const noBounds = {
      left: x,
      right: x + buttonRect.width,
      top: y,
      bottom: y + buttonRect.height,
    };
    const overlapsYes =
      noBounds.left < yesBounds.right &&
      noBounds.right > yesBounds.left &&
      noBounds.top < yesBounds.bottom &&
      noBounds.bottom > yesBounds.top;

    if (!overlapsYes) {
      break;
    }
  }

  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
}

function teaseAndMove(event) {
  event.preventDefault();
  dodgeCount += 1;

  const copy = teasingCopy[(dodgeCount - 1) % teasingCopy.length];
  questionTitle.textContent = copy[0];
  questionMessage.textContent = copy[1];

  placeNoButtonRandomly();
}

function updateSelectedTime(timeValue) {
  timeInput.value = timeValue;
  document.querySelectorAll(".time-slots button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.time === timeValue);
  });
}

function selectFood(button) {
  selectedPlan.food = button.dataset.food;
  foodGrid.querySelectorAll("button").forEach((foodButton) => {
    foodButton.classList.toggle("is-selected", foodButton === button);
  });
  toPlaceButton.disabled = false;
}

function selectPlace(button) {
  selectedPlan.place = button.dataset.place;
  placeGrid.querySelectorAll("button").forEach((placeButton) => {
    placeButton.classList.toggle("is-selected", placeButton === button);
  });
  toSummaryButton.disabled = false;
}

function showFoodStep() {
  selectedPlan.date = dateInput.value;
  selectedPlan.time = timeInput.value;
  showStep(foodCard);
}

function showPlaceStep() {
  showStep(placeCard);
}

function showSummary() {
  summaryDate.textContent = formatDate(selectedPlan.date);
  summaryTime.textContent = selectedPlan.time || "-";
  summaryFood.textContent = selectedPlan.food || "-";
  summaryPlace.textContent = selectedPlan.place || "-";
  showStep(summaryCard);
}

function restartPlan() {
  selectedPlan.date = dateInput.value;
  selectedPlan.time = timeInput.value;
  selectedPlan.food = "";
  selectedPlan.place = "";
  foodGrid.querySelectorAll("button").forEach((button) => {
    button.classList.remove("is-selected");
  });
  placeGrid.querySelectorAll("button").forEach((button) => {
    button.classList.remove("is-selected");
  });
  toPlaceButton.disabled = true;
  toSummaryButton.disabled = true;
  showStep(timeCard);
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawSummaryItem(context, label, value, x, y, width) {
  drawRoundedRect(context, x, y, width, 112, 14);
  context.fillStyle = "#ffffff";
  context.fill();
  context.lineWidth = 4;
  context.strokeStyle = "#7a574d";
  context.stroke();

  context.fillStyle = "#f45c99";
  context.font = "700 22px Microsoft YaHei, sans-serif";
  context.fillText(label, x + 24, y + 38);

  context.fillStyle = "#46342f";
  context.font = "900 32px Microsoft YaHei, sans-serif";
  context.fillText(value, x + 24, y + 82);
}

async function downloadSummaryImage() {
  downloadNote.textContent = "正在生成图片...";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const width = 900;
  const height = 1280;

  canvas.width = width;
  canvas.height = height;

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#fff8e9");
  gradient.addColorStop(0.5, "#fff0f6");
  gradient.addColorStop(1, "#ecfbf6");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  context.fillStyle = "rgba(255, 143, 188, 0.22)";
  context.beginPath();
  context.arc(160, 190, 130, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgba(155, 217, 204, 0.28)";
  context.beginPath();
  context.arc(760, 220, 150, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "rgba(255, 232, 141, 0.34)";
  context.beginPath();
  context.arc(700, 1080, 180, 0, Math.PI * 2);
  context.fill();

  drawRoundedRect(context, 80, 90, 740, 1080, 22);
  context.fillStyle = "rgba(255, 253, 245, 0.94)";
  context.fill();
  context.lineWidth = 6;
  context.strokeStyle = "#7a574d";
  context.stroke();

  context.fillStyle = "#ff8fbc";
  context.beginPath();
  context.arc(450, 210, 66, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#ffffff";
  context.font = "900 52px Microsoft YaHei, sans-serif";
  context.textAlign = "center";
  context.fillText("♥", 450, 230);

  context.fillStyle = "#46342f";
  context.font = "900 56px Microsoft YaHei, sans-serif";
  context.fillText("约会计划完成", 450, 340);

  context.fillStyle = "#8a6e68";
  context.font = "700 28px Microsoft YaHei, sans-serif";
  context.fillText("今天的可爱额度已经预约成功", 450, 400);
  context.textAlign = "left";

  drawSummaryItem(context, "DATE", summaryDate.textContent, 140, 490, 620);
  drawSummaryItem(context, "TIME", summaryTime.textContent, 140, 630, 620);
  drawSummaryItem(context, "FOOD", summaryFood.textContent, 140, 770, 620);
  drawSummaryItem(context, "PLACE", summaryPlace.textContent, 140, 910, 620);

  context.fillStyle = "#f45c99";
  context.font = "900 28px Microsoft YaHei, sans-serif";
  context.textAlign = "center";
  context.fillText("Hello Kitty Invitation", 450, 1100);

  const dataUrl = canvas.toDataURL("image/png");

  if (!dataUrl || dataUrl === "data:,") {
    downloadNote.textContent = "图片生成失败，请换个浏览器再试。";
    return;
  }

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = "hello-kitty-date-plan.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  downloadNote.textContent = "图片已生成。手机上如未自动进相册，请在下载记录里保存图片。";
}

dateInput.min = getTodayValue();
dateInput.value = getTodayValue();
updateSelectedTime("17:00");
restoreBackground();

noButton.addEventListener("pointerenter", teaseAndMove);
noButton.addEventListener("pointerdown", teaseAndMove);
noButton.addEventListener("focus", placeNoButtonRandomly);
yesButton.addEventListener("click", () => showStep(enterCard));
startPlanButton.addEventListener("click", () => showStep(timeCard));
toFoodButton.addEventListener("click", showFoodStep);
toPlaceButton.addEventListener("click", showPlaceStep);
toSummaryButton.addEventListener("click", showSummary);
downloadButton.addEventListener("click", downloadSummaryImage);
restartButton.addEventListener("click", restartPlan);

backgroundButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setBackground(button.dataset.bg);
  });
});

bgUpload.addEventListener("change", () => {
  const file = bgUpload.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    setCustomBackground(reader.result);
  });
  reader.readAsDataURL(file);
});

document.querySelectorAll(".time-slots button").forEach((button) => {
  button.addEventListener("click", () => {
    updateSelectedTime(button.dataset.time);
  });
});

timeInput.addEventListener("input", () => {
  updateSelectedTime(timeInput.value);
});

foodGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (button) {
    selectFood(button);
  }
});

placeGrid.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (button) {
    selectPlace(button);
  }
});
