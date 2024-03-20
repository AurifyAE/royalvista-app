import { getFirestore, deleteDoc, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { app } from '../../../config/db.js';

const firestore = getFirestore(app)

setInterval(() => {
    fetchData();
    document.getElementById('goldRateValue').textContent = '$' + goldValue.toFixed(2);
}, 500);

// Gold API KEY
const API_KEY = 'goldapi-fbqpmirloto20zi-io'

let goldValue, silverValue, alertValue, currentGoldValue, alert;


// Function to Fetch Gold API Data
async function fetchData() {
    var myHeaders = new Headers();
    myHeaders.append("x-access-token", API_KEY);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const responseGold = await fetch("https://www.goldapi.io/api/XAU/USD", requestOptions);
        // const responseSilver = await fetch("https://www.goldapi.io/api/XAG/USD", requestOptions);

        if (!responseGold.ok && !responseSilver.ok) {
            throw new Error('One or more network responses were not OK');
        }

        const resultGold = await responseGold.json();
        // const resultSilver = await responseSilver.json();

        // Adjust based on the actual API response structure
        var goldValueUSD = parseFloat(resultGold.price);
        // var silverValueUSD = parseFloat(resultSilver.price)

        goldValue = goldValueUSD;
        currentGoldValue = goldValueUSD;
        playAlert(goldValueUSD)


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
        const uid = 'LnpQA4ZFsEPRbLul1zDTFj5tWvn1';

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
    // Initialize the round slider on the element
    $("#slider").roundSlider({
        radius: 120,
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
    const uid = 'LnpQA4ZFsEPRbLul1zDTFj5tWvn1';

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
    const uid = 'LnpQA4ZFsEPRbLul1zDTFj5tWvn1';

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

