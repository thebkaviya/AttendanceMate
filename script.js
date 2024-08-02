document.addEventListener("DOMContentLoaded", function() {
    const calendar = document.getElementById('calendar');
    const calendarHeader = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    function renderCalendar(month, year) {
        calendar.innerHTML = ''; // Clear the calendar
        calendarHeader.textContent = `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month))} ${year}`;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let startDay = new Date(year, month, 1).getDay();

        // Adjust startDay to align with grid, assuming week starts from Sunday
        startDay = (startDay === 0) ? 6 : startDay - 1;

        for (let i = 0; i < startDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day');
            calendar.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const status = attendanceData[dateString] ? attendanceData[dateString].status : 'unknown';

            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            dayElement.dataset.status = status;

            dayElement.addEventListener('click', function() {
                const popup = document.getElementById('popup');
                const popupDate = document.getElementById('popup-date');
                const popupStatus = document.getElementById('popup-status');
                const popupReason = document.getElementById('popup-reason');

                popupDate.textContent = `Date: ${dateString}`;
                popupStatus.textContent = `Status: ${status}`;
                popupReason.textContent = `Reason: ${attendanceData[dateString]?.reason || 'N/A'}`;
                popup.classList.remove('hidden');
                popup.style.display = 'flex';
            });

            calendar.appendChild(dayElement);
        }
    }

    renderCalendar(currentMonth, currentYear);

    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    // Settings
    const requiredAttendanceInput = document.getElementById('required-attendance');
    const requiredAttendanceValue = document.getElementById('required-attendance-value');

    if (requiredAttendanceInput && requiredAttendanceValue) {
        requiredAttendanceInput.addEventListener('input', function() {
            const value = (requiredAttendanceInput.value * 100).toFixed(0);
            requiredAttendanceValue.textContent = `${value}%`;
            localStorage.setItem('requiredAttendance', requiredAttendanceInput.value);
        });

        const savedAttendance = localStorage.getItem('requiredAttendance');
        if (savedAttendance) {
            requiredAttendanceInput.value = savedAttendance;
            requiredAttendanceValue.textContent = `${(savedAttendance * 100).toFixed(0)}%`;
        }
    }

    // Logout
    const logoutBtn = document.getElementById('logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });
    }

    // Predictor
    const predictorForm = document.getElementById('predictor-form');
    if (predictorForm) {
        predictorForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const futureAbsences = parseInt(document.getElementById('future-absences').value);
            let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
            const totalDays = Object.keys(attendanceData).filter(date => attendanceData[date].status !== 'holiday').length;
            const presentDays = Object.values(attendanceData).filter(record => record.status === 'present').length;
            const newTotalDays = totalDays + 5;
            const newAbsentDays = Object.keys(attendanceData).filter(date => attendanceData[date].status !== 'holiday').length - presentDays + futureAbsences;
            const newPresentDays = newTotalDays - newAbsentDays;
            const newPercentage = (newPresentDays / newTotalDays) * 100;

            document.getElementById('predictor-result').innerHTML = `
                <p>Predicted Total School Days: ${newTotalDays}</p>
                <p>Predicted Present Days: ${newPresentDays}</p>
                <p>Predicted Absent Days: ${newAbsentDays}</p>
                <p>Predicted Attendance Percentage: ${newPercentage.toFixed(2)}%</p>
            `;
        });
    }
});

function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.add('hidden');
    popup.style.display = 'none';
}
