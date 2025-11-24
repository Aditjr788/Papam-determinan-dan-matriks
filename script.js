// Konstan untuk presisi pembulatan
const ROUND_DECIMALS = 6;
const ZERO_TOLERANCE = 1e-9; // Toleransi untuk menganggap nilai sangat kecil sebagai nol

/**
 * Fungsi pembantu untuk mengambil semua nilai dari input matriks NxN
 */
function getMatrixValues(prefix, size) {
  const matrix = [];
  for (let i = 1; i <= size; i++) {
    const row = [];
    for (let j = 1; j <= size; j++) {
      const id = `${prefix}_a${i}${j}`;
      // Menggunakan 0 jika input kosong atau tidak valid
      const value = parseFloat(document.getElementById(id)?.value) || 0;
      row.push(value);
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Membulatkan nilai matriks ke sejumlah desimal tertentu dan menangani nol.
 */
function round(value, decimals) {
  if (Math.abs(value) < ZERO_TOLERANCE) return 0; // Menganggap nilai sangat kecil sebagai 0
  // Pembulatan standar
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

// -------------------------------------------------------------------
// FUNGSI DASAR PERHITUNGAN MATRIKS
// -------------------------------------------------------------------

/**
 * Menghitung Determinan Matriks 2x2: ad - bc
 */
function calculateDet2x2Value(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

/**
 * Menghitung Determinan Matriks 3x3
 */
function calculateDet3x3Value(m) {
  const a = m[0][0],
    b = m[0][1],
    c = m[0][2];
  const d = m[1][0],
    e = m[1][1],
    f = m[1][2];
  const g = m[2][0],
    h = m[2][1],
    i = m[2][2];

  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

/**
 * Mendapatkan Submatriks 2x2 (Minor) dari Matriks 3x3
 */
function getMinorMatrix(m, r, c) {
  const minor = [];
  for (let i = 0; i < 3; i++) {
    if (i !== r) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        if (j !== c) {
          row.push(m[i][j]);
        }
      }
      minor.push(row);
    }
  }
  return minor;
}

/**
 * Menghitung Matriks Kofaktor dari Matriks 3x3
 */
function calculateCofactorMatrix(m) {
  const cofactor = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 3; j++) {
      const minorM = getMinorMatrix(m, i, j);
      const detMinor = calculateDet2x2Value(minorM);
      const sign = (i + j) % 2 === 0 ? 1 : -1;
      row.push(sign * detMinor);
    }
    cofactor.push(row);
  }
  return cofactor;
}

/**
 * Menghitung Adjoint (Transpos dari Matriks Kofaktor)
 */
function calculateAdjoint(c) {
  const adjoint = [
    [c[0][0], c[1][0], c[2][0]],
    [c[0][1], c[1][1], c[2][1]],
    [c[0][2], c[1][2], c[2][2]],
  ];
  return adjoint;
}

/**
 * Fungsi pembantu untuk menampilkan array 2D ke elemen HTML
 */
function displayMatrix(elementId, matrix, decimals) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Matriks datar (flat)
  const flatValues = matrix.flat().map((val) => round(val, decimals));

  // Tampilkan
  element.innerHTML = flatValues
    .map((val) => `<span class="cell">${val}</span>`)
    .join("");
}

// -------------------------------------------------------------------
// FUNGSI UTAMA KALKULATOR (Dipanggil oleh Button)
// -------------------------------------------------------------------

/**
 * Menghitung Determinan 2x2.
 */
function calculateDet2x2() {
  const m = getMatrixValues("det2x2", 2);
  const det = calculateDet2x2Value(m);
  document.getElementById("result-det2x2").textContent = round(det, 4);
}

/**
 * Menghitung Determinan 3x3.
 */
function calculateDet3x3() {
  const m = getMatrixValues("det3x3", 3);
  const det = calculateDet3x3Value(m);
  document.getElementById("result-det3x3").textContent = round(det, 4);
}

/**
 * Menghitung Invers 2x2.
 */
function calculateInv2x2() {
  const m = getMatrixValues("inv2x2", 2);
  const det = calculateDet2x2Value(m);

  const resultElement = document.getElementById("result-inv2x2");

  // Matriks Singular (Det = 0)
  if (Math.abs(det) < ZERO_TOLERANCE) {
    resultElement.innerHTML = `<span class="cell" style="grid-column: 1/3; color: #ff69b4; line-height: 40px;">Singular (Det = 0)</span>`;
    return;
  }

  // Invers = 1/det * Adjoint ([d, -b], [-c, a])
  const invFactor = 1 / det;
  const invM = [
    [invFactor * m[1][1], invFactor * -m[0][1]],
    [invFactor * -m[1][0], invFactor * m[0][0]],
  ];

  displayMatrix("result-inv2x2", invM, ROUND_DECIMALS);
}

/**
 * Menghitung Invers 3x3.
 */
function calculateInv3x3() {
  const m = getMatrixValues("inv3x3", 3);
  const det = calculateDet3x3Value(m);

  const detElement = document.getElementById("inv3x3_det");
  const adjElement = document.getElementById("result-inv3x3-adj");
  const finalElement = document.getElementById("result-inv3x3-final");

  detElement.textContent = round(det, 4);

  // Default tampilan Adjoint dan Final
  const defaultAdj = Array(9)
    .fill("?")
    .map((val) => `<span class="cell">${val}</span>`)
    .join("");
  adjElement.innerHTML = defaultAdj;
  finalElement.innerHTML = defaultAdj;

  // Matriks Singular (Det = 0)
  if (Math.abs(det) < ZERO_TOLERANCE) {
    adjElement.innerHTML = `<span class="cell" style="grid-column: 1/4; color: #ff69b4;">Det = 0</span>`;
    finalElement.innerHTML = `<span class="cell" style="grid-column: 1/4; color: #ff69b4;">Tidak Ada Invers</span>`;
    return;
  }

  // 1. Hitung Kofaktor
  const cofactorM = calculateCofactorMatrix(m);

  // 2. Hitung Adjoint (Transpos Kofaktor)
  const adjointM = calculateAdjoint(cofactorM);

  // Tampilkan Matriks Adjoint
  displayMatrix("result-inv3x3-adj", adjointM, 4);

  // 3. Hitung Invers Akhir: 1/det * Adjoint
  const invFactor = 1 / det;
  const invM = adjointM.map((row) => row.map((val) => invFactor * val));

  // Tampilkan Matriks Invers Akhir
  displayMatrix("result-inv3x3-final", invM, ROUND_DECIMALS);
}
