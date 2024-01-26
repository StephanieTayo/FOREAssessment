$(document).ready(function () {
  let mainTitle = "Entire Organization";
  let subTitle = ["", "Sales", "Marketing", "Customer Service"];

  // Loops through the data and create dashboards
  let i = 0;
  Object.keys(allCsvData).forEach((key) => {
    let folder = allCsvData[key];
    let folderArray = [];
    for (const key in folder) {
      if (folder.hasOwnProperty(key)) {
        let subfolder = folder[key];
        folderArray.push(subfolder);
      }
    }
    createDashboard(folderArray, i);

    i++;
  });

  //  generates HTML table for department data
  function generateTable(departments, counter) {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "table-section";
    sectionDiv.style.marginBottom = "20px";

    const table = document.createElement("table");
    table.id = "department-data_" + counter;
    table.className = "styled-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    thead.appendChild(headerRow);

    // Defines the headers
    const headers = Object.keys(departments[0]);

    // Append headers to the header row
    headers.forEach((headerText) => {
      const header = document.createElement("th");
      header.textContent = headerText;
      headerRow.appendChild(header);
    });

    // Append the header row to the thead
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    // Loops over each department and create a row
    departments.forEach((dept) => {
      const row = document.createElement("tr");

      headers.forEach((hearder) => {
        const nameCell = document.createElement("td");
        let cellValue = dept[hearder];

        if (subTitle.includes(cellValue)) {
          var anchor = document.createElement("a");
          anchor.href = "#" + cellValue.replace(/ /g, "_").toLowerCase();
          anchor.textContent = cellValue;
          nameCell.appendChild(anchor);
        } else {
          nameCell.textContent = cellValue;
        }
        row.appendChild(nameCell);
      });

      // Append the row to the tbody
      tbody.appendChild(row);
    });

    // Append the tbody to the table
    table.appendChild(tbody);

    sectionDiv.appendChild(table);
    return sectionDiv;
  }

  //creates charts container
  function createChartsContainer(tenureData, turnoverData, counter) {
    const chartsContainer = document.createElement("div");
    chartsContainer.className = "charts-container"; // Use this class to apply flexbox styling

    //turnover chart div and canvas
    const turnoverChartDiv = document.createElement("div");
    turnoverChartDiv.className = "chart";
    const turnoverChartCanvas = document.createElement("canvas");
    turnoverChartCanvas.id = "turnoverChart_" + counter;
    turnoverChartDiv.appendChild(turnoverChartCanvas);
    chartsContainer.appendChild(turnoverChartDiv);

    //tenure chart div and canvas
    const tenureChartDiv = document.createElement("div");
    tenureChartDiv.className = "chart";
    const tenureChartCanvas = document.createElement("canvas");
    tenureChartCanvas.id = "tenureChart_" + counter;
    tenureChartDiv.appendChild(tenureChartCanvas);
    chartsContainer.appendChild(tenureChartDiv);

    document.body.appendChild(chartsContainer);

    // generate the charts
    generateTurnoverChart(turnoverData, "turnoverChart_" + counter);
    generateTenureChart(tenureData, "tenureChart_" + counter);

    return chartsContainer;
  }

  // Generates turnover chart
  function generateTurnoverChart(chartData, chartId) {
    const ctx = document.getElementById(chartId).getContext("2d");
    let transformedData = transformTurnoverData(chartData);
    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: transformedData.labels,
        datasets: transformedData.datasets,
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              unit: "quarter",
              displayFormats: {
                quarter: "yyyy-q",
              },
            },
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Turnover Rate",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  // Generates tenure comparison bar chart
  function generateTenureChart(chartData, chartId) {
    const tenureCtx = document.getElementById(chartId).getContext("2d");
    let transformedData = transformTenureData(chartData);
    const tenureChart = new Chart(tenureCtx, {
      type: "bar",
      data: transformedData,
      options: {
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Median Tenure (Years)",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }

  function transformTurnoverData(sampleData) {
    const datasetsMap = {};

    sampleData.forEach((item) => {
      if (!datasetsMap[item.y]) {
        datasetsMap[item.y] = {
          label: item.y,
          data: [],
          fill: false,
          borderColor: getRandomColor(),
        };
      }
      datasetsMap[item.y].data.push({ x: item.x, y: parseFloat(item.series) });
    });

    // this will each dataset's data by the 'x' value (date)
    for (const dataset in datasetsMap) {
      datasetsMap[dataset].data.sort((a, b) => new Date(a.x) - new Date(b.x));
    }

    return {
      labels: sampleData.map((item) => item.x).sort(),
      datasets: Object.values(datasetsMap),
    };
  }

  function transformTenureData(sampleData) {
    const companyData = sampleData
      .filter((item) => item.series === "Company")
      .map((item) => ({ y: item.y, x: parseFloat(item.x) }));
    const competitorData = sampleData
      .filter((item) => item.series === "Competitor")
      .map((item) => ({ y: item.y, x: parseFloat(item.x) }));

    const labels = companyData.map((data) => data.y);

    return {
      labels: labels,
      datasets: [
        {
          label: "Company",
          data: companyData.map((data) => data.x),
          backgroundColor: "blue",
        },
        {
          label: "Competitor",
          data: competitorData.map((data) => data.x),
          backgroundColor: "orange",
        },
      ],
    };
  }

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // this is the main function to assemble the dashboard
  function createDashboard(data, counter) {
    var dashboardDiv = $("#dashboard");

    let PageTitle = subTitle[counter];

    addTitleToDashboard(mainTitle, PageTitle);
    dashboardDiv.append(generateTable(data[0], counter));
    dashboardDiv.append(generateTable(data[1], counter));
    dashboardDiv.append(createChartsContainer(data[2], data[3], counter));
  }

  function addTitleToDashboard(mainTitle, titleText) {
    var dashboardDiv = document.getElementById("dashboard");
    var title = document.createElement("span");

    if (titleText != "") {
      var anchor = document.createElement("a");
      anchor.href = "#" + mainTitle.replace(/ /g, "_").toLowerCase();
      anchor.textContent = mainTitle;
      anchor.className = "title-anchor";

      dashboardDiv.appendChild(anchor);
      title.textContent = " > " + titleText;
      title.className = "title-subtitle";
      title.id = titleText.replace(/ /g, "_").toLowerCase();
    } else {
      title.id = mainTitle.replace(/ /g, "_").toLowerCase();
      title.textContent = mainTitle;
      title.className = "title";
    }

    dashboardDiv.appendChild(title);
  }

  var element = document.getElementById("dashboard");
  var opt = {
    margin: [0.5, 0.5, 0.5, 0.5], // top, left, bottom, right margins
    filename: "Dashboard.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true },
    jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
  };

  $("#downloadPdf").click(function () {
    html2pdf().from(element).set(opt).save();
  });
});
