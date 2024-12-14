document.addEventListener("DOMContentLoaded", function () {
    let todoItemsContainer = document.getElementById("todoItemsContainer");
    let addTodoButton = document.getElementById("addTodoButton");
    let saveTodoButton = document.getElementById("saveTodoButton");
    let completedTasksElement = document.getElementById("completedTasks");
    let totalTasksElement = document.getElementById("totalTasks");

    function getTodoListFromLocalStorage() {
        let stringifiedTodoList = localStorage.getItem("todoList");
        let parsedTodoList = JSON.parse(stringifiedTodoList);
        return parsedTodoList === null ? [] : parsedTodoList;
    }

    let todoList = getTodoListFromLocalStorage();

   
    let todosCount = todoList.length > 0
        ? Math.max(...todoList.map(todo => todo.uniqueNo))
        : 0;

    saveTodoButton.onclick = function () {
        localStorage.setItem("todoList", JSON.stringify(todoList));
    };

    function updateTaskCounts() {
        let completedCount = todoList.filter(todo => todo.isChecked).length;
        let totalCount = todoList.length;

        completedTasksElement.textContent = `Completed: ${completedCount}`;
        totalTasksElement.textContent = `Total Tasks: ${totalCount}`;
    }

    function onAddTodo() {
        let userInputElement = document.getElementById("todoUserInput");
        let userInputValue = userInputElement.value;

        if (userInputValue === "") {
            alert("Enter Valid Text");
            return;
        }

        todosCount += 1;

        let newTodo = {
            text: userInputValue,
            uniqueNo: todosCount,
            isChecked: false,
        };
        todoList.push(newTodo);
        createAndAppendTodo(newTodo);
        userInputElement.value = "";
        updateTaskCounts();
    }

    addTodoButton.onclick = function () {
        onAddTodo();
    };

    function onTodoStatusChange(checkboxId, labelId, todoId) {
        let checkboxElement = document.getElementById(checkboxId);
        let labelElement = document.getElementById(labelId);
        labelElement.classList.toggle("checked");

        let todoObjectIndex = todoList.findIndex(function (eachTodo) {
            return "todo" + eachTodo.uniqueNo === todoId;
        });

        let todoObject = todoList[todoObjectIndex];

        todoObject.isChecked = checkboxElement.checked;

        updateTaskCounts();
    }

    function onDeleteTodo(todoId) {
        let todoElement = document.getElementById(todoId);
        todoItemsContainer.removeChild(todoElement);

        let deleteElementIndex = todoList.findIndex(function (eachTodo) {
            return "todo" + eachTodo.uniqueNo === todoId;
        });

        todoList.splice(deleteElementIndex, 1);

        updateTaskCounts();
    }

    function createAndAppendTodo(todo) {
        let todoId = "todo" + todo.uniqueNo;
        let checkboxId = "checkbox" + todo.uniqueNo;
        let labelId = "label" + todo.uniqueNo;

        let todoElement = document.createElement("li");
        todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
        todoElement.id = todoId;
        todoItemsContainer.appendChild(todoElement);

        let inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.id = checkboxId;
        inputElement.checked = todo.isChecked;

        inputElement.onclick = function () {
            onTodoStatusChange(checkboxId, labelId, todoId);
        };

        inputElement.classList.add("checkbox-input");
        todoElement.appendChild(inputElement);

        let labelContainer = document.createElement("div");
        labelContainer.classList.add("label-container", "d-flex", "flex-row");
        todoElement.appendChild(labelContainer);

        let labelElement = document.createElement("label");
        labelElement.setAttribute("for", checkboxId);
        labelElement.id = labelId;
        labelElement.classList.add("checkbox-label");
        labelElement.textContent = todo.text;
        if (todo.isChecked === true) {
            labelElement.classList.add("checked");
        }
        labelContainer.appendChild(labelElement);

        let deleteIconContainer = document.createElement("div");
        deleteIconContainer.classList.add("delete-icon-container");
        labelContainer.appendChild(deleteIconContainer);

        let deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");

        deleteIcon.onclick = function () {
            onDeleteTodo(todoId);
        };

        deleteIconContainer.appendChild(deleteIcon);
    }

    for (let todo of todoList) {
        createAndAppendTodo(todo);
    }

    updateTaskCounts();
});
