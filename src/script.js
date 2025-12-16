// Toggle Content
function showContent(id, event) {
  document.querySelectorAll('.content').forEach(c => c.style.display = 'none');
  document.getElementById(id).style.display = 'flex';
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}


// Local Time
function updateLocalTime() {
  const timeElement = document.getElementById("localTime");
  const now = new Date();
  const newTime = now.toLocaleTimeString();
  
  // Add update animation
  timeElement.classList.add('updating');
  setTimeout(() => timeElement.classList.remove('updating'), 600);
  
  timeElement.textContent = newTime;
  document.getElementById("timezone").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
}
setInterval(updateLocalTime, 1000);
updateLocalTime();


// ======================================
// ALARM SYSTEM - Multiple Alarms with Notifications
// ======================================

// Global variables for alarm system
let alarms = [];
let alarmCheckInterval;

// Initialize alarm system
window.onload = function() {
  // Initialize time selectors
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

  // Load alarms from localStorage
  loadAlarms();
  
  // Check notification permission
  updateNotificationPermissionUI();
  
  // Start alarm checking
  startAlarmChecking();
};

// Request notification permission
function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      updateNotificationPermissionUI();
      if (permission === 'granted') {
        showNotification('Notifikasi diaktifkan!', 'Anda akan menerima notifikasi saat alarm berbunyi.');
      }
    });
  } else {
    alert('Browser Anda tidak mendukung notifikasi!');
  }
}

// Update notification permission UI
function updateNotificationPermissionUI() {
  const permissionSection = document.getElementById('notificationPermission');
  const permissionStatus = document.getElementById('permissionStatus');
  const enableBtn = document.getElementById('enableNotifications');
  
  if (!('Notification' in window)) {
    permissionSection.className = 'notification-section denied';
    permissionStatus.textContent = 'Browser tidak mendukung';
    permissionStatus.className = 'permission-status denied';
    enableBtn.style.display = 'none';
    return;
  }
  
  const permission = Notification.permission;
  
  if (permission === 'granted') {
    permissionSection.className = 'notification-section allowed';
    permissionStatus.textContent = 'Notifikasi diizinkan';
    permissionStatus.className = 'permission-status allowed';
    enableBtn.style.display = 'none';
  } else if (permission === 'denied') {
    permissionSection.className = 'notification-section denied';
    permissionStatus.textContent = 'Notifikasi ditolak';
    permissionStatus.className = 'permission-status denied';
    enableBtn.style.display = 'none';
  } else {
    permissionSection.className = 'notification-section';
    permissionStatus.textContent = 'Belum diizinkan';
    permissionStatus.className = 'permission-status';
    enableBtn.style.display = 'inline-block';
  }
}

// Generate unique ID for alarm
function generateAlarmId() {
  return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Add new alarm
function addAlarm() {
  const hour = document.getElementById("alarmHour").value;
  const minute = document.getElementById("alarmMinute").value;
  const label = document.getElementById("alarmLabel").value.trim();

  if (hour === "" || minute === "") {
    alert("Pilih jam dan menit dulu!");
    return;
  }

  const alarmTime = `${hour}:${minute}`;
  
  // Check if alarm already exists
  const existingAlarm = alarms.find(alarm => alarm.time === alarmTime && !alarm.triggered);
  if (existingAlarm) {
    alert("Alarm pada jam tersebut sudah ada!");
    return;
  }

  // Create new alarm
  const newAlarm = {
    id: generateAlarmId(),
    time: alarmTime,
    label: label || `Alarm ${alarmTime}`,
    created: new Date().toISOString(),
    triggered: false
  };

  alarms.push(newAlarm);
  saveAlarms();
  updateAlarmsList();
  
  // Clear form
  document.getElementById("alarmLabel").value = "";
  
  // Show success feedback
  showNotification('Alarm ditambahkan!', `Alarm ${alarmTime} berhasil diset.`);
}

// Delete individual alarm
function deleteAlarm(alarmId) {
  alarms = alarms.filter(alarm => alarm.id !== alarmId);
  saveAlarms();
  updateAlarmsList();
}

// Clear all alarms
function clearAllAlarms() {
  if (alarms.length === 0) return;
  
  if (confirm(`Hapus semua ${alarms.length} alarm?`)) {
    alarms = [];
    saveAlarms();
    updateAlarmsList();
  }
}

// Show notification
function showNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: body,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300d4ff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
      badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2300d4ff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>'
    });
    
    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
}

// Trigger alarm
function triggerAlarm(alarm) {
  // Mark alarm as triggered
  alarm.triggered = true;
  saveAlarms();
  
  // Play sound
  const alarmSound = document.getElementById('alarmSound');
  alarmSound.play().catch(e => console.log('Could not play sound:', e));
  
  // Show browser notification
  const notificationTitle = '⏰ Alarm!';
  const notificationBody = alarm.label || `Waktunya ${alarm.time}`;
  
  showNotification(notificationTitle, notificationBody);
  
  // Show in-app notification
  alert(notificationTitle + '\n\n' + notificationBody);
  
  // Update UI
  updateAlarmsList();
}

// Start alarm checking
function startAlarmChecking() {
  if (alarmCheckInterval) {
    clearInterval(alarmCheckInterval);
  }
  
  alarmCheckInterval = setInterval(checkAlarms, 1000);
}

// Check for triggered alarms
function checkAlarms() {
  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2,'0') + ':' +
                     now.getMinutes().toString().padStart(2,'0');
  
  alarms.forEach(alarm => {
    if (!alarm.triggered && alarm.time === currentTime) {
      triggerAlarm(alarm);
    }
  });
}

// Save alarms to localStorage
function saveAlarms() {
  localStorage.setItem('clockApp_alarms', JSON.stringify(alarms));
}

// Load alarms from localStorage
function loadAlarms() {
  const saved = localStorage.getItem('clockApp_alarms');
  if (saved) {
    try {
      alarms = JSON.parse(saved);
      // Remove triggered alarms older than 1 day
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      alarms = alarms.filter(alarm => {
        if (alarm.triggered) {
          const triggeredDate = new Date(alarm.created);
          return triggeredDate > oneDayAgo;
        }
        return true;
      });
    } catch (e) {
      console.error('Error loading alarms:', e);
      alarms = [];
    }
  }
  updateAlarmsList();
}

// Update alarms list in UI
function updateAlarmsList() {
  const alarmsList = document.getElementById('activeAlarms');
  const alarmCount = document.getElementById('alarmCount');
  const clearAllBtn = document.getElementById('clearAllBtn');
  
  // Update count
  const activeAlarms = alarms.filter(alarm => !alarm.triggered);
  alarmCount.textContent = activeAlarms.length;
  
  // Clear current list
  alarmsList.innerHTML = '';
  
  if (activeAlarms.length === 0) {
    // Show no alarms message
    const noAlarmsMsg = document.createElement('p');
    noAlarmsMsg.className = 'no-alarms';
    noAlarmsMsg.textContent = alarms.length === 0 ? 'Belum ada alarm aktif' : 'Semua alarm sudah berbunyi';
    alarmsList.appendChild(noAlarmsMsg);
  } else {
    // Show active alarms
    activeAlarms.forEach(alarm => {
      const alarmItem = document.createElement('div');
      alarmItem.className = 'alarm-item';
      
      const alarmInfo = document.createElement('div');
      alarmInfo.className = 'alarm-info';
      
      const alarmTime = document.createElement('div');
      alarmTime.className = 'alarm-time';
      alarmTime.textContent = alarm.time;
      
      const alarmLabel = document.createElement('div');
      alarmLabel.className = 'alarm-label';
      alarmLabel.textContent = alarm.label;
      
      alarmInfo.appendChild(alarmTime);
      alarmInfo.appendChild(alarmLabel);
      
      const alarmActions = document.createElement('div');
      alarmActions.className = 'alarm-actions';
      
      const statusBadge = document.createElement('span');
      statusBadge.className = 'alarm-status active';
      statusBadge.textContent = 'Aktif';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = 'Hapus';
      deleteBtn.onclick = () => deleteAlarm(alarm.id);
      
      alarmActions.appendChild(statusBadge);
      alarmActions.appendChild(deleteBtn);
      
      alarmItem.appendChild(alarmInfo);
      alarmItem.appendChild(alarmActions);
      
      alarmsList.appendChild(alarmItem);
    });
  }
  
  // Show/hide clear all button
  clearAllBtn.style.display = alarms.length > 0 ? 'inline-block' : 'none';
}

// Stopwatch
let stopwatchInterval;
let elapsedTime = 0;


function updateStopwatch() {
  const timeElement = document.getElementById("stopwatchTime");
  let hrs = Math.floor(elapsedTime / 3600);
  let mins = Math.floor((elapsedTime % 3600) / 60);
  let secs = elapsedTime % 60;
  const newTime = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  
  // Add update animation
  timeElement.classList.add('updating');
  setTimeout(() => timeElement.classList.remove('updating'), 300);
  
  timeElement.textContent = newTime;
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
  const timeElement = document.getElementById("worldClock");
  const city = document.getElementById("citySelect").value;
  const now = new Date().toLocaleTimeString("en-US", { timeZone: city });
  
  // Add update animation
  timeElement.classList.add('updating');
  setTimeout(() => timeElement.classList.remove('updating'), 600);
  
  timeElement.textContent = now;
}
setInterval(updateWorldClock, 1000);
updateWorldClock();
