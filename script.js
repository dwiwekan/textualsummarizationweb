const loading = document.querySelector(".loading");
const loadingBg = document.querySelector(".loading-background");
const textareas = document.querySelectorAll(".teks-input");
const submitBtn = document.querySelector("#submit-btn");
const wrapper = document.querySelectorAll(".wrapper"),
  selectBtn = document.querySelectorAll(".select-btn"),
  options = document.querySelectorAll(".options");
const summaryContainer = document.querySelector("#summary");
const detailTable = document.querySelector("#detail-table tbody");
const percentageRange = document.querySelector(".slider");
const percentageValueContainer = document.querySelector("#percentage-value");
const kalimatUtamaOptions = [
  { text: "Awal Kalimat", value: 1 },
  { text: "Akhir Kalimat", value: 2 },
];
const kalimatUtamaSbgOptions = [
  { text: "Premise", value: 1 },
  { text: "Hipotesis", value: 2 },
];
const inputKalimatUtama = document.querySelector('input[name="awal_akhir"]');
const inputKalimatUtamaSbg = document.querySelector('input[name="posisi"]');
const form = document.querySelector("form");
//textarea word counting and height adjustment
textareas.forEach((textarea) => {
  textarea.addEventListener("input", function () {
    this.nextElementSibling.querySelector("span").innerHTML = this.value
      ? this.value.match(/\S+/g).length
      : 0;
  });
});

//addOptions to select Kalimat Utama
function addOptionsUtama(selectedOptions) {
  options[0].innerHTML = "";
  kalimatUtamaOptions.forEach((option) => {
    let isSelected = option == selectedOptions ? "selected" : "";
    let li = `<li data-value="${option.value}" onclick="updateNameUtama(this)" class="${isSelected}">${option.text}</li>`;
    options[0].insertAdjacentHTML("beforeend", li);
  });
}
//addOptions to select Kalimat Utama Sebagai
function addOptionsUtamaSbg(selectedOptions) {
  options[1].innerHTML = "";
  kalimatUtamaSbgOptions.forEach((option) => {
    let isSelected = option == selectedOptions ? "selected" : "";
    let li = `<li data-value="${option.value}" onclick="updateNameUtamaSbg(this)" class="${isSelected}">${option.text}</li>`;
    options[1].insertAdjacentHTML("beforeend", li);
  });
}
function updateNameUtama(selectedLi) {
  addOptionsUtama(selectedLi.innerText);
  wrapper[0].classList.remove("active");
  selectBtn[0].firstElementChild.innerText = selectedLi.innerText;
  inputKalimatUtama.value = selectedLi.getAttribute("data-value");
}
function updateNameUtamaSbg(selectedLi) {
  addOptionsUtama(selectedLi.innerText);
  wrapper[1].classList.remove("active");
  selectBtn[1].firstElementChild.innerText = selectedLi.innerText;
  inputKalimatUtamaSbg.value = selectedLi.getAttribute("data-value");
}
//call the function
addOptionsUtama();
addOptionsUtamaSbg();

//toggling options for both select kalimat utama and kalimat utama sebagai
selectBtn.forEach((select, key) => {
  select.addEventListener("click", () =>
    wrapper[key].classList.toggle("active")
  );
});

//show percentage value when slider change
percentageRange.addEventListener("input", function () {
  percentageValueContainer.innerHTML = this.value;
  console.log(this.value);
});

//submit button on click event. your request code to Machine Learning / server goes here
submitBtn.addEventListener("click", async function () {
  let formData = new FormData(form);
  let obj = {};
  for (var pair of formData.entries()) {
    obj[pair[0]] = pair[1];
  }
  obj.persentase = parseFloat(obj.persentase / 100);
  obj.awal_akhir = parseInt(obj.awal_akhir);
  obj.posisi = parseInt(obj.posisi);
  showLoading();
  getPredictionFromAPI(obj)
    .then((data) => {
      hideLoading();
      renderResult(data);
      console.log(data);
    })
    .catch((error) => {
      hideLoading();
      alert(error.message);
    });
});
function renderResult(data) {
  summaryContainer.innerHTML = data.summary;
  summaryContainer.dispatchEvent(new Event("input", { bubbles: true }));
  detailTable.innerHTML = "";
  data.list_df.forEach((row, key) => {
    detailTable.innerHTML += `<tr>
    <td>${key + 1}</td>
    <td>
  ${row[0]}
    </td>
    <td>${row[1]}</td>
    <td>${row[2]}%</td>
  </tr>`;
  });
}

async function getPredictionFromAPI(body) {
  const response = await axios({
    method: "post",
    url: "https://textualsummarization.fly.dev/predict",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    // data: {
    //   text: "Quarterly profits at US media giant TimeWarner jumped 76% to $1.13bn (£600m) for the three months to December, from $639m year-earlier. TimeWarner said fourth quarter sales rose 2% to $11.1bn from $10.9bn. Its profits were buoyed by one-off gains which offset a profit dip at Warner Bros, and less users for AOL. Time Warner said on Friday that it now owns 8% of search-engine Google. But its own internet business, AOL, had has mixed fortunes. It lost 464,000 subscribers in the fourth quarter profits were lower than in the preceding three quarters. However, the company said AOL's underlying profit before exceptional items rose 8% on the back of stronger internet advertising revenues. It hopes to increase subscribers by offering the online service free to TimeWarner internet customers and will try to sign up AOL's existing customers for high-speed broadband. TimeWarner also has to restate 2000 and 2003 results following a probe by the US Securities Exchange Commission (SEC), which is close to concluding.",
    //   persentase: 0.2,
    //   awal_akhir: 1,
    //   posisi: 1,
    // },
    data: body,
  });
  return response.data;
}

//function used to show the loading
function showLoading() {
  loading.classList.add("loading-active");
  loadingBg.classList.add("loading-active");
}
//function used to hide the loading
function hideLoading() {
  loading.classList.remove("loading-active");
  setTimeout(function () {
    loadingBg.classList.remove("loading-active");
  }, 20);
}
$("#fullpage").onepage_scroll({
  sectionContainer: ".section",
  pagination: false,
  easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
  // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
  animationTime: 800, // AnimationTime let you define how long each section takes to animate  updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
  beforeMove: function (index) {}, // This option accepts a callback function. The function will be called before the page moves.
  afterMove: function (index) {}, // This option accepts a callback function. The function will be called after the page moves.
  loop: false, // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
  responsiveFallback: false, // You can fallback to normal page scroll by defining the width of the browser in which
  // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
  // the browser's width is less than 600, the fallback will kick in.
  direction: "horizontal", // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
});
$(".nav-btn__right").on("click", function () {
  $("#fullpage").moveDown();
});
$(".nav-btn__left").on("click", function () {
  $("#fullpage").moveUp();
});
$("body").on("scroll touchmove mousewheel", function (e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
});

$(".nav-btn").hover(
  function () {
    $(this).find("i").addClass("bounce");
  },
  function () {
    $(this).find("i").removeClass("bounce");
  }
);
