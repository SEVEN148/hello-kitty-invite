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
const imageFrame = document.querySelector(".image-frame");
const heroImage = document.querySelector(".hero-image");
const heroUpload = document.querySelector("#heroUpload");
const editToggle = document.querySelector("#editToggle");
const editPanel = document.querySelector("#editPanel");
const closeEditorButton = document.querySelector("#closeEditorButton");
const saveTextButton = document.querySelector("#saveTextButton");
const resetTextButton = document.querySelector("#resetTextButton");
const editInviteKicker = document.querySelector("#editInviteKicker");
const editInviteTitle = document.querySelector("#editInviteTitle");
const editInviteMessage = document.querySelector("#editInviteMessage");
const editFoodTitle = document.querySelector("#editFoodTitle");
const editFoodMessage = document.querySelector("#editFoodMessage");
const editFoodOptions = document.querySelector("#editFoodOptions");
const editPlaceTitle = document.querySelector("#editPlaceTitle");
const editPlaceMessage = document.querySelector("#editPlaceMessage");
const editPlaceOptions = document.querySelector("#editPlaceOptions");
const editSummaryTitle = document.querySelector("#editSummaryTitle");
const editSummaryMessage = document.querySelector("#editSummaryMessage");
const editBackgroundOpacity = document.querySelector("#editBackgroundOpacity");
const opacityValue = document.querySelector("#opacityValue");
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

// 修改这里的文字，就可以调整首页、食物页、地点页的显示内容。
const defaultPageText = {
  invite: {
    kicker: "FOR YOU",
    title: "可以和我一起约会嘛？",
    message: "今天的心情是粉色的，想把最可爱的位置留给你。",
    yesButton: "愿意",
    noButton: "不要",
  },
  food: {
    kicker: "STEP 03",
    title: "我们吃点什么？",
    message: "挑一个今天的约会氛围。",
    nextButton: "继续选地点",
    options: [
      { icon: "🍕", label: "披萨" },
      { icon: "🍣", label: "寿司" },
      { icon: "🥘", label: "火锅" },
      { icon: "🥩", label: "烤肉" },
      { icon: "🥟", label: "早茶" },
      { icon: "🍜", label: "拉面" },
      { icon: "🌶️", label: "麻辣烫" },
      { icon: "🦞", label: "小龙虾" },
      { icon: "🍢", label: "烧烤" },
      { icon: "🍌", label: "其他" },
    ],
  },
  place: {
    kicker: "STEP 04",
    title: "想去哪里玩？",
    message: "选一个适合约会的小场景。",
    nextButton: "生成约会卡",
    options: [
      { icon: "🎬", label: "电影院" },
      { icon: "🌳", label: "公园" },
      { icon: "🎡", label: "游乐园" },
      { icon: "☕", label: "咖啡店" },
      { icon: "🛍️", label: "商场" },
      { icon: "🌊", label: "海边" },
      { icon: "📚", label: "书店" },
      { icon: "🏮", label: "夜市" },
      { icon: "📷", label: "拍照打卡" },
    ],
  },
  summary: {
    title: "约会计划完成",
    message: "那就这样说定啦，期待我们的约会ing。",
    backgroundOpacity: 42,
  },
};

let pageText = structuredClone(defaultPageText);

const defaultHeroImage = "./assets/sanrio-characters.png";
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

function createChoiceButton(item, dataName) {
  const button = document.createElement("button");
  const icon = document.createElement("span");

  button.type = "button";
  button.dataset[dataName] = item.label;
  icon.textContent = item.icon;
  button.append(icon, item.label);

  return button;
}

function cloneDefaultText() {
  return structuredClone(defaultPageText);
}

function mergePageText(savedText) {
  return {
    invite: { ...defaultPageText.invite, ...savedText.invite },
    food: {
      ...defaultPageText.food,
      ...savedText.food,
      options: Array.isArray(savedText.food?.options)
        ? savedText.food.options
        : defaultPageText.food.options,
    },
    place: {
      ...defaultPageText.place,
      ...savedText.place,
      options: Array.isArray(savedText.place?.options)
        ? savedText.place.options
        : defaultPageText.place.options,
    },
    summary: {
      ...defaultPageText.summary,
      ...savedText.summary,
      backgroundOpacity: Number.isFinite(Number(savedText.summary?.backgroundOpacity))
        ? Number(savedText.summary.backgroundOpacity)
        : defaultPageText.summary.backgroundOpacity,
    },
  };
}

function loadSavedPageText() {
  const savedText = localStorage.getItem("invitePageText");

  if (!savedText) {
    pageText = cloneDefaultText();
    return;
  }

  try {
    pageText = mergePageText(JSON.parse(savedText));
  } catch {
    pageText = cloneDefaultText();
  }
}

function formatOptionsForEditor(options) {
  return options.map((item) => `${item.icon} ${item.label}`).join("\n");
}

function parseEditableOptions(value, fallbackOptions) {
  const options = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [icon, ...labelParts] = line.split(/\s+/);
      const label = labelParts.join(" ").trim();
      return {
        icon: label ? icon : "♡",
        label: label || icon,
      };
    });

  return options.length ? options : fallbackOptions;
}

function fillEditorFields() {
  editInviteKicker.value = pageText.invite.kicker;
  editInviteTitle.value = pageText.invite.title;
  editInviteMessage.value = pageText.invite.message;
  editFoodTitle.value = pageText.food.title;
  editFoodMessage.value = pageText.food.message;
  editFoodOptions.value = formatOptionsForEditor(pageText.food.options);
  editPlaceTitle.value = pageText.place.title;
  editPlaceMessage.value = pageText.place.message;
  editPlaceOptions.value = formatOptionsForEditor(pageText.place.options);
  editSummaryTitle.value = pageText.summary.title;
  editSummaryMessage.value = pageText.summary.message;
  editBackgroundOpacity.value = pageText.summary.backgroundOpacity;
  opacityValue.textContent = pageText.summary.backgroundOpacity;
}

function saveEditorFields() {
  pageText = mergePageText({
    invite: {
      kicker: editInviteKicker.value.trim() || defaultPageText.invite.kicker,
      title: editInviteTitle.value.trim() || defaultPageText.invite.title,
      message: editInviteMessage.value.trim() || defaultPageText.invite.message,
    },
    food: {
      title: editFoodTitle.value.trim() || defaultPageText.food.title,
      message: editFoodMessage.value.trim() || defaultPageText.food.message,
      options: parseEditableOptions(editFoodOptions.value, defaultPageText.food.options),
    },
    place: {
      title: editPlaceTitle.value.trim() || defaultPageText.place.title,
      message: editPlaceMessage.value.trim() || defaultPageText.place.message,
      options: parseEditableOptions(editPlaceOptions.value, defaultPageText.place.options),
    },
    summary: {
      title: editSummaryTitle.value.trim() || defaultPageText.summary.title,
      message: editSummaryMessage.value.trim() || defaultPageText.summary.message,
      backgroundOpacity: Number(editBackgroundOpacity.value),
    },
  });
  localStorage.setItem("invitePageText", JSON.stringify(pageText));
  renderPageText();
  applySummaryBackground();
}

function renderPageText() {
  inviteCard.querySelector(".kicker").textContent = pageText.invite.kicker;
  questionTitle.textContent = pageText.invite.title;
  questionMessage.textContent = pageText.invite.message;
  yesButton.textContent = pageText.invite.yesButton;
  noButton.textContent = pageText.invite.noButton;

  foodCard.querySelector(".kicker").textContent = pageText.food.kicker;
  foodCard.querySelector("h2").textContent = pageText.food.title;
  foodCard.querySelector(".message").textContent = pageText.food.message;
  toPlaceButton.textContent = pageText.food.nextButton;
  foodGrid.replaceChildren(
    ...pageText.food.options.map((item) => createChoiceButton(item, "food")),
  );

  placeCard.querySelector(".kicker").textContent = pageText.place.kicker;
  placeCard.querySelector("h2").textContent = pageText.place.title;
  placeCard.querySelector(".message").textContent = pageText.place.message;
  toSummaryButton.textContent = pageText.place.nextButton;
  placeGrid.replaceChildren(
    ...pageText.place.options.map((item) => createChoiceButton(item, "place")),
  );

  summaryCard.querySelector("h2").textContent = pageText.summary.title;
  summaryCard.querySelector("p").textContent = pageText.summary.message;
}

function setDefaultHeroImage() {
  imageFrame.dataset.heroPreset = "sanrio";
  heroImage.src = defaultHeroImage;
  localStorage.setItem("inviteHeroPreset", "sanrio");
  localStorage.removeItem("inviteHeroImage");

  applySummaryBackground();
}

function setCustomHeroImage(dataUrl) {
  imageFrame.dataset.heroPreset = "custom";
  heroImage.src = dataUrl;
  localStorage.setItem("inviteHeroPreset", "custom");
  localStorage.setItem("inviteHeroImage", dataUrl);

  applySummaryBackground();
}

function getHeroTheme() {
  return {
    preset: imageFrame.dataset.heroPreset || "sanrio",
    imageUrl: heroImage.currentSrc || heroImage.src || defaultHeroImage,
  };
}

function getThemeBackground(theme) {
  const opacity = Math.min(Math.max(pageText.summary.backgroundOpacity, 0), 85) / 100;
  return `linear-gradient(rgba(255, 253, 245, ${opacity}), rgba(255, 253, 245, ${opacity})), url("${theme.imageUrl}")`;
}

function applySummaryBackground() {
  const theme = getHeroTheme();
  summaryCard.dataset.heroPreset = theme.preset;
  summaryCard.style.backgroundImage = getThemeBackground(theme);
  summaryCard.style.backgroundPosition = "center";
  summaryCard.style.backgroundSize = "cover";
}

function restoreHeroImage() {
  const savedPreset = localStorage.getItem("inviteHeroPreset") || "sanrio";

  if (savedPreset === "custom") {
    const customHeroImage = localStorage.getItem("inviteHeroImage");

    if (customHeroImage) {
      setCustomHeroImage(customHeroImage);
      return;
    }
  }

  setDefaultHeroImage();
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
  applySummaryBackground();
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
  context.fillStyle = "rgba(255, 255, 255, 0.38)";
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

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCoverImage(context, image, x, y, width, height) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const boxRatio = width / height;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;
  let sourceX = 0;
  let sourceY = 0;

  if (imageRatio > boxRatio) {
    sourceWidth = image.naturalHeight * boxRatio;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / boxRatio;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

async function drawSummaryBackground(context, width, height) {
  const theme = getHeroTheme();
  const opacity = Math.min(Math.max(pageText.summary.backgroundOpacity, 0), 85) / 100;

  try {
    const image = await loadCanvasImage(theme.imageUrl);
    drawCoverImage(context, image, 0, 0, width, height);
    context.fillStyle = `rgba(255, 253, 245, ${opacity})`;
    context.fillRect(0, 0, width, height);
  } catch {
    const fallbackGradient = context.createLinearGradient(0, 0, width, height);
    fallbackGradient.addColorStop(0, "#fff8e9");
    fallbackGradient.addColorStop(0.5, "#fff0f6");
    fallbackGradient.addColorStop(1, "#ecfbf6");
    context.fillStyle = fallbackGradient;
    context.fillRect(0, 0, width, height);
  }
}

function dataUrlToFile(dataUrl, filename) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mimeType });
}

function triggerImageDownload(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function downloadSummaryImage() {
  downloadNote.textContent = "正在生成图片...";
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const width = 900;
  const height = 1280;

  canvas.width = width;
  canvas.height = height;

  await drawSummaryBackground(context, width, height);

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
  context.fillStyle = "rgba(255, 253, 245, 0.62)";
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
  context.fillText(pageText.summary.title, 450, 340);

  context.fillStyle = "#8a6e68";
  context.font = "700 28px Microsoft YaHei, sans-serif";
  context.fillText(pageText.summary.message.replace(/[。.]$/, ""), 450, 400);
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

  const filename = "hello-kitty-date-plan.png";
  const file = dataUrlToFile(dataUrl, filename);

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "约会计划",
        text: "保存这张约会计划卡片",
      });
      downloadNote.textContent = "已打开手机保存面板，可以选择保存到相册。";
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        downloadNote.textContent = "已取消保存，可以再次点击按钮重新打开。";
        return;
      }
    }
  }

  triggerImageDownload(dataUrl, filename);
  downloadNote.innerHTML =
    '图片已生成。如果没有自动保存到相册，请在下载记录里保存，或<a href="' +
    dataUrl +
    '" target="_blank" rel="noopener">打开图片后长按保存</a>。';
}

dateInput.min = getTodayValue();
dateInput.value = getTodayValue();
loadSavedPageText();
renderPageText();
updateSelectedTime("17:00");
restoreHeroImage();

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

editToggle.addEventListener("click", () => {
  fillEditorFields();
  editPanel.hidden = false;
});

closeEditorButton.addEventListener("click", () => {
  editPanel.hidden = true;
});

saveTextButton.addEventListener("click", () => {
  saveEditorFields();
  editPanel.hidden = true;
});

resetTextButton.addEventListener("click", () => {
  localStorage.removeItem("invitePageText");
  pageText = cloneDefaultText();
  renderPageText();
  applySummaryBackground();
  fillEditorFields();
});

editBackgroundOpacity.addEventListener("input", () => {
  opacityValue.textContent = editBackgroundOpacity.value;
  pageText.summary.backgroundOpacity = Number(editBackgroundOpacity.value);
  applySummaryBackground();
});

heroUpload.addEventListener("change", () => {
  const file = heroUpload.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    setCustomHeroImage(reader.result);
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
