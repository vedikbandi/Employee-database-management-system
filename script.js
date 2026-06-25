// Employee Database Management System (Frontend only)
// Note: Changes exist only in browser memory and are NOT saved to data.json.

(async function () {
    // Fetch employee data
    let employees = [];

    try {
        const data = await fetch("data.json");
        employees = await data.json();

        if (!Array.isArray(employees)) {
            employees = [];
        }
    } catch (err) {
        employees = [];
    }

    // Selected Employee
    let selectedEmployeeId =
        employees.length > 0 ? employees[0].id : -1;

    let selectedEmployee =
        employees.length > 0 ? employees[0] : null;

    // DOM Elements
    const employeeList = document.querySelector(".employees__names--list");
    const employeeInfo = document.querySelector(".employees__single--info");

    const createEmployee = document.querySelector(".createEmployee");
    const addEmployeeModal = document.querySelector(".addEmployee");
    const addEmployeeForm = document.querySelector(".addEmployee_create");

    // Show Add Employee Modal
    createEmployee.addEventListener("click", () => {
        addEmployeeModal.style.display = "flex";
    });

    // Hide Modal
    addEmployeeModal.addEventListener("click", (e) => {
        if (e.target.className === "addEmployee") {
            addEmployeeModal.style.display = "none";
        }
    });

    // DOB validation (minimum age 18)
    const dobInput = document.querySelector(".addEmployee_create--dob");
    dobInput.max = `${new Date().getFullYear() - 18}-${new Date()
        .toISOString()
        .slice(5, 10)}`;

    // ---------------- Add Employee ----------------

    addEmployeeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(addEmployeeForm);

        let empData = {};

        [...formData.entries()].forEach(([key, value]) => {
            empData[key] = value;
        });

        // Generate ID
        const maxId =
            employees.length > 0
                ? Math.max(...employees.map((emp) => emp.id))
                : 1000;

        empData.id = maxId + 1;

        // Calculate Age
        empData.age =
            new Date().getFullYear() -
            parseInt(empData.dob.slice(0, 4), 10);

        // Default image
        empData.imageUrl = empData.imageUrl || "gf.png";

        employees.push(empData);

        // First employee
        if (selectedEmployeeId === -1) {
            selectedEmployeeId = empData.id;
            selectedEmployee = empData;
        }

        renderEmployees();
        renderSingleEmployee();

        addEmployeeForm.reset();
        addEmployeeModal.style.display = "none";
    });

    // ---------------- Employee Click Events ----------------

    employeeList.addEventListener("click", (e) => {
        // Select Employee
        if (
            e.target.tagName === "SPAN" &&
            selectedEmployeeId != e.target.id
        ) {
            selectedEmployeeId = Number(e.target.id);

            renderEmployees();
            renderSingleEmployee();
        }

        // Delete Employee
        if (e.target.tagName === "I") {
            employees = employees.filter(
                (emp) => String(emp.id) !== e.target.parentNode.id
            );

            if (String(selectedEmployeeId) === e.target.parentNode.id) {
                if (employees.length > 0) {
                    selectedEmployeeId = employees[0].id;
                    selectedEmployee = employees[0];
                } else {
                    selectedEmployeeId = -1;
                    selectedEmployee = null;
                }
            }

            renderEmployees();
            renderSingleEmployee();
        }
    });

    // ---------------- Render Employee List ----------------

    function renderEmployees() {
        employeeList.innerHTML = "";

        if (employees.length === 0) {
            employeeList.innerHTML =
                "<p style='padding:20px;text-align:center;'>No employees found.</p>";

            employeeInfo.innerHTML =
                "<p style='padding:20px;text-align:center;'>Click 'Add Employee' to create one.</p>";

            return;
        }

        employees.forEach((emp) => {
            const employee = document.createElement("span");

            employee.classList.add("employees__names--item");

            if (selectedEmployeeId === emp.id) {
                employee.classList.add("selected");
                selectedEmployee = emp;
            }

            employee.id = emp.id;

            employee.innerHTML = `
                ${emp.firstName} ${emp.lastName}
                <i class="employeeDelete">&#10060;</i>
            `;

            employeeList.append(employee);
        });
    }

    // ---------------- Render Employee Details ----------------

    function renderSingleEmployee() {
        if (selectedEmployeeId === -1 || !selectedEmployee) {
            employeeInfo.innerHTML =
                "<p style='padding:20px;text-align:center;'>No employee selected.</p>";
            return;
        }

        employeeInfo.innerHTML = `
            <img src="${selectedEmployee.imageUrl}" 
                 onerror="this.src='gf.png'">

            <span class="employees__single--heading">
                ${selectedEmployee.firstName}
                ${selectedEmployee.lastName}
                (${selectedEmployee.age})
            </span>

            <span>${selectedEmployee.address}</span>
            <span>${selectedEmployee.email}</span>
            <span>Mobile - ${selectedEmployee.contactNumber}</span>
            <span>DOB - ${selectedEmployee.dob}</span>
            <span>Salary - ₹${selectedEmployee.salary}</span>
        `;
    }

    // ---------------- Initial Render ----------------

    renderEmployees();
    renderSingleEmployee();
})();