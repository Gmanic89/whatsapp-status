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

  var initialMessage = 'Hola! Quiero informacion 🎮';
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
// CHAT WIDGET RESPONSIVE
// ========================================

var socket = null;
var username = null;
var sessionId = null;
var isReconnecting = false;
var isCheckingUsername = false;
var isMobile = window.innerWidth <= 768;
var isMinimized = false;

// Referencias a elementos del DOM
var chatButton = document.getElementById('chat-button');
var chatContainer = document.getElementById('chat-container');
var chatClose = document.getElementById('chat-close');
var chatHeader = document.getElementById('chat-header');
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

// ========== DETECCIÓN DE TECLADO MÓVIL ==========
var originalHeight = window.innerHeight;

window.addEventListener('resize', function() {
  if (isMobile) {
    var currentHeight = window.innerHeight;
    
    if (originalHeight - currentHeight > 100) {
      chatContainer.classList.add('keyboard-open');
      console.log('📱 Teclado móvil abierto');
    } else {
      chatContainer.classList.remove('keyboard-open');
      console.log('📱 Teclado móvil cerrado');
    }
  }
});

// ========== FUNCIONES MOBILE ==========
function toggleChatMobile() {
  if (!isMobile) return;
  
  isMinimized = !isMinimized;
  
  if (isMinimized) {
    chatContainer.classList.add('minimized');
    chatButton.classList.add('show');
    console.log('📱 Chat minimizado');
  } else {
    chatContainer.classList.remove('minimized');
    chatButton.classList.remove('show');
    scrollToBottom();
    console.log('📱 Chat expandido');
  }
}

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

// ========== VALIDAR NOMBRE DE USUARIO ==========
function validateUsername(name, callback) {
  if (!socket || !socket.connected) {
    var tempSocket = io(BACKEND_URL + '/client', {
      transports: ['websocket', 'polling'],
      reconnection: false
    });

    tempSocket.on('connect', function () {
      console.log('🔌 Socket temporal conectado para validación');
      tempSocket.emit('check_username', { username: name });
    });

    tempSocket.on('username_validation', function (data) {
      console.log('✅ Validación recibida:', data);
      tempSocket.disconnect();
      callback(data);
    });

    tempSocket.on('connect_error', function (error) {
      console.error('❌ Error de conexión en validación:', error);
      tempSocket.disconnect();
      callback({ 
        available: false, 
        message: 'Error de conexión. Intenta nuevamente.' 
      });
    });
  } else {
    socket.emit('check_username', { username: name });
    
    socket.once('username_validation', function (data) {
      callback(data);
    });
  }
}

// ========== MOSTRAR SUGERENCIAS ==========
function showUsernameSuggestions(username, suggestions) {
  var formContent = registerForm.querySelector('p');
  var suggestionHTML = `
    <div style="margin: 15px 0; padding: 12px; background: rgba(255,193,7,0.1); border-radius: 8px; border-left: 3px solid #ffc107;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #ffc107;">
        ⚠️ El nombre "${username}" ya está en uso
      </p>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #ccc;">
        Te sugerimos estos nombres disponibles:
      </p>
      <div id="suggestions-container">
        ${suggestions.map((s, i) => `
          <button 
            class="suggestion-btn" 
            onclick="selectSuggestion('${s}')"
            style="
              display: inline-block;
              margin: 4px;
              padding: 8px 16px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border: none;
              border-radius: 20px;
              color: white;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s;
            "
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
          >
            ${s}
          </button>
        `).join('')}
      </div>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: #888;">
        O ingresá un nombre diferente
      </p>
    </div>
  `;

  var existingSuggestions = registerForm.querySelector('#suggestions-container');
  if (existingSuggestions) {
    existingSuggestions.parentElement.remove();
  }

  formContent.insertAdjacentHTML('afterend', suggestionHTML);
  usernameInput.value = '';
  usernameInput.focus();
}

// ========== SELECCIONAR SUGERENCIA ==========
window.selectSuggestion = function (suggestedName) {
  console.log('📝 Sugerencia seleccionada:', suggestedName);
  
  var suggestionsDiv = document.querySelector('#suggestions-container');
  if (suggestionsDiv) {
    suggestionsDiv.parentElement.remove();
  }

  usernameInput.value = suggestedName;
  startChat();
};

// ========== EVENT LISTENERS ==========

// Header click para minimizar en mobile
chatHeader.addEventListener('click', function(e) {
  if (isMobile && !registerForm.style.display && registerForm.style.display !== 'none') {
    return;
  }
  
  if (isMobile && e.target !== chatClose) {
    toggleChatMobile();
  }
});

// Botón flotante (solo mobile)
chatButton.addEventListener('click', function () {
  toggleChatMobile();
});

// Botón cerrar (solo mobile minimiza)
chatClose.addEventListener('click', function (e) {
  e.stopPropagation();
  
  if (isMobile) {
    toggleChatMobile();
  }
});

registerButton.addEventListener('click', startChat);
usernameInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    startChat();
  }
});

// ========== INICIAR CHAT CON VALIDACIÓN ==========
function startChat() {
  var name = usernameInput.value.trim();
  
  if (name.length < 2) {
    showStatus('Por favor, ingresá un nombre válido (mínimo 2 caracteres)', 'error');
    return;
  }

  if (isCheckingUsername) {
    console.log('⏳ Ya hay una validación en curso...');
    return;
  }

  isCheckingUsername = true;
  registerButton.textContent = 'Verificando...';
  registerButton.disabled = true;
  usernameInput.disabled = true;

  console.log('🔍 Validando nombre:', name);

  validateUsername(name, function (result) {
    isCheckingUsername = false;
    registerButton.textContent = 'Iniciar Chat';
    registerButton.disabled = false;
    usernameInput.disabled = false;

    if (result.available) {
      console.log('✅ Nombre disponible:', name);
      
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
    } else {
      console.log('❌ Nombre no disponible:', name);
      
      if (result.suggestions && result.suggestions.length > 0) {
        showUsernameSuggestions(name, result.suggestions);
      } else {
        showStatus(result.message || 'Este nombre ya está en uso', 'error');
      }
    }
  });
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
      if (msg.imageData) {
        addImageMessage(msg.type, msg.imageData, msg.message || '');
      } else {
        addMessage(msg.type, msg.message, new Date(msg.timestamp));
      }
    });

    registerForm.style.display = 'none';
    messagesArea.classList.add('active');
    inputArea.classList.add('active');
    quickOptions.classList.add('active');

    scrollToBottom();
    showStatus('Bienvenido de vuelta, ' + username + ' ✓', 'success');
    
    console.log('✅ Historial cargado y chat restaurado');
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
    
    if (data.code === 'USERNAME_TAKEN') {
      messagesArea.classList.remove('active');
      inputArea.classList.remove('active');
      quickOptions.classList.remove('active');
      registerForm.style.display = 'block';
      
      showStatus('Este nombre ya fue tomado. Por favor, elige otro.', 'error');
      localStorage.removeItem('fwild_chat_session');
    } else {
      showStatus(data.message || 'Ocurrió un error', 'error');
    }
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
  
  bubble.style.whiteSpace = 'pre-line';
  
  if (text.includes('\n')) {
    bubble.innerHTML = text.replace(/\n/g, '<br>');
  } else {
    bubble.textContent = text;
  }

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

  if (caption && caption !== '[Imagen]' && caption !== '📤 Enviando...') {
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
  setTimeout(function() {
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }, 100);
}

// ========== AUTO RESIZE TEXTAREA ==========
messageInput.addEventListener('input', function () {
  autoResize(this);
});

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
}

// ========================================
// 📷 ENVÍO DE IMÁGENES - FIX PARA iOS/Safari
// ========================================

console.log('🔧 Inicializando sistema de imágenes...');

// ✅ NO crear input oculto, usar el del HTML directamente
var imageInput = document.getElementById('image-input-hidden');

// Si no existe en el HTML, crearlo
if (!imageInput) {
  console.log('⚠️ Creando input de imagen...');
  imageInput = document.createElement('input');
  imageInput.type = 'file';
  imageInput.id = 'image-input-hidden';
  imageInput.accept = 'image/*';
  imageInput.capture = 'environment';
  imageInput.style.display = 'none';
  document.body.appendChild(imageInput);
}

console.log('✅ Input de imagen listo:', imageInput);

// Variable para detectar si ya se procesó un archivo
var lastProcessedFile = null;
var isProcessingFile = false;

// ✅ FUNCIÓN PARA PROCESAR ARCHIVO (reutilizable)
function processImageFile(file) {
  // Prevenir procesamiento duplicado
  if (isProcessingFile) {
    console.log('⏳ Ya hay un archivo procesándose, ignorando...');
    return;
  }
  
  // Prevenir procesar el mismo archivo dos veces
  if (lastProcessedFile && 
      lastProcessedFile.name === file.name && 
      lastProcessedFile.size === file.size &&
      lastProcessedFile.lastModified === file.lastModified) {
    console.log('⏭️ Archivo ya procesado, ignorando duplicado');
    return;
  }
  
  console.log('📷 Archivo detectado:');
  console.log('  - Nombre:', file.name);
  console.log('  - Tamaño:', file.size, 'bytes');
  console.log('  - Tipo:', file.type);
  console.log('  - Última modificación:', new Date(file.lastModified));

  // Validar tipo
  if (!file.type.startsWith('image/')) {
    console.error('❌ No es una imagen');
    showStatus('❌ Solo se permiten imágenes', 'error');
    return;
  }

  // Validar tamaño (5MB)
  var maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    var sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    console.error('❌ Imagen muy grande:', sizeMB, 'MB');
    showStatus('❌ Imagen muy grande (' + sizeMB + 'MB). Máximo 5MB', 'error');
    return;
  }

  console.log('✅ Validación pasada, procesando imagen...');
  
  // Marcar como procesando
  isProcessingFile = true;
  lastProcessedFile = file;
  
  // Procesar imagen
  handleImageFile(file);
  
  // Desmarcar después de 2 segundos
  setTimeout(function() {
    isProcessingFile = false;
  }, 2000);
}

// ✅ EVENTO CHANGE
imageInput.addEventListener('change', function(e) {
  console.log('🎉 CHANGE EVENT TRIGGERED!');
  console.log('Files:', e.target.files);
  console.log('Files length:', e.target.files.length);
  
  var file = e.target.files[0];
  
  if (!file) {
    console.log('❌ No hay archivo seleccionado');
    return;
  }
  
  processImageFile(file);
  
  // Reset input después de un breve delay
  setTimeout(function() {
    imageInput.value = '';
    console.log('🔄 Input reseteado');
  }, 500);
});

// ✅ EVENTO ADICIONAL: INPUT (fallback para Chrome Android)
imageInput.addEventListener('input', function(e) {
  console.log('📥 INPUT EVENT TRIGGERED! (fallback)');
  
  if (e.target.files && e.target.files.length > 0) {
    var file = e.target.files[0];
    console.log('Archivo detectado vía INPUT event');
    processImageFile(file);
  }
});

// ✅ POLLING COMO ÚLTIMO RECURSO (para Fototeca de Chrome)
var pollingInterval = null;
var lastFileCount = 0;

function startFilePolling() {
  console.log('🔄 Iniciando polling de archivos...');
  lastFileCount = imageInput.files ? imageInput.files.length : 0;
  
  pollingInterval = setInterval(function() {
    if (imageInput.files && imageInput.files.length > 0) {
      var currentCount = imageInput.files.length;
      
      if (currentCount !== lastFileCount) {
        console.log('📊 Cambio detectado en files! Anterior:', lastFileCount, 'Nuevo:', currentCount);
        lastFileCount = currentCount;
        
        var file = imageInput.files[0];
        if (file) {
          console.log('✅ Archivo detectado vía POLLING!');
          processImageFile(file);
          stopFilePolling();
          
          // Reset input
          setTimeout(function() {
            imageInput.value = '';
          }, 500);
        }
      }
    }
  }, 300); // Revisar cada 300ms
}

function stopFilePolling() {
  if (pollingInterval) {
    console.log('⏹️ Deteniendo polling');
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

// Detener polling después de 10 segundos (timeout)
function startPollingWithTimeout() {
  startFilePolling();
  
  setTimeout(function() {
    if (pollingInterval) {
      console.log('⏱️ Timeout de polling alcanzado');
      stopFilePolling();
    }
  }, 10000); // 10 segundos máximo
}

// ✅ DETECTAR CUANDO EL USUARIO REGRESA A LA APP
var wasSelectingFile = false;

window.addEventListener('blur', function() {
  if (document.activeElement === imageInput) {
    console.log('👋 Usuario salió a seleccionar archivo');
    wasSelectingFile = true;
  }
});

window.addEventListener('focus', function() {
  if (wasSelectingFile) {
    console.log('👀 Usuario regresó a la app');
    wasSelectingFile = false;
    
    // Esperar un poco y revisar si hay archivo
    setTimeout(function() {
      if (imageInput.files && imageInput.files.length > 0) {
        console.log('✅ Archivo detectado al regresar (focus event)!');
        var file = imageInput.files[0];
        processImageFile(file);
        
        // Reset
        setTimeout(function() {
          imageInput.value = '';
        }, 500);
      } else {
        console.log('ℹ️ Usuario canceló la selección');
      }
    }, 300);
  }
});

// ✅ Función para abrir selector
window.selectImage = function() {
  console.log('📷 selectImage() llamada');
  
  if (!socket || !socket.connected) {
    console.error('❌ Socket no conectado');
    showStatus('No estás conectado. Espera...', 'error');
    return;
  }
  
  if (!username) {
    console.error('❌ Sin username');
    showStatus('Debes iniciar sesión primero', 'error');
    return;
  }
  
  console.log('✅ Abriendo selector de archivos...');
  console.log('Input element:', imageInput);
  
  // Limpiar input antes de abrir
  imageInput.value = '';
  
  // Trigger click
  imageInput.click();
  
  console.log('✅ Click ejecutado en input');
  
  // ⚡ INICIAR POLLING después del click (para Chrome Android Fototeca)
  setTimeout(function() {
    startPollingWithTimeout();
  }, 500);
};

// ✅ Nueva función para manejar el archivo
function handleImageFile(file) {
  console.log('🔄 handleImageFile() iniciado');
  
  var reader = new FileReader();
  
  reader.onloadstart = function() {
    console.log('📖 Iniciando lectura del archivo...');
    showStatus('Cargando imagen...', 'warning');
  };
  
  reader.onprogress = function(e) {
    if (e.lengthComputable) {
      var percentLoaded = Math.round((e.loaded / e.total) * 100);
      console.log('📊 Progreso:', percentLoaded + '%');
    }
  };
  
  reader.onload = function(e) {
    console.log('✅ Archivo leído correctamente');
    console.log('Data URL length:', e.target.result.length);
    
    // Mostrar preview
    addImageMessage('user', e.target.result, '📤 Enviando...');
    scrollToBottom();
    
    console.log('✅ Preview mostrado, iniciando envío...');
    
    // Enviar al servidor
    sendImageToServer(file);
  };
  
  reader.onerror = function(error) {
    console.error('❌ Error al leer archivo:', error);
    showStatus('Error al leer la imagen', 'error');
    addSystemMessage('❌ No se pudo leer la imagen');
  };
  
  console.log('📖 Iniciando FileReader.readAsDataURL()...');
  reader.readAsDataURL(file);
}

// ✅ Función para enviar imagen al servidor
async function sendImageToServer(file) {
  console.log('🚀 sendImageToServer() iniciado');
  
  if (!socket || !socket.connected) {
    console.error('❌ Socket desconectado');
    showStatus('No estás conectado', 'error');
    addSystemMessage('❌ Error: No hay conexión');
    return;
  }

  if (!username) {
    console.error('❌ Sin username');
    showStatus('No estás registrado', 'error');
    addSystemMessage('❌ Error: Sin sesión');
    return;
  }

  try {
    console.log('📦 Preparando FormData...');
    
    var formData = new FormData();
    formData.append('image', file);
    formData.append('username', username);
    formData.append('sessionId', sessionId);
    
    console.log('FormData creado:');
    console.log('  - image:', file.name);
    console.log('  - username:', username);
    console.log('  - sessionId:', sessionId);

    showStatus('Enviando imagen...', 'warning');
    console.log('🌐 Enviando petición a:', BACKEND_URL + '/api/upload-image');

    var response = await fetch(BACKEND_URL + '/api/upload-image', {
      method: 'POST',
      body: formData
    });

    console.log('📡 Respuesta recibida:', response.status, response.statusText);

    if (!response.ok) {
      var errorData;
      try {
        errorData = await response.json();
        console.error('❌ Error del servidor:', errorData);
      } catch (e) {
        console.error('❌ No se pudo parsear error:', e);
        errorData = { error: 'Error desconocido del servidor' };
      }
      throw new Error(errorData.error || 'Error al enviar imagen (HTTP ' + response.status + ')');
    }

    var data = await response.json();
    console.log('✅ Respuesta exitosa:', data);
    
    showStatus('Imagen enviada ✓', 'success');
    showTyping();
    
    console.log('🎉 Imagen enviada exitosamente');

  } catch (error) {
    console.error('❌ Error en sendImageToServer:', error);
    console.error('Stack trace:', error.stack);
    
    showStatus('Error: ' + error.message, 'error');
    addSystemMessage('❌ No se pudo enviar la imagen: ' + error.message);
  }
}

// Soporte para pegar imágenes (Ctrl+V / Cmd+V)
messageInput.addEventListener('paste', function(e) {
  console.log('📋 Paste event detectado');
  
  var items = e.clipboardData.items;
  console.log('Clipboard items:', items.length);
  
  for (var i = 0; i < items.length; i++) {
    console.log('Item', i, ':', items[i].type);
    
    if (items[i].type.startsWith('image/')) {
      console.log('✅ Imagen detectada en clipboard');
      e.preventDefault();
      
      var file = items[i].getAsFile();
      if (file) {
        console.log('📷 Procesando imagen pegada:', file.name);
        handleImageFile(file);
      }
      break;
    }
  }
});

console.log('✅ Sistema de envío de imágenes inicializado completamente');

// ========== AUTO-INICIALIZAR ==========
window.addEventListener('DOMContentLoaded', function () {
  isMobile = window.innerWidth <= 768;
  console.log('📱 Dispositivo:', isMobile ? 'Móvil' : 'Desktop');
  
  var savedSession = loadSession();
  
  if (savedSession) {
    username = savedSession.username;
    sessionId = savedSession.sessionId;
    isReconnecting = true;
    
    console.log('🔄 Sesión encontrada, reconectando como:', username);
    
    registerForm.style.display = 'none';
    messagesArea.classList.add('active');
    inputArea.classList.add('active');
    quickOptions.classList.add('active');
    
    addSystemMessage('Reconectando como ' + username + '...');
    connectToBot();
    
    console.log('✅ Reconexión iniciada para:', username);
  } else {
    console.log('🆕 Primera visita, mostrando formulario de registro');
    
    registerForm.style.display = 'block';
    messagesArea.classList.remove('active');
    inputArea.classList.remove('active');
    quickOptions.classList.remove('active');
    
    if (isMobile) {
      setTimeout(function() {
        usernameInput.focus();
      }, 500);
    } else {
      setTimeout(function() {
        usernameInput.focus();
      }, 300);
    }
  }
});