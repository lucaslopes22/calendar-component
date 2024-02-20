function generateDaysOfMonth(month, year) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    let days = [];
    let currentWeek = { week: 1, days: [] };

    for (let i = 0; i < firstDayOfMonth; i++) {
        currentWeek.days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        if (currentWeek.days.length === 7) {
            days.push(currentWeek);
            currentWeek = { week: currentWeek.week + 1, days: [] };
        }

        currentWeek.days.push(day);
    }

    days.push(currentWeek);

    days = days.map(week => ({
        week: week.week,
        days: week.days.filter(day => day !== null)
    }));

    return days;
}

function addMonths(date, months) {
    date.setMonth(date.getMonth() + months);
    return date;
}

function generateCalendar(month = 0, dateSet = null) {
    let date;

    if(!dateSet){
        if(month == 0)
        date = new Date();

        else{
            let calendar = document.querySelector(".calendar__component");
            date = addMonths(new Date(calendar.getAttribute("data-year"), calendar.getAttribute("data-month")), month)
        }
    }

    else{
        date = dateSet;
    }

    changeTextInputDate(date);
        
    let calendarDays = document.querySelector(".calendar__days");
    calendarDays.innerHTML = "";
    let daysWeek = generateDaysOfMonth(date.getMonth(), date.getFullYear());

    let index = 1;
    
    for(days of daysWeek){
        let weekElement = document.createElement("div");
        weekElement.classList.add("week");
        weekElement.classList.add("row");

        days.days.forEach(day => {
            let dayElement = document.createElement("span");
            dayElement.classList.add("day");
            dayElement.setAttribute("aria-label", new Date(date.getFullYear(), date.getMonth(), day));

            let dayNumberElement = document.createElement("div");
            dayNumberElement.innerText = day;
            dayNumberElement.addEventListener("click", () => {
                document.querySelectorAll('.day div.__active').forEach(el => {
                    el.classList.remove('__active');
                });

                dayNumberElement.classList.add("__active");
            });
            
            let dataHoje = new Date();
            dataHoje.setHours(dataHoje.getHours() - 3);

            if (new Date(date.getFullYear(), date.getMonth(), day).toISOString().split("T")[0] + "T00:00:00" == dataHoje.toISOString().split("T")[0] + "T00:00:00")
                dayNumberElement.classList.add("__today")
                

            dayElement.appendChild(dayNumberElement);
            weekElement.appendChild(dayElement);
        });

        if(daysWeek.length == index)
            weekElement.classList.add("__incomplete");

        calendarDays.appendChild(weekElement);
        index++;
    }

    let calendar = document.querySelector(".calendar__component");
    calendar.setAttribute("data-year", date.getFullYear());
    calendar.setAttribute("data-month", date.getMonth());

    
}

function changeInputDate(){
    let month = document.querySelector(".calendar__component .calendar__year__month #month").value;
    let year = document.querySelector(".calendar__component .calendar__year__month #year").value;

    let date = new Date(year, month, 1);
    generateCalendar(0, date);
}

function changeTextInputDate(date){
    document.querySelector(".calendar__component .calendar__year__month #month").value = date.getMonth();
    document.querySelector(".calendar__component .calendar__year__month #year").value = date.getFullYear();
}

let btnPreviousMonth = document.querySelector(".calendar__control .control__month.__previous");
btnPreviousMonth.addEventListener("click", () => generateCalendar(-1));

let btnNextMonth = document.querySelector(".calendar__control .control__month.__next");
btnNextMonth.addEventListener("click", () => generateCalendar(1));

let monthInput = document.querySelector(".calendar__component .calendar__year__month #month");
monthInput.addEventListener("change", () => changeInputDate());

let yearInput = document.querySelector(".calendar__component .calendar__year__month #year");
yearInput.addEventListener("change", () => changeInputDate());

generateCalendar();