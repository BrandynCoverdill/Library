const body = document.querySelector('body');
const dialog = document.querySelector('dialog');
const form = document.querySelector('form');
let library = [];

// Format dialog style
dialog.style.cssText = `
    width: 562px;
    margin: 1em auto;
`;

// Format form in the modal
form.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
`;

// Add new book to library, refresh the library, clear the inputs,
// and close the dialog on submit
form.addEventListener('submit', (e) => {
	e.preventDefault();

	let title = document.querySelector('#title').value;
	let author = document.querySelector('#author').value;
	let numPages = document.querySelector('#numPages').value;
	let hasRead = document.querySelector('#hasRead').checked;

	// Validation checks
	if (
		title.trim() === '' ||
		author.trim() === '' ||
		isNaN(numPages) ||
		numPages === ''
	) {
		return;
	} else {
		let newBook = new Book(title, author, numPages, hasRead);
		addBookToLibrary(newBook);
		refreshLibrary();
		document.querySelector('#title').value = '';
		document.querySelector('#author').value = '';
		document.querySelector('#numPages').value = '';
		document.querySelector('#hasRead').checked = false;
		dialog.close();
	}
});

// Add a button to the start of the page to show the modal to add a new book
const newBookBtn = document.createElement('button');
newBookBtn.textContent = 'NEW BOOK';
body.appendChild(newBookBtn);
newBookBtn.addEventListener('click', () => {
	showModal();
});

/**
 * Shows the modal to add a new book
 */
function showModal() {
	dialog.showModal();
}

// Create/style DOM elements for the library to be shown on the page
let container = document.createElement('div');
container.style.cssText = `
    background: white;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    margin: 1em;
    border: 3px solid black;
    padding: 1em;
    justify-content: center;
`;

body.appendChild(container);

function refreshLibrary() {
	// Remove old library items
	container.textContent = '';

	// Loop through the library
	library.forEach((book) => {
		// Create/style dom elements to house the library items
		const div = document.createElement('div');
		const h2 = document.createElement('h2');
		const p = document.createElement('p');
		const changeReadStatusBtn = document.createElement('button');
		const rmBookBtn = document.createElement('button');

		div.style.cssText = `
            border: 3px solid red;
            max-width: 250px;
            padding: .5em;
        `;

		changeReadStatusBtn.style.cssText = `
			margin-block: .5em;
		`;

		// Attach each book and button with a data attribute to keep
		// track of the books and to enable functionality of buttons
		div.dataset.bookId = library.indexOf(book);
		rmBookBtn.dataset.bookId = library.indexOf(book);
		changeReadStatusBtn.dataset.bookId = library.indexOf(book);

		// Populate dom elements
		h2.textContent = book.title;
		p.textContent = `Book written by ${book.author}, ${book.numPages} pages, ${
			book.hasRead ? 'has read' : 'not read yet'
		}.`;
		changeReadStatusBtn.textContent = 'Change Read Status';
		changeReadStatusBtn.classList.add('changeReadStatusBtn');
		rmBookBtn.textContent = 'Remove Book from Library';
		rmBookBtn.classList.add('removeBookBtn');

		// Append the dom elements
		container.appendChild(div);
		div.appendChild(h2);
		div.appendChild(p);
		div.appendChild(changeReadStatusBtn);
		div.appendChild(rmBookBtn);
	});

	// Event listener for deleting books from the library
	const removeBtns = document.querySelectorAll('.removeBookBtn');

	removeBtns.forEach((button) => {
		button.addEventListener('click', () => {
			removeFromLibrary(button.dataset.bookId);
		});
	});

	// Event listener for changing read status of books from the library
	const changeReadBtns = document.querySelectorAll('.changeReadStatusBtn');

	changeReadBtns.forEach((button) => {
		button.addEventListener('click', () => {
			Book.prototype.changeRead(button.dataset.bookId);
		});
	});
}

/**
 * Constructor to create Book objects
 * @param {String} title title of a book
 * @param {String} author author of a book
 * @param {Number} numPages number of pages the book has
 * @param {Boolean} hasRead if the user has read this book
 */
function Book(title, author, numPages, hasRead = false) {
	this.title = title;
	this.author = author;
	this.numPages = numPages;
	this.hasRead = hasRead;
	this.info = function () {
		return `${this.title} by ${this.author}, ${this.numPages} pages, ${
			hasRead ? 'not read yet' : 'has read'
		}`;
	};
}

/**
 * Changes the read status from the selected book to true or false
 * @param {Number} bookId Id of the book
 */
Book.prototype.changeRead = function (bookId) {
	switch (library[bookId].hasRead) {
		case true:
			library[bookId].hasRead = false;
			refreshLibrary();
			break;

		case false:
			library[bookId].hasRead = true;
			refreshLibrary();
			break;

		default:
			break;
	}
};

/**
 * Adds a book to the library array
 * @param {Object} book a book to be added to the library
 */
function addBookToLibrary(book) {
	library.push(book);
}

/**
 * Removes the book from the library and refreshes the library with the
 * new view
 * @param {Number} bookId Id of the book
 */
function removeFromLibrary(bookId) {
	const newLibrary = library.filter((book) => {
		return library.indexOf(book) !== +bookId;
	});
	library = newLibrary;
	refreshLibrary();
}

// Temp data
const book = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
const book1 = new Book("A Dog's Life", 'Ann M. Martin', 192, true);
const book2 = new Book('It', 'Steven King', 1138, false);
library.push(book);
library.push(book1);
library.push(book2);
refreshLibrary();
