// helper
const getQueueUrl = () => document.querySelector("#queueUrl").value;
const makeAjaxParams = (url, data, success, error) => ({ type: "POST", dataType: "json", url, data, success, error });
let ERROR_COUNT = 0;
const errorAlert = (xhr, status, error) => {
  ERROR_COUNT++;
  if (ERROR_COUNT == 5) {
    alert("오류가 5회 검출되었습니다. 새로고침 하기 전까지는 더이상 에러가 발생해도 노출되지 않습니다.");
  }
  if (ERROR_COUNT > 5) {
    return;
  }
  return alert(error.length === 0 ? "화면을 새로고침 해 주세요" : error);
};
let currentOrderCount = 0;
function addTextToTextarea(order) {
  currentOrderCount++;
  const text = order === "새로운 주문!" ? `${currentOrderCount}번째 주문이 접수되었습니다.\n` : `스페셜 주문 "${order}"가 접수되었습니다.\n`;
  const log = document.querySelector("#log");
  log.innerHTML = text + log.innerHTML;
}

// 큐 정보 갱신
let serverIdle = true;
setInterval(() => {
  console.log("check current queue size");
  if (!serverIdle) return;
  serverIdle = false;
  const success = ({ size }) => {
    document.querySelector("#queue_size").innerText = size;
    serverIdle = true;
  };
  $.ajax(makeAjaxParams("./status", { QueueUrl: getQueueUrl() }, success, errorAlert));
}, 1000);

const switchOff = elem => elem.classList.add("disabled");
const switchOn = elem => elem.classList.remove("disabled");
let btnAvailable = true;

// 주문 측
document.querySelector("#req1").addEventListener("click", function() {
  if (!btnAvailable) return;
  console.log("req1");
  btnAvailable = false;
  switchOff(this);
  const success = () => {
    btnAvailable = true;
    switchOn(this);
  };
  const error = (xhr, status, error) => {
    btnAvailable = true;
    switchOn(this);
    alert(error);
  };
  $.ajax(makeAjaxParams("./req", { count: 1, QueueUrl: getQueueUrl() }, success, error));
});

document.querySelector("#req10").addEventListener("click", function() {
  if (!btnAvailable) return;
  btnAvailable = false;
  console.log("req10");
  switchOff(this);
  const success = () => {
    btnAvailable = true;
    switchOn(this);
  };
  const error = (xhr, status, error) => {
    btnAvailable = true;
    switchOn(this);
    alert(error);
  };
  $.ajax(makeAjaxParams("./req", { count: 10, QueueUrl: getQueueUrl() }, success, error));
});

document.querySelector("#req50").addEventListener("click", function() {
  if (!btnAvailable) return;
  btnAvailable = false;
  console.log("req50");
  switchOff(this);
  const success = () => {
    btnAvailable = true;
    switchOn(this);
  };
  const error = (xhr, status, error) => {
    btnAvailable = true;
    switchOn(this);
    alert(error);
  };
  $.ajax(makeAjaxParams("./req", { count: 50, QueueUrl: getQueueUrl() }, success, error));
});

document.querySelector("#reqSpecial").addEventListener("click", function() {
  if (!btnAvailable) return;
  btnAvailable = false;
  console.log("reqSpecial");
  const order = document.querySelector("#specialOrderInput").value.trim();
  if (!order) return alert("스페셜 주문의 내용을 입력해주세요.");
  document.querySelector("#specialOrderInput").value = "";
  switchOff(this);
  const success = () => {
    btnAvailable = true;
    switchOn(this);
  };
  const error = (xhr, status, error) => {
    btnAvailable = true;
    switchOn(this);
    alert(error);
  };
  $.ajax(makeAjaxParams("./req", { count: 1, order: order, QueueUrl: getQueueUrl() }, success, error));
});

let btnWorking = false;
document.querySelector("#reqEndless").addEventListener("click", function() {
  if (!btnAvailable) return;
  console.log("reqEndless");
  btnAvailable = false;
  switchOff(this);
  if (!btnWorking) {
    btnWorking = true;
    this.innerText = "무한 주문 정지";
    const success = () => {
      btnAvailable = true;
      switchOn(this);
    };
    const error = (xhr, status, error) => {
      this.innerText = "무한 주문 요청 (1초당 10건)";
      btnAvailable = true;
      alert(error);
      switchOn(this);
    };
    $.ajax(makeAjaxParams("./reqEndless", { QueueUrl: getQueueUrl() }, success, error));
  } else {
    btnWorking = false;
    this.innerText = "무한 주문 요청 (1초당 10건)";
    const success = data => {
      console.log(data);
      btnAvailable = true;
      switchOn(this);
    };
    const error = (xhr, status, error) => {
      this.innerText = "무한 주문 정지";
      btnAvailable = true;
      alert(error);
      switchOn(this);
    };
    $.ajax(makeAjaxParams("./reqEndlessCancel", { QueueUrl: getQueueUrl() }, success, error));
  }
});

// 수락 측
document.querySelector("#rec1").addEventListener("click", function() {
  if (!btnAvailable) return;
  btnAvailable = false;
  console.log("rec1");
  switchOff(this);
  const success = data => {
    data.result && data.result.forEach(order => addTextToTextarea(order));
    btnAvailable = true;
    switchOn(this);
  };
  const error = (xhr, status, error) => {
    btnAvailable = true;
    switchOn(this);
    alert(error);
  };
  $.ajax(makeAjaxParams("./rec", { count: 1, QueueUrl: getQueueUrl() }, success, error));
});

document.querySelector("#rec10").addEventListener("click", function() {
  if (!btnAvailable) return;
  btnAvailable = false;
  console.log("rec10");
  switchOff(this);
  const success = data => {
    data.result && data.result.forEach(order => addTextToTextarea(order));
    btnAvailable = true;
    switchOn(this);
  };
  const error = (xhr, status, error) => {
    btnAvailable = true;
    switchOn(this);
    alert(error);
  };
  $.ajax(makeAjaxParams("./rec", { count: 10, QueueUrl: getQueueUrl() }, success, error));
});

document.querySelector("#rec50").addEventListener("click", function() {
  if (!btnAvailable) return;
  btnAvailable = false;
  console.log("rec50");
  switchOff(this);
  const success = data => {
    data.result && data.result.forEach(order => addTextToTextarea(order));
    btnAvailable = true;
    switchOn(this);
  };
  const error = (xhr, status, error) => {
    btnAvailable = true;
    switchOn(this);
    alert(error);
  };
  $.ajax(makeAjaxParams("./rec", { count: 50, QueueUrl: getQueueUrl() }, success, error));
});

let btnWorking2 = false;
function recData() {
  function success(data) {
    if (!!data.error) btnWorking2 = false;
    data.result && data.result.forEach(order => addTextToTextarea(order));
    if (!btnWorking2) {
      document.querySelector("#recEndless").innerText = "무한 주문 수락";
      return;
    }
    recData();
  }
  const error = (xhr, status, error) => {
    this.innerText = "무한 주문 수락";
    alert(error);
  };
  $.ajax(makeAjaxParams("./rec", { count: 1, QueueUrl: getQueueUrl() }, success, error));
}

document.querySelector("#recEndless").addEventListener("click", function() {
  if (!btnAvailable) return;
  console.log("recEndless");
  if (!btnWorking2) {
    btnWorking2 = true;
    this.innerText = "무한 수락 정지";
    recData();
  } else {
    btnWorking2 = false;
    this.innerText = "무한 주문 수락";
  }
});

// 중앙 탭 관련
document.querySelector("#resetLog").addEventListener("click", function() {
  document.querySelector("#log").innerHTML = "";
  currentOrderCount = 0;
});

document.querySelector("#purge").addEventListener("click", function() {
  if (!btnAvailable) return;
  btnAvailable = false;
  console.log("purge");
  switchOff(this);
  const success = () => {
    btnAvailable = true;
    switchOn(this);
  };
  $.ajax(makeAjaxParams("./purge", { QueueUrl: getQueueUrl() }, success, errorAlert));
});
