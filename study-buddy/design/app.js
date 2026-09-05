const socket = io();
const chatBox = document.getElementById('chat-box');
localStorage.removeItem('studybuddy-chat-history');
const savedChatName = localStorage.getItem('studybuddy-chat-name') || '';
document.getElementById('username').value = savedChatName;
let chatHistory = [];

function initializeScrollReveals() {
  const revealTargets = [
    document.querySelector('.generator'),
    ...document.querySelectorAll('.feature-card'),
    document.querySelector('.architecture'),
    document.querySelector('.contact-section'),
    document.querySelector('.site-footer')
  ].filter(Boolean);

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-target');
    if (element.classList.contains('feature-card')) {
      element.style.setProperty('--reveal-delay', `${index * 80}ms`);
    }
  });

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(element => element.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach(element => revealObserver.observe(element));
}

initializeScrollReveals();

function saveChatMessage(data) {
  chatHistory = [...chatHistory, { sender: data.sender, message: data.message }].slice(-30);
}

function renderChatMessage(data) {
  const msgDiv = document.createElement('div');
  const isUserMessage = data.sender !== 'ChatBuddy AI';
  msgDiv.className = `chat-msg${isUserMessage ? ' user-message' : ''}`;
  msgDiv.innerHTML = `<strong>${escapeHtml(data.sender)}:</strong> ${escapeHtml(data.message)}`;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

socket.on('connect', () => {
  socket.emit('chat_context', {
    name: document.getElementById('username').value.trim(),
    conversation: chatHistory.slice(-12)
  });
});

socket.on('receive_message', (data) => {
  renderChatMessage(data);
  saveChatMessage(data);
});

function sendMessage() {
  const nameInput = document.getElementById('username');
  const msgInput = document.getElementById('chat-input');
  const sender = nameInput.value.trim() || 'Student';
  const message = msgInput.value.trim();

  if (!message) return;

  socket.emit('send_message', { sender, message });
  localStorage.setItem('studybuddy-chat-name', sender === 'Student' ? '' : sender);
  msgInput.value = '';
}

function toggleSuggestions() {
  const panel = document.getElementById('chat-suggestions');
  const toggle = document.querySelector('.suggestion-toggle');
  const isHidden = panel.hasAttribute('hidden');
  panel.toggleAttribute('hidden', !isHidden);
  toggle.setAttribute('aria-expanded', String(isHidden));
}

function useSuggestion(button) {
  const input = document.getElementById('chat-input');
  input.value = button.textContent.trim();
  input.focus();
}

function openSupportChat(message) {
  const input = document.getElementById('chat-input');
  input.value = message;
  if (!document.getElementById('chat-drawer').classList.contains('open')) toggleChat();
  input.focus();
}

function focusStudyWorkspace() {
  const notes = document.getElementById('lesson-notes');
  notes.scrollIntoView({ behavior: 'smooth', block: 'center' });
  notes.focus();
}

function prepareContactMessage(event) {
  event.preventDefault();
  const name = document.getElementById('contact-name').value.trim() || 'A StudyBuddy student';
  const message = document.getElementById('contact-message').value.trim();
  const status = document.getElementById('contact-status');
  if (!message) {
    status.hidden = false;
    status.textContent = 'Please write a message first.';
    return;
  }
  openSupportChat(`Message from ${name}: ${message}`);
  status.hidden = false;
  status.textContent = 'Your message is ready in ChatBuddy. Press Send message to submit it.';
}

let selectedFiles = [];

function showReviewChoices() {
  document.getElementById('review-actions').classList.add('ready');
}

document.getElementById('lesson-notes').addEventListener('input', (event) => {
  if (event.target.value.trim()) showReviewChoices();
});

const uploadBox = document.getElementById('upload-box');
document.getElementById('source-file').addEventListener('change', (event) => {
  addFiles(event.target.files);
  event.target.value = '';
});

['dragenter', 'dragover'].forEach(eventName => {
  uploadBox.addEventListener(eventName, (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadBox.classList.add('drag-over');
  });
});

['dragleave', 'drop'].forEach(eventName => {
  uploadBox.addEventListener(eventName, (event) => {
    event.preventDefault();
    event.stopPropagation();
    uploadBox.classList.remove('drag-over');
  });
});

uploadBox.addEventListener('drop', (event) => {
  addFiles(event.dataTransfer.files);
});

function addFiles(fileList) {
  const newFiles = Array.from(fileList).filter(file => {
    return !selectedFiles.some(existing => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified);
  });
  selectedFiles = [...selectedFiles, ...newFiles];
  renderFileList();
  if (selectedFiles.length) showReviewChoices();
}

function renderFileList() {
  const list = document.getElementById('file-list');
  document.getElementById('file-name').textContent = selectedFiles.length ? `${selectedFiles.length} file${selectedFiles.length === 1 ? '' : 's'} selected` : 'No files selected';
  list.innerHTML = selectedFiles.map((file, index) => `<div class="file-chip"><span title="${escapeHtml(file.name)}">${escapeHtml(file.name)}</span><button class="remove-file" type="button" onclick="removeFile(${index})" aria-label="Remove ${escapeHtml(file.name)}">×</button></div>`).join('');
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  renderFileList();
  if (!selectedFiles.length && !document.getElementById('lesson-notes').value.trim()) {
    document.getElementById('review-actions').classList.remove('ready');
  }
}

function toggleChat() {
  const drawer = document.getElementById('chat-drawer');
  const launcher = document.getElementById('chat-launcher');
  const isOpen = drawer.classList.toggle('open');
  launcher.classList.toggle('is-open', isOpen);
  launcher.setAttribute('aria-expanded', String(isOpen));
}

async function createReview(mode) {
  let notes = document.getElementById('lesson-notes').value.trim();
  const results = document.getElementById('results');
  if (!notes && !selectedFiles.length) { results.innerHTML = '<p class="helper">Add notes or choose a file first.</p>'; return; }
  const buttons = [document.getElementById('review-only'), document.getElementById('enhance-review')];
  buttons.forEach(button => { button.disabled = true; });
  results.innerHTML = '<p class="helper">Reading your material and building the reviewer...</p>';

  try {
    const files = [];
    for (const selectedFile of selectedFiles) {
      if (selectedFile.type.startsWith('text/') || /\.(txt|md)$/i.test(selectedFile.name)) {
        const uploadedText = await selectedFile.text();
        notes = [notes, uploadedText].filter(Boolean).join('\n\n');
        document.getElementById('lesson-notes').value = notes;
      } else {
        const dataUrl = await readFile(selectedFile);
        files.push({ mimeType: selectedFile.type || 'application/octet-stream', data: dataUrl.split(',')[1] });
      }
    }
    const res = await fetch('/api/review', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: notes, files, file: files[0] || null, mode, settings: document.getElementById('card-settings').value.trim() }) });
    const responseText = await res.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      if (res.status === 429 || responseText.toLowerCase().includes('quota exceeded')) {
        showApiNotice(
          'StudyBuddy is temporarily paused',
          '<strong>What happened:</strong> the AI is currently out of available free usage for this moment.<br><br><strong>What to do:</strong> wait a few minutes and try again, or check the billing plan if you want more access right away.'
        );
      }
      throw new Error(`The study server returned HTML instead of JSON (HTTP ${res.status}). Restart the server and try again.`);
    }
    if (!res.ok || !data.success) {
      const message = data?.error || 'Could not create the reviewer.';
      if (isQuotaErrorMessage(message, res.status)) {
        showApiNotice(
          'StudyBuddy is temporarily paused',
          `<strong>What happened:</strong> the AI has reached its daily free usage limit for now.<br><br><strong>What to do:</strong> please wait a little while and try again, or upgrade the plan if you want to keep using the AI without interruption.`
        );
        results.innerHTML = '<p class="helper" style="color:#b44b3a">The AI is currently at its usage limit. Please wait a few minutes and try again.</p>';
        return;
      }
      throw new Error(message);
    }
    renderReview(data.review, results, mode);
  } catch (err) {
    if (!isQuotaErrorMessage(err.message, null)) {
      results.innerHTML = `<p class="helper" style="color:#b44b3a">${escapeHtml(err.message)}</p>`;
    }
  } finally { buttons.forEach(button => { button.disabled = false; }); }
}

function readFile(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file); }); }

function showApiNotice(title, message) {
  const notice = document.getElementById('api-notice');
  if (!notice) return;
  notice.querySelector('.api-notice-title').textContent = title;
  notice.querySelector('.api-notice-body').innerHTML = message;
  notice.classList.add('show');
  notice.hidden = false;
  window.clearTimeout(showApiNotice.timeoutId);
  showApiNotice.timeoutId = window.setTimeout(() => {
    notice.classList.remove('show');
  }, 8000);
}

function hideApiNotice() {
  const notice = document.getElementById('api-notice');
  if (!notice) return;
  notice.classList.remove('show');
}

document.addEventListener('DOMContentLoaded', () => {
  const closeButton = document.querySelector('.api-notice-close');
  if (closeButton) closeButton.addEventListener('click', hideApiNotice);
});

function isQuotaErrorMessage(message, statusCode) {
  const text = `${statusCode || ''} ${message || ''}`.toLowerCase();
  return statusCode === 429 || text.includes('quota exceeded') || text.includes('resource_exhausted') || text.includes('rate limit') || text.includes('free tier');
}

function renderReview(review, container, mode) {
  Object.keys(selectedAnswers).forEach(key => delete selectedAnswers[key]);
  Object.keys(checkedAnswers).forEach(key => delete checkedAnswers[key]);
  const points = (review.keyPoints || []).map(point => `<li>${escapeHtml(point)}</li>`).join('');
  const cards = mode === 'enhance' ? renderFlashcards(review.flashcards || []) : '';
  container.innerHTML = `<article class="review"><div class="kicker">${mode === 'enhance' ? 'Enhanced reviewer' : 'Reviewer'}</div><h3>${escapeHtml(review.title || 'Your study reviewer')}</h3><p>${escapeHtml(review.summary)}</p><h3>Key points</h3><ul>${points}</ul><h3>Review notes</h3><p>${escapeHtml(review.reviewer)}</p>${cards}</article>`;
}

function renderFlashcards(flashcards) {
  if (!flashcards.length) return '';
  const cards = flashcards.map((card, index) => {
    const options = Array.isArray(card.options) ? card.options : [];
    const answerControl = options.length
      ? `<div class="choice-list">${options.map((option, optionIndex) => `<button type="button" class="choice-button" data-card="${index}" data-option="${optionIndex}" onclick="chooseAnswer(${index}, ${optionIndex})">${escapeHtml(option)}</button>`).join('')}</div>`
      : `<input class="answer-input" id="answer-${index}" type="text" placeholder="Type your answer...">`;
    return `<div class="card flashcard" data-flashcard="${index}" data-correct-option="${escapeHtml(card.correctOption || '')}"><div class="card-title">Card ${index + 1}</div><p class="flashcard-question">${escapeHtml(card.question)}</p>${answerControl}<div class="flashcard-feedback" id="feedback-${index}" hidden></div><div class="card-answer" id="answer-display-${index}" hidden>Answer: ${escapeHtml(card.answer)}</div></div>`;
  }).join('');
  return `<h3>Flashcards</h3><div class="score-panel" id="score-panel" hidden><strong id="score-percent">0%</strong><span id="score-text"></span></div>${cards}<button class="check-all" type="button" onclick="checkAllAnswers()">Check all answers</button><p class="answer-progress" id="answer-progress">Answer every question before checking.</p>`;
}

const selectedAnswers = {};
const checkedAnswers = {};

function chooseAnswer(cardIndex, optionIndex) {
  if (checkedAnswers[cardIndex]) return;
  selectedAnswers[cardIndex] = optionIndex;
  document.querySelectorAll(`[data-card="${cardIndex}"]`).forEach(button => button.classList.remove('selected'));
  const selected = document.querySelector(`[data-card="${cardIndex}"][data-option="${optionIndex}"]`);
  if (selected) selected.classList.add('selected');
}

function checkAllAnswers() {
  const cards = [...document.querySelectorAll('[data-flashcard]')];
  const unanswered = cards.filter(card => !getSelectedText(card));
  const progress = document.getElementById('answer-progress');
  if (unanswered.length) {
    progress.textContent = `Please answer ${unanswered.length} more question${unanswered.length === 1 ? '' : 's'} before checking.`;
    progress.style.color = '#a64f38';
    unanswered[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  cards.forEach((card, index) => gradeAnswer(card, index));
  updateScore();
  progress.textContent = 'All answers checked. You can review the answers above.';
  progress.style.color = 'var(--teal)';
  document.querySelector('.check-all').disabled = true;
}

function getSelectedText(card) {
  const selectedButton = card.querySelector('.choice-button.selected');
  const answerInput = card.querySelector('.answer-input');
  return selectedButton ? selectedButton.textContent.trim() : answerInput?.value.trim();
}

function gradeAnswer(card, cardIndex) {
  if (checkedAnswers[cardIndex]) return;
  const selectedText = getSelectedText(card);
  const answerInput = card.querySelector('.answer-input');
  const answerText = card.dataset.correctOption || card.querySelector('.card-answer').textContent.replace(/^Answer:\s*/, '').trim();
  const isCorrect = normalizeAnswer(selectedText) === normalizeAnswer(answerText) || normalizeAnswer(answerText).includes(normalizeAnswer(selectedText));
  checkedAnswers[cardIndex] = isCorrect;
  const feedback = document.getElementById(`feedback-${cardIndex}`);
  feedback.hidden = false;
  feedback.className = `flashcard-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedback.textContent = isCorrect ? 'Correct. Nice work.' : 'Not quite. Review the answer, then keep going.';
  card.querySelector('.card-answer').hidden = false;
  if (answerInput) answerInput.disabled = true;
  card.querySelectorAll('.choice-button').forEach(button => { button.disabled = true; });
}

function normalizeAnswer(value) {
  return String(value || '').toLowerCase().replace(/^[a-d][).:\s]+/i, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

function updateScore() {
  const total = document.querySelectorAll('[data-flashcard]').length;
  const completed = Object.keys(checkedAnswers).length;
  if (!total || !completed) return;
  const correct = Object.values(checkedAnswers).filter(Boolean).length;
  const percentage = Math.round((correct / total) * 100);
  const panel = document.getElementById('score-panel');
  panel.hidden = false;
  document.getElementById('score-percent').textContent = `${percentage}%`;
  document.getElementById('score-text').textContent = `${correct} of ${total} answered correctly`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
