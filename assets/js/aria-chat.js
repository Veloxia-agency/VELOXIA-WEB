'use strict';

function pWait(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

function chatBubble(threadId, m, firstAria) {
  var thread = document.getElementById(threadId);
  var row = document.createElement('div');
  row.className = 'p-row p-' + m.s;
  var wrap = document.createElement('div');
  wrap.className = 'p-wrap';
  if (m.s === 'aria' && firstAria) {
    var chip = document.createElement('div');
    chip.className = 'p-senderchip';
    chip.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z"/></svg> ARIA · Setter IA';
    wrap.appendChild(chip);
  }
  var b = document.createElement('div');
  b.className = 'p-bubble';
  b.textContent = m.t;
  wrap.appendChild(b);
  var meta = document.createElement('div');
  meta.className = 'p-meta';
  if (m.s === 'aria') {
    meta.innerHTML = 'Entregado <span class="p-read"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12l5 5 7-9"/><path d="M11 16l2 1 7-9"/></svg> Leído</span>';
  } else {
    var mins = ['41','42','43','44','45','46','47'];
    meta.textContent = '9:' + mins[Math.floor(Math.random() * mins.length)];
  }
  wrap.appendChild(meta);
  row.appendChild(wrap);
  thread.appendChild(row);
  requestAnimationFrame(function() { row.classList.add('show'); });
  thread.scrollTop = thread.scrollHeight;
}

function chatTyping(threadId) {
  var thread = document.getElementById(threadId);
  var row = document.createElement('div');
  row.className = 'p-row p-lead p-typing show';
  row.innerHTML = '<div class="p-bubble"><div class="p-dots"><i></i><i></i><i></i></div></div>';
  thread.appendChild(row);
  thread.scrollTop = thread.scrollHeight;
  return row;
}

async function playChat(threadId, msgs) {
  var thread = document.getElementById(threadId);
  var rows = thread.querySelectorAll('.p-row');
  for (var i = 0; i < rows.length; i++) rows[i].remove();
  var firstAria = true;
  await pWait(400);
  for (var j = 0; j < msgs.length; j++) {
    var m = msgs[j];
    if (m.s === 'aria') {
      var t = chatTyping(threadId);
      await pWait(1100);
      t.remove();
      chatBubble(threadId, m, firstAria);
      if (firstAria) firstAria = false;
    } else {
      await pWait(550);
      chatBubble(threadId, m, false);
    }
    await pWait(450);
  }
}
