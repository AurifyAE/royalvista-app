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


document.getElementById('bankName').addEventListener('change', () => displayBankLogo())


const deleteButtons = document.querySelectorAll('.delete');

// Function to Read Data from Database
function displayBankDetails() {
  // Get the UID of the authenticated user
  const uid = sessionStorage.getItem('uid');

  if (!uid) {
    console.error('User not authenticated');
    return Promise.reject('User not authenticated');
  }

  // Reference to the user's bank collection
  const userCollectionRef = collection(firestore, `users/${uid}/bank`);

  // Get all documents in the collection
  getDocs(userCollectionRef)
    .then((querySnapshot) => {
      // Display the data
      querySnapshot.forEach((doc) => {
        const bankDetails = doc.data();

        // Document ID
        const documentId = doc.id;

        const logo = displayBankLogo(bankDetails.bankName)

        var newCard = document.createElement('div');
        newCard.className = 'col-md-12';
        newCard.innerHTML = `
                <div class="card mb-3">
                  <div class="card-body">
                    <div class="bank-data">
                      <div class="row col-md-12">
                        <div class="col-md-2">
                          <p>Holder Name</p>
                          <p>${bankDetails.holderName}</p>
                        </div>
                        <div class="col-md-4">
                          <p>Bank Name</p>
                          <p>${bankDetails.bankName}</p>
                        </div>
                        <div class="col-md-3">
                          <p>Account Number</p>
                          <p>${bankDetails.AccountNumber}</p>
                        </div>
                        <div class="col-md-2">
                          <p>IBAN</p>
                          <p>${bankDetails.IBANCode}</p>
                        </div>
                        <div class="col-md-1">
                          <p>IFSC</p>
                          <p>${bankDetails.IFSCcode}</p>
                        </div>
                      </div>
                      <div class="row col-md-12 row2">
                        <div class="col-md-2">
                          <p>SWIFT</p>
                          <p>${bankDetails.SWIFTcode}</p>
                        </div>
                        <div class="col-md-2">
                          <p>Branch</p>
                          <p>${bankDetails.branch}</p>
                        </div>
                        <div class="col-md-2">
                          <p>City</p>
                          <p>${bankDetails.city}</p>
                        </div>
                        <div class="col-md-2">
                          <p>Country</p>
                          <p>${bankDetails.country}</p>
                        </div>
                        <div class="col-md-2">
                          <p>Logo</p>
                          <img src="${logo}"></img>
                        </div>
                        <div class="col-md-2 action">
                          <p>Action</p>
                          <div class="action-button">
                            <button class="btn btn-primary btn-sm edit" data-id="${documentId}">Edit</button>
                            <button class="btn btn-danger btn-sm delete" data-id="${documentId}">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            `;
        displayCards.appendChild(newCard); // Append the new card


        // Add event listener to the delete button
        const deleteButton = newCard.querySelector('.delete');
        const editButton = newCard.querySelector('.edit');

        deleteButton.addEventListener('click', () => {
          const documentId = deleteButton.getAttribute('data-id');
          deleteBankDetails(documentId, newCard);
        });

        editButton.addEventListener('click', () => {
          const documentId = deleteButton.getAttribute('data-id');
          editBankDetails(documentId, bankDetails);
        });


        // Add the news element to the latest news area
        // latestNewsArea.appendChild(newsItem);
      });
    })
    .catch((error) => {
      console.error('Error reading data from Firestore: ', error);
    });

  document.getElementById("closeBtn").addEventListener('click', () => closeModal());
  document.getElementById("closeBtn2").addEventListener('click', () => closeModal());
}

// Function for Closing Modals on Button Click
function closeModal() {
  var modal = document.getElementById('addModal');
  modal.style.display = 'none';
  clearForm()
}

var modal = document.getElementById('addModal');
modal.addEventListener('click', function (event) {
  event.stopPropagation();
});


//Function to Clear Values
function clearForm() {
  document.getElementById('holderName').value = '';
  document.getElementById('bankName').value = '';
  document.getElementById('AccountNumber').value = '';
  document.getElementById('IBANCode').value = '';
  document.getElementById('IFSCcode').value = '';
  document.getElementById('SWIFTcode').value = '';
  document.getElementById('branch').value = '';
  document.getElementById('city').value = '';
  document.getElementById('country').value = '';
  document.getElementById('bank-logo').value = '';
}


// Function to Edit Data
function editBankDetails(documentId, bankDetails) {
  console.log("edit");
  document.getElementById('addModal').style.display = 'block';
  document.getElementById('updateDetails').style.display = 'block';
  document.getElementById('saveDetails').style.display = 'none';
  var displayCards = document.getElementById('displayCards');

  const logo = displayBankLogo(bankDetails.bankName)

  document.getElementById('holderName').value = bankDetails.holderName;
  document.getElementById('bankName').value = bankDetails.bankName;
  document.getElementById('AccountNumber').value = bankDetails.AccountNumber;
  document.getElementById('IBANCode').value = bankDetails.IBANCode;
  document.getElementById('IFSCcode').value = bankDetails.IFSCcode;
  document.getElementById('SWIFTcode').value = bankDetails.SWIFTcode;
  document.getElementById('branch').value = bankDetails.branch;
  document.getElementById('city').value = bankDetails.city;
  document.getElementById('country').value = bankDetails.country;
  document.getElementById('bank-logo').src = logo;

  document.getElementById('updateDetails').addEventListener('click', () => updateBankDetails(documentId));
}

// Function to Update Data
function updateBankDetails(documentId) {
  var modal = document.getElementById('addModal');

  var holderName = document.getElementById('holderName').value;
  var bankName = document.getElementById('bankName').value;
  var AccountNumber = document.getElementById('AccountNumber').value;
  var IBANCode = document.getElementById('IBANCode').value;
  var IFSCcode = document.getElementById('IFSCcode').value;
  var SWIFTcode = document.getElementById('SWIFTcode').value;
  var branch = document.getElementById('branch').value;
  var city = document.getElementById('city').value;
  var country = document.getElementById('country').value;
  var logo = document.getElementById('bank-logo').value;

  // Get the UID of the authenticated user
  const uid = sessionStorage.getItem('uid');

  if (!uid) {
    console.error('User not authenticated');
    return Promise.reject('User not authenticated');
  }

  // Create an object with the data to be saved
  const dataToSave = {
    holderName: holderName,
    bankName: bankName,
    AccountNumber: AccountNumber,
    IBANCode: IBANCode,
    IFSCcode: IFSCcode,
    SWIFTcode: SWIFTcode,
    branch: branch,
    city: city,
    country: country
  };

  const userCollectionRef = collection(firestore, `users/${uid}/bank`);

  if (userCollectionRef) {
    // Reference to the specific document
    const specificDocRef = doc(userCollectionRef, documentId);

    // Update the document
    updateDoc(specificDocRef, dataToSave)
      .then(() => {
        console.log('Data successfully updated in Firestore');

        // UI
        // location.reload()
      })
      .catch((error) => {
        console.error('Error updating data in Firestore: ', error);
      });
  }


  modal.style.display = 'none';

  clearForm()
}


// Function to delete a news item
function deleteBankDetails(documentId, newsItem) {
  const uid = sessionStorage.getItem('uid');
  const userCollectionRef = collection(firestore, `users/${uid}/bank`);

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


displayBankDetails()


// Function to Display Logo
function displayBankLogo(bank) {
  var selectedBank = bank;
  var selectedBank2 = document.getElementById("bankName").value;
  var bankLogo = document.getElementById("bank-logo");

  // Define image sources for each bank
  var bankImageMap = {
    "First Abu Dhabi Bank": "../../assets/img/bank/FBAB.jpg",
    "Abu Dhabi Commercial Bank": "../../assets/img/bank/ADCB.jpg",
    "Arab Bank For Investment and Foreign Trade": "../../assets/img/bank/ALMASRAF.jpg",
    "Commercial Bank of Dubai": "../../assets/img/bank/CBD.jpg",
    "Emirates NBD": "../../assets/img/bank/ENBD.jpg",
    "Mashreq": "../../assets/img/bank/MASHREQ.jpg",
    "Bank of Sharjah": "../../assets/img/bank/BS.png",
    "United Arab Bank": "../../assets/img/bank/UAB.jpg",
    "Invest Bank": "../../assets/img/bank/IB.jpg",
    "RAKBANK": "../../assets/img/bank/RAK.jpg",
    "Commercial Bank International": "../../assets/img/bank/CBI.jpg",
    "National Bank of Fujairah": "../../assets/img/bank/NBF.jpg",
    "National Bank of Umm Al Qaiwain": "../../assets/img/bank/NBQ.jpg",
    "Dubai Islamic Bank": "../../assets/img/bank/DIB.jpg",
    "Emirates Islamic Bank": "../../assets/img/bank/EIB.jpg",
    "Sharjah Islamic Bank": "../../assets/img/bank/SIB.png",
    "Abu Dhabi Islamic Bank": "../../assets/img/bank/ADIB.jpg",
    "Al Hilal Bank": "../../assets/img/bank/AHB.jpg",
    "Ajman Bank": "../../assets/img/bank/AJMAN.jpg",
    "Emirates Investment Bank": "../../assets/img/bank/EIN.jpg",
    "Network International": "../../assets/img/bank/NI.jpg",
    "Mastercard": "../../assets/img/bank/MASTERCARD.png",
    "Foreign Exchange and Remittance Group": "../../assets/img/bank/FERG.jpg",
    "VISA": "../../assets/img/bank/VISA.png",
    "Al Maryah Community Bank": "../../assets/img/bank/AMCB.png",
    "Wio Bank": "../../assets/img/bank/WIO.png",
    "Zand Bank": "../../assets/img/bank/ZAND.png",
    "Arab Bank": "../../assets/img/bank/ARABBANK.jpg",
    "Banque Misr": "../../assets/img/bank/BM.jpg",
    "Bank of Baroda": "../../assets/img/bank/BOB.jpg",
    "Nilein Bank": "../../assets/img/bank/NILE.jpg",
    "National Bank of Bahrain": "../../assets/img/bank/NBB.jpg",
    "BNP Paribas Head Office": "../../assets/img/bank/BNP.jpg",
    "HSBC": "../../assets/img/bank/HSBC.jpg",
    "Arab African International Bank": "../../assets/img/bank/AAB.jpg",
    "AL Khaliji - France S.A": "../../assets/img/bank/ALK.jpg",
    "Al Ahli Bank of Kuwait": "../../assets/img/bank/ABK.jpg",
    "Barclays Bank": "../../assets/img/bank/BARCLAYS.jpg",
    "Habib Bank Limited": "../../assets/img/bank/HBL.jpg",
    "Habib Bank AG Zurich": "../../assets/img/bank/HABIB.jpg",
    "Standard Chartered Bank": "../../assets/img/bank/SCB.jpg",
    "Citi Bank": "../../assets/img/bank/CITI.jpg",
    "Bank Saderat Iran": "../../assets/img/bank/BSI.jpg",
    "Bank Melli Iran": "../../assets/img/bank/BMI.jpg",
    "Banque Banorient France": "../../assets/img/bank/BBF.jpg",
    "United Bank Limited": "../../assets/img/bank/UBL.jpg",
    "Doha Bank": "../../assets/img/bank/DOHA.jpg",
    "Samba Financial Group": "../../assets/img/bank/SAMBA.jpg",
    "Deutsche Bank": "../../assets/img/bank/DB.jpg",
    "Industrial and Commercial Bank of China": "../../assets/img/bank/ICBC.jpg",
    "National Bank of Kuwait": "../../assets/img/bank/NBK.jpg",
    "Gulf International Bank": "../../assets/img/bank/GIB.jpg",
    "Bank of China": "../../assets/img/bank/BOC.jpg",
    "BOK International": "../../assets/img/bank/BOK.jpg",
    "Credit Agricole Corporate and Investment Bank": "../../assets/img/bank/CA.jpg",
    "International Development Bank": "../../assets/img/bank/IDB.jpg"
  };

  if (selectedBank !== "select") {
    bankLogo.src = bankImageMap[selectedBank2];
    bankLogo.style.display = "block";
    return bankImageMap[selectedBank];
  } else {
    // If "Select a Bank" is chosen, hide the logo
    bankLogo.style.display = "none";
  }
}


var addButton = document.getElementById('showForm');
var modal = document.getElementById('addModal');
var saveButton = document.getElementById('saveDetails');
var displayCards = document.getElementById('displayCards');

addButton.addEventListener('click', showModal);

saveButton.addEventListener('click', saveData);

modal.addEventListener('click', function (event) {
  if (event.target === modal) {
    hideModal();
  }
});

function showModal() {
  console.log('click');
  modal.style.display = 'block';
  $('#bankName').val('select');
}

function saveData() {
  var holderName = document.getElementById('holderName').value;
  var bankName = document.getElementById('bankName').value;
  var AccountNumber = document.getElementById('AccountNumber').value;
  var IBANCode = document.getElementById('IBANCode').value;
  var IFSCcode = document.getElementById('IFSCcode').value;
  var SWIFTcode = document.getElementById('SWIFTcode').value;
  var branch = document.getElementById('branch').value;
  var city = document.getElementById('city').value;
  var country = document.getElementById('country').value;
  var logo = document.getElementById('bank-logo').value;

  if (!holderName || !bankName || !AccountNumber || !IBANCode || !IFSCcode 
    || !SWIFTcode || !branch || !city || !country) {
    // alert('Enter Details')
    var holderName = document.getElementById('holderName');
    var bankName = document.getElementById('bankName');
    var AccountNumber = document.getElementById('AccountNumber');
    var IBANCode = document.getElementById('IBANCode');
    var IFSCcode = document.getElementById('IFSCcode');
    var SWIFTcode = document.getElementById('SWIFTcode');
    var branch = document.getElementById('branch');
    var city = document.getElementById('city');
    var country = document.getElementById('country');

    holderName.style.border = '2px solid red';
    bankName.style.border = '2px solid red';
    AccountNumber.style.border = '2px solid red';
    IBANCode.style.border = '2px solid red';
    IFSCcode.style.border = '2px solid red';
    SWIFTcode.style.border = '2px solid red';
    branch.style.border = '2px solid red';
    city.style.border = '2px solid red';
    country.style.border = '2px solid red';
  }

  const uid = sessionStorage.getItem('uid');

  if (!uid) {
    console.error('User not authenticated');
    return Promise.reject('User not authenticated');
  }

  const dataToSave = {
    holderName: holderName,
    bankName: bankName,
    AccountNumber: AccountNumber,
    IBANCode: IBANCode,
    IFSCcode: IFSCcode,
    SWIFTcode: SWIFTcode,
    branch: branch,
    city: city,
    country: country
  };

  const userCollectionRef = collection(firestore, `users/${uid}/bank`);

  if (userCollectionRef) {
    addDoc(userCollectionRef, dataToSave)
      .then((docRef) => {
        console.log('Data successfully added to Firestore');
        const documentId = docRef.id;
        addBankDetailsToUI(documentId, dataToSave);
      })
      .catch((error) => {
        console.error('Error adding data to Firestore: ', error);
      });
  }

  hideModal();
  clearForm();
}

function hideModal() {
  modal.style.display = 'none';
}



// Refresh UI
function addBankDetailsToUI(documentId, bankDetails) {
  const logo = displayBankLogo(bankDetails.bankName);

  var newCard = document.createElement('div');
  newCard.className = 'col-md-12'; // Bootstrap column class for half width
  newCard.innerHTML = `
    <div class="card mb-3">
      <div class="card-body">
        <div class="bank-data">
          <div class="row col-md-12">
            <div class="col-md-2">
              <p>Holder Name</p>
              <p>${bankDetails.holderName}</p>
            </div>
            <div class="col-md-4">
              <p>Bank Name</p>
              <p>${bankDetails.bankName}</p>
            </div>
            <div class="col-md-3">
              <p>Account Number</p>
              <p>${bankDetails.AccountNumber}</p>
            </div>
            <div class="col-md-2">
              <p>IBAN</p>
              <p>${bankDetails.IBANCode}</p>
            </div>
            <div class="col-md-1">
              <p>IFSC</p>
              <p>${bankDetails.IFSCcode}</p>
            </div>
          </div>
          <div class="row col-md-12 row2">
            <div class="col-md-2">
              <p>SWIFT</p>
              <p>${bankDetails.SWIFTcode}</p>
            </div>
            <div class="col-md-2">
              <p>Branch</p>
              <p>${bankDetails.branch}</p>
            </div>
            <div class="col-md-2">
              <p>City</p>
              <p>${bankDetails.city}</p>
            </div>
            <div class="col-md-2">
              <p>Country</p>
              <p>${bankDetails.country}</p>
            </div>
            <div class="col-md-2">
              <p>Logo</p>
              <img src="${logo}"></img>
            </div>
            <div class="col-md-2 action">
              <p>Action</p>
              <div class="action-button">
                <button class="btn btn-primary btn-sm edit" data-id="${documentId}>Edit</button>
                <button class="btn btn-danger btn-sm delete" data-id="${documentId}">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
`;

  displayCards.appendChild(newCard); // Append the new card

  // Add event listener to the delete button
  const deleteButton = newCard.querySelector('.delete');
  deleteButton.addEventListener('click', () => {
    deleteBankDetails(documentId, newCard);
  });

  // Add the news element to the latest news area
  latestNewsArea.appendChild(newCard);

}
