document.addEventListener("DOMContentLoaded", function () {
    // Helper functions to interact with local storage
    const getAttendanceData = () => JSON.parse(localStorage.getItem('attendanceData')) || {};
    const saveAttendanceData = (data) => localStorage.setItem('attendanceData', JSON.stringify(data));
    const getRequiredAttendance = () => parseFloat(localStorage.getItem('requiredAttendance')) || 75;
    const setRequiredAttendance = (percentage) => localStorage.setItem('requiredAttendance', percentage);
    const getInitialData = () => JSON.parse(localStorage.getItem('initialData')) || { totalSchoolDays: 0, presentDays: 0 };
    const setInitialData = (data) => localStorage.setItem('initialData', JSON.stringify(data));

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
                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-day');
                dayElement.textContent = day;
                dayElement.dataset.status = dayData.status;

                dayElement.addEventListener('click', () => {
                    const popup = document.getElementById('popup');
                    if (popup) {
                        document.getElementById('popup-date').textContent = date;
                        document.getElementById('popup-status').textContent = dayData.status;
                        document.getElementById('popup-reason').textContent = dayData.reason;
                        popup.style.display = 'flex';
                    }
                });

                calendarContainer.appendChild(dayElement);
            }
        };

        renderCalendar();
    }

    // Popup for Calendar Details
    const popupCloseButton = document.getElementById('popup-close');
    if (popupCloseButton) {
        popupCloseButton.addEventListener('click', () => {
            document.getElementById('popup').style.display = 'none';
        });
    }

    // Statistics Page
    const statisticsContainer = document.getElementById('statistics');
    if (statisticsContainer) {
        const renderStatistics = () => {
            const attendanceData = getAttendanceData();
            const initialData = getInitialData();
            let totalSchoolDays = initialData.totalSchoolDays;
            let presentDays = initialData.presentDays;
            let absentDays = 0;

            for (const date in attendanceData) {
                const dayData = attendanceData[date];
                if (dayData.status === 'present') {
                    presentDays++;
                } else if (dayData.status === 'absent') {
                    absentDays++;
                }
            }

            totalSchoolDays += Object.keys(attendanceData).length;
            const requiredAttendance = getRequiredAttendance();
            const currentAttendance = presentDays / totalSchoolDays * 100;
            const additionalDaysRequired = Math.ceil((requiredAttendance * totalSchoolDays / 100) - presentDays);

            statisticsContainer.innerHTML = `
                <p>Total School Days: ${totalSchoolDays}</p>
                <p>Present Days: ${presentDays}</p>
                <p>Absent Days: ${absentDays}</p>
                <p>Current Attendance: ${currentAttendance.toFixed(2)}%</p>
                <p>Additional Days Needed: ${additionalDaysRequired > 0 ? additionalDaysRequired : 0}</p>
            `;
        };

        renderStatistics();
    }

    // Settings Page
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        const requiredAttendanceSlider = document.getElementById('required-attendance');
        const requiredAttendanceValue = document.getElementById('required-attendance-value');

        requiredAttendanceSlider.value = getRequiredAttendance();
        requiredAttendanceValue.textContent = `${requiredAttendanceSlider.value}%`;

        requiredAttendanceSlider.addEventListener('input', () => {
            requiredAttendanceValue.textContent = `${requiredAttendanceSlider.value}%`;
        });

        settingsForm.addEventListener('submit', function (event) {
            event.preventDefault();
            setRequiredAttendance(requiredAttendanceSlider.value);
            alert('Settings saved successfully.');
        });
    }

    // Predictor Page
    const predictorForm = document.getElementById('predictor-form');
    if (predictorForm) {
        predictorForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const daysAbsentNextWeek = parseInt(document.getElementById('days-absent-next-week').value);
            const attendanceData = getAttendanceData();
            const initialData = getInitialData();
            let totalSchoolDays = initialData.totalSchoolDays;
            let presentDays = initialData.presentDays;

            for (const date in attendanceData) {
                const dayData = attendanceData[date];
                if (dayData.status === 'present') {
                    presentDays++;
                }
            }

            totalSchoolDays += Object.keys(attendanceData).length + 5; // Assume 5 school days in the next week
            const futureAttendance = (presentDays / (totalSchoolDays - daysAbsentNextWeek)) * 100;

            document.getElementById('predictor-result').textContent = `Predicted Attendance: ${futureAttendance.toFixed(2)}%`;
        });
    }

    // Initial Data Page
    const initialDataForm = document.getElementById('initial-data-form');
    if (initialDataForm) {
        initialDataForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const initialSchoolDays = parseInt(document.getElementById('initial-school-days').value);
            const initialPresentDays = parseInt(document.getElementById('initial-present-days').value);

            setInitialData({ totalSchoolDays: initialSchoolDays, presentDays: initialPresentDays });
            alert('Initial data saved successfully.');
        });
    }
});
