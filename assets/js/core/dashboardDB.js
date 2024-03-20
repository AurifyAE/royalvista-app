import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { app } from '../../../config/db.js'


// Get the Auth instance
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
    const signOutBtn = document.getElementById('sign-out-btn');

    // Add a click event listener to the sign-out button
    signOutBtn.addEventListener('click', function () {
        // Sign out the user
        signOut(auth)
            .then(() => {
                // Clear the UID from sessionStorage
                sessionStorage.removeItem('uid');

                // Redirect to the login page after sign out
                window.location.href = '../../index.html';
            })
            .catch((error) => {
                console.error('Error signing out:', error.message);
            });
    });

    // Check if the user is authenticated when the page loads
    const uid = sessionStorage.getItem('uid');

    if (!uid) {
        // If not authenticated and not already on the login page, redirect to the login page
        if (window.location.pathname !== '/index.html') {
            window.location.href = '../../index.html';
        }
    }
});
