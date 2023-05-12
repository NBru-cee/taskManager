const select = (selector) => {
      return document.querySelector(selector);
};
const taskIdDom = select(".taskEditId");
const taskNameDom = select(".taskEditName");
const taskCompletedDom = select(".taskEditCompleted");
const editFormDom = select(".singleTaskForm");
const editBtnDom = select(".taskEditBtn");
const formAlertDom = select(".taskAlert");
const params = window.location.search;
const id = new URLSearchParams(params).get("id");
let tempName;

const showTask = async () => {
      try {
            const {
                  data: { task },
            } = await axios.get(`/api/v1/tasks/${id}`);
            const { _id: taskID, completed, name } = task;
            taskIdDom.textContent = taskID;
            taskNameDom.value = name;
            tempName = name;
            if (completed) {
                  taskCompletedDom.checked = true;
            }
      } catch (error) {
            console.log(error);
      }
};

showTask();
editFormDom.addEventListener("submit", async (e) => {
      editBtnDom.textContent = "Loading...";
      e.preventDefault();
      try {
            const taskName = taskNameDom.value;
            const taskCompleted = taskCompletedDom.checked;
            const {
                  data: { task },
            } = await axios.patch(`/api/v1/tasks/${id}`, {
                  name: taskName,
                  completed: taskCompleted,
            });
            const { _id: taskID, completed, name } = task;
            taskIdDom.textContent = taskID;
            taskNameDom.value = name;
            if (completed) {
                  taskCompletedDom.checked = true;
            }
            formAlertDom.style.display = "block";
            formAlertDom.textContent = `success, edited task`;
            formAlertDom.classList.add("textSuccess");
      } catch (error) {
            console.log(error);
            taskNameDom.value = tempName;
            formAlertDom.style.display = "block";
            formAlertDom.innerHTML = "error, please try again";
      }
      editBtnDom.textContent = "Edit";
      setTimeout(() => {
            formAlertDom.style.display = "none";
            formAlertDom.classList.add("textSuccess");
      }, 3000);
});
