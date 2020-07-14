//************************* StorageController *****************************/
// Storage controller
const StorageController = (function () {
	//* Public methods
	return {
		storeItem: function (item) {
			let items;

			// Check for the existing data
			if (localStorage.getItem("items") === null) {
				items = [];

				//Push new item to the array which
				items.push(item);

				// Add this local variable to local storage
				localStorage.setItem("items", JSON.stringify(items));
			} else {
				//If we have existing data then we will retrieve the data from local storage
				items = JSON.parse(localStorage.getItem("items"));

				//Push new item that we got from the local storage to our local variable
				items.push(item);

				// Finally add the updated array in local storage
				localStorage.setItem("items", JSON.stringify(items));
			}
		},

		// Get items from local storage and returning them as an array
		getItemsFromStorage: function () {
			let items;
			if (localStorage.getItem("items") === null) {
				items = [];
			} else {
				items = JSON.parse(localStorage.getItem("items"));
			}
			return items;
		},
		updateItemStorage: function (updatedItem) {
			let items = JSON.parse(localStorage.getItem("items"));

			// Iterate over the local storage and update the item
			items.map((item, index) => {
				if (updatedItem.id === item.id) {
					items.splice(index, 1, updatedItem);
				}
			});

			// Reset the local storage after updating the item
			localStorage.setItem("items", JSON.stringify(items));
		},
		deleteItemFromStorage: function (id) {
			let items = JSON.parse(localStorage.getItem("items"));

			// Iterate over the local storage and delete the item
			items.map((item, index) => {
				if (id === item.id) {
					items.splice(index, 1);
				}
			});

			// Reset the local storage after deleting the item
			localStorage.setItem("items", JSON.stringify(items));
		},
		clearItemFromStorage: function () {
			localStorage.removeItem("items");
		},
	};
})();

//************************* ItemController ******************************/
// Item controller
const ItemController = (() => {
	//* Creating an item constructor so that we can create an item and then add it to the data structure
	const Item = function (id, name, calories) {
		this.id = id;
		this.name = name;
		this.calories = calories;
	};

	//* Data structure/ state
	// This data will be private we cannot access it directly, for using the data we have to return it
	const data = {
		// Here all the meals info will be stored this is hard coded data
		// items: [
		// 	{ id: 0, name: "Chicken Biriyani", calories: 1300 },
		// 	{ id: 1, name: "Triple bypass burger", calories: 1500 },
		// 	{ id: 2, name: "Oreo smoothie", calories: 500 },
		// ],

		//* Data from local storage
		items: StorageController.getItemsFromStorage(),

		//Current item refers to the item when we are editing it
		currentItem: null,
		totalCalories: 0,
	};

	// Accessing the data via getData method now the private data can be accessed via public method, whatever we are returning will be public
	//* Public method
	return {
		getData: function () {
			return data;
		},

		// This will return an array of items
		getItems: function () {
			return data.items;
		},

		// Add new item to our data structure
		addItem: function (name, calories) {
			let ID;
			// Create ID
			if (data.items.length > 0) {
				ID = data.items[data.items.length - 1].id + 1;
			} else {
				ID = 0;
			}
			// console.log(name, calories);

			// Calories to number
			calories = parseInt(calories);

			// Create new Item
			newItem = new Item(ID, name, calories);

			//Add the new item to our array
			data.items.push(newItem);

			return newItem;
		},
		getItemByID: function (id) {
			let found = null;
			data.items.map((item) => {
				if (item.id === id) {
					found = item;
				}
			});
			return found;
		},
		// * This method will update the item info in the data structure
		updateItem: function (name, calories) {
			//Convert Calories to number
			calories = parseInt(calories);

			let found = null;
			data.items.map((item) => {
				// * We will compare the current item ID with the existing data structure
				if (item.id === data.currentItem.id) {
					item.name = name;
					item.calories = calories;
					found = item;
				}
			});
			return found;
		},
		deleteItem: function (id) {
			// Get ID's from data structure
			const ids = data.items.map(function (item) {
				return item.id;
			});

			//Get index of the id that we want to delete
			const index = ids.indexOf(id);

			// Remove that item from the array
			data.items.splice(index, 1);
		},

		//* Clear all info from data structure
		clearAllItems: function () {
			data.items = [];
		},

		//* this will set the current item to the item we want ot edit=
		setCurrentItem: function (item) {
			data.currentItem = item;
		},

		//* This method will return the current which is selected, from data structure
		getCurrentItem: function () {
			return data.currentItem;
		},

		//* This method will return the total calories
		getTotalCalories: function () {
			let totalCal = 0;
			data.items.map((i) => (totalCal += i.calories));

			//* Setting totalCalories in data structure
			data.totalCalories = totalCal;

			return data.totalCalories;
			// let op = data.items.reduce((sum, i) => sum + i.calories);
			// return op;
		},
	};
})();

//************************* UIController ******************************/
// UI controller
const UIController = (() => {
	//* UI Selectors

	//* 1. We will use this instead of using the html element's id or class again and again
	//* 2. Also if we change the id or class name in html we can just update this variable we don't have to update whole JS file

	const UISelectors = {
		itemList: "#item-list",
		totalCalories: ".total-calories",
		listItems: "#item-list li",
		addBtn: ".add-btn",
		updateBtn: ".update-btn",
		deleteBtn: ".delete-btn",
		clearBtn: ".clear-btn",
		backBtn: ".back-btn",
		itemNameInput: "#item-name",
		itemCaloriesInput: "#item-calorie",
	};

	//* Public method
	return {
		showData: function (data) {
			console.log("Go the data from the 📴 AppController  ");
			console.log("Adding data to the DOM 🐶");

			// Create the HTML for which contains all the food items
			let op = "";
			data.map((item) => {
				op += `
                <li class='collection-item' style='font-size:18px' id='item-${item.id}' >
                    <strong>${item.name}</strong> <em>${item.calories} Calories</em>
                    <a href="" class="secondary-content">
						<i class="edit-item fa fa-pencil"></i>
					</a>
                </li>
                `;
			});

			// Insert list items to the UI
			document.querySelector(UISelectors.itemList).innerHTML = op;
		},

		//* This method will get the input value from the inputs in HTML
		getInput: function () {
			return {
				name: document.querySelector(UISelectors.itemNameInput).value,
				calories: document.querySelector(UISelectors.itemCaloriesInput)
					.value,
			};
		},

		addListItem: function (item) {
			//Unhide the list once we add the item
			document.querySelector(UISelectors.itemList).style.display =
				"block";

			//* Add the list item to DOM
			//* first we will create the li element
			// class='collection-item' style='font-size:18px' id='item-${item.id}'
			const liItem = document.createElement("li");
			liItem.className = "collection-item";
			liItem.style = "font-size:18px";
			liItem.id = `item-${item.id}`;

			//* Add HTML
			liItem.innerHTML = `
            <strong>${item.name}</strong> <em>${item.calories}</em>
                    <a href="" class="secondary-content">
						<i class="edit-item fa fa-pencil"></i>
                    </a>`;

			//* Insert the element into ul
			document
				.querySelector(UISelectors.itemList)
				.insertAdjacentElement("beforeend", liItem);
		},

		//* Add the new item to the UIm that we got from the data structure
		updateLisItem: function (item) {
			// This will give us a nodelist
			let listItems = document.querySelectorAll(UISelectors.listItems);
			// console.log("Updated list item ", item);

			// We can not iterate over nodelist, so we have to convert node list to an array
			listItems = Array.from(listItems);

			// No we will iterate over the array of li
			listItems.map((liItem) => {
				// get the item id from the list
				const itemID = liItem.getAttribute("id");

				if (itemID === `item-${item.id}`) {
					document.querySelector(`#${itemID}`).innerHTML = `
					<strong>${item.name}</strong> <em>${item.calories}</em>
                    <a href="" class="secondary-content">
						<i class="edit-item fa fa-pencil"></i>
                    </a>
					`;
				}
			});
		},

		//* Delete item from the UI
		deleteListItem: function (id) {
			const itemID = `#item-${id}`;
			const item = document.querySelector(itemID);
			item.remove();
			// // Get total calories
			// const totalCalories = ItemController.getTotalCalories();

			// // Add total calories in the UI
			// UIController.showTotalCalories(totalCalories);

			// //* Remove the item from the input once it has added to the DOM
			// UIController.clearInputs();
		},

		clearInputs: function () {
			document.querySelector(UISelectors.itemNameInput).value = "";
			document.querySelector(UISelectors.itemCaloriesInput).value = "";
		},

		//* Once the user has clicked the edit button then we will add the info to the input fields
		addItemToForm: function () {
			document.querySelector(
				UISelectors.itemNameInput
			).value = ItemController.getCurrentItem().name;
			document.querySelector(
				UISelectors.itemCaloriesInput
			).value = ItemController.getCurrentItem().calories;
			UIController.showEditState();
		},

		removeItems: function () {
			let listItems = document.querySelectorAll(UISelectors.listItems);

			// We can not iterate over nodelist, so we have to convert node list to an array
			listItems = Array.from(listItems);

			listItems.map((item) => item.remove());
		},

		hideList: function () {
			document.querySelector(UISelectors.itemList).style.display = "none";
		},

		//* Show total calories count that we got from the ItemController
		showTotalCalories: function (total) {
			document.querySelector(
				UISelectors.totalCalories
			).textContent = total;
		},

		clearEditState: function () {
			UIController.clearInputs();
			document.querySelector(UISelectors.updateBtn).style.display =
				"none";
			document.querySelector(UISelectors.deleteBtn).style.display =
				"none";
			document.querySelector(UISelectors.backBtn).style.display = "none";
			document.querySelector(UISelectors.addBtn).style.display = "inline";
		},

		showEditState: function () {
			document.querySelector(UISelectors.updateBtn).style.display =
				"inline";
			document.querySelector(UISelectors.deleteBtn).style.display =
				"inline";
			document.querySelector(UISelectors.backBtn).style.display =
				"inline";
			document.querySelector(UISelectors.addBtn).style.display = "none";
		},

		//* Making the UISelectors Public
		getUISelectors: function () {
			return UISelectors;
		},
	};
})();

//***************************** AppController ************************//

// App controller
const App = ((ItemController, StorageController, UIController) => {
	//* Function for loading all the initial events in the application

	//************************* LoadEventListeners  ********************/
	const loadEventListeners = function () {
		// Using UISelectors from the UIController to get all the classes and IDs from the HTML

		const UISelector = UIController.getUISelectors();

		// Add item event
		document
			.querySelector(UISelector.addBtn)
			.addEventListener("click", itemAddSubmit);

		//* Disable submit on enter
		//* Disable adding item again after pressing enter
		document.addEventListener("keypress", function (e) {
			if (e.keyCode == 13 || e.which == 13) {
				e.preventDefault();
				return false;
			}
		});

		//* Edit icon click event
		document
			.querySelector(UISelector.itemList)
			.addEventListener("click", itemEditClick);

		//* Update item when we edit it
		document
			.querySelector(UISelector.updateBtn)
			.addEventListener("click", itemUpdateSubmit);

		//* Delete item when we edit it
		document
			.querySelector(UISelector.deleteBtn)
			.addEventListener("click", itemDeleteSubmit);

		//* Back button
		document
			.querySelector(UISelector.backBtn)
			.addEventListener("click", UIController.clearEditState);

		//* Clear all button
		document
			.querySelector(UISelector.clearBtn)
			.addEventListener("click", clearAllItemsClicked);
	};

	// Add item submit
	const itemAddSubmit = function (e) {
		// get input from UI Controller this will be an object with name and calories
		const input = UIController.getInput();
		//console.log(input);

		// Check if the name and calories are entered and only proceed if the values are entered
		if (input.name !== "" && input.calories !== "") {
			// Add items once this condition satisfies
			// This method will add the item to the data structure
			const newItem = ItemController.addItem(input.name, input.calories);
			//ItemController.addItem()

			//* Add new item to the UI
			// this method will add the item to the DOM
			UIController.addListItem(newItem);

			//console.log(input);

			// Get total calories
			const totalCalories = ItemController.getTotalCalories();

			// Add total calories in the UI
			UIController.showTotalCalories(totalCalories);

			//* Store in local storage
			StorageController.storeItem(newItem);

			//* Remove the item from the input once it has added to the DOM
			UIController.clearInputs();
		}
		e.preventDefault();
	};

	const itemEditClick = function (e) {
		//* Targeting the edit button
		if (e.target.classList.contains("edit-item")) {
			//* We have to use "event delegation" here because the edi button was not always there from the start we are dynamically adding the edit button.

			//* Get list-item id
			const listID = e.target.parentNode.parentNode.id; // item-0

			//We want the id just the number so will take the listID and split it
			//* Get actual ID
			const id = parseInt(listID.split("-")[1]);

			// Get item
			const itemToEdit = ItemController.getItemByID(id);

			//console.log(itemToEdit);

			// Set the itemToEdit to current item
			ItemController.setCurrentItem(itemToEdit);

			//* Add the item's value to the form UI
			//* The item that we want to use will be already set to current item
			UIController.addItemToForm();
		}
		e.preventDefault();
	};

	//* Update Item
	//* This function will update the item info name and calorie
	const itemUpdateSubmit = function (e) {
		// Get Item input from the data structure
		const input = UIController.getInput();

		// Update item
		const updatedItem = ItemController.updateItem(
			input.name,
			input.calories
		);

		//* Update new item in the UI
		UIController.updateLisItem(updatedItem);

		//* Update the total Calories
		// Get total calories
		const totalCalories = ItemController.getTotalCalories();

		// Add total calories in the UI
		UIController.showTotalCalories(totalCalories);

		// Update local storage items to latest items
		StorageController.updateItemStorage(updatedItem);

		UIController.clearEditState();

		//console.log("Update button clicked");
		e.preventDefault();
	};

	//* delete Items
	const itemDeleteSubmit = function (e) {
		//Get current item's ID
		const currentItemID = ItemController.getCurrentItem();

		// Delete from data structure
		ItemController.deleteItem(currentItemID.id);

		// Delete from the UI
		UIController.deleteListItem(currentItemID.id);

		// Get total calories
		const totalCalories = ItemController.getTotalCalories();

		// Add total calories in the UI
		UIController.showTotalCalories(totalCalories);

		// Update local storage items to latest items
		StorageController.deleteItemFromStorage(currentItemID.id);

		UIController.clearEditState();

		e.preventDefault();
	};

	//* clear all items
	const clearAllItemsClicked = function (e) {
		// Delete all items from the DS
		ItemController.clearAllItems();

		// Get total calories
		const totalCalories = ItemController.getTotalCalories();

		// Add total calories in the UI
		UIController.showTotalCalories(totalCalories);

		//Remove every thing from UI
		UIController.removeItems();

		// Remove all from local storage
		StorageController.clearItemFromStorage();

		// Remove from UI
		UIController.hideList();

		e.preventDefault();
	};

	//***************************** Initializer ************************//

	//* We want the app controller to return just one method an that must be initializer method that will run right away when the application loads

	//* Public method
	return {
		//* 1. Init is going to call from the item controller, method call getItems which is going to get Items from the data in the ItemController

		//* 2. And we will use the UIController to populate the DOM with the data

		initializer: function () {
			console.log("Initializing the app 🚀");
			console.log("Getting data 💻 ⬇️ from ItemsController");

			//* Clear edit state or set initial state
			UIController.clearEditState();

			//* Getting the list of item from the ItemController
			const items = ItemController.getItems();

			//* Hide the line if there is no items in the list na if there are items then populate the dom
			if (items.length === 0) {
				UIController.hideList();
			} else {
				//* Populate the DOM with the data that we got from ItemController
				UIController.showData(items);
			}

			// Get total calories
			const totalCalories = ItemController.getTotalCalories();

			// Add total calories in the UI
			UIController.showTotalCalories(totalCalories);

			//* Load Event listeners
			loadEventListeners();
		},
	};
})(ItemController, StorageController, UIController);

console.log();

//* Application will only be started once we initialize the app
App.initializer();
