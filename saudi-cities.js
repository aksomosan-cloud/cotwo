// saudi-cities.js - بيانات المحافظات والمناطق

const citiesData = {
    muscat: {
        name: 'مسقط',
        regions: {
            'muscat_capital': 'مسقط (العاصمة)',
            'qurayyat': 'القريات',
            'amerat': 'العميرات'
        }
    },
    dhofar: {
        name: 'ظفار',
        regions: {
            'salalah': 'صلالة',
            'thumrait': 'ثمريت',
            'mirbat': 'مرباط'
        }
    },
    musandam: {
        name: 'مسندم',
        regions: {
            'khasab': 'خصب',
            'dibba': 'دبا'
        }
    },
    al_buraimi: {
        name: 'البريمي',
        regions: {
            'buraimi': 'البريمي',
            'mahadah': 'محضة'
        }
    },
    al_dhahirah: {
        name: 'الظاهرة',
        regions: {
            'ibra': 'إبراء',
            'ibri': 'إبري',
            'yanqul': 'ينقل'
        }
    },
    al_dakhiliyah: {
        name: 'الداخلية',
        regions: {
            'nizwa': 'نزوى',
            'izki': 'إزكي',
            'bahla': 'بهلاء',
            'manah': 'المناح'
        }
    },
    north_al_batinah: {
        name: 'شمال الباطنة',
        regions: {
            'sohar': 'صحار',
            'shinas': 'شناص',
            'liwa': 'ليوا'
        }
    },
    south_al_batinah: {
        name: 'جنوب الباطنة',
        regions: {
            'rustaq': 'الرستاق',
            'nakhal': 'نخل',
            'awabi': 'العوابي'
        }
    },
    north_al_sharqiyah: {
        name: 'شمال الشرقية',
        regions: {
            'sur': 'صور',
            'qalhat': 'قلهات'
        }
    },
    south_al_sharqiyah: {
        name: 'جنوب الشرقية',
        regions: {
            'ibra_south': 'إبراء',
            'jalan': 'الجالين'
        }
    },
    al_wusta: {
        name: 'الوسطى',
        regions: {
            'haima': 'الحيمة',
            'duqm': 'دقم'
        }
    },
    riyadh: {
        name: 'الرياض',
        regions: {
            'riyadh_center': 'وسط الرياض',
            'riyadh_north': 'شمال الرياض',
            'riyadh_south': 'جنوب الرياض',
            'riyadh_east': 'شرق الرياض',
            'riyadh_west': 'غرب الرياض'
        }
    },
    jeddah: {
        name: 'جدة',
        regions: {
            'balad': 'البلد',
            'obhur': 'أبحر',
            'khaleej': 'الخليج',
            'corniche': 'الكورنيش'
        }
    },
    makkah: {
        name: 'مكة المكرمة',
        regions: {
            'makkah_center': 'وسط مكة',
            'abraj': 'أبراج',
            'aziziyah': 'العزيزية'
        }
    },
    madinah: {
        name: 'المدينة المنورة',
        regions: {
            'madinah_center': 'وسط المدينة',
            'quba': 'قباء'
        }
    },
    dammam: {
        name: 'الدمام',
        regions: {
            'dammam_center': 'وسط الدمام',
            'khobar': 'الخبر'
        }
    },
    khobar: {
        name: 'الخبر',
        regions: {
            'khobar_center': 'وسط الخبر',
            'khobar_corniche': 'كورنيش الخبر'
        }
    },
    taif: {
        name: 'الطائف',
        regions: {
            'taif_center': 'وسط الطائف',
            'shafa': 'الشفا'
        }
    },
    abha: {
        name: 'أبها',
        regions: {
            'abha_center': 'وسط أبها',
            'asir': 'عسير'
        }
    },
    khamis: {
        name: 'خميس مشيط',
        regions: {
            'khamis_center': 'وسط خميس',
            'muhayil': 'محايل'
        }
    },
    buraydah: {
        name: 'بريدة',
        regions: {
            'buraydah_center': 'وسط بريدة'
        }
    },
    unayzah: {
        name: 'عنيزة',
        regions: {
            'unayzah_center': 'وسط عنيزة'
        }
    },
    tabuk: {
        name: 'تبوك',
        regions: {
            'tabuk_center': 'وسط تبوك'
        }
    },
    hail: {
        name: 'حائل',
        regions: {
            'hail_center': 'وسط حائل'
        }
    },
    jizan: {
        name: 'جازان',
        regions: {
            'jizan_center': 'وسط جازان'
        }
    },
    najran: {
        name: 'نجران',
        regions: {
            'najran_center': 'وسط نجران'
        }
    },
    baha: {
        name: 'الباحة',
        regions: {
            'baha_center': 'وسط الباحة'
        }
    },
    sakaka: {
        name: 'سكاكا',
        regions: {
            'sakaka_center': 'وسط سكاكا'
        }
    },
    arar: {
        name: 'عرعر',
        regions: {
            'arar_center': 'وسط عرعر'
        }
    },
    ahsa: {
        name: 'الأحساء',
        regions: {
            'ahsa_center': 'وسط الأحساء',
            'hofuf': 'الهفوف'
        }
    },
    jubail: {
        name: 'الجبيل',
        regions: {
            'jubail_center': 'وسط الجبيل'
        }
    },
    yanbu: {
        name: 'ينبع',
        regions: {
            'yanbu_center': 'وسط ينبع'
        }
    },
    qatif: {
        name: 'القطيف',
        regions: {
            'qatif_center': 'وسط القطيف'
        }
    }
};

// تحميل المناطق عند اختيار محافظة
function loadRegions() {
    const govSelect = document.getElementById('governorate');
    const regionSelect = document.getElementById('region');
    const gov = govSelect.value;

    regionSelect.innerHTML = '<option value="">اختر المنطقة</option>';

    if (gov && citiesData[gov]) {
        const regions = citiesData[gov].regions;
        for (const [key, name] of Object.entries(regions)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = name;
            regionSelect.appendChild(option);
        }
        console.log('✅ Regions loaded for:', gov);
    } else {
        console.warn('⚠️ No regions found for:', gov);
    }

    // مسح حقل الحي
    const districtInput = document.getElementById('district');
    if (districtInput) districtInput.value = '';
}

// تحميل الأحياء (حقل مفتوح في حالتنا)
function loadDistricts() {
    console.log('✅ District field ready for input');
}