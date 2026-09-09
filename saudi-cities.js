/* ============================================
  /* ============================================
   بيانات المدن والولايات والأحياء في سلطنة عُمان
   ============================================ */

const omanCities = {
    muscat: {
        name: "مسقط",
        districts: [
            "بوشر",
            "الخوض",
            "المعبيلة",
            "السيب",
            "الموالح",
            "الحيل",
            "العامرات",
            "مطرح",
            "القرم",
            "مدينة السلطان قابوس",
            "العذيبة",
            "الغبرة"
        ]
    },

    dhofar: {
        name: "ظفار",
        districts: [
            "صلالة",
            "السعادة",
            "عوقد",
            "الحافة",
            "الدهاريز",
            "صحلنوت",
            "ريسوت",
            "طاقة",
            "مرباط"
        ]
    },

    musandam: {
        name: "مسندم",
        districts: [
            "خصب",
            "بخاء",
            "دبا",
            "مدحاء"
        ]
    },

    al_buraimi: {
        name: "البريمي",
        districts: [
            "البريمي",
            "محضة",
            "السنينة"
        ]
    },

    al_dhahirah: {
        name: "الظاهرة",
        districts: [
            "عبري",
            "ينقل",
            "ضنك"
        ]
    },

    al_dakhiliyah: {
        name: "الداخلية",
        districts: [
            "نزوى",
            "بهلاء",
            "الحمراء",
            "منح",
            "إزكي",
            "سمائل",
            "بدبد",
            "أدم"
        ]
    },

    north_al_batinah: {
        name: "شمال الباطنة",
        districts: [
            "صحار",
            "شناص",
            "لوى",
            "صحم",
            "الخابورة",
            "السويق"
        ]
    },

    south_al_batinah: {
        name: "جنوب الباطنة",
        districts: [
            "الرستاق",
            "العوابي",
            "نخل",
            "وادي المعاول",
            "بركاء",
            "المصنعة"
        ]
    },

    north_al_sharqiyah: {
        name: "شمال الشرقية",
        districts: [
            "إبراء",
            "المضيبي",
            "بدية",
            "القابل",
            "وادي بني خالد",
            "دماء والطائيين"
        ]
    },

    south_al_sharqiyah: {
        name: "جنوب الشرقية",
        districts: [
            "صور",
            "جعلان بني بو حسن",
            "جعلان بني بو علي",
            "الكامل والوافي",
            "مصيرة"
        ]
    },

    al_wusta: {
        name: "الوسطى",
        districts: [
            "هيماء",
            "محوت",
            "الدقم",
            "الجازر"
        ]
    }
};


/* ============================================
   أسماء محافظات سلطنة عُمان
   ============================================ */

const governorateNames = {
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
    al_wusta: "الوسطى"
};


/* ============================================
   تحميل الولايات والمناطق
   ============================================ */

function loadRegions() {
    const governorateSelect = document.getElementById('governorate');
    const regionSelect = document.getElementById('region');
    const districtInput = document.getElementById('district');

    const selectedGovernorate = governorateSelect.value;

    regionSelect.innerHTML = '<option value="">اختر الولاية</option>';
    districtInput.value = '';

    if (selectedGovernorate && omanCities[selectedGovernorate]) {
        omanCities[selectedGovernorate].districts.forEach(district => {
            const option = document.createElement('option');

            option.value = district;
            option.textContent = district;

            regionSelect.appendChild(option);
        });
    }
}


/* ============================================
   اختيار الحي
   ============================================ */

function loadDistricts() {
    const regionSelect = document.getElementById('region');
    const districtInput = document.getElementById('district');

    if (regionSelect.value) {
        districtInput.value = regionSelect.value;
    }
}