// Global Değişkenler
const schools = JSON.parse(localStorage.getItem("schools")) || []; // Okul kayıtları
const students = JSON.parse(localStorage.getItem("students")) || []; // Öğrenci kayıtları
const wasteRecords = JSON.parse(localStorage.getItem("wasteRecords")) || []; // Atık kayıtları

// Sayfa geçişleri
function showSection(sectionId) {
  document.querySelectorAll("section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
}

// === Okul Kaydı ===
function registerSchool() {
  const form = document.getElementById("schoolRegisterForm");
  const schoolName = form.querySelector("input[placeholder='Okul Adı']").value;
  const city = form.querySelector("input[placeholder='İl']").value;
  const district = form.querySelector("input[placeholder='İlçe']").value;
  const password = form.querySelector("input[placeholder='Şifre']").value;

  if (schoolName && city && district && password) {
    schools.push({ schoolName, city, district, password });
    localStorage.setItem("schools", JSON.stringify(schools));
    alert("Okul kaydı başarılı!");
    form.reset();
    showSection("home");
  } else {
    alert("Lütfen tüm alanları doldurun!");
  }
}

// === Öğrenci Kaydı ===
function registerStudent() {
  const form = document.getElementById("studentRegisterForm");
  const name = form.querySelector("input[placeholder='Ad']").value;
  const surname = form.querySelector("input[placeholder='Soyad']").value;
  const studentNumber = form.querySelector("input[placeholder='Okul Numarası']").value;
  const grade = form.querySelector("input[placeholder='Sınıf/Şube']").value;
  const email = form.querySelector("input[placeholder='E-posta (Opsiyonel)']").value;
  const phone = form.querySelector("input[placeholder='Telefon (Opsiyonel)']").value;

  if (name && surname && studentNumber && grade) {
    students.push({
      name,
      surname,
      studentNumber,
      grade,
      email,
      phone,
      totalWaste: 0, // Öğrencinin toplam atığı (kg)
      totalPoints: 0, // Öğrencinin toplam puanı
    });
    localStorage.setItem("students", JSON.stringify(students));
    alert("Öğrenci kaydı başarılı!");
    form.reset();
    showSection("home");
  } else {
    alert("Lütfen gerekli alanları doldurun!");
  }
}

// === Veri Girişi ===
function submitData() {
  const form = document.getElementById("dataEntryForm");
  const schoolPassword = form.querySelector("input[placeholder='Okul Şifresi']").value;
  const studentNumber = form.querySelector("input[placeholder='Öğrenci Numarası']").value;
  const studentName = form.querySelector("input[placeholder='Ad Soyad']").value;
  const wasteType = form.querySelector("#wasteType").value;
  const wasteAmount = parseFloat(form.querySelector("input[placeholder='Miktar (kg)']").value);
  const deliveredBy = form.querySelector("input[placeholder='Teslim Alan Kişi']").value;

  const school = schools.find((s) => s.password === schoolPassword);
  const student = students.find((s) => s.studentNumber === studentNumber);

  if (school && student && wasteType && wasteAmount && deliveredBy) {
    // Kredi hesaplama (her atık türüne puan atama)
    const points = calculatePoints(wasteType, wasteAmount);
    student.totalWaste += wasteAmount;
    student.totalPoints += points;

    // Atık kaydını sakla
    wasteRecords.push({
      studentNumber,
      studentName,
      wasteType,
      wasteAmount,
      points,
      deliveredBy,
      date: new Date().toLocaleString(),
    });
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("wasteRecords", JSON.stringify(wasteRecords));
    alert(`Veri başarıyla kaydedildi! Kazanılan puan: ${points}`);
    form.reset();
    showSection("home");
  } else {
    alert("Hatalı bilgi girdiniz! Lütfen tüm alanları doldurun.");
  }
}

// === Kredi Hesaplama ===
function calculatePoints(wasteType, wasteAmount) {
  const pointRates = {
    yag: 5,
    tekstil: 2,
    pil: 10,
    elektronik: 8,
    metal: 4,
    kagit: 1,
    plastik: 1,
    cam: 1,
  };
  return wasteAmount * (pointRates[wasteType] || 1);
}

// === Veri Görüntüleme ===
function viewStudentData() {
  const form = document.getElementById("viewDataForm");
  const identifier = form.querySelector("input[placeholder='E-posta veya Öğrenci Numarası']").value;

  const student = students.find(
    (s) => s.studentNumber === identifier || s.email === identifier
  );

  if (student) {
    const studentRecords = wasteRecords.filter(
      (record) => record.studentNumber === student.studentNumber
    );

    let recordsHtml = `
      <h3>${student.name} ${student.surname}</h3>
      <p>Toplam Atık: ${student.totalWaste} kg</p>
      <p>Toplam Puan: ${student.totalPoints}</p>
      <h4>Atık Kayıtları:</h4>
    `;

    studentRecords.forEach((record) => {
      recordsHtml += `
        <div>
          <p><b>Tarih:</b> ${record.date}</p>
          <p><b>Atık Türü:</b> ${record.wasteType}</p>
          <p><b>Miktar:</b> ${record.wasteAmount} kg</p>
          <p><b>Kazandığı Puan:</b> ${record.points}</p>
          <p><b>Teslim Alan:</b> ${record.deliveredBy}</p>
        </div><hr>
      `;
    });

    document.getElementById("studentData").innerHTML = recordsHtml;
  } else {
    alert("Öğrenci bulunamadı!");
  }
}
