const STORAGE_KEY = "youth-ceo-rookies-self-learning";
const fields = Array.from(document.querySelectorAll("[data-field]"));
const checks = Array.from(document.querySelectorAll("[data-check]"));
const progressValue = document.querySelector("#progressValue");
const progressBar = document.querySelector("#progressBar");
const progressHint = document.querySelector("#progressHint");
const finalOutput = document.querySelector("#finalOutput");
const toast = document.querySelector("#toast");

const defaultPitch = "아직 작성된 내용이 없습니다. Step 1부터 입력해보세요.";

const sampleState = {
  nickname: "민지",
  interests: "자취 요리, 생활비 절약, 건강한 식사",
  knownProblem: "장을 보면 재료가 남고, 결국 버리게 되는 문제",
  personality: "꼼꼼함, 현실적, 실험을 좋아함",
  helpPeople: "자취를 처음 시작한 청년",
  characterLine: "작은 냉장고 안에서 낭비를 줄이는 자취 식생활 메이커",
  whyUncomfortable: "장을 본 뒤 1인분만 쓰고 남은 재료를 어떻게 처리할지 몰라 불편했다.",
  whyCost: "재료를 버리고 다시 배달앱을 쓰면서 식비가 계속 늘었다.",
  whyChoice: "레시피는 많은데 내 냉장고 재료에 맞는 선택지가 잘 보이지 않았다.",
  interestArea: "자취 식생활",
  moneyMoment: "장보기 후 남은 재료를 버리고 다시 배달을 시킬 때",
  failMoment: "대파, 양파, 채소를 사놓고 절반 이상 버린 경험",
  choiceProblem: "남은 재료로 무엇을 만들 수 있는지 바로 판단하기 어렵다.",
  problemSentence: "자취 초기 청년은 1인분 기준 식재료 관리가 어려워 재료와 식비를 반복적으로 낭비한다.",
  lensMemo: "- 돈 낭비: 먹지 못하고 버리는 식재료가 생긴다.\n- 선택 스트레스: 남은 재료로 만들 메뉴를 고르기 어렵다.",
  ideaList:
    "1. 남은 재료 입력 기반 1인분 레시피 추천\n2. 일주일 식재료 소진표\n3. 자취생 냉장고 재고 체크리스트\n4. 3일 안에 먹어야 할 재료 알림\n5. 편의점 재료 조합 추천 콘텐츠\n6. 식비 낭비 기록표\n7. 자취생 장보기 소분 키트\n8. 남은 재료 교환 커뮤니티\n9. 초보 자취생 식단 템플릿\n10. 냉장고 사진 기반 메뉴 추천",
  scoreFrequency: "5",
  scoreReach: "4",
  scorePain: "4",
  scoreTest: "5",
  finalIdea: "남은 식재료를 입력하면 1인분 메뉴와 소진 순서를 알려주는 자취생 냉장고 코치",
  firstExperiment: "자취생 5명에게 남은 재료 3가지를 받아 1인분 메뉴 추천표를 보내고, 실제로 도움이 됐는지 물어본다.",
};

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

  if (action === "fill-sample") {
    fields.forEach((field) => {
      field.value = sampleState[field.dataset.field] || "";
    });
    checks.forEach((check) => {
      check.checked = true;
    });
    persist();
    document.querySelector("#pitch")?.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("예시 답변을 채웠습니다.");
  }

  if (action === "copy-final") {
    copyText(finalOutput.textContent);
  }

  if (action === "download") {
    downloadPitch();
  }
});

restore();
