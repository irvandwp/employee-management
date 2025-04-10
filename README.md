## Overview
This is an Employee Management System built with Angular 17 and Tailwind CSS. The application provides a responsive web interface for managing employee data with features like authentication, employee listing with pagination/sorting/searching, adding new employees, and viewing employee details.

## Features
# Login Page 
authentication with username and password (admin & admin123)

# Employee List Page:
* Displays 100+ dummy employee records
* Pagination with customizable page sizes
* Sorting by column headers
* Advanced search functionality (AND condition across multiple fields)
* Action buttons for edit/delete with toast notifications
* Add new employee button

## Add Employee Page:
* Form validation for all required fields
* Date picker for birth date (with max date validation)
* Email format validation
* Numeric validation for basic salary
* Searchable dropdown for employee groups

## Employee Detail Page:
* Detailed employee information display
* Preserves previous search state when returning to list

## Technical Stack
* Angular 17
* Tailwind CSS for styling
* Angular Router for navigation
* Reactive Forms for form handling

## Installation
1. run npm install in terminal
2. run ng serve
3. Open your browser and navigate to http://localhost:4200

## Development Notes
The application uses a mock authentication system with hardcoded credentials (check the auth service for details)
Employee data is generated in-memory using the employee service
The UI is fully responsive and works on mobile, tablet, and desktop screens
