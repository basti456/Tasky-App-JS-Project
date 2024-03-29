var state = {
  taskList: [],
};

//DOM Operation

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");

//Template for card on screen
const htmlTaskContent = ({ id, title, description, type, url }) => `
  <div class="col-md-6 col-lg-4 mt-3 id=${id}">
    <div class='card shadow-sm task__card'>
      <div class='card-header d-flex justify-content-end task__card__header'>
        <button type='button' class='btn btn-outline-info mr-1.5' onClick='editTask.apply(this,arguments)' name=${id}>
          <i class='fas fa-pencil-alt' name=${id}></i>
        </button>
        <button type='button' class='btn btn-outline-danger mr-1.5' onClick='deleteTask.apply(this,arguments)' name=${id} >
          <i class='fas fa-trash-alt' name=${id} on></i>
        </button>
      </div>
      <div class='card-body'>
        ${
          url &&
          `<img width='100%' src=${url} alt='Card Image' class='card-img-top md-3 rounded-lg'/>`
        }
        <h4 class='card-title task__card__title'>${title}</h4>
        <p class='description trim-3-lines text-muted'>${description}</p>
        <div class='tags text-white d-flex flex-wrap'>
          <span class='badge bg-primary m-1'>${type}</span>
        </div>
      </div>
      <div class='card-footer'>
          <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle="modal" data-bs-target="#showTask" onClick='openTask.apply(this,arguments)' id=${id}>Open Task</button>
      </div>
    </div>
  </div>
`;
const htmlModalContent = ({ id, title, description, url }) => {
  const date = new Date(parseInt(id));
  return `
  <div id=${id}>
    ${
      url &&
      `<img width='100%' src=${url} alt='Card Image' class='img-fluid place__holder__image mb-3'/>`
    }
    <strong class='text-muted text-sm'>Created on ${date.toDateString()}</strong>
    <h2 class='my-3'>${title}</h2>
    <p class='text-muted'>${description}</p>
  </div>
  `;
};

const updateLocalStorage = () => {
  console.log(state.taskList);
  localStorage.clear();
  localStorage.setItem(
    "task",
    JSON.stringify({
      tasks: state.taskList,
    })
  );
};

const loadInitialData = () => {
  const localStorageCopy = JSON.parse(localStorage.task);
  if (localStorageCopy) {
    state.taskList = localStorageCopy.tasks;
  }
  state.taskList.map((cardData) => {
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
  });
};

const handleSubmit = (event) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("imageURL").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };
  console.log(input);
  taskContents.insertAdjacentHTML(
    "beforeend",
    htmlTaskContent({ ...input, id })
  );
  state.taskList.push({ ...input, id });
  updateLocalStorage();
};

const openTask = (event) => {
  const getTask = state.taskList.find(({ id }) => id === event.target.id);
  taskModal.innerHTML = htmlModalContent(getTask);
};

const deleteTask = (e) => {
  if (!e) {
    window.event;
  }
  const targetId = e.target.getAttribute("name");
  const type = e.target.tagName;
  const removeTask = state.taskList.filter((ele) => {
    return ele.id !== targetId;
  });
  state.taskList = removeTask;
  updateLocalStorage();
  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

const editTask = (e) => {
  if (!e) window.event;
  const targetId = e.target.getAttribute("name");
  // console.log(e.target);
  // console.log(e.target.id);

  const type = e.target.tagName;
  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[1];
  submitButton = parentNode.childNodes[5].childNodes[1];
  taskTitle.setAttribute("contentEditable", true);
  taskDescription.setAttribute("contentEditable", true);
  taskType.setAttribute("contenteditable", "true");

  submitButton.setAttribute("onClick", "saveEdit.apply(this,arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
  if (!e) {
    window.event;
  }
  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;
  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const taskType = parentNode.childNodes[3].childNodes[1];
  const submitButton = parentNode.childNodes[5].childNodes[1];
  const updateData = {
    title: taskTitle.innerHTML,
    description: taskDescription.innerHTML,
    type: taskType.innerHTML,
  };
  let stateCopy = state.taskList;
  stateCopy = stateCopy.map((task) =>
    task.id === targetId
      ? {
          id: task.id,
          title: updateData.title,
          description: updateData.description,
          type: updateData.type,
          url: task.url,
        }
      : task
  );
  console.log(stateCopy);
  state.taskList = stateCopy;
  updateLocalStorage();

  taskTitle.setAttribute("contentEditable", false);
  taskDescription.setAttribute("contentEditable", false);
  taskType.setAttribute("contenteditable", "false");

  submitButton.setAttribute("onClick", "openTask.apply(this,arguments)");
  submitButton.setAttribute("data-bs-toggle", "modal");
  submitButton.setAttribute("data-bs-target", "#showTask");
  submitButton.innerHTML = "Open Task";
};

const searchTask = (e) => {
  if (!e) {
    window.event;
  }
  while (taskContents.firstChild) {
    taskContents.removeChild(taskContents.firstChild);
  }
  const resultData = state.taskList.filter(({ title }) =>
    title.toLowerCase().includes(e.target.value.toLowerCase())
  );
  console.log(resultData);
  resultData.map((cardData) =>
    taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData))
  );
};
