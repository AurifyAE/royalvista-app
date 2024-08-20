import { getFirestore, deleteDoc, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { app } from '../../../config/db.js';

const script = document.createElement("script");
script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.2.0/socket.io.js";
document.head.appendChild(script);

const socket = io("https://capital-server-9ebj.onrender.com", {
    query: { secret: "aurify@123" }, // Pass secret key as query parameter
});

const firestore = getFirestore(app);

socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    requestMarketData(["GOLD", "SILVER"]);
});

// Request market data based on symbols
function requestMarketData(symbols) {
    socket.emit("request-data", symbols);
}

setInterval(() => {
    fetchData();
    document.getElementById('goldRateValue').textContent = '$' + goldValue.toFixed(2);
}, 500);

let goldValue, silverValue, alertValue, currentGoldValue, alert;

let goldData = {};


// Function to Fetch Gold API Data
async function fetchData() {
    try {
        socket.on("market-data", (data) => {
            if (data && data.symbol) {
                if (data.symbol === "Gold") {
                    goldData = data;
                    // updateGoldUI();
                } else if (data.symbol === "Silver") {
                    silverData = data;
                }
            } else {
                console.warn("Received malformed market data:", data);
            }

            const value = goldData.bid;
            goldValue = value;
            currentGoldValue = value;
            playAlert(value)
        });

    } catch (error) {
        console.error('Error fetching gold and silver values:', error);
    }
    alertInitialValue()
}

// Show Alert values from Firebase
readData()
    .then((result) => {
        // console.log('Document data:', result.data.alertValue);
        document.getElementById('displayValue').innerHTML = result.data.alertValue;
        setAlertValue(result.data.alertValue);
    })
    .catch((error) => {
        console.error(error);
        document.getElementById('displayValue').style.display = 'none';
        document.getElementById('alertDeleteBtn').style.display = 'none';
        document.getElementById('display').style.display = 'none';
    });



// Event Listener for Delete Alert Btn
document.getElementById('alertDeleteBtn').addEventListener('click', async () => {
    console.log('delete btn');
    try {
        const uid = '1s4ZN51tk8UxYfxtiNK5Ql9yhEP2';

        if (!uid) {
            console.error('User not authenticated');
            throw new Error('User not authenticated');
        }

        await deleteDoc(doc(firestore, `users/${uid}/alert/alertValue`));
        document.getElementById('displayValue').style.display = 'none';
        document.getElementById('alertDeleteBtn').style.display = 'none';
        document.getElementById('display').style.display = 'none';

        console.log('Document deleted successfully');
    } catch (error) {
        console.error('Error:', error.message);
    }
});



// Function to set Alert initial Value
function alertInitialValue() {
    var currentValue = $("#slider").roundSlider("option", "value");
    if (currentValue === 50) {
        // console.log(currentValue);
        document.getElementById('value').innerHTML = goldValue.toFixed(0);
    }
}

// Function to show Alert
function rateAlert() {
    var radius = 120; // Default radius

    // Check screen width and adjust radius accordingly
    if ($(window).width() >= 600) {
        radius = 200; // Adjusted radius for smaller devices
    }

    if ($(window).width() >= 900) {
        radius = 300; // Adjusted radius for smaller devices
    }

    if ($(window).width() >= 1024) {
        radius = 350; // Adjusted radius for smaller devices
    }

    // Initialize the round slider on the element
    $("#slider").roundSlider({
        radius: radius,
        circleShape: "half-top",
        sliderType: "mid-range",
        showTooltip: false,
        value: 50,
        min: 0,
        max: 100,
        lineCap: "round",
        handleSize: 25
    });


    // Set up a callback function for the value change event
    $("#slider").on("drag", function (event) {
        // Get the current value
        var currentValue = $("#slider").roundSlider("option", "value");

        if (currentValue <= 50) {
            alertValue = Math.round(goldValue - 50 + currentValue);
            document.getElementById('value').innerHTML = alertValue;
        } else {
            alertValue = Math.round(goldValue + currentValue - 50);
            document.getElementById('value').innerHTML = alertValue;
        }
        console.log("Current Value:", currentValue);
    });
}

rateAlert()

// Function to read data from the Firestore collection
async function readData() {
    // Get the UID of the authenticated user
    const uid = '1s4ZN51tk8UxYfxtiNK5Ql9yhEP2';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    const docRef = doc(firestore, `users/${uid}/alert/alertValue`);

    try {
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            // Document exists, retrieve its data
            const result = {
                id: docSnapshot.id,
                data: docSnapshot.data()
            };
            return result;
        } else {
            console.error('Document does not exist');
            return Promise.reject('Document does not exist');
        }
    } catch (error) {
        console.error('Error getting document:', error);
        return Promise.reject('Error getting document');
    }
}

// Function to save data to the Firestore collection
async function saveData(data) {
    // Get the UID of the authenticated user
    const uid = '1s4ZN51tk8UxYfxtiNK5Ql9yhEP2';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    const docRef = doc(firestore, `users/${uid}/alert/alertValue`);

    await setDoc(docRef, data);

    console.log('Document written');
}

//////////////////
// Event Listener to Edit Alert Value
document.getElementById('value').addEventListener('input', () => {
    // Update alertValue with the edited content
    alertValue = document.getElementById('value').textContent;
    console.log(alertValue);
});

// Optionally, you can add a click event to enable content editing on click
document.getElementById('value').addEventListener('click', () => {
    // Set contentEditable to true when the element is clicked
    document.getElementById('value').contentEditable = true;
});
//////////////////

////////////////////
// Event Listener for Set Alert Button Click
document.getElementById('alertBtn').addEventListener('click', () => {
    let value = parseFloat(alertValue);
    let value2 = parseFloat(goldValue);


    const value3 = value.toFixed(0);
    const value4 = value2.toFixed(0);

    console.log(alertValue);
    saveData({
        alertValue: alertValue
    })

    let alert;
    readData()
        .then((result) => {
            // console.log('Document data:', result);
            document.getElementById('displayValue').innerHTML = result.data.alertValue;
            setAlertValue(result.data.alertValue);
            document.getElementById('displayValue').style.display = 'inline-block';
            document.getElementById('alertDeleteBtn').style.display = 'inline-block';
            document.getElementById('display').style.display = 'inline-block';
        })
        .catch((error) => {
            console.error(error);
        });

    if (alert === value4) {
        document.getElementById('xyz').play();
        // alert("Thank you!");
    }
});

// Function to Set Alert Value Globaly
function setAlertValue(value) {
    alert = value;
}

// Function to Play Alert
function playAlert() {
    let value = parseFloat(goldValue);

    const value2 = value.toFixed(0);
    const value3 = alert.toFixed(0);
    console.log(value2, value3);

    if (value3 === value2) {
        // alert("Thank you!");
        document.getElementById('xyz').play();
    }
}

playAlert()

