import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDocs,
    setDoc,
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js';
import { app } from '../../../config/db.js';

document.addEventListener('DOMContentLoaded', function () {
    displayUserData()
});

const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

var documentId = ''

// Attach event listener to the button with ID saveChangesBtn
document.addEventListener("DOMContentLoaded", function () {
    const saveChangesBtn = document.getElementById('saveChangesBtn');

    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function () {
            saveChanges();
        });
    }
});

function saveChanges() {
    // Get the edited values
    const companyName = document.getElementById('company-name').textContent;
    const fullName = document.getElementById('full-name').textContent;
    const mobile = document.getElementById('mobile').textContent;
    const email = document.getElementById('email').textContent;
    const location = document.getElementById('location').textContent;
    const personalInfo = document.getElementById('personal-info').textContent;

    // Get the UID of the authenticated user
    const uid = sessionStorage.getItem('uid');

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Create an object with the data to be saved
    const dataToSave = {
        companyName: companyName,
        fullName: fullName,
        mobile: mobile,
        email: email,
        location: location,
        personalInfo: personalInfo,
    };

    // Reference to the user's profile collection
    const userCollectionRef = collection(firestore, `users/${uid}/profile`);

    // Reference to the specific document with ID 
    const userDocRef = documentId ? doc(userCollectionRef, documentId) : null;

    if (userDocRef) {
        // Update the existing document
        setDoc(userDocRef, dataToSave)
            .then(() => {
                console.log('Data successfully updated in Firestore');
            })
            .catch((error) => {
                console.error('Error updating data in Firestore: ', error);
            });
    } else {
        // Create a new document
        addDoc(userCollectionRef, dataToSave)
            .then(() => {
                console.log('Data successfully added to Firestore');
            })
            .catch((error) => {
                console.error('Error adding data to Firestore: ', error);
            });
    }
}


// Function to read data from Firestore
function displayUserData() {
    // Get the UID of the authenticated user
    const uid = sessionStorage.getItem('uid');

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Reference to the user's profile collection
    const userCollectionRef = collection(firestore, `users/${uid}/profile`);

    // Get all documents in the collection
    getDocs(userCollectionRef)
        .then((querySnapshot) => {
            // Display the data
            // Assuming your Firestore documents have fields like fullName, mobile, email, etc.
            querySnapshot.forEach((doc) => {
                const userData = doc.data();

                // Document ID
                documentId = doc.id

                // Update HTML elements with user data
                document.getElementById('company-name').textContent = userData.companyName;
                document.getElementById('full-name').textContent = userData.fullName;
                document.getElementById('mobile').textContent = userData.mobile;
                document.getElementById('email').textContent = userData.email;
                document.getElementById('location').textContent = userData.location;
                document.getElementById('personal-info').textContent = userData.personalInfo;


                document.getElementById('company-name-display').textContent = userData.companyName;
                document.getElementById('full-name-display').textContent = userData.fullName;
                document.getElementById('user-name').textContent = userData.fullName;
            });
        })
        .catch((error) => {
            console.error('Error reading data from Firestore: ', error);
        });
}

// Example of calling the displayUserData function
displayUserData();


// Function to read data from Firestore
function displayLogo() {
    // Get the UID of the authenticated user
    const uid = sessionStorage.getItem('uid');

    if (!uid) {
        console.error('User not authenticated');
        return Promise.reject('User not authenticated');
    }

    // Reference to the user's profile collection
    const userCollectionRef = collection(firestore, `users/${uid}/logo`);

    // Get all documents in the collection
    getDocs(userCollectionRef)
        .then((querySnapshot) => {
            // Display the data
            // Assuming your Firestore documents have fields like fullName, mobile, email, etc.
            querySnapshot.forEach((doc) => {
                const logo = doc.data();

                // Document ID
                documentId = doc.id

                console.log(logo);
                document.getElementById('profile-logo').src = logo.logo
            });
        })
        .catch((error) => {
            console.error('Error reading data from Firestore: ', error);
        });
}

// Example of calling the displayUserData function
displayLogo();

// Function to handle logo change
function handleLogoChange() {
    console.log('55');
    const logoInput = document.getElementById('logo');
    const logoPreview = document.getElementById('logo-preview');
    const deleteIcon = document.getElementById('delete-icon');
    const message = document.getElementById('success-message');


    const uid = sessionStorage.getItem('uid');
    const storage = getStorage(app);

    logoInput.addEventListener('change', function () {
        const file = logoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                logoPreview.src = e.target.result;
                deleteIcon.style.display = 'inline';

                const storageRef = ref(storage, `users/${uid}/logo/logo.jpg`);
                uploadBytes(storageRef, file).then(snapshot => {
                    console.log('Uploaded a blob or file!', snapshot);


                    // Rest of your code...
                    // Update the Firestore document with the image URL
                    getDownloadURL(storageRef).then(url => {
                        const logoDocumentRef = doc(firestore, `users/${uid}/logo`, 'fixedDocumentId');

                        // Set the data for the fixed document ID
                        setDoc(logoDocumentRef, { logo: url })
                            .then(() => {
                                console.log('Document successfully updated!');
                                displayLogo();
                                setTimeout(() => {
                                    message.style.display = 'block'
                                }, 3000)
                                message.style.display = 'none'
                            })
                            .catch(error => {
                                console.error('Error updating document: ', error);
                            });
                    }).catch(error => {
                        console.error('Error getting download URL: ', error);
                    });
                    message.style.display = 'none'

                }).catch(error => {
                    console.error('Error uploading file: ', error);
                });
            };
            reader.readAsDataURL(file);
        } else {
            logoPreview.src = '#';
            deleteIcon.style.display = 'none';
        }
    });
    message.style.display = 'none'
}

handleLogoChange();


// // Function to handle logo change
// function handleLogoChange() {
//     const logoInput = document.getElementById('logo');
//     const logoPreview = document.getElementById('logo-preview');
//     const tvLogo = document.getElementById('tv-logo');

//     // Add an event listener to the logo input element
//     logoInput.addEventListener('change', function () {
//         // Check if a file is selected
//         if (logoInput.files.length > 0) {
//             // Get the selected file
//             const selectedFile = logoInput.files[0];

//             // Create a FileReader to read the selected file
//             const reader = new FileReader();

//             // Set up the onload event handler for the FileReader
//             reader.onload = function () {
//                 // Update the src attribute of the logo preview and TV logo elements
//                 logoPreview.src = reader.result;
//                 tvLogo.src = reader.result;
//             };

//             // Read the selected file as a data URL
//             reader.readAsDataURL(selectedFile);
//         }
//     });
// }

// // Call the function to initialize the logo change functionality
// handleLogoChange();

// // JavaScript to handle logo upload and preview
// const logoInput = document.getElementById('logo');
// const logoPreview = document.getElementById('logo-preview');
// const deleteIcon = document.getElementById('delete-icon');
// const saveBtn = document.getElementById('logoSaveBtn');

// logoInput.addEventListener('change', function () {
//     const file = logoInput.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function (e) {
//             logoPreview.src = e.target.result;
//             deleteIcon.style.display = 'inline'; // Show the delete icon
//             saveBtn.style.display = 'inline';
//         };
//         reader.readAsDataURL(file);
//     } else {
//         logoPreview.src = '#'; // Clear the preview if no file selected
//         deleteIcon.style.display = 'none'; // Hide the delete icon
//         saveBtn.style.display = 'none';
//     }
// });

// // Add a click event listener to the delete icon
// deleteIcon.addEventListener('click', function () {
//     logoInput.value = ''; // Clear the file input
//     logoPreview.src = ''; // Clear the preview
//     deleteIcon.style.display = 'none'; // Hide the delete icon
//     saveBtn.style.display = 'none';
// });


// const inp = document.querySelector(".inp");
// const progressbar = document.querySelector(".progress");
// const img = document.querySelector(".img");
// const fileData = document.querySelector(".filedata");
// const loading = document.querySelector(".loading");
// let file;
// let fileName;
// let progress;
// let isLoading = false;
// let uploadedFileName;
// const selectImage = () => {
//     inp.click();
// };
// const getImageData = (e) => {
//     file = e.target.files[0];
//     fileName = Math.round(Math.random() * 9999) + file.name;
//     if (fileName) {
//         fileData.style.display = "block";
//     }
//     fileData.innerHTML = fileName;
//     console.log(file, fileName);
// };

// const uploadImage = () => {
//     loading.style.display = "block";
//     const storageRef = storage.ref().child("myimages");
//     const folderRef = storageRef.child(fileName);
//     const uploadtask = folderRef.put(file);
//     uploadtask.on(
//         "state_changed",
//         (snapshot) => {
//             console.log("Snapshot", snapshot.ref.name);
//             progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//             progress = Math.round(progress);
//             progressbar.style.width = progress + "%";
//             progressbar.innerHTML = progress + "%";
//             uploadedFileName = snapshot.ref.name;
//         },
//         (error) => {
//             console.log(error);
//         },
//         () => {
//             storage
//                 .ref("myimages")
//                 .child(uploadedFileName)
//                 .getDownloadURL()
//                 .then((url) => {
//                     console.log("URL", url);
//                     if (!url) {
//                         img.style.display = "none";
//                     } else {
//                         img.style.display = "block";
//                         loading.style.display = "none";
//                     }
//                     img.setAttribute("src", url);
//                 });
//             console.log("File Uploaded Successfully");
//         }
//     );
// };
