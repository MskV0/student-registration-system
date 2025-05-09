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
        this.students.push(student);
        this.saveToLocalStorage();
    }

    editStudent(index, updatedStudent) {
        this.students[index] = updatedStudent;
        this.saveToLocalStorage();
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
}

// DOM manipulation functions
function renderStudents(studentManager) {
    const studentRecordsTable = document.querySelector('#studentRecords table');
    studentRecordsTable.innerHTML = `
        <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Email</th>
            <th>Contact</th>
            <th>Actions</th>
        </tr>
    `;

    const students = studentManager.loadStudents();
    students.forEach((student, index) => {
        const row = studentRecordsTable.insertRow();
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
    });
}

// Global instance of StudentManager
const studentManager = new StudentManager();

// Event listener for form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    renderStudents(studentManager);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addStudent();
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

    // Validate contact number to ensure it contains only digits
    if (!/^\d+$/.test(contact)) {
        alert("Contact number must contain only digits.");
        return;
    }

    // Create a new student object
    const student = new Student(name, id, email, contact);
    studentManager.addStudent(student);
    renderStudents(studentManager);
    document.getElementById('registrationForm').reset();
}

// Function to edit a student
window.editStudent = function(index) {
    const student = studentManager.students[index];
    document.getElementById('studentName').value = student.name;
    document.getElementById('studentID').value = student.id;
    document.getElementById('emailID').value = student.email;
    document.getElementById('contactNo').value = student.contact;

    // Remove student from array and local storage
    studentManager.deleteStudent(index);
    renderStudents(studentManager);
}

// Function to delete a student
window.deleteStudent = function(index) {
    studentManager.deleteStudent(index);
    renderStudents(studentManager);
}