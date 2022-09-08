const AGE_LIMIT = 80;

window.onload = () => {
  const submitBtn = document.getElementById("submit-birthday");
  submitBtn.onclick = submitBirthday;
  renderCalendar();
};

function renderCalendar() {
  resetError();
  const birthdayStr = localStorage.getItem("birthday");
  if(!birthdayStr) {
    document.getElementById("input-birthday-wrapper").classList.remove("hide");
    return;
  }
  document.getElementById("memento-mori-life-calendar").classList.remove("hide");

  const currentDate = moment();
  const birthday = moment(birthdayStr).utc().format()
  if (birthday >= currentDate) {
    document.getElementById("memento-mori-life-calendar").classList.add("hide");
    showError(
      "Invalid birthday stored in local storage. Probably you have modified the stored birthday."
        + " Reset the local storage for this website. Or reinstall the extension."
    );
    return;
  }

  const age = currentDate.diff(birthday, 'years', true);
  createTable(AGE_LIMIT, age);
  createLegend(AGE_LIMIT);
}

function submitBirthday() {
  resetError();

  const input = document.getElementById("input-birthday").value;

  if (!input) {
    showError("Invalid Birthday. No Date provided.");
    return;
  }
  const current = moment();
  const birthday = moment(
    document.getElementById("input-birthday").valueAsNumber
  ).utc().format();
  if (birthday > current) {
    showError("Invalid Birthday");
    return;
  }
  document.getElementById("input-birthday-wrapper").classList.add("hide");
  localStorage.setItem("birthday", birthday.toString());
  renderCalendar();
}

function showError(errorStr) {
  document.getElementById("error-birthday").innerText = `&#9888; ${errorStr}`;
}

function resetError() {
  document.getElementById("error-birthday").innerText = "";
}

function createTable(ageLimit, currentAge) {
  const wrapper = document.getElementById("calendar-wrapper");

  const ageYears = Math.floor(currentAge);
  // NOTE: First (bugged) implementation calculated the age in weeks and then divided it by 52.
  // This approach was wrong since each year has an average of 52.176 weeks.
  // A regular year has 52.143 weeks, while a leap year 52.286 weeks (leap year occurs every 4 years)
  // https://www.remote.tools/how-many-weeks-in-a-year
  // The new implementation calculates the age in years. This way the calculation is less precise
  // and can be fit in in the 52 weeks.
  const ageWeeks = Math.floor((currentAge - Math.floor(currentAge))
      .toFixed(10)
      * 52
  );

  const calendar = document.createElement("div");
  calendar.id = "calendar";

  for (let year = 0; year < ageLimit; year++) {
    if (year !== 0 && year % 10 === 0) {
      calendar.append(createSpacingCell());
    }

    const row = document.createElement("div");
    row.classList.add("calendar-row");
    row.id = `year-${year}`;

    for (let week = 0; week < 52; week++) {
      if (week !== 0 && week % 26 === 0) {
        row.appendChild(createSpacingCell());
      }

      const cell = document.createElement("div");
      cell.id = `y=${year}-w${week}`;
      row.appendChild(cell);
      cell.classList.add("cell");

      if (year < ageYears || year === ageYears && week < ageWeeks) {
        cell.classList.add("cell-filled");
      } else {
        cell.classList.add("cell-empty");
      }
    }
    calendar.appendChild(row);
  }
  wrapper.appendChild(calendar);
}

function createSpacingCell() {
  const div = document.createElement("div");
  div.classList.add("cell", "spacing-cell");
  return div;
}

function createLegend(ageLimit) {
  const wrapper = document.getElementById("calendar-wrapper");

  const calendarLegend = document.createElement("div");
  calendarLegend.id = "calendar-legend";

  for (let year = 0; year < ageLimit; year++) {
    if (year !== 0 && year % 10 === 0) {
      calendarLegend.append(createSpacingCell());
    }

    const row = document.createElement("div");
    row.id = `year-${year}`;

    const cell = document.createElement("div");
    cell.classList.add("cell", "cell-calendar-legend");
    row.appendChild(cell);
    if (year !== 0 && (year) % 5 === 0) {
      cell.innerText = `${year}`;
    }
    calendarLegend.appendChild(row);
  }
  wrapper.appendChild(calendarLegend);
}
