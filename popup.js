document.addEventListener("DOMContentLoaded", function () {
  const changeDateBtn = document.getElementById("changeDate");
  changeDateBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.create({url: "chrome://newtab/"})
        localStorage.removeItem("birthday");
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
  });
});
