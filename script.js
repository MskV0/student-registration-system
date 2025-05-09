// Student class definition
class Student {
    constructor(name, id, email, contact) {
        this.name = name;
        this.id = id;
        this.email = email;
        this.contact = contact;
    }
}
// StudentManager class to handle student operations
class StudentManager {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('students')) || [];
    }
    addStudent(student) {
        // Check if student ID already exists
        if (this.isIdUnique(student.id)) {
            this.students.push(student);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }
    editStudent(index, updatedStudent) {
        const currentId = this.students[index].id;
        
        // If ID is being changed, check if the new ID is unique
        if (currentId !== updatedStudent.id && !this.isIdUnique(updatedStudent.id)) {
            return false;
        }
        
        this.students[index] = updatedStudent;
        this.saveToLocalStorage();
        return true;
    }
    deleteStudent(index) {
        this.students.splice(index, 1);
        this.saveToLocalStorage();
    }
    saveToLocalStorage() {
        localStorage.setItem('students', JSON.stringify(this.students));
    }
    loadStudents() {
        return this.students.sort((a, b) => a.id - b.id);
    }
    isIdUnique(id) {
        return !this.students.some(student => student.id === id);
    }
}
// DOM manipulation functions
function renderStudents(studentManager) {
    const studentRecordsTable = document.querySelector('#studentRecords table');
    studentRecordsTable.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="studentTableBody"></tbody>
    `;
    
    const tableBody = document.getElementById('studentTableBody');
    const students = studentManager.loadStudents();
    
    // Add rows to the table body
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.id}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td>
                <button onclick="editStudent(${index})">Edit</button>
                <button onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Add scrollbar if there are enough students
    const tableContainer = document.getElementById('tableContainer');
    if (students.length > 5) {
        tableContainer.style.maxHeight = '300px';
        tableContainer.style.overflowY = 'auto';
    } else {
        tableContainer.style.maxHeight = 'none';
        tableContainer.style.overflowY = 'visible';
    }
}
// Global instance of StudentManager
const studentManager = new StudentManager();
// Event listener for form submission and initialization
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    
    // Initial rendering of students
    renderStudents(studentManager);
    
    // Set up form submission event
    form.addEventListener('submit', handleFormSubmit);
    
    // Set up input validation for student name (only alphabets)
    const studentNameInput = document.getElementById('studentName');
    studentNameInput.addEventListener('input', function() {
        const nameValue = this.value;
        // Allow only alphabets and spaces
        const validatedValue = nameValue.replace(/[^a-zA-Z\s]/g, '');
        if (nameValue !== validatedValue) {
            this.value = validatedValue;
        }
    });
    
    // Set up input validation for contact number (only digits)
    const contactInput = document.getElementById('contactNo');
    contactInput.addEventListener('input', function() {
        const contactValue = this.value;
        // Allow only digits
        const validatedValue = contactValue.replace(/\D/g, '');
        if (contactValue !== validatedValue) {
            this.value = validatedValue;
        }
    });
});
// Function to add a student
function addStudent() {
    const name = document.getElementById('studentName').value;
    const id = document.getElementById('studentID').value;
    const email = document.getElementById('emailID').value;
    const contact = document.getElementById('contactNo').value;
    
    // Validate input
    if (!name || !id || !email || !contact) {
        alert("All fields are required!");
        return;
    }
    
    // Validate student name to ensure it contains only alphabets
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        alert("Student name must contain only alphabets.");
        return;
    }
    
    // Validate contact number to ensure it contains only digits
    if (!/^\d+$/.test(contact)) {
        alert("Contact number must contain only digits.");
        return;
    }
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    
    // Create a new student object
    const student = new Student(name, id, email, contact);
    
    // Try to add the student and check if successful (ID is unique)
    if (studentManager.addStudent(student)) {
        renderStudents(studentManager);
        document.getElementById('registrationForm').reset();
    } else {
        alert("Student ID already exists. Please use a unique ID.");
    }
}
// Function to edit a student
window.editStudent = function(index) {
    const student = studentManager.students[index];
    const originalId = student.id; // Store the original ID
    
    // Store the index in a data attribute for later use
    document.getElementById('registrationForm').setAttribute('data-edit-index', index);
    document.getElementById('registrationForm').setAttribute('data-original-id', originalId);
    
    // Populate form with student data
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentID').value = student.id;
    document.getElementById('emailID').value = student.email;
    document.getElementById('contactNo').value = student.contact;
    
    // Change the submit button to say "Update"
    const submitButton = document.querySelector('#registrationForm button[type="submit"]');
    submitButton.textContent = 'Update';
    
    // Replace the form's submit handler
    const form = document.getElementById('registrationForm');
    form.removeEventListener('submit', handleFormSubmit);
    form.addEventListener('submit', handleUpdateSubmit);
}

// Function to handle the update submission
function handleUpdateSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('studentName').value;
    const id = document.getElementById('studentID').value;
    const email = document.getElementById('emailID').value;
    const contact = document.getElementById('contactNo').value;
    
    // Validate input
    if (!name || !id || !email || !contact) {
        alert("All fields are required!");
        return;
    }
    
    // Validate student name
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        alert("Student name must contain only alphabets.");
        return;
    }
    
    // Validate contact number
    if (!/^\d+$/.test(contact)) {
        alert("Contact number must contain only digits.");
        return;
    }
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    
    // Get the index of the student being edited
    const index = parseInt(document.getElementById('registrationForm').getAttribute('data-edit-index'));
    const originalId = document.getElementById('registrationForm').getAttribute('data-original-id');
    
    // Create updated student object
    const updatedStudent = new Student(name, id, email, contact);
    
    // Check if ID is changed and if it's unique
    if (id !== originalId && !studentManager.isIdUnique(id)) {
        alert("This Student ID is already in use. Please choose a unique ID.");
        return;
    }
    
    // Update the student record
    studentManager.students[index] = updatedStudent;
    studentManager.saveToLocalStorage();
    
    // Reset the form and restore the original submit handler
    document.getElementById('registrationForm').reset();
    document.getElementById('registrationForm').removeAttribute('data-edit-index');
    document.getElementById('registrationForm').removeAttribute('data-original-id');
    
    // Restore the submit button text
    const submitButton = document.querySelector('#registrationForm button[type="submit"]');
    submitButton.textContent = 'Register';
    
    // Switch back to the original submit handler
    const form = document.getElementById('registrationForm');
    form.removeEventListener('submit', handleUpdateSubmit);
    form.addEventListener('submit', handleFormSubmit);
    
    // Refresh the student list
    renderStudents(studentManager);
}

// Function to handle the initial form submission (for adding new students)
function handleFormSubmit(e) {
    e.preventDefault();
    addStudent();
}
// Function to delete a student
window.deleteStudent = function(index) {
    studentManager.deleteStudent(index);
    renderStudents(studentManager);
}