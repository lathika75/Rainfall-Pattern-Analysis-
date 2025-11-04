// ✅ Sample rainfall data for Tamil Nadu
const sampleData = [
  { date: "2022-01-15", district: "Chennai", rainfall_mm: 12 },
  { date: "2022-02-10", district: "Chennai", rainfall_mm: 20 },
  { date: "2022-03-05", district: "Chennai", rainfall_mm: 5 },
  { date: "2022-06-20", district: "Chennai", rainfall_mm: 110 },
  { date: "2022-10-25", district: "Chennai", rainfall_mm: 180 },
  { date: "2023-01-15", district: "Chennai", rainfall_mm: 10 },
  { date: "2023-07-10", district: "Chennai", rainfall_mm: 95 },
  { date: "2023-11-20", district: "Chennai", rainfall_mm: 210 },

  { date: "2022-01-15", district: "Coimbatore", rainfall_mm: 18 },
  { date: "2022-07-05", district: "Coimbatore", rainfall_mm: 120 },
  { date: "2022-09-25", district: "Coimbatore", rainfall_mm: 140 },
  { date: "2022-11-15", district: "Coimbatore", rainfall_mm: 160 },
  { date: "2023-03-20", district: "Coimbatore", rainfall_mm: 30 },
  { date: "2023-08-18", district: "Coimbatore", rainfall_mm: 180 },
  { date: "2023-10-10", district: "Coimbatore", rainfall_mm: 190 },
];

const districts = [...new Set(sampleData.map(d => d.district))];
const districtSelect = document.getElementById("districtSelect");
const aggregationSelect = document.getElementById("aggregationSelect");
const recordCount = document.getElementById("recordCount");
const tableBody = document.querySelector("#dataTable tbody");

// Populate dropdown
districtSelect.innerHTML = `<option value="all">All Districts</option>`;
districts.forEach(d => {
  districtSelect.innerHTML += `<option value="${d}">${d}</option>`;
});

// Show data in table
function renderTable(data) {
  tableBody.innerHTML = data.map(d =>
    `<tr><td>${d.date}</td><td>${d.district}</td><td>${d.rainfall_mm}</td></tr>`
  ).join("");
  recordCount.textContent = `Records loaded: ${data.length}`;
}
renderTable(sampleData);

// Chart rendering
let chart;
function renderChart(filtered, aggregation) {
  if (chart) chart.destroy();

  let labels = [], values = [];

  if (aggregation === "monthly") {
    const grouped = {};
    filtered.forEach(d => {
      const month = new Date(d.date).toLocaleString("default", { month: "short", year: "numeric" });
      grouped[month] = (grouped[month] || 0) + d.rainfall_mm;
    });
    labels = Object.keys(grouped);
    values = Object.values(grouped);
  } else if (aggregation === "seasonal") {
    const grouped = { "Dry (Jan–May)": 0, "SW Monsoon (Jun–Sep)": 0, "NE Monsoon (Oct–Dec)": 0 };
    filtered.forEach(d => {
      const m = new Date(d.date).getMonth() + 1;
      if (m >= 1 && m <= 5) grouped["Dry (Jan–May)"] += d.rainfall_mm;
      else if (m >= 6 && m <= 9) grouped["SW Monsoon (Jun–Sep)"] += d.rainfall_mm;
      else grouped["NE Monsoon (Oct–Dec)"] += d.rainfall_mm;
    });
    labels = Object.keys(grouped);
    values = Object.values(grouped);
  } else {
    const grouped = {};
    filtered.forEach(d => {
      const year = new Date(d.date).getFullYear();
      grouped[year] = (grouped[year] || 0) + d.rainfall_mm;
    });
    labels = Object.keys(grouped);
    values = Object.values(grouped);
  }

  const ctx = document.getElementById("rainChart");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Rainfall (mm)",
        data: values,
        backgroundColor: "#0077ccaa",
        borderColor: "#005b96",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: `Rainfall Analysis (${aggregation})` }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Update chart when button clicked
document.getElementById("updateBtn").addEventListener("click", () => {
  const district = districtSelect.value;
  const aggregation = aggregationSelect.value;
  const filtered = district === "all" ? sampleData : sampleData.filter(d => d.district === district);
  renderChart(filtered, aggregation);
});

// ✅ Auto-show chart on page load
renderChart(sampleData, "monthly");
