const inviteCard = document.querySelector("#inviteCard");
const timeCard = document.querySelector("#timeCard");
const foodCard = document.querySelector("#foodCard");
const summaryCard = document.querySelector("#summaryCard");
const buttonStage = document.querySelector("#buttonStage");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const questionTitle = document.querySelector("#questionTitle");
const questionMessage = document.querySelector("#questionMessage");
const dateInput = document.querySelector("#dateInput");
const timeInput = document.querySelector("#timeInput");
const toFoodButton = document.querySelector("#toFoodButton");
const foodGrid = document.querySelector("#foodGrid");
const toSummaryButton = document.querySelector("#toSummaryButton");
const summaryDate = document.querySelector("#summaryDate");
const summaryTime = document.querySelector("#summaryTime");
const summaryFood = document.querySelector("#summaryFood");
const restartButton = document.querySelector("#restartButton");

const teasingCopy = [
  ["点不到吧", "再想一下嘛，粉色小队已经准备好啦。"],
  ["不要按钮开始害羞了", "它觉得这个答案不太适合今天。"],
  ["真的不选愿意吗？", "这里还有一整份可爱在等你。"],
];

const steps = [inviteCard, timeCard, foodCard, summaryCard];
const selectedPlan = {
  date: "",
  time: "",
  food: "",
};

let dodgeCount = 0;

function showStep(activeStep) {
  steps.forEach((step) => {
    step.hidden = step !== activeStep;
  });
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
  toSummaryButton.disabled = false;
}

function showFoodStep() {
  selectedPlan.date = dateInput.value;
  selectedPlan.time = timeInput.value;
  showStep(foodCard);
}

function showSummary() {
  summaryDate.textContent = formatDate(selectedPlan.date);
  summaryTime.textContent = selectedPlan.time || "-";
  summaryFood.textContent = selectedPlan.food || "-";
  showStep(summaryCard);
}

function restartPlan() {
  selectedPlan.date = dateInput.value;
  selectedPlan.time = timeInput.value;
  selectedPlan.food = "";
  foodGrid.querySelectorAll("button").forEach((button) => {
    button.classList.remove("is-selected");
  });
  toSummaryButton.disabled = true;
  showStep(timeCard);
}

dateInput.min = getTodayValue();
dateInput.value = getTodayValue();
updateSelectedTime("17:00");

noButton.addEventListener("pointerenter", teaseAndMove);
noButton.addEventListener("pointerdown", teaseAndMove);
noButton.addEventListener("focus", placeNoButtonRandomly);
yesButton.addEventListener("click", () => showStep(timeCard));
toFoodButton.addEventListener("click", showFoodStep);
toSummaryButton.addEventListener("click", showSummary);
restartButton.addEventListener("click", restartPlan);

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
