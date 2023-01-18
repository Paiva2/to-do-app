const mainContainer = document.getElementById("container");
const toDoField = document.getElementById("todofield");
const newTasks = document.getElementById("new-tasks-div");
const addBtn = document.getElementById("add-btn");
const clearAllBtn = document.querySelector(".clear-all-btn");
const editSend = document.getElementById("confirm-edit");
const cancelEdit = document.getElementById("cancel-edit");
const form = document.getElementById("form");
const formEdit = document.getElementById("edit-form");
const icons = ['<i class="bi bi-x"></i>', '<i class="bi bi-pencil-square"></i>'];
const iconsClass = ["editBtn", "deleteBtn", "bi-x", "bi-pencil-square"];
const editContainer = document.getElementById("editContainer");
const editInput = document.querySelector(".edit-input");
const backgroundShadowEdit = document.getElementById("background-shadow");
let idGenerator = 0;

class NewElements {
  createButton(icon, iconClass) {
    const btn = document.createElement("button");
    btn.innerHTML = icon;
    btn.className = iconClass;
    return btn;
  }
  createParagraph(text) {
    const p = document.createElement("p");
    p.innerText = text;
    return p;
  }

  static newId() {
    return idGenerator++;
  }

  createDiv(task) {
    const div = document.createElement("div");
    const divParagraph = document.createElement("div");

    divParagraph.className = "text";
    div.className = "new-task-styles";
    div.setAttribute("data-id", NewElements.newId());
    div.append(divParagraph);
    newTasks.append(div);
    div.prepend(this.createButton(icons[1], iconsClass[0]));
    divParagraph.append(this.createParagraph(task));
    div.append(this.createButton(icons[0], iconsClass[1]));
    return div;
  }
}

class DeleteTasks {
  static deleteTask() {
    document.addEventListener("click", (e) => {
      e.preventDefault();
      const el = e.target;

      if (el.classList.contains(iconsClass[1]) || el.classList.contains(iconsClass[2])) {
        el.closest(".new-task-styles").remove();
        if (newTasks.children.length <= 2) clearAllBtn.style.display = "none";
        DataStorageAndEdit.saveData();
      }

      clearAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        clearAllBtn.style.display = "none";
        newTasks.innerHTML = "";
        DataStorageAndEdit.saveData();
      });
    });
  }
}

class DataStorageAndEdit {
  static saveData() {
    const tasks = document.querySelectorAll("p");
    let taskList = [];
    for (let i = 0; i < tasks.length; i++) {
      let tasksText = tasks[i].innerText;
      taskList.push(tasksText);
    }

    const tasksJSON = JSON.stringify(taskList);
    localStorage.setItem("tasks", tasksJSON);
  }

  static loadData() {
    const savedTasks = localStorage.getItem("tasks");
    const convertedTaskList = JSON.parse(savedTasks);
    const createElements = new NewElements();
    if (convertedTaskList !== null) {
      convertedTaskList.forEach((task) => {
        createElements.createDiv(task);
      });
    }

    if (newTasks.children.length <= 2) clearAllBtn.style.display = "none";
    if (newTasks.children.length > 2) clearAllBtn.style.display = "block";
  }

  static editTask() {
    let newTaskDiv = "";
    let taskId = "";
    document.addEventListener("click", (e) => {
      e.preventDefault();
      const event = e.target;
      if (event.classList.contains(iconsClass[3]) || event.classList.contains(iconsClass[0])) {
        newTaskDiv = event.closest(".new-task-styles");
        taskId = newTaskDiv.getAttribute("data-id");
      }
      return taskId;
    });

    editSend.addEventListener("click", () => {
      if (editInput.value === "") {
        editInput.focus();
        Swal.fire("Insert an edit text!", "", "warning");
        return;
      }
      backgroundShadowEdit.style.display = "none";
      editContainer.style.display = "none";
      let textId = document.querySelector(`[data-id="${taskId}"] div p`);
      textId.innerText = editInput.value;
      formEdit.reset();
      DataStorageAndEdit.saveData();
    });

    document.addEventListener("click", (e) => {
      e.preventDefault();
      const el = e.target;
      if (el.classList.contains(iconsClass[3]) || el.classList.contains(iconsClass[0])) {
        backgroundShadowEdit.style.display = "block";
        editContainer.style.display = "flex";
        editInput.focus();
      }
    });

    cancelEdit.addEventListener("click", (e) => {
      e.preventDefault();
      backgroundShadowEdit.style.display = "none";
      editContainer.style.display = "none";
      formEdit.reset();
    });

  }
}

const addNewTask = () => {
  addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (toDoField.value == "") {
      Swal.fire("Insert a task!", "", "warning");
      return;
    }

    if (newTasks.children.length > 1) {
      clearAllBtn.style.display = "block";
    }

    const createElements = new NewElements();
    createElements.createDiv(toDoField.value);
    form.reset();
    DataStorageAndEdit.saveData();
  });
};

addNewTask();
DeleteTasks.deleteTask();
DataStorageAndEdit.editTask();
DataStorageAndEdit.loadData()
