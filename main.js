// Global variables for document elements
const body = document.querySelector('body');
const dialog = document.querySelector('dialog');
const form = document.querySelector('form');
const formElements = document.querySelectorAll('form input');
const formBtn = document.querySelector('form button');
const formCheckbox = document.querySelector('form input[type="checkbox"]');

/**
 * Class for building Book objects
 */
class Book {
	/**
	 * Constructor for creating new instances of Book
	 * @param {String} title title of the book
	 * @param {String} author author of the book
	 * @param {Number} numPages number of pages the book has
	 * @param {Boolean} hasRead if the user has read this book
	 */
	constructor(title, author, numPages, hasRead = false) {
		this.title = title;
		this.author = author;
		this.numPages = numPages;
		this.hasRead = hasRead;
	}

	/**
	 * Returns information about the specifics of the book
	 * @returns {String} Book details
	 */
	info() {
		return `${this.title} by ${this.author}, ${this.numPages} pages, ${
			hasRead ? 'not read yet' : 'has read'
		}`;
	}

	/**
	 * Changes the read status from the selected book to true or false
	 * @param {Number} bookId Id of the book
	 */
	changeRead(bookId, library) {
		switch (library[bookId].hasRead) {
			case true:
				library[bookId].hasRead = false;
				break;
			case false:
				library[bookId].hasRead = true;
				break;
			default:
				break;
		}
	}
}

/**
 * Class to build library objects that holds books
 */
class Library {
	constructor() {
		this.library = [];
	}
	/**
	 * Adds a book to the library array
	 * @param {Object} book a book to be added to the library
	 */
	addBookToLibrary(book) {
		this.library.push(book);
	}

	/**
	 * Removes the book from the library and refreshes the library with
	 * the new view
	 * @param {Number} bookId Id of the book
	 */
	removeFromLibrary(bookId) {
		const newLibrary = this.library.filter((book) => {
			return this.library.indexOf(book) !== +bookId;
		});
		this.library = newLibrary;
		this.refreshLibrary();
	}

	refreshLibrary() {
		// Remove old library items
		container.textContent = '';

		// Loop through the library
		this.library.forEach((book) => {
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
			div.dataset.bookId = this.library.indexOf(book);
			rmBookBtn.dataset.bookId = this.library.indexOf(book);
			changeReadStatusBtn.dataset.bookId = this.library.indexOf(book);

			// Populate dom elements
			h2.textContent = book.title;
			p.textContent = `Book written by ${book.author}, ${
				book.numPages
			} pages, ${book.hasRead ? 'has read' : 'not read yet'}.`;
			changeReadStatusBtn.textContent = 'Change Read Status';
			changeReadStatusBtn.classList.add('changeReadStatusBtn'); // TODO
			rmBookBtn.textContent = 'Remove Book from Library';
			rmBookBtn.classList.add('removeBookBtn');

			// Event listener for changing read status of books from the library
			changeReadStatusBtn.addEventListener('click', () => {
				book.changeRead(changeReadStatusBtn.dataset.bookId, this.library);
				this.refreshLibrary();
			});

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
				this.removeFromLibrary(button.dataset.bookId);
			});
		});
	}
}

// Array to hold an object of books
const library = new Library();

// Format dialog style
dialog.style.cssText = `
    width: 562px;
    margin: 1em auto;
`;

// Format form elements in the modal

formElements.forEach((el) => {
	el.style.cssText = `
		margin-block-start: 1em;
		width: 100%;
		display: block;
	`;
});

formCheckbox.style.cssText = `
	width: fit-content;
`;

formBtn.style.cssText = `
	display: block;
	margin-block-start: 1em;
`;

// Add new book to library, refresh the library, clear the inputs,
// and close the dialog on submit
form.addEventListener('submit', (e) => {
	e.preventDefault();

	let title = document.querySelector('#title');
	let author = document.querySelector('#author');
	let numPages = document.querySelector('#numPages');
	let hasRead = document.querySelector('#hasRead');
	let titleError = document.querySelector('.title-error');
	let authorError = document.querySelector('.author-error');
	let pagesError = document.querySelector('.pages-error');

	// Validate author
	if (author.validity.valueMissing) {
		authorError.textContent = "Please enter an Author's name.";
		authorError.style.cssText = `
			display: block
		`;
	} else {
		authorError.style.cssText = `
			display: none;
		`;
	}
	// Validate book
	if (title.validity.valueMissing) {
		titleError.textContent = "Please enter the book's name.";
		titleError.style.cssText = `
			display: block
		`;
	} else {
		titleError.style.cssText = `
			display: none;
		`;
	}

	// Validate pages
	if (numPages.validity.valueMissing) {
		pagesError.textContent = 'Please enter the number of pages.';
		pagesError.style.cssText = `
			display: block
		`;
	} else if (numPages.validity.rangeUnderflow) {
		pagesError.textContent = 'Please enter a number of pages above 0.';
		pagesError.style.cssText = `
			display: block
		`;
	} else {
		pagesError.style.cssText = `
			display: none;
		`;
	}

	// Validation is good to go
	if (
		!author.validity.valid ||
		!title.validity.valid ||
		!numPages.validity.valid
	) {
		return;
	} else {
		authorError.textContent = '';
		titleError.textContent = '';
		pagesError.textContent = '';
		let newBook = new Book(
			title.value,
			author.value,
			numPages.value,
			hasRead.checked
		);
		library.addBookToLibrary(newBook);
		library.refreshLibrary();
		title.value = '';
		author.value = '';
		numPages.value = '';
		hasRead.checked = false;
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

// Temp data
const book = new Book('The Hobbit', 'J.R.R. Tolkien', 295, false);
const book1 = new Book("A Dog's Life", 'Ann M. Martin', 192, true);
const book2 = new Book('It', 'Steven King', 1138, false);
library.addBookToLibrary(book);
library.addBookToLibrary(book1);
library.addBookToLibrary(book2);
library.refreshLibrary();
