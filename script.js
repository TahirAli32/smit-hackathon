import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js"
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.12.0/firebase-firestore.js"

const firebaseConfig = {
apiKey: "AIzaSyBvJMqE-KYPtI__B3pv_HfAcOR26TPWLIw",
authDomain: "hackathon-c856a.firebaseapp.com",
projectId: "hackathon-c856a",
storageBucket: "hackathon-c856a.appspot.com",
messagingSenderId: "552367272650",
appId: "1:552367272650:web:a61c92d9d1f1e19c0cfa33"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

let loginForm = document.getElementById('loginForm')


window.addEventListener('load', onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user)
        if (window.location.pathname === "/login.html") {
            window.location = '/'
        }
        else if (window.location.pathname === "/") {
            return
        }
    }
}))

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault()
    // console.log(e.target.elements[0].value)
    // console.log(e.target.elements[1].value)

    if(!e.target.elements[0].value.match(/([^\s])/) || !e.target.elements[1].value.match(/([^\s])/))
        return

    try {
        const user = await signInWithEmailAndPassword(auth, e.target.elements[0].value, e.target.elements[1].value)
        console.log(user.user)
      } catch (error) {
        console.log(error)
      }

    // e.target.elements[0].value = ""
    // e.target.elements[1].value = ""
})