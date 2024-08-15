document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const appContainer = document.getElementById('app-container');
    const loginContainer = document.getElementById('login-container');
    const logoutButton = document.getElementById('logout-button');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'password') { // Basic login check
            loginContainer.style.display = 'none';
            appContainer.style.display = 'block';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });

    logoutButton.addEventListener('click', function() {
        appContainer.style.display = 'none';
        loginContainer.style.display = 'block';
        loginForm.reset();
    });

    // Helper functions for localStorage
    function getAttendanceData() {
        return JSON.parse(localStorage.getItem('attendanceData')) || {};
    }

    function setAttendanceData(data) {
        localStorage.setItem('attendanceData', JSON.stringify(data));
    }

    function getInitialData() {
        return JSON.parse(localStorage.getItem('initialData')) || { totalSchoolDays: 0, presentDays: 0 };
    }

    function setInitialData(data) {
        localStorage.setItem('initialData', JSON.stringify(data));
    }

    function getRequiredAttendance() {
        return localStorage.getItem('requiredAttendance') || 75;
    }

    function setRequiredAttendance(value) {
        localStorage.setItem('requiredAttendance', value);
    }

    // Data Entry Page
    const dataEntryForm = document.getElementById('data-entry-form');
    if (dataEntryForm) {
        dataEntryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const date = document.getElementById('date').value;
            const status = document.getElementById('status').value;
            const reason = document.getElementById('reason').value;

            const attendanceData = getAttendanceData();
            attendanceData[date] = { status, reason };
            setAttendanceData(attendanceData);

            alert('Attendance data saved successfully.');
            dataEntryForm.reset();
        });
    }

    // Calendar View Page
    const calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer) {
        const renderCalendar = () => {
            const attendanceData = getAttendanceData();
            const daysInWeek = 7;
            const totalWeeks = 4;
            calendarContainer.innerHTML = '';

            for (let i = 0; i < daysInWeek * totalWeeks; i++) {
                const day = i + 1;
                const date = new Date();
                date.setDate(day - date.getDay() + 1); // Start from Monday
                const formattedDate = date.toISOString().split('T')[0];

                const dayData = attendanceData[formattedDate] || { status: 'unknown', reason: '' };
                const dayElement = document.createElement('div');
                dayElement.classList.add('calendar-day');
                dayElement.textContent = day;
                dayElement.dataset.status = dayData.status;

                dayElement.addEventListener('click', () => {
                    const popup = document.getElementById('popup');
                    if (popup) {
                        document.getElementById('popup-date').textContent = formattedDate;
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
    const statisticsContainer = document.getElementById('statistics-container');
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
                   
                    settingsForm.addEventListener('submit', function(event) {
                        event.preventDefault();
                        setRequiredAttendance(requiredAttendanceSlider.value);
                        alert('Settings saved successfully.');
                    });
                }
            
                // Predictor Page
                const predictorForm = document.getElementById('predictor-form');
                if (predictorForm) {
                    predictorForm.addEventListener('submit', function(event) {
                        event.preventDefault();
                        const daysAbsentNextWeek = parseInt(document.getElementById('days-absent-next-week').value);
            
                        const attendanceData = getAttendanceData();
                        const initialData = getInitialData();
                        let totalSchoolDays = initialData.totalSchoolDays;
                        let presentDays = initialData.presentDays;
            
                        // Calculate future attendance
                        totalSchoolDays += 5; // Adding the 5 days of the next week
                        const predictedPresentDays = presentDays;
                        const predictedAbsentDays = totalSchoolDays - predictedPresentDays - daysAbsentNextWeek;
            
                        const predictedAttendance = ((predictedPresentDays / totalSchoolDays) * 100).toFixed(2);
                        document.getElementById('predictor-result').textContent = `Predicted Attendance: ${predictedAttendance}%`;
                    });
                }
            
                // Initial Data Page
                const initialDataForm = document.getElementById('initial-data-form');
                if (initialDataForm) {
                    initialDataForm.addEventListener('submit', function(event) {
                        event.preventDefault();
                        const initialSchoolDays = parseInt(document.getElementById('initial-school-days').value);
                        const initialPresentDays = parseInt(document.getElementById('initial-present-days').value);
            
                        const initialData = {
                            totalSchoolDays: initialSchoolDays,
                            presentDays: initialPresentDays
                        };
                        setInitialData(initialData);
            
                        alert('Initial data saved successfully.');
                    });
                }
            });
            