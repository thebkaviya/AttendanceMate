document.addEventListener("DOMContentLoaded", function() {
    // Redirect to login if not logged in and not on the login page
    if (!localStorage.getItem('isLoggedIn') && window.location.pathname !== '/login.html') {
        window.location.href = 'login.html';
    }

    // Theme and settings
    const themeToggle = document.getElementById('theme-toggle');
    const attendancePercentage = document.getElementById('attendance-percentage');
    const percentageDisplay = document.getElementById('percentage-display');

    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            document.body.classList.toggle('dark-mode', themeToggle.checked);
        });
    }

    if (attendancePercentage) {
        attendancePercentage.addEventListener('input', function() {
            percentageDisplay.textContent = attendancePercentage.value + '%';
        });
    }

    // Data Entry Form
    const dataEntryForm = document.getElementById('data-entry-form');
    if (dataEntryForm) {
        dataEntryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const date = document.getElementById('date').value;
            const status = document.querySelector('input[name="status"]:checked').value;
            const reason = document.getElementById('reason').value;

            let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
            attendanceData[date] = { status, reason };
            localStorage.setItem('attendanceData', JSON.stringify(attendanceData));

            alert('Data saved successfully');
            dataEntryForm.reset();
        });
    }

    // Calendar View
    const calendar = document.getElementById('calendar');
    if (calendar) {
        let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayOfWeek = date.getDay();

            if (dayOfWeek === 0 || dayOfWeek === 6) continue;

            const dateString = date.toISOString().split('T')[0];
            const status = attendanceData[dateString] ? attendanceData[dateString].status : 'unknown';

            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;
            dayElement.style.backgroundColor = status === 'present' ? 'green' : status === 'absent' ? 'red' : status === 'holiday' ? 'blue' : 'gray';

            dayElement.addEventListener('click', function() {
                const popup = document.getElementById('popup');
                const popupDate = document.getElementById('popup-date');
                const popupStatus = document.getElementById('popup-status');
                const popupReason = document.getElementById('popup-reason');

                popupDate.textContent = `Date: ${dateString}`;
                popupStatus.textContent = `Status: ${status}`;
                popupReason.textContent = `Reason: ${attendanceData[dateString]?.reason || 'N/A'}`;
                popup.classList.remove('hidden');
            });

            calendar.appendChild(dayElement);
        }
    }

    // Statistics
    if (document.getElementById('statistics')) {
        let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
        const totalDays = Object.keys(attendanceData).filter(date => attendanceData[date].status !== 'holiday').length;
        const presentDays = Object.values(attendanceData).filter(record => record.status === 'present').length;
        const absentDays = Object.keys(attendanceData).filter(date => attendanceData[date].status !== 'holiday').length - presentDays;
        const requiredPercentage = attendancePercentage ? attendancePercentage.value / 100 : 0.75;
        const requiredDays = Math.ceil(totalDays * requiredPercentage);

        document.getElementById('statistics').innerHTML = `
            <p>Total School Days: ${totalDays}</p>
            <p>Present Days: ${presentDays}</p>
            <p>Absent Days: ${absentDays}</p>
            <p>Required Attendance Percentage: ${requiredPercentage * 100}%</p>
            <p>Additional Days Needed: ${Math.max(0, requiredDays - presentDays)}</p>
        `;
    }

    // Predictor
    const predictorForm = document.getElementById('predictor-form');
    if (predictorForm) {
        predictorForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const absentDays = parseInt(document.getElementById('absent-days').value);

            let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
            const totalDays = Object.keys(attendanceData).filter(date => attendanceData[date].status !== 'holiday').length;
            const presentDays = Object.values(attendanceData).filter(record => record.status === 'present').length;
            const predictedTotalDays = totalDays + 5; // Adding 5 school days for the next week
            const predictedAbsentDays = absentDays + (totalDays - presentDays);
            const predictedPresentDays = predictedTotalDays - predictedAbsentDays;
            const predictedAttendancePercentage = (predictedPresentDays / predictedTotalDays) * 100;

            const predictionResult = document.getElementById('prediction-result');
            const predictionDetails = document.getElementById('prediction-details');

            predictionDetails.innerHTML = `
                <p>Predicted Total School Days: ${predictedTotalDays}</p>
                <p>Predicted Present Days: ${predictedPresentDays}</p>
                <p>Predicted Absent Days: ${predictedAbsentDays}</p>
                <p>Predicted Attendance Percentage: ${predictedAttendancePercentage.toFixed(2)}%</p>
            `;

            predictionResult.classList.remove('hidden');
        });
    }

    // Login and Registration
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');

            if (username === storedUsername && password === storedPassword) {
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = 'index.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newUsername = document.getElementById('new-username').value;
            const newPassword = document.getElementById('new-password').value;

            localStorage.setItem('username', newUsername);
            localStorage.setItem('password', newPassword);
            alert('User registered successfully');
            registerForm.reset();
        });
    }

    // Logout functionality
    const logout = document.getElementById('logout');
    if (logout) {
        logout.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        });
    }
});

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}
