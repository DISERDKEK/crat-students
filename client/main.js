const BASE_URL = "http://localhost:3000/students";

const getStudentsBtn = document.getElementById("get-students-btn");
const studentsTableBody = document.querySelector("#students-table tbody");
const addStudentForm = document.getElementById("add-student-form");

function getStudents() {
  fetch(BASE_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Помилка HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((students) => {
      renderStudents(students);
    })
    .catch((error) => console.error("Помилка при отриманні студентів:", error));
}

function renderStudents(students) {
  const markup = students
    .map(
      ({ id, name, age, course, skills, email, isEnrolled }) => `
      <tr>
        <td>${id}</td>
        <td>${name}</td>
        <td>${age}</td>
        <td>${email}</td>
        <td>${isEnrolled ? "Записаний" : "Не записаний"}</td>
        <td>
          <button type="button" class="update-btn" data-id="${id}">Оновити</button>
          <button type="button" class="delete-btn" data-id="${id}">Видалити</button>
        </td>
      </tr>
    `
    )
    .join("");

  studentsTableBody.innerHTML = markup;
}

function addStudent(e) {
  e.preventDefault();

  const newStudent = {
    name: document.getElementById("name").value.trim(),
    age: Number(document.getElementById("age").value),
    course: document.getElementById("course").value.trim(),
    skills: document
      .getElementById("skills")
      .value.split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    email: document.getElementById("email").value.trim(),
    isEnrolled: document.getElementById("isEnrolled").checked,
  };

  fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStudent),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Помилка HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      addStudentForm.reset();
      getStudents();
    })
    .catch((error) => console.error("Помилка при додаванні студента:", error));
}

function updateStudent(id) {
  const newCourse = prompt("Введіть новий курс для студента (залиште порожнім, щоб не змінювати):");
  const newAge = prompt("Введіть новий вік студента (залиште порожнім, щоб не змінювати):");

  const updatedData = {};
  if (newCourse !== null && newCourse.trim() !== "") {
    updatedData.course = newCourse.trim();
  }
  if (newAge !== null && newAge.trim() !== "" && !isNaN(Number(newAge))) {
    updatedData.age = Number(newAge);
  }

  if (Object.keys(updatedData).length === 0) return;

  fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Помилка HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(() => {
      getStudents();
    })
    .catch((error) => console.error("Помилка при оновленні студента:", error));
}

function deleteStudent(id) {
  fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Помилка HTTP: ${response.status}`);
      }
      getStudents();
    })
    .catch((error) => console.error("Помилка при видаленні студента:", error));
}

getStudentsBtn.addEventListener("click", getStudents);
addStudentForm.addEventListener("submit", addStudent);

studentsTableBody.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("update-btn")) {
    updateStudent(id);
  }

  if (e.target.classList.contains("delete-btn")) {
    deleteStudent(id);
  }
});