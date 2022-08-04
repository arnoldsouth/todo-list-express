// Create a constant variable `deleteBtn`, assigning to it a NodeList with HTML Elements having the class of `fa-trash`
const deleteBtn = document.querySelectorAll(".fa-trash");

// Create a constant variable `item`, assigning to it a NodeList with HTML Elements having the class of `item` and <span> as children
const item = document.querySelectorAll(".item span");

// Create a constant variable `item`, assigning to it a NodeList with HTML Elements having the class of `item` and <span> as children with a class of `completed`
const itemCompleted = document.querySelectorAll(".item span.completed");

// Convert the variable `deleteBtn` to an array of HTML Elements and call `forEach` on it
Array.from(deleteBtn).forEach((element) => {
  // Add `click` event listener to each `element` and calls the function `deleteItem`
  element.addEventListener("click", deleteItem);
});

// Convert the variable `item` to an array of HTML Elements and call `forEach` on it
Array.from(item).forEach((element) => {
  // Add `click` event listener to each `element` and calls the function `markComplete`
  element.addEventListener("click", markComplete);
});

// Convert the variable `itemCompleted` to an array of HTML Elements and call `forEach` on it
Array.from(itemCompleted).forEach((element) => {
  // Add `click` event listener to each `element` and calls the function `markUnComplete`
  element.addEventListener("click", markUnComplete);
});

async function deleteItem() {
  // Create a constant variable `itemText`; this variable is assigned the text content when read by the `innerText` property; specifically, this text content points to the parentNode (the <li>), then the childNode (the <span>) at index [1], and then its property at `.innerText`
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Create a constant variable `response` that makes a fetch to the relative path `deleteItem`
    const response = await fetch("deleteItem", {
      // Sets property of request's method to `delete`
      method: "delete",
      // Sets property of request's headers at `{"Content-Type" to "application/json"}, which means we're sending JSON data to the application to parse it correctly
      headers: { "Content-Type": "application/json" },
      // Sets property of request's body by sending the `itemText` value as a JSON string for the current object's property `itemFromJS`
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });

    // Create a constant variable `data`, assigning this parsed JSON to the `response` body
    const data = await response.json();
    // Logs `data` to console within the browser
    console.log(data);
    // Reloads the current page
    location.reload();
  } catch (err) {
    // Logs `err` (errors) to console within the browser
    console.log(err);
  }
}

async function markComplete() {
  // Create a constant variable `itemText`; this variable is assigned the text content when read by the `innerText` property; specifically, this text content points to the parentNode (the <li>), then the childNode (the <span>) at index [1], and then its property at `.innerText`
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Create a constant variable `response` that makes a fetch to the relative path `markComplete`
    const response = await fetch("markComplete", {
      // Sets property of request's method to `put`
      method: "put",
      // Sets property of request's headers at `{"Content-Type" to "application/json"}, which means we're sending JSON data to the application to parse it correctly
      headers: { "Content-Type": "application/json" },
      // Sets property of request's body by sending the `itemText` value as a JSON string for the current object's property `itemFromJS`
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });

    // Create a constant variable `data`, assigning this parsed JSON to the `response` body
    const data = await response.json();
    // Logs `data` to console within the browser
    console.log(data);
    // Reloads the current page
    location.reload();
  } catch (err) {
    // Logs `err` (errors) to console within the browser
    console.log(err);
  }
}

async function markUnComplete() {
  const itemText = this.parentNode.childNodes[1].innerText;
  try {
    // Create a constant variable `response` that makes a fetch to the relative path `markUnComplete`
    const response = await fetch("markUnComplete", {
      // Sets property of request's method to `put`
      method: "put",
      // Sets property of request's headers at `{"Content-Type" to "application/json"}, which means we're sending JSON data to the application to parse it correctly
      headers: { "Content-Type": "application/json" },
      // Sets property of request's body by sending the `itemText` value as a JSON string for the current object's property `itemFromJS`
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });

    // Create a constant variable `data`, assigning this parsed JSON to the `response` body
    const data = await response.json();
    // Logs `data` to console within the browser
    console.log(data);
    // Reloads the current page
    location.reload();
  } catch (err) {
    // Logs `err` (errors) to console within the browser
    console.log(err);
  }
}
