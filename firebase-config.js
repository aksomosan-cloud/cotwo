// firebase-config.js - Firebase Configuration (Fixed)

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

// دالة التهيئة الآمنة
function initializeFirebase() {
    if (typeof firebase === 'undefined') {
        console.warn('⏳ Firebase SDK still loading...');
        setTimeout(initializeFirebase, 300);
        return;
    }

    // تحقق إذا كان Firebase مهيأ بالفعل
    if (firebase.apps && firebase.apps.length > 0) {
        console.log('✅ Firebase already initialized');
        window.isFirebaseReady = true;
        
        if (typeof firebase.firestore === "function") {
            window.db = firebase.firestore();
            // ✅ إصلاح المشكلة: استخدم merge: true
            window.db.settings({ 
                experimentalAutoDetectLongPolling: true,
                ignoreUndefinedProperties: true,
                merge: true  // ✅ هنا الحل
            });
        }
        return;
    }

    if (!isFirebaseConfigReady(firebaseConfig)) {
        console.warn('⚠️ Firebase config incomplete');
        return;
    }

    try {
        firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase initialized successfully');

        if (typeof firebase.firestore === "function") {
            window.db = firebase.firestore();
            // ✅ إصلاح المشكلة: استخدم merge: true
            window.db.settings({ 
                experimentalAutoDetectLongPolling: true,
                ignoreUndefinedProperties: true,
                merge: true  // ✅ هنا الحل
            });
            console.log('✅ Firestore ready');
        }

        if (typeof firebase.analytics === "function") {
            window.analytics = firebase.analytics();
        }

        window.isFirebaseReady = true;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        setTimeout(initializeFirebase, 1000);
    }
}

// ابدأ بعد تأخير بسيط
setTimeout(initializeFirebase, 500);

window.getFirebaseErrorMessage = function (error, fallback) {
    const code = error && error.code ? error.code : 'unknown-error';
    return `${fallback}\nرمز الخطأ: ${code}`;
};