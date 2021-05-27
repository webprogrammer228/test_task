/* 
Во фронтальном приложении необходимо на странице реализовать таблицу с возможностью
- добавления в нее данных (через модальное окно)
- редактирование данных в таблице в inline режиме, т.е. без модального окна, путем редактирования данных непосредственно в таблице
В таблице должны располагаться объекты со следующими полями: дата, инструмент (ценная бумага), стоимость
Пример данных:
01.01.2019    Газпром    2000
01.01.2019    Автоваз    2500
05.01.2019    Сбербанк    10000
10.01.2019    Газпром    2500
07.10.2019    Автоваз    2100

Т.е. не обязательно по всем датам есть значаения для всех инструментов
На странице должен быть размещен график зависимости стоимости инструментов по датам: по оси абсцисс - даты, по оси ординат - стоимость
График должен автоматически обновлять данные в зависимости от состояния таблицы.
*/

// 1. <---- Открытие и закрытие модального окна ---- > 
const form = document.getElementById('form');
const table = document.getElementById('table');

const popup = document.getElementById('popup');
const popupButton = document.getElementById('button');
const popupIcon = document.getElementById('popup_close');

const date = form.date;
const tool = form.instrument
const price = form.price
const addPosition = form.add_position;

popupButton.addEventListener('click', function(event) {
	event.preventDefault();
	popup.classList.toggle('open');
})

// Закрытие на крестик в модальном окне

popupIcon.addEventListener('click', function(event) {
	event.preventDefault();
	popup.classList.remove('open');
	date.value = '';
	tool.value = '';
	price.value = '';
})

// Закрытие модального окна, при клике вне модального окна

popup.addEventListener('click', function(event) {
	let body = document.getElementById('popup_body');
	if (event.target == body) {
		popup.classList.remove('open');
		date.value = '';
		tool.value = '';
		price.value = '';
	}
})

// 1. <----  ---- > 

// 2.  <---- Добавление новых значений в таблицу ---->

let addDateArr = Array.from(document.querySelectorAll('td.date'));
let addPriceArr = Array.from(document.querySelectorAll('td.prices'));

// перебираем массивы для получения дат и цен из дом элементов
let dateInGraph = addDateArr.map((elem) => elem.textContent);
let priceInGraph = addPriceArr.map((elem) => elem.textContent);

addPosition.addEventListener('click', function(event) {
	event.preventDefault();

	let newtr = document.createElement('tr');
	let newDate = document.createElement('td');
	newDate.textContent = date.value;
	newDate.classList.add('date');
	table.children[0].append(newtr);
	newtr.append(newDate);

	let newTool = document.createElement('td');
	newTool.textContent = tool.value;
	newtr.append(newTool);

	let newPrice = document.createElement('td');
	newPrice.textContent = price.value;
	newPrice.classList.add('prices');
	newtr.append(newPrice);

	refreshItems();
});

// Функция с циклом для обновления данных в таблице и графике
function refreshItems() {
	for (let i = 0; i < addDateArr.length; i++) {
		addDateArr = Array.from(document.querySelectorAll('td.date'));
		addPriceArr = Array.from(document.querySelectorAll('td.prices'));
		dateInGraph = addDateArr.map((elem) => elem.textContent);
		priceInGraph = addPriceArr.map((elem) => elem.textContent);
		updateGraph(dateInGraph, priceInGraph);
	}
}

// 2. <--- ---->

// 3. График... пробуем нарисовать и посчитать

var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
	type: 'bar',
	data: {
		labels: dateInGraph,
		datasets: [{
			label: 'Котировки цен кампаний по датам',
			backgroundColor: 'rgb(255, 99, 132)',
			borderColor: 'rgb(255, 99, 132)',
			data: priceInGraph,
		}]
	},

	options: { responsive: true }

});

// обновляем значения из графика путем удаления старого и добавления нового, с новыми, добавленными значениями.
function updateGraph(labels, data) {
	chart.destroy();
	chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: dateInGraph,
			datasets: [{
				label: 'Котировки цен кампаний по датам',
				backgroundColor: 'rgb(255, 99, 132)',
				borderColor: 'rgb(255, 99, 132)',
				data: priceInGraph,
			}]
		},
	})
	chart.data.labels = labels;
	chart.data.datasets.data = data;
	chart.update();
}

// < ----  3. ----- >

// < --- 4. Изменение ячеек по клику ---- >

table.onclick = function editTables(event) {

	// 3 возможных цели
	let target = event.target.closest('.edit-cancel,.edit-ok,td');

	if (!table.contains(target)) return;

	if (target.className == 'edit-cancel') {
		finishTdEdit(editingTd.elem, false);
	} else if (target.className == 'edit-ok') {
		finishTdEdit(editingTd.elem, true);
	} else if (target.nodeName == 'TD') {
		if (editingTd) return; // уже редактируется

		makeTdEditable(target);
	}
};

let editingTd;

function makeTdEditable(td) {
	editingTd = {
		elem: td,
		data: td.innerHTML
	};

	td.classList.add('edit-td'); // td в состоянии редактирования, CSS применятся к textarea внутри ячейки

	let textArea = document.createElement('textarea');
	textArea.style.width = td.clientWidth + 'px';
	textArea.style.height = td.clientHeight + 'px';
	textArea.className = 'edit-area';

	textArea.value = td.innerHTML;
	td.innerHTML = '';
	td.appendChild(textArea);
	textArea.focus();

	td.insertAdjacentHTML("beforeEnd",
		'<div class="edit-controls"><button class="edit-ok">OK</button><button class="edit-cancel">CANCEL</button></div>'
	);
}

function finishTdEdit(td, isOk) {
	if (isOk) {
		td.innerHTML = td.firstChild.value;
	} else {
		td.innerHTML = editingTd.data;
	}
	td.classList.remove('edit-td');
	editingTd = null;
	refreshItems();
}

//  < ---- 4. ------ >