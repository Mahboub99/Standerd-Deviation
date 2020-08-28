var n = document.getElementById("numberOfInputs");
var container = document.getElementById("inputs-container");
var numberOfInputsBtn = document.getElementById("numberOfInputs-btn");
var Draw = document.getElementById("Draw");
var Reset = document.getElementById("Reset");
var buttonState = 0;
Draw.style.visibility = "hidden";
Reset.style.visibility = "hidden";
var MxMn = [];

var inputs = 0;

numberOfInputsBtn.addEventListener("click", () => {
  inputs = n.value;
  container.removeChild(n);
  container.removeChild(numberOfInputsBtn);

  var par = document.createElement("p");
  par.innerHTML = "please enter the data in this formate a1, a2 ,a3,...";
  container.appendChild(par);

  for (let i = 0; i < inputs; i++) {
    var input = document.createElement("input");
    input.type = "text";
    input.id = "data" + i;
    container.appendChild(input);
  }
  Draw.style.visibility = "visible";
  Reset.style.visibility = "visible";
});

function stdNormalDistribution(x, sd, mean) {
  let pdf =
    Math.pow(Math.E, -Math.pow((x - mean) / sd, 2) / 2) /
    (Math.sqrt(2 * Math.PI) * sd);
  return pdf;
}

function Random_normal_Dist(mean, sd) {
  let arr = [];
  //const normDist = new NormalDistribution(sd, mean);
  console.log(sd, mean);
  for (var i = mean - 3 * sd; i < mean + 3 * sd; i += 1) {
    arr.push(stdNormalDistribution(i, sd, mean));
  }
  return {
    data: arr,
    max: Math.max(mean - 3 * sd, mean + 3 * sd),
    min: Math.min(mean - 3 * sd, mean + 3 * sd)
  };
}

var series = [];
Draw.addEventListener("click", () => {
  let max = Number.MIN_SAFE_INTEGER,
    min = Number.MAX_SAFE_INTEGER,
    mxLength = 0;
  for (let i = 0; i < inputs; i++) {
    var curr = document.getElementById("data" + i);
    let arr = curr.value.split(",");
    let m = d3.mean(arr);
    let sd = d3.deviation(arr);
    var RND = Random_normal_Dist(m, sd);
    var data = RND.data;
    mxLength = Math.max(mxLength, data.length);
    max = Math.max(max, RND.max);
    min = Math.min(min, RND.min);
    MxMn.push({ max: max, min: min });
    let currObj = { name: curr.id, data: data };
    series.push(currObj);
  }

  var categories = [];
  let step = parseInt((max - min) / 20);
  if (step < 1) {
    step = 1;
  }

  for (let i = parseInt(min); i < parseInt(max); i += step) {
    categories.push(i);
  }
  for (let i = 0; i < series.length; i++) {
    let lenghtToconConcat = parseInt(
      ((MxMn[i].min - categories[0]) / step / categories.length) * mxLength
    );
    console.log(mxLength, lenghtToconConcat);
    let arr = [];
    for (let j = 0; j < lenghtToconConcat; j++) {
      arr.push(0);
    }
    if (lenghtToconConcat > 0) {
      let allDate = arr.concat(series[i].data);
      //allDate = allDate.concat(arr);
      console.log(allDate);
      series[i].data = allDate;
    }
  }
  var container = document.getElementById("chart-area");
  var data = {
    categories: categories,
    series: series
  };
  console.log(series, categories);
  var options = {
    chart: {
      width: 650,
      height: 540,
      title: "standerd Deviation"
    },
    yAxis: [
      {
        title: "pdf(normal probability)",
        pointOnColumn: true
      }
    ],

    series: {
      showDot: false,
      spline: true
    }
  };
  Draw.style.visibility = "hidden";
  Draw.style.display = "none";
  var chart = tui.chart.lineChart(container, data, options);
});

Reset.addEventListener("click", () => {
  window.location = window.location;
});
