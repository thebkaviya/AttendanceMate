document.addEventListener("DOMContentLoaded", function () {
    const getAttendanceData = () => JSON.parse(localStorage.getItem('attendanceData')) || {};
    const saveAttendanceData = (data) => localStorage.setItem('attendanceData', JSON.stringify(data));
    const getRequiredAttendance = () => localStorage.getItem('requiredAttendance') || 75;
    const setRequiredAttendance = (percentage) => localStorage.setItem('requiredAttendance', percentage);

    // Data Entry Page
    const dataEntryForm = document.getElementById('data-entry-form');
    if (dataEntryForm) {
        dataEntryForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const date = document.getElementById('date').value;
            const status = document.querySelector('input[name="status"]:checked').value;
            const reason = document.getElementById('reason').value;

            const attendanceData = getAttendanceData();
            attendanceData[date] = { status, reason };
            saveAttendanceData(attendanceData);
            alert('Attendance data saved successfully.');
        });
    }

    // Calendar View Page
    const calendarContainer = document.getElementById('calendar');
    if (calendarContainer) {
        const renderCalendar = () => {
            const now = new Date();
            const month = now.getMonth();
            const year = now.getFullYear();
            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);
            const firstDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Adjust so Monday is the first day
            const daysInMonth = lastDayOfMonth.getDate();

            calendarContainer.innerHTML = '';

            for (let i = 0; i < firstDayOfWeek; i++) {
                calendarContainer.innerHTML += '<div class="calendar-day"></div>';
            }

            const attendanceData = getAttendanceData();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day).toISOString().split('T')[0];
                const dayData = attendanceData[date] || { status: 'unknown', reason: '' };
                calendarContainer.innerHTML += `
                    <div class="calendar-day" data-status="${dayData.status}" data-date="${date}">
                        ${day}
                    </div>
                `;
            }

            document.querySelectorAll('.calendar-day[data-date]').forEach(dayElem => {
                dayElem.addEventListener('click', function () {
                    const date = this.getAttribute('data-date');
                    const dayData = attendanceData[date] || { status: 'unknown', reason: '' };
                    alert(`Date: ${date}\nStatus: ${dayData.status}\nReason: ${dayData.reason}`);
                });
            });
        };

        renderCalendar();
    }

    // Statistics Page
    const statisticsContainer = document.getElementById('statistics');
    if (statisticsContainer) {
        const renderStatistics = () => {
            const attendanceData = getAttendanceData();
            const totalSchoolDays = Object.keys(attendanceData).filter(date => {
                const dayOfWeek = new Date(date).getDay();
                return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
            }).length;
            const presentDays = Object.values(attendanceData).filter(data => data.status === 'present').length;
            const absentDays = Object.values(attendanceData).filter(data => data.status === 'absent').length;
            const requiredAttendance = getRequiredAttendance();
            const additionalDaysNeeded = Math.max(0, Math.ceil((requiredAttendance / 100) * totalSchoolDays - presentDays));

            statisticsContainer.innerHTML = `
                <p>Required Attendance: ${requiredAttendance}%</p>
                <p>Total School Days: ${totalSchoolDays}</p>
                <p>Present Days: ${presentDays}</p>
                <p>Absent Days: ${absentDays}</p>
                <p>Additional Days Needed: ${additionalDaysNeeded}</p>
            `;
        };

        renderStatistics();
    }

    // Settings Page
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        const attendanceSlider = document.getElementById('required-attendance');
        const attendanceValue = document.getElementById('required-attendance-value');

        attendanceSlider.value = getRequiredAttendance();
        attendanceValue.textContent = `${attendanceSlider.value}%`;

        attendanceSlider.addEventListener('input', function () {
            attendanceValue.textContent = `${this.value}%`;
        });

        settingsForm.addEventListener('submit', function (event) {
            event.preventDefault();
            setRequiredAttendance(attendanceSlider.value);
            alert('Settings saved successfully.');
        });
    }

    // Predictor Page
    const predictorForm = document.getElementById('predictor-form');
    const predictorResult = document.getElementById('predictor-result');
    if (predictorForm) {
        predictorForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const daysAbsentNextWeek = parseInt(document.getElementById('days-absent-next-week').value, 10);

            const attendanceData = getAttendanceData();
            const totalSchoolDays = Object.keys(attendanceData).filter(date => {
                const dayOfWeek = new Date(date).getDay();
                return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
            }).length;
            const presentDays = Object.values(attendanceData).filter(data => data.status === 'present').length;

            const newTotalSchoolDays = totalSchoolDays + 5; // Adding next week's days (assuming a full school week)
            const newAbsentDays = Object.values(attendanceData).filter(data => data.status === 'absent').length + daysAbsentNextWeek;
            const newPresentDays = presentDays;
            const newAttendancePercentage = (newPresentDays / newTotalSchoolDays) * 100;

            predictorResult.innerHTML = `
                <p>New Total School Days: ${newTotalSchoolDays}</p>
                <p>New Present Days: ${newPresentDays}</p>
                <p>New Absent Days: ${newAbsentDays}</p>
                <p>New Attendance Percentage: ${newAttendancePercentage.toFixed(2)}%</p>
            `;
        });
    }
});
