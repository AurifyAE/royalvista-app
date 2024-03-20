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

const addNewsBtn = document.getElementById('addNewsBtn');
const newsModal = document.getElementById('newsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const latestNewsArea = document.getElementById('latestNewsArea');
const deleteButtons = document.querySelectorAll('.delete-btn');

addNewsBtn.addEventListener('click', () => {
    newsModal.style.display = 'block';
});

closeModalBtn.addEventListener('click', () => {
    newsModal.style.display = 'none';
});

// Function to Read News from Database
function displayNews() {
    // Get the UID of the authenticated user
    const uid = sessionStorage.getItem('uid');

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Reference to the user's profile collection
    const userCollectionRef = collection(firestore, `users/${uid}/news`);

    // Get all documents in the collection
    getDocs(userCollectionRef)
        .then((querySnapshot) => {
            // Display the data
            querySnapshot.forEach((doc) => {
                const newsData = doc.data();

                // Document ID
                const documentId = doc.id;

                // Create a news element
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');
                newsItem.innerHTML = `
                    <h4>${newsData.newsTitle}</h4>
                    <p>${newsData.newsContent}</p>
                    <div class="news-item-buttons">
                        <button class="btn btn-success">Edit</button>
                        <button class="btn btn-danger delete-btn" data-id="${documentId}">Delete</button>
                    </div>
                `;

                // Add event listener to the delete button
                const deleteButton = newsItem.querySelector('.delete-btn');
                deleteButton.addEventListener('click', () => {
                    const documentId = deleteButton.getAttribute('data-id');
                    deleteNewsItem(documentId, newsItem);
                });

                // Add the news element to the latest news area
                latestNewsArea.appendChild(newsItem);
            });
        })
        .catch((error) => {
            console.error('Error reading data from Firestore: ', error);
        });
}

// Function to delete a news item
function deleteNewsItem(documentId, newsItem) {
    const uid = sessionStorage.getItem('uid');
    const userCollectionRef = collection(firestore, `users/${uid}/news`);

    // Delete the document with the specified ID
    deleteDoc(doc(userCollectionRef, documentId))
        .then(() => {
            console.log('Document successfully deleted!');
            // Update the UI to reflect the deletion
            newsItem.remove(); // Remove the deleted item from the DOM
        })
        .catch((error) => {
            console.error('Error deleting document: ', error);
        });
}



displayNews()

// Function to handle news submission
function uploadNews(event) {
    event.preventDefault(); // Prevent the form from submitting

    const newsTitle = document.getElementById('newsTitle').value;
    const newsContent = document.getElementById('newsContent').value;

    // Get the UID of the authenticated user
    const uid = sessionStorage.getItem('uid');

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Create an object with the data to be saved
    const dataToSave = {
        newsTitle: newsTitle,
        newsContent: newsContent
    };

    // Reference to the user's profile collection
    const userCollectionRef = collection(firestore, `users/${uid}/news`);

    if (userCollectionRef) {
        // Create a new document
        addDoc(userCollectionRef, dataToSave)
            .then((docRef) => {
                console.log('Data successfully added to Firestore');

                // Get the newly generated document ID
                const documentId = docRef.id;

                // Update the UI to reflect the addition
                addNewsItemToUI(documentId, dataToSave);

                // Optional: You can do other actions if needed

                // location.reload(); // Reload the page (you may want to remove this depending on your use case)
            })
            .catch((error) => {
                console.error('Error adding data to Firestore: ', error);
            });
    }

    // Clear the form and close the modal
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    newsModal.style.display = 'none';
}

// Function to dynamically add a new news item to the UI
function addNewsItemToUI(documentId, newsData) {
    // Create a news element
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');
    newsItem.innerHTML = `
        <h4>${newsData.newsTitle}</h4>
        <p>${newsData.newsContent}</p>
        <div class="news-item-buttons">
            <button class="btn btn-success">Edit</button>
            <button class="btn btn-danger delete-btn" data-id="${documentId}">Delete</button>
        </div>
    `;

    // Add event listener to the delete button
    const deleteButton = newsItem.querySelector('.delete-btn');
    deleteButton.addEventListener('click', () => {
        deleteNewsItem(documentId, newsItem);
    });

    // Add the news element to the latest news area
    latestNewsArea.appendChild(newsItem);
}




// Add an event listener to the news upload form
const uploadForm = document.querySelector('form');
uploadForm.addEventListener('submit', uploadNews);

// Add event listeners to existing delete buttons
deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const newsItem = button.parentElement.parentElement;
        latestNewsArea.removeChild(newsItem);
    });
});