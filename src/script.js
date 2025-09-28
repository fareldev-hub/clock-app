// Toggle Content
function showContent(id, event) {
  document.querySelectorAll('.content').forEach(c => c.style.display = 'none');
  document.getElementById(id).style.display = 'flex';
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// Local Time
function updateLocalTime() {
  const now = new Date();
  document.getElementById("localTime").textContent = now.toLocaleTimeString();
  document.getElementById("timezone").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}
setInterval(updateLocalTime, 1000);
updateLocalTime();

// Alarm
window.onload = function() {
  const hourSelect = document.getElementById("alarmHour");
  const minuteSelect = document.getElementById("alarmMinute");

  for (let h = 0; h < 24; h++) {
    const opt = document.createElement("option");
    opt.value = String(h).padStart(2, '0');
    opt.textContent = String(h).padStart(2, '0');
    hourSelect.appendChild(opt);
  }

  for (let m = 0; m < 60; m++) {
    const opt = document.createElement("option");
    opt.value = String(m).padStart(2, '0');
    opt.textContent = String(m).padStart(2, '0');
    minuteSelect.appendChild(opt);
  }
};

let alarmTime = null;

function setAlarm() {
  const hour = document.getElementById("alarmHour").value;
  const minute = document.getElementById("alarmMinute").value;

  if (hour === "" || minute === "") {
    alert("Pilih jam dan menit dulu!");
    return;
  }

  alarmTime = `${hour}:${minute}`;
  document.getElementById("alarmStatus").textContent = "Alarm diset pada " + alarmTime;
}

setInterval(() => {
  if (alarmTime) {
    const now = new Date();
    const current = now.getHours().toString().padStart(2,'0') + ":" +
                    now.getMinutes().toString().padStart(2,'0');
    if (current === alarmTime) {
      document.getElementById("alarmSound").play();
      alert("⏰ Waktunya bangun!");
      alarmTime = null;
    }
  }
}, 1000);

// Stopwatch
let stopwatchInterval;
let elapsedTime = 0;

function updateStopwatch() {
  let hrs = Math.floor(elapsedTime / 3600);
  let mins = Math.floor((elapsedTime % 3600) / 60);
  let secs = elapsedTime % 60;
  document.getElementById("stopwatchTime").textContent =
    `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

function startStopwatch() {
  if (stopwatchInterval) return;
  stopwatchInterval = setInterval(() => {
    elapsedTime++;
    updateStopwatch();
  }, 1000);
}
function stopStopwatch() {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
}
function resetStopwatch() {
  elapsedTime = 0;
  updateStopwatch();
}

// World Clock
function updateWorldClock() {
  const city = document.getElementById("citySelect").value;
  const now = new Date().toLocaleTimeString("en-US", { timeZone: city });
  document.getElementById("worldClock").textContent = now;
}
setInterval(updateWorldClock, 1000);
updateWorldClock();
