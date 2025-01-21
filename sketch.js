// Code written by dmaon.
// Comments added by DeepSeek-V3 to explain the functionality of the code.

// Define a Stack class to manage a stack data structure
class Stack {
    constructor(data) {
        // Initialize the stack with the provided data (spread into an array)
        this.data = [...data];
    }

    // Method to push an element onto the stack
    push(x) {
        this.data = [...this.data, x];
    }

    // Method to pop an element from the stack
    pop() {
        // Get the last element of the stack
        const x = this.data.slice(-1)[0];
        // Remove the last element from the stack
        this.data = this.data.slice(0, -1);
        return x; // Return the popped element
    }

    // Method to peek at the top element of the stack without removing it
    peek() {
        const x = this.data.slice(-1)[0];
        return x; // Return the top element
    }
}

// p5.js setup function, runs once when the program starts
function setup() {
    createCanvas(400, 400); // Create a canvas of size 400x400
    background(0); // Set the background color to black

    // Initialize variables for the Sierpinski carpet algorithm
    let x = 0; // Starting x-coordinate
    let y = 0; // Starting y-coordinate
    let areaWidth = width; // Width of the area to process
    let areaHeight = height; // Height of the area to process
    let iter = 5; // Number of iterations for the Sierpinski carpet
    let level = 0; // Current level of recursion
    let areaColor = 255; // Color for drawing (not used directly in this code)
    
    // Initialize the stack with the initial area
    const myStack = new Stack([[x, y, areaWidth, areaHeight]]);
    
    let parts; // Stores subdivided parts of the area
    let lastPart; // Stores the last part processed from the stack
    let visited = []; // Tracks visited parts to avoid reprocessing

    // Process the stack until it's empty
    while (myStack.data.length > 0) {
        // Peek at the top element of the stack
        lastPart = myStack.peek();

        // Extract coordinates and dimensions of the current area
        x = lastPart[0];
        y = lastPart[1];
        areaWidth = lastPart[2];
        areaHeight = lastPart[3];

        // Subdivide the current area using the Sierpinski method
        parts = doSierpinskiMethodOnceOnArea(
            x,
            y,
            areaWidth,
            areaHeight,
            [random(255), random(255), random(255), map(iter - level, 0, 2, 10, 100)]
        );

        // If the current part has already been visited, skip it
        if (visited.includes(lastPart)) {
            level--; // Decrease the recursion level
            myStack.pop(); // Remove the part from the stack
            continue; // Skip to the next iteration
        }

        // If the recursion level is within the limit, subdivide further
        if (level < iter - 1) {
            // Push all subdivided parts onto the stack
            parts.forEach((item) => myStack.push(item));
            level++; // Increase the recursion level
            visited.push(lastPart); // Mark the current part as visited
        } else {
            // If the recursion limit is reached, remove the part from the stack
            myStack.pop();
        }
    }
}

// Function to apply the Sierpinski carpet method to a given area
function doSierpinskiMethodOnceOnArea(x, y, areaWidth, areaHeight, areaColor) {
    // Calculate the width and height proportions for subdivision
    const widthProportion = areaWidth / 3;
    const heightProportion = areaHeight / 3;

    // Draw the center rectangle (the "hole" in the Sierpinski carpet)
    noStroke(); // Disable stroke for the rectangle
    fill(areaColor[0], areaColor[2], areaColor[2], areaColor[3]); // Set fill color
    rect(x + widthProportion, y + heightProportion, widthProportion, heightProportion);

    // Create an array to store the subdivided parts
    let parts = [];
    // Loop through the 3x3 grid to create subdivisions
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            // Skip the center part (already processed)
            if (i !== 1 || j !== 1) {
                parts.push([
                    x + j * widthProportion, // New x-coordinate
                    y + i * heightProportion, // New y-coordinate
                    widthProportion, // New width
                    heightProportion, // New height
                ]);
            }
        }
    }

    return parts; // Return the subdivided parts
}