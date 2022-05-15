// Utility Funs

const $ = (selector) => document.querySelector(selector);

const getIdsTodo = (idx) => {
	const id = 'todo-main-' + idx + '-';

	const EditBtnId = id + 'edit';

	const DeleteBtnId = id + 'delete';

	const CheckBoxId = id + 'checkbox';

	return {
		MainId: id,
		EditBtnId,
		DeleteBtnId,
		CheckBoxId,
	};
};

const setLocalStorageItem = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorageItem = (key) => {
	return JSON.parse(localStorage.getItem(key));
};

export { $, getIdsTodo, getLocalStorageItem, setLocalStorageItem };
