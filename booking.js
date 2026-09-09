/* ============================================
   منطق الحجز المشترك - محسّن v2
   ============================================ */

const hourlyPrices = {
    morning: { '4': 60, '6': 80, '8': 100, '10': 130 },
    evening: { '4': 65, '6': 95, '8': 115, '10': 155 }
};

const monthlyPrices = {
    '1': 800,
    '2': 1400,
    '3': 1800
};

const residentPrices = {
    '1': 1200,
    '3': 3200,
    '6': 5800,
    '12': 10000
};

// تحديث سعر الحجز بالساعة
function updateHourlyPrice() {
    const hours = document.getElementById('hours')?.value;
    const period = document.getElementById('pickup_period')?.value;
    const workers = document.getElementById('workers_count')?.value;
    
    if (hours && period && workers && hourlyPrices[period]) {
        const basePrice = hourlyPrices[period][hours] || 0;
        const totalPrice = basePrice * workers;
        const priceDisplay = document.getElementById('price_display');
        if (priceDisplay) {
            priceDisplay.textContent = `السعر الإجمالي: ${totalPrice} ريال`;
            priceDisplay.style.display = 'block';
        }
    }
}

// تحديث سعر الحجز الشهري
function updateMonthlyPrice() {
    const months = document.getElementById('months')?.value;
    const workers = document.getElementById('workers_count')?.value;
    
    if (months && workers && monthlyPrices[months]) {
        const basePrice = monthlyPrices[months];
        const totalPrice = basePrice * workers;
        const priceDisplay = document.getElementById('price_display');
        if (priceDisplay) {
            priceDisplay.textContent = `السعر الإجمالي: ${totalPrice} ريال`;
            priceDisplay.style.display = 'block';
        }
    }
}

// تحديث سعر الحجز المقيم
function updateResidentPrice() {
    const duration = document.getElementById('duration')?.value;
    
    if (duration && residentPrices[duration]) {
        const totalPrice = residentPrices[duration];
        const priceDisplay = document.getElementById('price_display');
        if (priceDisplay) {
            priceDisplay.textContent = `السعر الإجمالي: ${totalPrice} ريال`;
            priceDisplay.style.display = 'block';
        }
    }
}

// حفظ بيانات الخطوة
function saveStep(stepNum, data) {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    const key = `booking_${bookingType}_step${stepNum}`;
    try {
        sessionStorage.setItem(key, JSON.stringify(data));
        console.log(`✅ Step ${stepNum} saved locally`);
    } catch (error) {
        console.warn('Session storage error:', error);
    }
}

// قراءة بيانات الخطوة
function loadStep(stepNum) {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    const key = `booking_${bookingType}_step${stepNum}`;
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function getLocalBookingsKey() {
    return 'sm_local_booking_store';
}

function readLocalBookings() {
    try {
        const raw = localStorage.getItem(getLocalBookingsKey());
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        console.warn('Unable to read local booking cache.', error);
        return [];
    }
}

function getCurrentBookingIdKey(bookingType) {
    return `booking_${bookingType}_current_id`;
}

// حفظ في localStorage مع معالجة الأخطاء
function saveBookingToLocalStorage(bookingType, data, status = 'incomplete') {
    try {
        const localBookings = readLocalBookings();
        const currentIdKey = getCurrentBookingIdKey(bookingType);
        let bookingId = sessionStorage.getItem(currentIdKey);
        const now = new Date().toISOString();

        if (!bookingId) {
            bookingId = 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(currentIdKey, bookingId);
        }

        const bookingIndex = localBookings.findIndex(item => item.id === bookingId);
        const bookingRecord = bookingIndex >= 0 ? localBookings[bookingIndex] : {
            id: bookingId,
            booking_type: bookingType,
            createdAt: now,
            status
        };

        const mergedRecord = {
            ...bookingRecord,
            ...data,
            id: bookingId,
            booking_type: bookingType,
            updatedAt: now,
            status: status || bookingRecord.status || 'incomplete'
        };

        if (bookingIndex >= 0) {
            localBookings[bookingIndex] = mergedRecord;
        } else {
            localBookings.unshift(mergedRecord);
        }

        localStorage.setItem(getLocalBookingsKey(), JSON.stringify(localBookings));
        console.log('✅ Booking saved locally:', bookingId);
        return bookingId;
    } catch (error) {
        console.warn('Unable to save local booking cache.', error);
    }
}

// حفظ آمن في Firebase و Local معاً
async function persistBookingProgressSafely(bookingType, data, status = 'incomplete') {
    // احفظ محلياً أولاً
    const bookingId = saveBookingToLocalStorage(bookingType, data, status);

    // حاول Firebase
    if (!window.isFirebaseReady || !window.db) {
        console.warn('⚠️ Firebase not ready — saved locally only');
        return { success: false, bookingId, local: true };
    }

    try {
        await upsertBookingProgress(bookingType, data, status);
        console.log('✅ Booking synced to Firebase:', bookingId);
        return { success: true, bookingId, local: false };
    } catch (error) {
        console.error('❌ Firebase error (saved locally):', error);
        return { success: false, bookingId, local: true, error };
    }
}

// رفع إلى Firebase
async function upsertBookingProgress(bookingType, data, status = 'incomplete') {
    if (!window.isFirebaseReady || !window.db) {
        throw new Error('Firebase not ready');
    }

    const currentIdKey = getCurrentBookingIdKey(bookingType);
    let bookingId = sessionStorage.getItem(currentIdKey);
    const now = new Date().toISOString();

    if (!bookingId) {
        bookingId = 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem(currentIdKey, bookingId);
    }

    const bookingData = {
        ...data,
        id: bookingId,
        booking_type: bookingType,
        createdAt: now,
        updatedAt: now,
        status
    };

    const bookingRef = window.db.collection('bookings').doc(bookingId);
    await bookingRef.set(bookingData, { merge: true });
    return bookingId;
}

// مسح البيانات
function clearBooking() {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    for (let i = 1; i <= 4; i++) {
        sessionStorage.removeItem(`booking_${bookingType}_step${i}`);
    }
    const currentIdKey = getCurrentBookingIdKey(bookingType);
    sessionStorage.removeItem(currentIdKey);
    console.log('✅ Booking cleared');
}

// حفظ الحجز المكتمل
async function saveCompletedBooking(bookingData) {
    const bookingType = bookingData.booking_type || window.BOOKING_TYPE || 'hourly';
    const currentIdKey = getCurrentBookingIdKey(bookingType);
    let bookingId = sessionStorage.getItem(currentIdKey);
    const now = new Date().toISOString();

    if (!bookingId) {
        bookingId = 'BK-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    const completedBooking = {
        ...bookingData,
        id: bookingId,
        booking_type: bookingType,
        createdAt: bookingData.createdAt || now,
        updatedAt: now,
        status: bookingData.status || 'pending'
    };

    saveBookingToLocalStorage(bookingType, completedBooking, completedBooking.status);
    sessionStorage.removeItem(currentIdKey);

    if (!window.isFirebaseReady || !window.db) {
        console.warn('⚠️ Saved locally only (Firebase not ready)');
        return bookingId;
    }

    try {
        const bookingRef = window.db.collection('bookings').doc(bookingId);
        await bookingRef.set(completedBooking, { merge: true });
        console.log('✅ Booking completed and sent to Firebase:', bookingId);
        return bookingId;
    } catch (error) {
        console.error('❌ Firebase error:', error);
        return bookingId;
    }
}

// تشغيل صوت النجاح
function playSuccessSound() {
    try {
        // محاولة استخدام Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
        
        console.log('✅ Success sound played');
    } catch (error) {
        console.log('ℹ️ Sound not available:', error.message);
    }
}

// الأسماء العربية للجنسيات
const nationalityNames = {
    filipina: 'فلبينية',
    indonesian: 'إندونيسية',
    indian: 'هندية',
    srilankan: 'سريلانكية',
    nepali: 'نيبالية',
    ethiopian: 'إثيوبية',
    other: 'أخرى'
};

// الأسماء العربية للمحافظات
const governorateNamesMap = {
    muscat: "مسقط",
    dhofar: "ظفار",
    musandam: "مسندم",
    al_buraimi: "البريمي",
    al_dhahirah: "الظاهرة",
    al_dakhiliyah: "الداخلية",
    north_al_batinah: "شمال الباطنة",
    south_al_batinah: "جنوب الباطنة",
    north_al_sharqiyah: "شمال الشرقية",
    south_al_sharqiyah: "جنوب الشرقية",
    al_wusta: "الوسطى",
    riyadh: "الرياض",
    jeddah: "جدة",
    makkah: "مكة المكرمة",
    madinah: "المدينة المنورة",
    dammam: "الدمام",
    khobar: "الخبر",
    taif: "الطائف",
    abha: "أبها",
    khamis: "خميس مشيط",
    buraydah: "بريدة",
    unayzah: "عنيزة",
    tabuk: "تبوك",
    hail: "حائل",
    jizan: "جازان",
    najran: "نجران",
    baha: "الباحة",
    sakaka: "سكاكا",
    arar: "عرعر",
    ahsa: "الأحساء",
    jubail: "الجبيل",
    yanbu: "ينبع",
    qatif: "القطيف"
};

console.log('✅ Booking.js loaded successfully');