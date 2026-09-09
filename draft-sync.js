import { syncDraft } from './firebase-sync.js';

(() => {
  let syncTimer;
  const saveField = field => {
    if (!field || field.type === 'checkbox' || !field.value.trim()) return;
    const draft = JSON.parse(localStorage.getItem('musaedDraft') || '{}');
    const label = field.closest('label')?.childNodes[0]?.textContent?.trim() || field.placeholder || field.getAttribute('aria-label') || 'حقل';
    draft.liveFields ||= {};
    draft.liveFields[`${document.title} — ${label}`] = field.value;
    draft.liveUpdatedAt = new Date().toLocaleTimeString('ar-OM');
    localStorage.setItem('musaedDraft', JSON.stringify(draft));
    // نؤجل المزامنة حتى يتوقف المستخدم عن الكتابة، بدل طلب شبكة لكل حرف.
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(() => {
      syncDraft(draft).catch(error => console.error('تعذر مزامنة الإدخال مع Firebase:', error));
    }, 900);
  };
  document.addEventListener('input', event => saveField(event.target));
  document.addEventListener('change', event => saveField(event.target));
})();
