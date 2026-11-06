// ===== DOM Elements =====
const form = document.getElementById('healthForm');
const resetBtn = document.getElementById('resetBtn');
const newAssessBtn = document.getElementById('newAssessBtn');
const resultSection = document.getElementById('resultSection');
const alertContainer = document.getElementById('alertContainer');

// ===== Form Submission =====
form.addEventListener('submit', function(e) {
    e.preventDefault();
    clearAlerts();

    if (validateForm()) {
        calculateAndDisplay();
    }
});

// ===== Reset Button =====
resetBtn.addEventListener('click', function() {
    form.reset();
    clearErrors();
    clearAlerts();
    resultSection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== New Assessment Button =====
newAssessBtn.addEventListener('click', function() {
    form.reset();
    clearErrors();
    clearAlerts();
    resultSection.style.display = 'none';
    document.getElementById('registration-form').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Validation =====
function validateForm() {
    let isValid = true;
    clearErrors();

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const age = document.getElementById('age');
    const weight = document.getElementById('weight');
    const height = document.getElementById('height');
    const gender = document.querySelector('input[name="gender"]:checked');

    // ชื่อ
    if (!firstName.value.trim()) {
        showError('firstName', 'กรุณากรอกชื่อ');
        isValid = false;
    }

    // นามสกุล
    if (!lastName.value.trim()) {
        showError('lastName', 'กรุณากรอกนามสกุล');
        isValid = false;
    }

    // อายุ
    if (!age.value) {
        showError('age', 'กรุณากรอกอายุ');
        isValid = false;
    } else if (parseInt(age.value) < 1 || parseInt(age.value) > 150) {
        showError('age', 'กรุณากรอกอายุระหว่าง 1-150 ปี');
        isValid = false;
    }

    // เพศ
    if (!gender) {
        showError('gender', 'กรุณาเลือกเพศ');
        isValid = false;
    }

    // น้ำหนัก
    if (!weight.value) {
        showError('weight', 'กรุณากรอกน้ำหนัก');
        isValid = false;
    } else if (parseFloat(weight.value) <= 0) {
        showError('weight', 'น้ำหนักต้องมากกว่า 0');
        isValid = false;
    }

    // ส่วนสูง
    if (!height.value) {
        showError('height', 'กรุณากรอกส่วนสูง');
        isValid = false;
    } else if (parseFloat(height.value) <= 0) {
        showError('height', 'ส่วนสูงต้องมากกว่า 0');
        isValid = false;
    }

    if (!isValid) {
        showAlert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง', 'error');
    }

    return isValid;
}

function showError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const inputEl = document.getElementById(fieldId);
    if (errorEl) {
        errorEl.textContent = message;
    }
    if (inputEl) {
        inputEl.classList.add('error');
    }
}

function clearErrors() {
    document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
    document.querySelectorAll('.text-field').forEach(el => el.classList.remove('error'));
}

// ===== Alert =====
function showAlert(message, type) {
    const iconMap = {
        error: 'error_outline',
        success: 'check_circle'
    };
    alertContainer.innerHTML = `
        <div class="alert alert-${type}">
            <span class="material-icons">${iconMap[type]}</span>
            ${message}
        </div>
    `;
    alertContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearAlerts() {
    alertContainer.innerHTML = '';
}

// ===== BMI Calculation =====
function calculateBMI(weightKg, heightCm) {
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { text: 'น้ำหนักต่ำกว่าเกณฑ์ (Underweight)', color: '#2196f3' };
    if (bmi < 23) return { text: 'น้ำหนักปกติ (Normal)', color: '#4caf50' };
    if (bmi < 25) return { text: 'น้ำหนักเกิน (Overweight)', color: '#ff9800' };
    if (bmi < 30) return { text: 'อ้วนระดับ 1 (Obese I)', color: '#f44336' };
    return { text: 'อ้วนระดับ 2 (Obese II)', color: '#b71c1c' };
}

// ===== Risk Assessment =====
function assessRisk(bmi, riskBehavior, conditions, age) {
    let score = 0;
    let factors = [];

    // BMI risk
    if (bmi < 18.5) {
        score += 1;
        factors.push('BMI ต่ำกว่าเกณฑ์');
    } else if (bmi >= 23 && bmi < 25) {
        score += 1;
        factors.push('น้ำหนักเกินเกณฑ์');
    } else if (bmi >= 25 && bmi < 30) {
        score += 2;
        factors.push('อ้วนระดับ 1');
    } else if (bmi >= 30) {
        score += 3;
        factors.push('อ้วนระดับ 2');
    }

    // Risk behavior
    if (riskBehavior === 'smoking') {
        score += 2;
        factors.push('สูบบุหรี่');
    } else if (riskBehavior === 'drinking') {
        score += 1;
        factors.push('ดื่มแอลกอฮอล์เป็นประจำ');
    } else if (riskBehavior === 'both') {
        score += 3;
        factors.push('สูบบุหรี่และดื่มแอลกอฮอล์');
    }

    // Medical conditions
    const conditionLabels = {
        diabetes: 'เบาหวาน',
        hypertension: 'ความดันโลหิตสูง',
        heart: 'โรคหัวใจ',
        kidney: 'โรคไต',
        cancer: 'โรคมะเร็ง',
        obesity: 'โรคอ้วน'
    };

    conditions.forEach(c => {
        if (c !== 'none') {
            score += 2;
            factors.push('โรคประจำตัว: ' + (conditionLabels[c] || c));
        }
    });

    // Age risk
    if (age >= 60) {
        score += 2;
        factors.push('อายุ 60 ปีขึ้นไป');
    } else if (age >= 45) {
        score += 1;
        factors.push('อายุ 45-59 ปี');
    }

    // Determine risk level
    let level;
    if (score <= 2) {
        level = { text: 'ความเสี่ยงต่ำ (Low Risk)', class: 'risk-low' };
    } else if (score <= 5) {
        level = { text: 'ความเสี่ยงปานกลาง (Moderate Risk)', class: 'risk-moderate' };
    } else {
        level = { text: 'ความเสี่ยงสูง (High Risk)', class: 'risk-high' };
    }

    return { level, factors, score };
}

// ===== Get Recommendations =====
function getRecommendations(riskLevel, bmi, riskBehavior, conditions) {
    const recommendations = [];

    // General
    recommendations.push('ตรวจสุขภาพประจำปีอย่างสม่ำเสมอ');

    // BMI-based
    if (bmi < 18.5) {
        recommendations.push('ควรรับประทานอาหารที่มีคุณค่าทางโภชนาการเพิ่มขึ้น เน้นโปรตีนและคาร์โบไฮเดรตเชิงซ้อน');
    } else if (bmi >= 23) {
        recommendations.push('ควรควบคุมอาหาร ลดของหวาน ของมัน และออกกำลังกายอย่างน้อย 150 นาทีต่อสัปดาห์');
        recommendations.push('พบนักโภชนาการเพื่อวางแผนอาหารที่เหมาะสม');
    }

    // Risk behavior
    if (riskBehavior === 'smoking' || riskBehavior === 'both') {
        recommendations.push('ควรเลิกสูบบุหรี่ หรือเข้าร่วมโปรแกรมเลิกบุหรี่');
    }
    if (riskBehavior === 'drinking' || riskBehavior === 'both') {
        recommendations.push('ควรลดหรือหยุดดื่มแอลกอฮอล์ หากเลิกเองไม่ได้ ควรปรึกษาแพทย์');
    }

    // Conditions
    if (conditions.includes('diabetes')) {
        recommendations.push('ควบคุมระดับน้ำตาลในเลือด ตรวจ HbA1c ทุก 3 เดือน');
    }
    if (conditions.includes('hypertension')) {
        recommendations.push('วัดความดันโลหิตสม่ำเสมอ ลดอาหารเค็ม');
    }
    if (conditions.includes('heart')) {
        recommendations.push('พบแพทย์โรคหัวใจตามนัดอย่างสม่ำเสมอ หลีกเลี่ยงกิจกรรมที่หักโหม');
    }

    // Risk level based
    if (riskLevel.class === 'risk-high') {
        recommendations.push('⚠️ ควรพบแพทย์เพื่อตรวจสุขภาพอย่างละเอียดโดยเร็ว');
        recommendations.push('⚠️ ควรปรึกษาแพทย์เฉพาะทางเพื่อวางแผนการรักษาและดูแลสุขภาพ');
    } else if (riskLevel.class === 'risk-moderate') {
        recommendations.push('ควรพบแพทย์เพื่อตรวจสุขภาพเพิ่มเติม');
    }

    // General healthy lifestyle
    recommendations.push('ออกกำลังกายสม่ำเสมอ อย่างน้อย 30 นาทีต่อวัน 5 วันต่อสัปดาห์');
    recommendations.push('นอนหลับพักผ่อนให้เพียงพอ 7-9 ชั่วโมงต่อคืน');
    recommendations.push('ดื่มน้ำสะอาดอย่างน้อย 8 แก้วต่อวัน');

    return recommendations;
}

// ===== Calculate & Display Results =====
function calculateAndDisplay() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const riskBehavior = document.querySelector('input[name="riskBehavior"]:checked').value;

    const conditionsSelect = document.getElementById('conditions');
    const conditions = Array.from(conditionsSelect.selectedOptions).map(opt => opt.value);

    // Calculate BMI
    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi);

    // Assess risk
    const risk = assessRisk(bmi, riskBehavior, conditions, age);

    // Get recommendations
    const recommendations = getRecommendations(risk.level, bmi, riskBehavior, conditions);

    // Display results
    document.getElementById('resultName').textContent = `${firstName} ${lastName}`;
    document.getElementById('resultAge').textContent = `${age} ปี`;
    document.getElementById('resultGender').textContent = gender === 'male' ? 'ชาย' : 'หญิง';
    document.getElementById('resultWeight').textContent = `${weight} กก.`;
    document.getElementById('resultHeight').textContent = `${height} ซม.`;

    // BMI
    const bmiValueEl = document.getElementById('resultBMI');
    bmiValueEl.textContent = bmi.toFixed(2);
    bmiValueEl.style.color = bmiCategory.color;

    const bmiCategoryEl = document.getElementById('resultBMICategory');
    bmiCategoryEl.textContent = bmiCategory.text;
    bmiCategoryEl.style.color = bmiCategory.color;

    // Risk chip
    const riskChip = document.getElementById('riskChip');
    riskChip.textContent = risk.level.text;
    riskChip.className = 'risk-chip ' + risk.level.class;

    // Risk factors
    const riskFactorsEl = document.getElementById('riskFactors');
    if (risk.factors.length > 0) {
        riskFactorsEl.innerHTML = risk.factors.map(f => `
            <div class="risk-factor-item">
                <span class="material-icons">warning_amber</span>
                ${f}
            </div>
        `).join('');
    } else {
        riskFactorsEl.innerHTML = `
            <div class="risk-factor-item">
                <span class="material-icons" style="color: #4caf50;">check_circle</span>
                ไม่พบปัจจัยเสี่ยงเพิ่มเติม
            </div>
        `;
    }

    // Recommendations
    document.getElementById('recommendations').innerHTML = recommendations.map(r => `
        <div class="recommendation-item">
            <span class="material-icons">check_circle_outline</span>
            <p>${r}</p>
        </div>
    `).join('');

    // Show result, show alert
    resultSection.style.display = 'block';
    showAlert('ประเมินผลสำเร็จ! กรุณาตรวจสอบผลการประเมินด้านล่าง', 'success');

    // Scroll to result
    setTimeout(() => {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}
