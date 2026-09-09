const firebaseConfig = {
    apiKey: "AIzaSyCvBU3NS8MaP1HFlufrRBfWY07vIFgup_o",
    authDomain: "smac-6951a.firebaseapp.com",
    projectId: "smac-6951a",
    storageBucket: "smac-6951a.firebasestorage.app",
    messagingSenderId: "378062618040",
    appId: "1:378062618040:web:a08c895ff85c4f264d634d",
    measurementId: "G-J23HM3D05D"
};

function isFirebaseConfigReady(config) {
    return Boolean(
        config.apiKey &&
        config.projectId &&
        !config.apiKey.startsWith("PASTE_") &&
        !config.projectId.startsWith("PASTE_")
    );
}

window.firebaseConfig = firebaseConfig;
window.isFirebaseReady = false;
window.db = null;
window.analytics = null;

if (window.firebase && isFirebaseConfigReady(firebaseConfig)) {
    firebase.initializeApp(firebaseConfig);

    if (typeof firebase.firestore === "function") {
        window.db = firebase.firestore();
        window.db.settings({ experimentalAutoDetectLongPolling: true });
    }

    if (typeof firebase.analytics === "function") {
        window.analytics = firebase.analytics();
    }

    window.isFirebaseReady = true;
} else {
    console.warn("Firebase is not configured yet. Paste your Firebase web app config in firebase-config.js.");
}

window.getFirebaseErrorMessage = function (error, fallback) {
    const code = error && error.code ? error.code : 'unknown-error';
    return `${fallback}\nرمز الخطأ: ${code}`;
};
