import { db, doc, updateDoc, serverTimestamp } from './firebase.js';

export const syncDraft = async draft => {
  if (!draft.firebaseDocumentId) return;
  await updateDoc(doc(db, 'users', draft.firebaseDocumentId), {
    ...draft,
    updatedAt: serverTimestamp()
  });
};
