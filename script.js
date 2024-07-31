document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById('theme-toggle');
    const attendancePercentage = document.getElementById('attendance-percentage');
    const percentageDisplay = document.getElementById('percentage-display');

    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', themeToggle.checked);
    });

    attendancePercentage.addEventListener('input', function() {
        percentageDisplay.textContent = attendancePercentage.value + '%';
    });

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
            dayElement.style.backgroundColor = status === 'present' ? 'green' : status === 'absent' ? 'red' : 'gray';

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

    if (document.getElementById('statistics')) {
        let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
        const totalDays = Object.keys(attendanceData).length;
        const presentDays = Object.values(attendanceData).filter(record => record.status === 'present').length;
        const absentDays = totalDays - presentDays;
        const requiredPercentage = attendancePercentage.value / 100;
        const requiredDays = Math.ceil(totalDays * requiredPercentage);

        document.getElementById('statistics').innerHTML = `
            <p>Total School Days: ${totalDays}</p>
            <p>Present Days: ${presentDays}</p>
            <p>Absent Days: ${absentDays}</p>
            <p>Required Attendance Percentage: ${requiredPercentage * 100}%</p>
            <p>Additional Days Needed: ${Math.max(0, requiredDays - presentDays)}</p>
        `;
    }
});

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}
