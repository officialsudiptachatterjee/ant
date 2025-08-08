// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging.js";

// 🔹 Your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Push Notification Permission
Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" })
      .then(token => console.log("Push Token:", token));
  }
});

onMessage(messaging, payload => {
  alert(`📢 Update: ${payload.notification.title}`);
});

// USER PAGE: Track Delivery
window.trackDelivery = async function () {
  const code = document.getElementById("codeInput").value.trim();
  const ref = doc(db, "deliveries", code);
  const snap = await getDoc(ref);
  const resultDiv = document.getElementById("result");

  if (snap.exists()) {
    const data = snap.data();
    resultDiv.innerHTML = `
      <h3>Delivery Details</h3>
      <p><b>Name:</b> ${data.user}</p>
      <p><b>Address:</b> ${data.address}</p>
      <p><b>Quantity:</b> ${data.quantity}</p>
      <p><b>Billing:</b> ₹${data.billingValue}</p>
      <p><b>Type:</b> Prepaid</p>
      <p><b>ETA:</b> ${data.eta}</p>
      <p><b>Status:</b> ${data.status}</p>
    `;
  } else {
    resultDiv.innerHTML = `<p style="color:red;">No delivery found for ${code}</p>`;
  }
};

// ADMIN PAGE: Update Delivery
window.updateDelivery = async function () {
  const code = document.getElementById("code").value.trim();
  await setDoc(doc(db, "deliveries", code), {
    user: document.getElementById("user").value,
    address: document.getElementById("address").value,
    quantity: Number(document.getElementById("quantity").value),
    billingValue: Number(document.getElementById("billing").value),
    type: "Prepaid",
    eta: document.getElementById("eta").value,
    status: document.getElementById("status").value
  });
  alert("Delivery updated!");
};
