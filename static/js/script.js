let petName;
let isPetAlive = true;
let hunger = 80;
let happiness = 80;
let energy = 80;
let adoptionTime = 80;

// Add variables for button display
let adoptBtnDisplay = "none";


const petNameInput = document.getElementById("petName");
const adoptBtn = document.getElementById("adoptBtn");
const petTypeInput = document.querySelector('input[name="petType"]:checked');
const petIcon = document.getElementById("petIcon");
const adoptionMessage = document.getElementById("adoptionMessage");
const welcomeMessage = document.getElementById("welcomeMessage");
const petStats = document.getElementById("petStats");
const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const sleepBtn = document.getElementById("sleepBtn");
const newPetNameInput = document.getElementById("newPetName");
const confirmAdoptionBtn = document.getElementById("confirmAdoption");

const interactionMessages = []; // Array to store interaction messages

document.addEventListener("DOMContentLoaded", function() {
    // Your JavaScript code here
});

if (adoptBtn) {
    adoptBtn.addEventListener("click", () => {
        console.log("Button clicked!"); // Add this line
        petName = petNameInput.value;
        const petType = document.querySelector('input[name="petType"]:checked').value; // Get the selected pet type

        if (petName && petType) {
            const petTypeText = petType === "dog" ? "your loyal dog" : "your adorable cat";
            welcomeMessage.textContent = `Welcome, ${petTypeText}, ${petName}`;

            // Set healthier initial stats
            hunger = 80;
            happiness = 80;
            energy = 80;

            // Update the pet icon based on the selected pet type
            if (petType === "dog") {
                petIcon.src = "/static/images/dog.png";
            } else if (petType === "cat") {
                petIcon.src = "/static/images/cat.png";
            }
            petIcon.style.display = "block"; // Show the pet icon
            adoptionMessage.textContent = `Congratulations! You adopted ${petName}, a cuddly ${petType}`;
            adoptionMessage.style.color = "brown";
            adoptionMessage.style.fontWeight = "bold";
            adoptionMessage.style.display = "block";
            adoptBtn.style.display = "none";
            adoptionTime = Date.now(); // Record the adoption time
            updatePetInfo();
            console.log(`You adopted a pet named ${petName}`);  // Log adoption to console

            // Add the following lines for the "Confirm Adoption" button
            document.getElementById('petInfo').style.display = 'block';
            document.getElementById('buttons').style.display = 'block';

        } else {
            adoptionMessage.textContent = "Please enter a pet name and select a pet type.";
            adoptionMessage.style.color = "red";
            adoptionMessage.style.fontWeight = "bold";
            adoptionMessage.style.display = "block";
            console.log("Please enter a pet name and select a pet type.");
            alert("Please enter a pet name and select a pet type."); // Alert if pet name is missing
        }
    });
}


    // Display interaction messages
function addInteractionMessage(message) {
    const messageList = document.getElementById("interactionMessages");
    const messageItem = document.createElement("li");
    messageItem.textContent = message;
    messageList.appendChild(messageItem);
}


feedBtn.addEventListener("click", () => {
     if (isPetAlive) {
        if (hunger < 20) {
            // If hunger is below 20, change the text color to red
            petStats.style.color = "red";
        } else {
            petStats.style.color = "black"; // Reset the text color
        }

        if (hunger < 100) {
            hunger += 10;
            updatePetInfo();

            const interactionMessage = document.createElement("li");
            interactionMessage.textContent = `You fed ${petName}`;

           // Add the message to the interaction messages list
            const messageList = document.getElementById("interactionMessages");
            messageList.appendChild(interactionMessage);

            console.log(interactionMessage);
        }
    }
});

playBtn.addEventListener("click", () => {
    if (isPetAlive) {
        if (happiness < 20) {
            // If happiness is below 20, change the text color to red
            petStats.style.color = "red";
        } else {
            petStats.style.color = "black"; // Reset the text color
        }

        if (happiness < 100) {
            happiness += 10;
            if (energy > 10) energy -= 10;
            updatePetInfo();

            // Create a new interaction message element
            const interactionMessage = document.createElement("li");
            interactionMessage.textContent = `You played with ${petName}`;

            // Add the message to the interaction messages list
            const messageList = document.getElementById("interactionMessages");
            messageList.appendChild(interactionMessage);

            console.log(`You played with ${petName}`);
        }
    }
});


sleepBtn.addEventListener("click", () => {
    if (isPetAlive) {
        if (energy < 20) {
            // If energy is below 20, change the text color to red
            petStats.style.color = "red";
        } else {
            petStats.style.color = "black"; // Reset the text color
        }

        if (energy < 100) {
            energy += 10;
            if (hunger > 10) hunger -= 10;
            updatePetInfo();

            // Create a new interaction message element
            const interactionMessage = document.createElement("li");
            interactionMessage.textContent = `${petName} went to sleep`;

            // Add the message to the interaction messages list
            const messageList = document.getElementById("interactionMessages");
            messageList.appendChild(interactionMessage);

            console.log(`${petName} went to sleep`);
        }
    }
});


// Define the updatePetInfo function
function updatePetInfo() {

    if (isPetAlive) {
        // Check if the levels are below 20 and change the text color to red
         if (isPetAlive) {
        if (hunger < 20) {
            petStats.style.color = "red";
        } else if (happiness < 20) {
            petStats.style.color = "red";
        } else if (energy < 20) {
            petStats.style.color = "red";
        } else {
            petStats.style.color = "black"; // Reset the text color
        }

        petStats.textContent = `Hunger: ${hunger}, Happiness: ${happiness}, Energy: ${energy}`;
    }
    else {
        adoptionMessage.textContent = `${petName} is not feeling well. It has passed away.`;
        adoptionMessage.style.color = "red";
        adoptionMessage.style.fontWeight = "bold";
        adoptBtn.style.display = "block";
        console.log(`${petName} has passed away`);
        alert(`${petName} has passed away`);
        }
    }
}


function reset_pet() {
    petName = "";
    isPetAlive = true;
    hunger = 80;
    happiness = 80;
    energy = 80;
    welcomeMessage.textContent = "";
    adoptionMessage.textContent = "";
    petStats.textContent = "";
    petNameInput.value = "";
    adoptBtn.style.display = "block";
    interactionMessages.length = 0; // Clear the interaction messages array
    updatePetInfo();

}

function simulateTime() {
  const interval = 10000; // Update every 10 seconds

  setInterval(function () {
    if (isPetAlive) {
      // Decrease hunger, happiness, and energy over time (every 20 seconds)
      hunger -= 10;
      happiness -= 10;
      energy -= 10;

      if (hunger <= 0 || happiness <= 0 || energy <= 0) {
        // If any stat reaches zero or below, the pet passes away
        isPetAlive = false;
        adoptionMessage.textContent = `${petName} is not feeling well. It has passed away.`;
        adoptionMessage.style.color = "red";
        adoptionMessage.style.fontWeight = "bold";
        adoptBtn.style.display = "block";
        console.log(`${petName} has passed away.`);
        alert(`${petName} has passed away.`);
      }

       updatePetInfo();
    }
  }, interval);
}

// Start simulating time
simulateTime()