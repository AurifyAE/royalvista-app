import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { app } from '../../../config/db.js';


const firestore = getFirestore(app);
const auth = getAuth(app);

// Function to Read News from Database
function displayNews() {
    // Get the UID of the authenticated user
    const uid = 'LnpQA4ZFsEPRbLul1zDTFj5tWvn1';

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Reference to the user's profile collection
    const userCollectionRef = collection(firestore, `users/${uid}/news`);

    getDocs(userCollectionRef)
        .then((querySnapshot) => {
            // Create an array to store news content
            const newsArray = [];

            // Loop through each document
            querySnapshot.forEach((doc) => {
                const newsData = doc.data();

                // Add news content to the array
                newsArray.push(newsData.newsContent);
            });
            console.log(newsArray);
            // Display the news content in a single div
            const displayNewsDiv = document.getElementById("displayNews");
            displayNewsDiv.innerHTML = newsArray.join(" >> ");

        })
        .catch((error) => {
            console.error('Error reading data from Firestore: ', error);
        });

}

displayNews();
