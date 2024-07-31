# Attendance Tracker

An attendance tracking web application designed to help students monitor their attendance and ensure they meet the required attendance percentage for their A-levels.

## Features

1. **Login and Registration:**
   - Secure login and registration system to protect user data.

2. **Data Entry Page:**
   - Mark attendance as present, absent, or holiday.
   - Option to provide a reason for absence.
   - Holidays do not count towards the total number of school days or the attendance percentage.

3. **Calendar View Page:**
   - Visual calendar displaying attendance status for each day.
   - Clicking on a date shows a pop-up with details (date, status, reason for absence).

4. **Statistics Page:**
   - Summary of attendance data including total school days, present days, absent days, and required attendance percentage.
   - Calculation of additional days needed to meet the required attendance percentage.

5. **Settings Page:**
   - Toggle between light and dark mode.
   - Adjust the required attendance percentage using a slider.

6. **Predictor Page:**
   - Predict future attendance percentage based on potential absences in the upcoming week.

## Pages

### Login Page

Users can log in or register to access the app. If the user is not logged in, they are redirected to the login page.

### Data Entry Page

- Allows users to select a date and mark their attendance status (present, absent, holiday).
- Users can provide a reason for their absence.
- Holidays are excluded from attendance calculations.

### Calendar View Page

- Displays a calendar view of the current month with each day's attendance status color-coded:
  - Green for present.
  - Red for absent.
  - Blue for holiday.
  - Gray for unknown.
- Clicking on a date shows a pop-up with detailed information.

### Statistics Page

- Provides a summary of attendance:
  - Total number of school days (excluding weekends and holidays).
  - Number of present days.
  - Number of absent days.
  - Required attendance percentage.
  - Additional days needed to meet the required attendance percentage.

### Settings Page

- Users can switch between light and dark mode.
- Users can adjust the required attendance percentage using a slider.

### Predictor Page

- Allows users to predict their attendance percentage for the next week based on potential absences.
- Shows predicted total school days, present days, absent days, and attendance percentage.

## Usage

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.).


## How to Run

1. Clone the repository.
2. Open `index.html` in your browser.

## Hosting on GitHub Pages

1. Push the repository to GitHub.
2. Go to the repository settings.
3. Enable GitHub Pages and select the `main` branch as the source.
4. Your app will be live at `https://<username>.github.io/<repository-name>/`.
