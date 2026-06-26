const STORAGE_KEY = "youth-ceo-rookies-self-learning";
const fields = Array.from(document.querySelectorAll("[data-field]"));
const checks = Array.from(document.querySelectorAll("[data-check]"));
const progressValue = document.querySelector("#progressValue");
const progressBar = document.querySelector("#progressBar");
const progressHint = document.querySelector("#progressHint");
const finalOutput = document.querySelector("#finalOutput");
const toast = document.querySelector("#toast");

const defaultPitch = "아직 작성된 내용이 없습니다. Step 1부터 입력해보세요.";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getValue(name) {
  const field = document.querySelector(`[data-field="${name}"]`);
  return field ? field.value.trim() : "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function buildPitch() {
  const nickname = getValue("nickname") || "저";
  const characterLine = getValue("characterLine");
  const interestArea = getValue("interestArea");
  const problemSentence = getValue("problemSentence");
  const finalIdea = getValue("finalIdea");
  const firstExperiment = getValue("firstExperiment");
  const ideaList = getValue("ideaList");
  const helpPeople = getValue("helpPeople");

  const hasCore = problemSentence || finalIdea || characterLine || ideaList;
  if (!hasCore) return defaultPitch;

  return [
    `안녕하세요. 저는 ${nickname}입니다.`,
    characterLine ? `저는 ${characterLine}라는 방향으로 아이디어를 정리했습니다.` : "",
    interestArea ? `제가 관심 있게 본 영역은 ${interestArea}입니다.` : "",
    problemSentence ? `제가 주목한 문제는 "${problemSentence}"입니다.` : "",
    helpPeople ? `이 문제는 특히 ${helpPeople}에게 의미가 있다고 봤습니다.` : "",
    finalIdea ? `그래서 제가 선택한 아이템은 "${finalIdea}"입니다.` : "",
    firstExperiment ? `다음 단계에서는 ${firstExperiment}` : "",
    "오늘의 목표는 완벽한 정답을 내는 것이 아니라, 작게 검증할 수 있는 첫 문제와 첫 아이디어를 남기는 것입니다.",
  ]
    .filter(Boolean)
    .join("\n\n");
}

function updateFinalOutput() {
  finalOutput.textContent = buildPitch();
}

function updateProgress() {
  const filledFields = fields.filter((field) => field.value.trim().length > 0).length;
  const checked = checks.filter((check) => check.checked).length;
  const total = fields.length + checks.length;
  const percent = total ? Math.round(((filledFields + checked) / total) * 100) : 0;
  progressValue.textContent = String(percent);
  progressBar.style.width = `${percent}%`;

  if (percent === 0) {
    progressHint.textContent = "첫 입력칸부터 가볍게 채워보세요.";
  } else if (percent < 35) {
    progressHint.textContent = "좋아요. 아직은 후보를 넓히는 구간입니다.";
  } else if (percent < 70) {
    progressHint.textContent = "문제와 아이디어가 잡히고 있습니다.";
  } else if (percent < 100) {
    progressHint.textContent = "이제 발표문을 다듬을 수 있는 단계입니다.";
  } else {
    progressHint.textContent = "완성입니다. 발표문을 복사해 마지막으로 소리 내 읽어보세요.";
  }
}

function persist() {
  const state = {};
  fields.forEach((field) => {
    state[field.dataset.field] = field.value;
  });
  checks.forEach((check) => {
    state[`check:${check.dataset.check}`] = check.checked;
  });
  saveState(state);
  updateProgress();
  updateFinalOutput();
}

function restore() {
  const state = loadState();
  fields.forEach((field) => {
    field.value = state[field.dataset.field] || "";
  });
  checks.forEach((check) => {
    check.checked = Boolean(state[`check:${check.dataset.check}`]);
  });
  updateProgress();
  updateFinalOutput();
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(
    () => showToast("복사했습니다."),
    () => showToast("복사에 실패했습니다.")
  );
}

function downloadPitch() {
  const blob = new Blob([finalOutput.textContent], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "청년사장-루키즈-1분-발표문.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("텍스트 파일을 저장했습니다.");
}

fields.forEach((field) => field.addEventListener("input", persist));
checks.forEach((check) => check.addEventListener("change", persist));

document.addEventListener("click", (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (copyButton) {
    copyText(copyButton.dataset.copy);
    return;
  }

  const lensButton = event.target.closest("[data-lens]");
  if (lensButton) {
    const memo = document.querySelector('[data-field="lensMemo"]');
    const area = getValue("interestArea") || "내 관심 영역";
    memo.value = `${memo.value}${memo.value ? "\n" : ""}- ${lensButton.dataset.lens}: ${area}에서 반복되는 불편은 무엇인가?`;
    persist();
    memo.focus();
    return;
  }

  const patternButton = event.target.closest("[data-pattern]");
  if (patternButton) {
    const list = document.querySelector('[data-field="ideaList"]');
    const problem = getValue("problemSentence") || "내가 고른 문제";
    list.value = `${list.value}${list.value ? "\n" : ""}- ${patternButton.dataset.pattern}: ${problem}를 해결하는 아이디어`;
    persist();
    list.focus();
    return;
  }

  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.action;
  if (action === "reset") {
    localStorage.removeItem(STORAGE_KEY);
    fields.forEach((field) => {
      field.value = "";
    });
    checks.forEach((check) => {
      check.checked = false;
    });
    persist();
    showToast("작성 내용을 초기화했습니다.");
  }

  if (action === "copy-final") {
    copyText(finalOutput.textContent);
  }

  if (action === "download") {
    downloadPitch();
  }
});

restore();
