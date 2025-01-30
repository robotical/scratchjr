# How to Add a Tutorial

This guide will walk you through the steps to add a new tutorial to the project.

## Step 1: Create the Tutorial Object

First, create a new file in the `src/tutorial/tutorials-data/` directory. The file should contain the tutorial object. The id of the tutorial will be used to reference it in the `activities` tab.

Example:
```javascript
// filepath: /src/tutorial/tutorials-data/my-new-tutorial.js
const myNewTutorial = {
    id: "my-new-tutorial", // This id will be used to reference the tutorial in the activities tab
    platform: "blocksjr",
    title: "My New Tutorial",
    description: "Description of my new tutorial",
    tutorialSteps: [
        // Define the steps of the tutorial here
    ]
};

export default myNewTutorial;
```

## Step 2: Load the Tutorial in the Project

Next, load the tutorial in the project by adding it to the `TutorialFetcher`.

Edit the `TutorialFetcher.js` file located at `src/tutorial/TutorialFetcher.js` to include your new tutorial.

Example:
```javascript
// filepath: ./src/tutorial/TutorialFetcher.js
import myNewTutorial from "./tutorials-data/my-new-tutorial";

// ...existing code...

const allTutorials = [
    // ...existing tutorials...
    myNewTutorial
];

// ...existing code...
```

## Step 3: Understand the Tutorial UI and Engine

The `TutorialUI.js` file located at `src/editor/ui/TutorialUI.js` is responsible for handling the UI, such as showing instructions, highlighting elements of the UI, etc.

The `TutorialEngine.js` file located at `src/tutorial/TutorialEngine.js` is responsible for reading the tutorial object and instructing the UI to change accordingly.

### TutorialUI.js

This file contains methods to:
- Set up the tutorial UI elements.
- Show and hide buttons.
- Display speech bubbles with text, images, or videos.
- Highlight blocks and elements.
- Handle drag and drop animations.

### TutorialEngine.js

This file contains methods to:
- Initialize the tutorial engine with the tutorial object.
- Progress through the tutorial steps.
- Update the UI based on the current step.
- Handle actions defined in the tutorial steps.
- Evaluate the scripts area to check if the expected code conditions are met.