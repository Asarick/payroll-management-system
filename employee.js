let currentEmployee = null;
let allowances = JSON.parse(localStorage.getItem('allowances')) || {
    house: 0,
    transport: 0,
    hardship: 0
};

let deductionRates = JSON.parse(localStorage.getItem('deductionRates')) || {
    nhif: 2.5,
    nssf: 6,
    paye: 30,
    housing: 1.5
};

// Function to get current employee data from localStorage
function getCurrentEmployeeData() {
    const employeeData = JSON.parse(localStorage.getItem('currentEmployee'));
    if (!employeeData) {
        console.error('No employee data found in localStorage');
        alert('Failed to load employee data. Please log in again.');
        window.location.href = 'login.html';
        return null;
    }
    return employeeData;
}

// Function to show/hide sections
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Function to load employee data
function loadEmployeeData() {
    currentEmployee = getCurrentEmployeeData();
    if (currentEmployee) {
        refreshAllowancesAndDeductions(); // Add this line
        loadCurrentSalary(currentEmployee);
        loadPastSalaries(currentEmployee);
        loadPersonalInfo(currentEmployee);
    }
}

// Function to load current salary information
function loadCurrentSalary(employeeData) {
    const salaryInfo = document.getElementById('currentSalaryInfo');
    const grossSalary = calculateGrossSalary(employeeData.salary);
    const deductions = calculateDeductions(grossSalary);
    const netSalary = grossSalary - deductions.total;

    salaryInfo.innerHTML = `
        <h3>Salary Breakdown for Current Month</h3>
        <p>Basic Salary: Ksh${employeeData.salary}</p>
        <p>House Allowance: Ksh${allowances.house}</p>
        <p>Transport Allowance: Ksh${allowances.transport}</p>
        <p>Hardship Allowance: Ksh${allowances.hardship}</p>
        <h4>Deductions:</h4>
        <p>NHIF: Ksh${deductions.nhif.toFixed(2)}</p>
        <p>NSSF: Ksh${deductions.nssf.toFixed(2)}</p>
        <p>PAYE: Ksh${deductions.paye.toFixed(2)}</p>
        <p>Housing Levy: Ksh${deductions.housing.toFixed(2)}</p>
        <h4>Net Salary: Ksh${netSalary.toFixed(2)}</h4>
    `;
}

// Function to calculate gross salary
function calculateGrossSalary(basicSalary) {
    return parseFloat(basicSalary) + allowances.house + allowances.transport + allowances.hardship;
}

// Function to calculate deductions
function calculateDeductions(grossSalary) {
    const nhif = grossSalary * (deductionRates.nhif / 100);
    const nssf = grossSalary * (deductionRates.nssf / 100);
    const paye = grossSalary * (deductionRates.paye / 100);
    const housing = grossSalary * (deductionRates.housing / 100);
    const total = nhif + nssf + paye + housing;

    return { nhif, nssf, paye, housing, total };
}

function refreshAllowancesAndDeductions() {
    allowances = JSON.parse(localStorage.getItem('allowances')) || allowances;
    deductionRates = JSON.parse(localStorage.getItem('deductionRates')) || deductionRates;
}

// Call this function when the page loads
window.onload = function() {
    refreshAllowancesAndDeductions();
    showSection('currentSalary');
    loadEmployeeData();
};

// Function to load past salaries
function loadPastSalaries(employeeData) {
    const pastSalariesList = document.getElementById('pastSalariesList');
    pastSalariesList.innerHTML = '<h3>Past Salaries</h3>';
    if (employeeData.pastSalaries && employeeData.pastSalaries.length > 0) {
        employeeData.pastSalaries.forEach(salary => {
            pastSalariesList.innerHTML += `<p>${salary.month}: $${salary.netSalary.toFixed(2)}</p>`;
        });
    } else {
        pastSalariesList.innerHTML += '<p>No past salary data available.</p>';
    }
}

// Function to download payslip
function downloadPayslip() {
    // This function should be implemented based on your specific requirements
    // For now, we'll just show an alert
    alert('Payslip download initiated. Please check your downloads folder.');
}

// Function to load personal information
function loadPersonalInfo(employeeData) {
    document.getElementById('name').value = employeeData.name;
    document.getElementById('email').value = employeeData.email;
    document.getElementById('phone').value = employeeData.phone || '';
    document.getElementById('address').value = employeeData.address || '';
}

// Function to update personal information
document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const updatedInfo = {
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
    };

    // Update the employee data in localStorage
    currentEmployee.phone = updatedInfo.phone;
    currentEmployee.address = updatedInfo.address;
    localStorage.setItem('currentEmployee', JSON.stringify(currentEmployee));

    // Update in the main employees array
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const index = employees.findIndex(emp => emp.id === currentEmployee.id);
    if (index !== -1) {
        employees[index] = {...employees[index], ...updatedInfo};
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    alert('Personal information updated successfully');
});

// Function to send feedback
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const feedbackData = {
        employeeId: currentEmployee.id,
        type: document.getElementById('feedbackType').value,
        message: document.getElementById('feedbackMessage').value,
        date: new Date().toISOString()
    };

    // Store feedback in localStorage
    const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(feedbackData);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

    alert('Feedback sent successfully');
    document.getElementById('feedbackMessage').value = '';
});

// Function to handle logout
function logout() {
    localStorage.removeItem('currentEmployee');
    alert('Logged out successfully');
    window.location.href = 'login.html';
}

// Initialize the page
window.onload = function() {
    showSection('currentSalary');
    loadEmployeeData();
};