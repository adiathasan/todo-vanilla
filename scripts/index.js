import { response } from './data.js';

import { $btnSubmit, $form, $input, $todoList } from './selectors.js';
import { $, getIdsTodo, getLocalStorageItem, setLocalStorageItem } from './utils.js';

const TODO_KEY = 'todo:core';

// global variable

let editableId = null;

// todoList
let todos = response.data;

const localTodo = getLocalStorageItem(TODO_KEY);

if (localTodo) {
	todos = localTodo;
} else {
	setLocalStorageItem(TODO_KEY, todos);
}

// Render todos Fn
const renderTodoList = ({ saveToStorage = true } = {}) => {
	let todoList = '';

	if (saveToStorage) {
		setLocalStorageItem(TODO_KEY, todos);
	}

	todos.forEach((todo, index) => {
		const { MainId, EditBtnId, DeleteBtnId, CheckBoxId } = getIdsTodo(todo.id);

		todoList += `
                        <li id="${MainId}" class="${
			(todo.completed ? 'bg-green-200' : 'bg-green-300') + ' w-full shadow flex space-x-1 items-center p-2 rounded'
		}">
                                <input id="${CheckBoxId}" type="checkbox" ${
			todo.completed ? 'checked' : ''
		} class="w-5 h-5  text-blue-600 cursor-pointer bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-4">
                            <h5 class="${(todo.completed ? 'line-through text-slate-500' : '') + ' flex-1'}">${
			index + 1
		}. ${todo.title}</h5>
                            <div class="flex ml-auto space-x-4">
                                <button
                                id="${EditBtnId}"
                                    type="button"
                                    class="md:py-2 px-2 md:px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    Edit
                                </button>
                                <button
                                id="${DeleteBtnId}"
                                    type="button"
                                    class="focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 md:px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    `;
	});

	$todoList.innerHTML = todoList;

	// Logic For CRUD
	todos.forEach((todo) => {
		const { EditBtnId, DeleteBtnId, CheckBoxId, MainId } = getIdsTodo(todo.id);

		const $Main = $('#' + MainId);
		const $deleteBtn = $('#' + DeleteBtnId);
		const $EditBtn = $('#' + EditBtnId);
		const $CheckBox = $('#' + CheckBoxId);

		const deleteTodo = (e) => {
			const findIndex = todos.findIndex((todox) => todo.id === todox.id);

			if (findIndex !== -1) {
				todos.splice(findIndex, 1);

				if (editableId) {
					$form.reset();
					$btnSubmit.innerHTML = 'ADD+';
					editableId = null;
				}

				renderTodoList();
			}
		};

		const editTodo = (e) => {
			if (editableId) {
				const findEdit = todos.find((todox) => todox.id === editableId);

				if (findEdit) {
					const { MainId, DeleteBtnId } = getIdsTodo(findEdit.id);

					const $findEdit = $('#' + MainId);
					const $findDelete = $('#' + DeleteBtnId);

					$findEdit.classList.remove('animate-pulse');
					$findEdit.classList.remove('ring');
					$findEdit.classList.remove('ring-blue-900');
					$findDelete.disabled = false;
				}
			}

			editableId = todo.id;

			$Main.classList.add('animate-pulse');
			$Main.classList.add('ring');
			$Main.classList.add('ring-blue-900');
			$deleteBtn.disabled = true;

			$input.value = todo.title;

			$input.focus();

			$btnSubmit.innerHTML = 'UPDATE';
		};

		const checkTodo = (e) => {
			const findIndex = todos.findIndex((todox) => todo.id === todox.id);

			if (findIndex !== -1) {
				todos[findIndex].completed = e.target.checked;
			}

			renderTodoList();
		};

		$EditBtn.removeEventListener('click', editTodo);
		$EditBtn.addEventListener('click', editTodo);

		$deleteBtn.removeEventListener('click', deleteTodo);
		$deleteBtn.addEventListener('click', deleteTodo);

		$CheckBox.removeEventListener('change', checkTodo);
		$CheckBox.addEventListener('change', checkTodo);
	});
};

// Init render
renderTodoList({ saveToStorage: false });

// create a todo

// submit form

$form.addEventListener('submit', (e) => {
	e.preventDefault();

	if (editableId) {
		const todoEditIdx = todos.findIndex((todo) => todo.id === editableId);

		if (todoEditIdx !== -1) {
			todos[todoEditIdx].title = $input.value;
		}

		$btnSubmit.innerHTML = 'ADD+';
	} else {
		const todo = {
			id: todos.length + 1,
			title: $input.value,
			completed: false,
		};

		todos.unshift(todo);
	}

	renderTodoList();

	e.target.reset();
});
3;
