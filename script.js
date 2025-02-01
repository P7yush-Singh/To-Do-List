document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed');
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTask(index));

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;

            const editButton = document.createElement('button');
            editButton.textContent = '✎';
            editButton.className = 'edit-btn';
            editButton.addEventListener('click', () => editTask(index));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✖';
            deleteButton.className = 'delete-btn';
            deleteButton.addEventListener('click', () => deleteTask(index));

            li.appendChild(checkbox);
            li.appendChild(taskText);
            li.appendChild(editButton);
            li.appendChild(deleteButton);

            taskList.appendChild(li);
        });
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = '';
            saveTasks();
            renderTasks();
        }
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function editTask(index) {
        const li = taskList.children[index];
        const taskText = li.querySelector('.task-text');
        const text = taskText.textContent;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = text;

        const saveButton = document.createElement('button');
        saveButton.textContent = '✓';
        saveButton.className = 'edit-btn';

        li.innerHTML = '';
        li.appendChild(input);
        li.appendChild(saveButton);

        input.focus();

        saveButton.addEventListener('click', saveEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') saveEdit();
        });

        function saveEdit() {
            const newText = input.value.trim();
            if (newText) {
                tasks[index].text = newText;
                saveTasks();
                renderTasks();
            }
        }
    }

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    renderTasks();
});