/* ============================================
   منطق الحجز المشترك
   ============================================ */

// أسعار الحجز بالساعة
const hourlyPrices = {
    morning: { '4': 60, '6': 80, '8': 100, '10': 130 },
    evening: { '4': 65, '6': 95, '8': 115, '10': 155 }
};

// أسعار الحجز الشهري
const monthlyPrices = {
    '1': 800,
    '2': 1400,
    '3': 1800
};

// أسعار الحجز المقيم
const residentPrices = {
    '1': 1200,
    '3': 3200,
    '6': 5800,
    '12': 10000
};

function updatePriceDisplay() {
    const priceDisplay = document.getElementById('price_display');
    if (priceDisplay) {
        priceDisplay.style.display = 'none';
    }
}

function updateHourlyPrice() { updatePriceDisplay(); }
function updateMonthlyPrice() { updatePriceDisplay(); }
function updateResidentPrice() { updatePriceDisplay(); }

// حفظ بيانات الخطوة مؤقتاً في الجلسة الحالية
function saveStep(stepNum, data) {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    const key = `booking_${bookingType}_step${stepNum}`;
    sessionStorage.setItem(key, JSON.stringify(data));
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

function saveBookingToLocalStorage(bookingType, data, status = 'incomplete') {
    try {
        const localBookings = readLocalBookings();
        const currentIdKey = getCurrentBookingIdKey(bookingType);
        let bookingId = sessionStorage.getItem(currentIdKey);
        const now = new Date().toISOString();

        if (!bookingId) {
            bookingId = 'BK-' + Date.now();
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
    } catch (error) {
        console.warn('Unable to save local booking cache.', error);
    }
}

function getCurrentBookingIdKey(bookingType) {
    return `booking_${bookingType}_current_id`;
}

function getBookingsCollection() {
    if (!window.isFirebaseReady || !window.db) {
        throw new Error('Firebase Firestore is not configured. Paste your Firebase config in firebase-config.js.');
    }

    return window.db.collection('bookings');
}

async function persistBookingProgressSafely(bookingType, data, status = 'incomplete') {
    saveBookingToLocalStorage(bookingType, data, status);

    if (!window.isFirebaseReady || !window.db) {
        console.warn('Firebase not ready — saving booking locally for admin sync fallback.');
        return false;
    }

    try {
        await upsertBookingProgress(bookingType, data, status);
        return true;
    } catch (error) {
        saveBookingToLocalStorage(bookingType, data, status);
        throw error;
    }
}

async function upsertBookingProgress(bookingType, data, status = 'incomplete') {
    const currentIdKey = getCurrentBookingIdKey(bookingType);
    let bookingId = sessionStorage.getItem(currentIdKey);
    const now = new Date().toISOString();

    if (!bookingId) {
        bookingId = 'BK-' + Date.now();
        sessionStorage.setItem(currentIdKey, bookingId);
    }

    const bookingRef = getBookingsCollection().doc(bookingId);
    const existingBooking = await bookingRef.get();
    const bookingData = {
        ...data,
        id: bookingId,
        booking_type: bookingType,
        updatedAt: now,
        status
    };

    if (!existingBooking.exists) {
        bookingData.createdAt = now;
    }

    await bookingRef.set(bookingData, { merge: true });
    return bookingId;
}

// قراءة بيانات خطوة من الجلسة الحالية
function loadStep(stepNum) {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    const key = `booking_${bookingType}_step${stepNum}`;
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// مسح بيانات الحجز الحالي
function clearBooking() {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    for (let i = 1; i <= 4; i++) {
        sessionStorage.removeItem(`booking_${bookingType}_step${i}`);
    }
}

// حفظ الحجز المكتمل في قاعدة بيانات الحجوزات
async function saveCompletedBooking(bookingData) {
    const bookingType = bookingData.booking_type || sessionStorage.getItem('current_booking_type') || window.BOOKING_TYPE || 'hourly';
    const currentIdKey = getCurrentBookingIdKey(bookingType);
    let bookingId = sessionStorage.getItem(currentIdKey);
    const now = new Date().toISOString();

    if (!bookingId) {
        bookingId = 'BK-' + Date.now();
        sessionStorage.setItem(currentIdKey, bookingId);
    }

    const completedBooking = {
        ...bookingData,
        id: bookingId,
        booking_type: bookingType,
        updatedAt: now,
        status: bookingData.status || 'completed'
    };

    saveBookingToLocalStorage(bookingType, completedBooking, completedBooking.status);
    sessionStorage.removeItem(currentIdKey);

    if (!window.isFirebaseReady || !window.db) {
        console.warn('Firebase not ready — completed booking saved locally only.');
        return bookingId;
    }

    try {
        const bookingRef = getBookingsCollection().doc(bookingId);
        const existingBooking = await bookingRef.get();

        if (!existingBooking.exists) {
            completedBooking.createdAt = now;
        }

        await bookingRef.set(completedBooking, { merge: true });
        return bookingId;
    } catch (error) {
        console.warn('Firebase save failed — completed booking remains saved locally.', error);
        return bookingId;
    }
}

// تشغيل صوت النجاح
function playSuccessSound() {
    const audio = document.getElementById('success-sound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// الأسماء العربية للجنسيات
const nationalityNames = {
    filipina: 'فلبينية', indonesian: 'إندونيسية', indian: 'هندية',
    srilankan: 'سريلانكية', nepali: 'نيبالية', ethiopian: 'إثيوبية', other: 'أخرى'
};

// الأسماء العربية للمحافظات
const governorateNamesMap = {
    riyadh: "الرياض", jeddah: "جدة", makkah: "مكة المكرمة",
    madinah: "المدينة المنورة", dammam: "الدمام", khobar: "الخبر",
    taif: "الطائف", abha: "أبها", khamis: "خميس مشيط",
    buraydah: "بريدة", unayzah: "عنيزة", tabuk: "تبوك",
    hail: "حائل", jizan: "جازان", najran: "نجران",
    baha: "الباحة", sakaka: "سكاكا", arar: "عرعر",
    ahsa: "الأحساء", jubail: "الجبيل", yanbu: "ينبع", qatif: "القطيف",
    muscat: "مسقط", dhofar: "ظفار", musandam: "مسندم",
    al_buraimi: "البريمي", al_dhahirah: "الظاهرة", al_dakhiliyah: "الداخلية",
    north_al_batinah: "شمال الباطنة", south_al_batinah: "جنوب الباطنة",
    north_al_sharqiyah: "شمال الشرقية", south_al_sharqiyah: "جنوب الشرقية",
    al_wusta: "الوسطى"
};