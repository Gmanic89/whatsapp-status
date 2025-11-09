// ========== CONFIGURACIÓN GLOBAL ==========
const BACKEND_URL = 'https://fortunabot-production.up.railway.app';

// ========== FUNCIONES DE DECODIFICACIÓN ==========
function d(s) {
  return atob(s);
}

const enc = {
  main: d('NTQy') + d('MjE0NDA3MzYz'), // 542214407363
  telegram: d('Zm9ydHVuYXdpbGQwMQ==') // fortunawild01
};

// ========== FUNCIONES AUXILIARES ==========
function getRandomWhatsAppURL(phone, message) {
  var encodedMessage = encodeURIComponent(message);
  var formats = [
    'https://wa.me/' + phone + '?text=' + encodedMessage,
    'https://api.whatsapp.com/send?phone=' + phone + '&text=' + encodedMessage,
    'https://api.whatsapp.com/send/?phone=' + phone + '&text=' + encodedMessage + '&app_absent=0'
  ];
  return formats[Math.floor(Math.random() * formats.length)];
}

// ========== CONTROL DE LÍMITE DE CLICKS ==========
function canUserClick() {
  var now = Date.now();
  var lastClick = localStorage.getItem('last_fwild_click');
  var firstClickTime = localStorage.getItem('fwild_first_click_time');
  var totalClicks = parseInt(localStorage.getItem('fwild_total_clicks') || '0');

  if (firstClickTime) {
    var timeElapsed = now - parseInt(firstClickTime);
    var thirtyMinutes = 30 * 60 * 1000;

    if (timeElapsed >= thirtyMinutes) {
      localStorage.removeItem('fwild_total_clicks');
      localStorage.removeItem('fwild_first_click_time');
      localStorage.removeItem('last_fwild_click');
      location.reload();
      return { allowed: false, reason: 'reload' };
    }
  }

  if (lastClick && now - parseInt(lastClick) < 3000) {
    return {
      allowed: false,
      reason: 'fast',
      message: 'Por favor espera unos segundos antes de intentar nuevamente'
    };
  }

  if (totalClicks >= 3) {
    var timeElapsed = now - parseInt(firstClickTime);
    var thirtyMinutes = 30 * 60 * 1000;
    var timeRemaining = thirtyMinutes - timeElapsed;
    var minutesRemaining = Math.ceil(timeRemaining / 60000);

    return {
      allowed: false,
      reason: 'limit',
      message: 'Has alcanzado el límite de 3 intentos. Podrás intentar nuevamente en ' + minutesRemaining + ' minutos.'
    };
  }

  if (totalClicks === 0) {
    localStorage.setItem('fwild_first_click_time', now.toString());
  }

  var newTotal = totalClicks + 1;
  localStorage.setItem('fwild_total_clicks', newTotal.toString());
  localStorage.setItem('last_fwild_click', now.toString());

  return { allowed: true, remaining: 3 - newTotal };
}

// ========== EVENT LISTENERS BOTONES PRINCIPALES ==========
document.getElementById('whatsappBtn').onclick = function () {
  var clickCheck = canUserClick();

  if (!clickCheck.allowed) {
    alert(clickCheck.message);
    if (clickCheck.reason === 'limit') {
      document.getElementById('whatsappBtn').style.opacity = '0.5';
      document.getElementById('whatsappBtn').style.cursor = 'not-allowed';
      document.getElementById('telegramBtn').style.opacity = '0.5';
      document.getElementById('telegramBtn').style.cursor = 'not-allowed';
    }
    return;
  }

  if (clickCheck.remaining !== undefined && clickCheck.remaining > 0) {
    console.log('Te quedan ' + clickCheck.remaining + ' intentos');
  }

  document.getElementById('loadingOverlay').classList.add('show');

  if (typeof gtag !== 'undefined') {
    gtag('event', 'whatsapp_support_click', {
      event_category: 'engagement',
      event_label: 'Fwild Support'
    });
  }

  var initialMessage = 'Hola! Quiero consultar sobre productos de Fwild 🎮';
  var waUrl = getRandomWhatsAppURL(enc.main, initialMessage);

  setTimeout(function () {
    window.location.href = waUrl;
    setTimeout(function () {
      document.getElementById('loadingOverlay').classList.remove('show');
    }, 2000);
  }, 800);
};

document.getElementById('telegramBtn').onclick = function () {
  var clickCheck = canUserClick();

  if (!clickCheck.allowed) {
    alert(clickCheck.message);
    if (clickCheck.reason === 'limit') {
      document.getElementById('whatsappBtn').style.opacity = '0.5';
      document.getElementById('whatsappBtn').style.cursor = 'not-allowed';
      document.getElementById('telegramBtn').style.opacity = '0.5';
      document.getElementById('telegramBtn').style.cursor = 'not-allowed';
    }
    return;
  }

  if (clickCheck.remaining !== undefined && clickCheck.remaining > 0) {
    console.log('Te quedan ' + clickCheck.remaining + ' intentos');
  }

  document.getElementById('loadingOverlay').classList.add('show');

  if (typeof gtag !== 'undefined') {
    gtag('event', 'telegram_clan_click', {
      event_category: 'engagement',
      event_label: 'Fwild Telegram'
    });
  }

  setTimeout(function () {
    window.location.href = 'https://t.me/' + enc.telegram;
    setTimeout(function () {
      document.getElementById('loadingOverlay').classList.remove('show');
    }, 2000);
  }, 800);
};

// ========== ANALYTICS ==========
if (typeof gtag !== 'undefined') {
  gtag('event', 'page_view', {
    event_category: 'engagement',
    event_label: 'fwild_community',
    page_title: 'Fwild Community'
  });
}

// ========== WINDOW ONLOAD ==========
window.onload = function () {
  var now = Date.now();
  var totalClicks = parseInt(localStorage.getItem('fwild_total_clicks') || '0');
  var firstClickTime = localStorage.getItem('fwild_first_click_time');

  if (firstClickTime) {
    var timeElapsed = now - parseInt(firstClickTime);
    var thirtyMinutes = 30 * 60 * 1000;

    if (timeElapsed >= thirtyMinutes && totalClicks > 0) {
      localStorage.removeItem('fwild_total_clicks');
      localStorage.removeItem('fwild_first_click_time');
      localStorage.removeItem('last_fwild_click');
      console.log('Límite reseteado automáticamente');
    }
  }

  var currentClicks = parseInt(localStorage.getItem('fwild_total_clicks') || '0');

  if (currentClicks >= 3) {
    var firstClick = localStorage.getItem('fwild_first_click_time');
    if (firstClick) {
      var timeElapsed = now - parseInt(firstClick);
      var thirtyMinutes = 30 * 60 * 1000;
      var timeRemaining = thirtyMinutes - timeElapsed;
      var minutesRemaining = Math.ceil(timeRemaining / 60000);

      document.getElementById('whatsappBtn').style.opacity = '0.5';
      document.getElementById('whatsappBtn').style.cursor = 'not-allowed';
      document.getElementById('telegramBtn').style.opacity = '0.5';
      document.getElementById('telegramBtn').style.cursor = 'not-allowed';

      document.querySelector('.info-text').textContent = '⏱️ Límite alcanzado. Espera ' + minutesRemaining + ' minutos';
      document.querySelector('.info-text').style.color = '#ffeb3b';
    }
  }
};

// ========================================
// CHAT WIDGET
// ========================================

var socket = null;
var username = null;
var sessionId = null;
var isReconnecting = false;

// Referencias a elementos del DOM
var chatButton = document.getElementById('chat-button');
var chatContainer = document.getElementById('chat-container');
var chatClose = document.getElementById('chat-close');
var registerForm = document.getElementById('register-form');
var usernameInput = document.getElementById('username-input');
var registerButton = document.getElementById('register-button');
var messagesArea = document.getElementById('messages-area');
var inputArea = document.getElementById('input-area');
var messageInput = document.getElementById('message-input');
var sendButton = document.getElementById('send-button');
var connectionStatus = document.getElementById('connection-status');
var typingIndicator = document.getElementById('typing-indicator');
var quickOptions = document.getElementById('quick-options');

// ========== FUNCIONES DE SESIÓN ==========
function saveSession(user, session) {
  var sessionData = {
    username: user,
    sessionId: session,
    timestamp: Date.now()
  };
  localStorage.setItem('fwild_chat_session', JSON.stringify(sessionData));
  console.log('💾 Sesión guardada:', sessionData);
}

function loadSession() {
  var savedSession = localStorage.getItem('fwild_chat_session');
  if (!savedSession) return null;
  var sessionData = JSON.parse(savedSession);
  console.log('📂 Sesión cargada:', sessionData);
  return sessionData;
}

// ========== EVENT LISTENERS CHAT ==========
chatButton.addEventListener('click', function () {
  var savedSession = loadSession();

  if (savedSession) {
    username = savedSession.username;
    sessionId = savedSession.sessionId;
    isReconnecting = true;

    chatContainer.classList.add('active');
    chatButton.classList.add('hidden');

    registerForm.style.display = 'none';
    messagesArea.classList.add('active');
    inputArea.classList.add('active');
    quickOptions.classList.add('active');

    addSystemMessage('Reconectando como ' + username + '...');

    if (!socket || !socket.connected) {
      connectToBot();
    }
  } else {
    chatContainer.classList.add('active');
    chatButton.classList.add('hidden');
  }
});

chatClose.addEventListener('click', function () {
  chatContainer.classList.remove('active');
  chatButton.classList.remove('hidden');
});

registerButton.addEventListener('click', startChat);
usernameInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') startChat();
});

// ========== INICIAR CHAT ==========
function startChat() {
  var name = usernameInput.value.trim();
  if (name.length < 2) {
    alert('Por favor, ingresá un nombre válido (mínimo 2 caracteres)');
    return;
  }

  username = name;
  sessionId = 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  isReconnecting = false;

  saveSession(username, sessionId);

  registerForm.style.display = 'none';
  messagesArea.classList.add('active');
  inputArea.classList.add('active');
  quickOptions.classList.add('active');

  addSystemMessage('Conectando...');
  connectToBot();

  if (typeof gtag !== 'undefined') {
    gtag('event', 'chat_widget_start', {
      event_category: 'engagement',
      event_label: 'Fwild Chat'
    });
  }
}

// ========== CONECTAR AL BOT ==========
function connectToBot() {
  console.log('🔌 Conectando al bot:', BACKEND_URL);

  socket = io(BACKEND_URL + '/client', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', function () {
    console.log('✅ Conectado al bot, Socket ID:', socket.id);
    showStatus('Conectado ✓', 'success');

    socket.emit('web_chat_start', {
      username: username,
      sessionId: sessionId,
      isReconnecting: isReconnecting
    });
  });

  socket.on('chat_history', function (data) {
    console.log('📜 Historial recibido:', data.messages.length, 'mensajes');

    messagesArea.innerHTML = '';

    data.messages.forEach(function (msg) {
      addMessage(msg.type, msg.message, new Date(msg.timestamp));
    });

    scrollToBottom();
    showStatus('Historial cargado ✓', 'success');
  });

  socket.on('disconnect', function () {
    console.log('❌ Desconectado del bot');
    showStatus('Desconectado. Reconectando...', 'warning');
  });

  socket.on('connect_error', function (error) {
    console.error('❌ Error de conexión:', error);
    showStatus('Error de conexión. Verifica tu internet.', 'error');
  });

  socket.on('bot_message', function (data) {
    console.log('💬 Mensaje del bot recibido:', data);
    hideTyping();

    if (data.imageData) {
      addImageMessage('bot', data.imageData, data.message || '');
    } else {
      addMessage('bot', data.message, new Date());
    }

    if (data.showMenu) {
      console.log('📋 Mostrando botones rápidos');
      quickOptions.classList.add('active');
    }
  });

  socket.on('admin_message', function (data) {
    console.log('💬 Mensaje del admin recibido:', data);
    hideTyping();
    addMessage('bot', data.message, data.timestamp || new Date());
  });

  socket.on('admin_image', function (data) {
    console.log('📷 Imagen del admin recibida');
    hideTyping();
    addImageMessage('bot', data.imageData, data.caption || '');
  });

  socket.on('message_sent', function () {
    console.log('✅ Mensaje enviado correctamente');
  });

  socket.on('error', function (data) {
    console.error('❌ Error:', data);
    showStatus(data.message || 'Ocurrió un error', 'error');
  });
}

// ========== ENVIAR MENSAJE ==========
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  var message = messageInput.value.trim();
  if (!message || !socket) return;

  addMessage('user', message, new Date());

  socket.emit('message', {
    message: message
  });

  messageInput.value = '';
  autoResize(messageInput);
  showTyping();
}

// ========== OPCIONES RÁPIDAS ==========
window.selectQuickOption = function (option) {
  console.log('🎯 Opción rápida seleccionada:', option);

  addMessage('user', option, new Date());

  if (socket) {
    socket.emit('message', {
      message: option
    });
    showTyping();
  }

  if (typeof gtag !== 'undefined') {
    gtag('event', 'chat_quick_option', {
      event_category: 'engagement',
      event_label: option
    });
  }
};

// ========== FUNCIONES DE UI ==========
function addMessage(type, text, timestamp) {
  var messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + type;

  var bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = text;

  var time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = formatTime(timestamp);

  messageDiv.appendChild(bubble);
  messageDiv.appendChild(time);
  messagesArea.appendChild(messageDiv);
  scrollToBottom();
}

function addImageMessage(type, imageSrc, caption) {
  var messageDiv = document.createElement('div');
  messageDiv.className = 'message ' + type;

  var img = document.createElement('img');
  img.className = 'message-image';
  img.src = imageSrc;
  img.onclick = function () {
    window.open(imageSrc, '_blank');
  };

  messageDiv.appendChild(img);

  if (caption) {
    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = caption;
    messageDiv.appendChild(bubble);
  }

  var time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = formatTime(new Date());
  messageDiv.appendChild(time);

  messagesArea.appendChild(messageDiv);
  scrollToBottom();
}

function addSystemMessage(text) {
  var messageDiv = document.createElement('div');
  messageDiv.className = 'system-message';
  messageDiv.textContent = text;
  messagesArea.appendChild(messageDiv);
  scrollToBottom();
}

function showStatus(message, type) {
  connectionStatus.textContent = message;
  connectionStatus.className = 'connection-status ' + type + ' show';

  setTimeout(function () {
    connectionStatus.classList.remove('show');
  }, 3000);
}

function showTyping() {
  typingIndicator.classList.add('show');
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.classList.remove('show');
}

function formatTime(timestamp) {
  var date = new Date(timestamp);
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function scrollToBottom() {
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

// ========== AUTO RESIZE TEXTAREA ==========
messageInput.addEventListener('input', function () {
  autoResize(this);
});

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
}

// ========== AUTO-RECONEXIÓN AL CARGAR ==========
window.addEventListener('DOMContentLoaded', function () {
  var savedSession = loadSession();
  if (savedSession) {
    username = savedSession.username;
    sessionId = savedSession.sessionId;
    isReconnecting = true;
    console.log('🔄 Sesión detectada, preparando auto-conexión:', username);
  }
});