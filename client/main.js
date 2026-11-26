const BASEURL = "http://localhost:3000";

function fetchStudents() {
  return fetch(`${baseUrl}/students`).then((response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

const list = document.querySelector(".students_list");

function renderStudents(students) {
  const markup = students
    .map(({ name, age, email }) => {
      return `
        <li>
          <p>name: ${name}</p>
          <p>age: ${age}</p>
          <p>email: ${email}</p>
        </li>
      `;
    })
    .join("");
  list.insertAdjacentHTML("beforeend", markup);
}

fetchStudents()
  .then((students) => renderStudents(students))
  .catch((error) => console.error(error));
