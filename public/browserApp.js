const select = (selector) => {
      return document.querySelector(selector);
};
const tasksDom = select(".tasks");
const loadingDom = select(".loadingText");
const formDom = select(".taskForm");
const taskInputDom = select(".taskInput");
const formAlertDom = select(".formAlert");

//load tasks from /api/tasks
const showTasks = async () => {
      loadingDom.style.visibility = "visible";
      try {
            const {
                  data: { tasks },
            } = await axios.get(`/api/v1/tasks`);
            if (tasks.length < 1) {
                  tasksDom.innerHTML = `
            <h5 class="emptyList">No tasks in your list</h5>`;
                  loadingDom.style.visibility = "hidden";
                  return;
            }
            const allTasks = tasks
                  .map((task) => {
                        const { completed, _id: taskID, name } = task;
                        return `
                        <div class="singleTask ${completed && "taskCompleted"}">
                              <h5>
                                    <span>
                                          <i class="far fa-check-circle"></i>
                                    </span>${name}
                              </h5>
                              <div class="taskLinks">
                                    // edit link
                                    <a
                                    href="task.html?id=${taskID}" 
                                    class="editLInk"
                                    >
                                          <i class="fas fa-edit"></i>
                                    </a>
                                    // delte btn
                                    <button 
                                    type="button"
                                    class="deleteBtn"
                                    data-id="${taskID}"
                                    >
                                          <i class="fas fa-trash"></i>
                                    </button>
                              </div>
                        </div>
                  `;
                  })
                  .join("");
            tasksDom.innerHTML = allTasks;
      } catch (error) {
            tasksDom.innerHTML = `
                  <h5 class="emptyList">There was an error, please try later...</h5>
            `;
            loadingDom.style.visibility = "hidden";
      }
};

showTasks();

//deelte task /api/tasks/:id
tasksDom.addEventListener("click", async (e) => {
      const el = e.target;
      if (el.parentElement.classList.contains("deleteBtn")) {
            loadingDom.style.visibility = "visible";
            const id = el.parentElement.dataset.id;
            try {
                  await axios.delete(`/api/v1/tasks/${id}`);
                  showTasks();
            } catch (error) {
                  console.log(error);
            }
      }
      loadingDom.style.visibility = "hidden";
});

//form

formDom.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = taskInputDom.value;
      try {
            await axios.post(`/api/v1/tasks`, { name });
            showTasks();
            taskInputDom.value = "";
            formAlertDom.style.display = "block";
            formAlertDom.textContent = `success, task added`;
            formAlertDom.classList.add("textSuccess");
      } catch (error) {
            formAlertDom.style.display = "block";
            formAlertDom.innerHTML = `error, please try again`;
      }
      setTimeout(() => {
            formAlertDom.style.display = "none";
            formAlertDom.classList.remove("textSuccess");
      }, 3000);
});
