document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const signupContainer = document.getElementById('signup-container');
    const appContainer = document.getElementById('app-container');

    // Show signup form
    const showSignupLink = document.getElementById('show-signup');
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(event) {
            event.preventDefault();
            loginContainer.style.display = 'none';
            signupContainer.style.display = 'block';
        });
    }

    // Show login form
    const showLoginLink = document.getElementById('show-login');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(event) {
            event.preventDefault();
            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }

    // Signup functionality
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newUsername = document.getElementById('new-username').value;
            const newPassword = document.getElementById('new-password').value;

            localStorage.setItem('username', newUsername);
            localStorage.setItem('password', newPassword);
            alert('Signup successful! You can now log in.');

            signupContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }

    // Login functionality
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const enteredUsername = document.getElementById('username').value;
            const enteredPassword = document.getElementById('password').value;

            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');

            if (enteredUsername === storedUsername && enteredPassword === storedPassword) {
                alert('Login successful!');
                loginContainer.style.display = 'none';
                appContainer.style.display = 'block';
            } else {
                alert('Incorrect username or password. Please try again.');
            }
        });
    }

    // Logout functionality
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            appContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    }

    // Data entry form
    const dataEntryForm = document.getElementById('data-entry-form');
    if (dataEntryForm) {
        dataEntryForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const date = document.getElementById('date').value;
            const status = document.getElementById('status').value;
            const reason = document.getElementById('reason').value;

            // Store attendance data
            localStorage.setItem(`attendance-${date}`, JSON.stringify({ status, reason }));
            alert('Data saved successfully!');
        });
    }

    // Calendar view
    const calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer) {
        renderCalendar();
    }

    // Settings form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const requiredAttendance = document.getElementById('required-attendance').value;
            localStorage.setItem('requiredAttendance', requiredAttendance);
            alert('Settings saved!');
        });

        // Initialize settings
        const requiredAttendanceValue = localStorage.getItem('requiredAttendance') || 75;
        document.getElementById('required-attendance').value = requiredAttendanceValue;
        document.getElementById('required-attendance-value').innerText = `${requiredAttendanceValue}%`;
    }

    // Predictor form
    const predictorForm = document.getElementById('predictor-form');
    if (predictorForm) {
        predictorForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const daysAbsent = parseInt(document.getElementById('days-absent-next-week').value);
            const totalSchoolDays = calculateSchoolDays();
            const presentDays = calculatePresentDays();

            const predictedAttendance = ((presentDays - daysAbsent) / (totalSchoolDays + 5)) * 100;
            document.getElementById('predictor-result').innerText = `Predicted Attendance: ${predictedAttendance.toFixed(2)}%`;
        });
    }

    // Initial data form
    const initialDataForm = document.getElementById('initial-data-form');
    if (initialDataForm) {
        initialDataForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const initialSchoolDays = parseInt(document.getElementById('initial-school-days').value);
            const initialPresentDays = parseInt(document.getElementById('initial-present-days').value);

            localStorage.setItem('initialSchoolDays', initialSchoolDays);
            localStorage.setItem('initialPresentDays', initialPresentDays);
            alert('Initial data saved!');
        });
    }

    // Render calendar
    function renderCalendar() {
        const totalDays = 28; // Assuming a 4-week month view
        const weekStart = 1; // 1 = Monday, 0 = Sunday
        const today = new Date();

        calendarContainer.innerHTML = ''; // Clear previous calendar

        for (let i = 0; i < totalDays; i++) {
            const date = new Date(today.getFullYear(), today.getMonth(), 1 + i - today.getDay() + weekStart);
            const formattedDate = date.toISOString().split('T')[0];
            const attendanceData = JSON.parse(localStorage.getItem(`attendance-${formattedDate}`));

            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.innerText = date.getDate();
            dayElement.dataset.date = formattedDate;

            if (attendanceData) {
                dayElement.dataset.status = attendanceData.status;
            }

            dayElement.addEventListener('click', function() {
                showPopup(date, attendanceData);
            });

            calendarContainer.appendChild(dayElement);
        }
    }

    // Show popup
    function showPopup(date, attendanceData) {
        const popup = document.getElementById('popup');
        popup.style.display = 'flex';

        document.getElementById('popup-date').innerText = `Date: ${date.toDateString()}`;
        document.getElementById('popup-status').innerText = `Status: ${attendanceData ? attendanceData.status : 'No data'}`;
        document.getElementById('popup-reason').innerText = `Reason: ${attendanceData && attendanceData.status === 'absent' ? attendanceData.reason : 'N/A'}`;

        const closeBtn = document.getElementById('popup-close');
        closeBtn.addEventListener('click', function() {
            popup.style.display = 'none';
        });
    }

    // Calculate total school days
    function calculateSchoolDays() {
        const initialSchoolDays = parseInt(localStorage.getItem('initialSchoolDays')) || 0;
        return initialSchoolDays;
    }

    // Calculate total present days
    function calculatePresentDays() {
        const initialPresentDays = parseInt(localStorage.getItem('initialPresentDays')) || 0;
        return initialPresentDays;
    }
});
