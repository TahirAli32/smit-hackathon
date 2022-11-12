import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js"
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { getFirestore, collection, query, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { ref, uploadBytesResumable, getDownloadURL, getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"

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
const db = getFirestore(app)

let loginForm = document.getElementById('loginForm')
let logout = document.getElementById('logout')
let createClassForm = document.getElementById('createClassForm')
let createUserForm = document.getElementById('createUserForm')
// let loginForm = document.getElementById('loginForm')

window.addEventListener('load', onAuthStateChanged(auth, (user) => {
    if (user) {
        // console.log(user)
        if (window.location.pathname === "/login.html") {
            window.location = '/'
        }
        else if (window.location.pathname === "/") {
            return
        }
    }
    else{
        if (window.location.pathname === "/") {
            window.location = '/login.html'
        }
        else if (window.location.pathname === "/login.html") {
            return
        }
    }
}))

loginForm?.addEventListener('click', async () => {
    let email = document.getElementById('email')
    let password = document.getElementById('password')

    if(!email.value.match(/([^\s])/) || !password.value.match(/([^\s])/))
        return
    try {
        const user = await signInWithEmailAndPassword(auth, email.value, password.value)
        console.log(user.user)
        window.location = "/"
      } catch (error) {
        console.log(error)
      }
    email.value = ""
    password.value = ""
})

logout.addEventListener('click', async () => {
    await signOut(auth)
    window.location = "/login.html"
})

createClassForm?.addEventListener('click', async () => {
    let classTiming = document.getElementById('classTiming')
    let classSchedule = document.getElementById('classSchedule')
    let classTeacher = document.getElementById('classTeacher')
    let section = document.getElementById('section')
    let courseName = document.getElementById('courseName')
    let batchNo = document.getElementById('batchNo')

    if(!classTiming.value.match(/([^\s])/) || !classSchedule.value.match(/([^\s])/) || !classTeacher.value.match(/([^\s])/) || !section.value.match(/([^\s])/) || !courseName.value.match(/([^\s])/) || !batchNo.value.match(/([^\s])/) ){
        return
    }

    await addDoc(collection(db, "classes"),{
        classTiming: classTiming.value,
        classSchedule: classSchedule.value,
        classTeacher: classTeacher.value,
        section: section.value,
        courseName: courseName.value,
        batchNo: batchNo.value,
    })

    classTiming = ""
    classSchedule = ""
    classTeacher = ""
    section = ""
    courseName = ""
    batchNo = ""

    console.log('class created')
})

const fetchData = async (data) => {
    const q = query(collection(db, data))
    let arr = []
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach(doc => {
        arr.push(doc.data())
    })
    return arr
}

const uploadFiles = (file) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage()
        const storageRef = ref(storage, `users/${Math.random()}.png`)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
            "state_changed",
            (snapshot) => {
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                })
            }
        )
    })
}

createUserForm?.addEventListener('click', async () => {
    let stdName = document.getElementById('stdName')
    let fName = document.getElementById('fName')
    let rollNo = document.getElementById('rollNo')
    let contactNo = document.getElementById('contactNo')
    let cnic = document.getElementById('cnic')
    let stdCourse = document.getElementById('stdCourse')
    let profilePic = document.getElementById('profilePic')

    const picUrl = await uploadFiles(profilePic.files[0])

    if(!stdName.value.match(/([^\s])/) || !fName.value.match(/([^\s])/) || !rollNo.value.match(/([^\s])/) || !contactNo.value.match(/([^\s])/) || !cnic.value.match(/([^\s])/) || !stdCourse.value.match(/([^\s])/) ){
        return
    }

    await addDoc(collection(db, "users"),{
        stdName: stdName.value,
        fName: fName.value,
        rollNo: rollNo.value,
        contactNo: contactNo.value,
        cnic: cnic.value,
        stdCourse: stdCourse.value,
        profilePic: picUrl
    })
    console.log('user created')
    stdName = ""
    fName = ""
    rollNo = ""
    contactNo = ""
    cnic = ""
    stdCourse = ""
})


let createClassTab = document.getElementById('createClassTab')
let createUserTab = document.getElementById('createUserTab')
let manageAttendanceTab = document.getElementById('manageAttendanceTab')
let viewStudentsTab = document.getElementById('viewStudentsTab')
let viewClassesTab = document.getElementById('viewClassesTab')

function changeDisplay (showDiv){
    let arr = ['createClass', 'createUser', 'manageAttendance', 'viewStudents', 'viewClasses']
    for(const eachDiv of arr){
        if(eachDiv === showDiv){
            document.getElementById(showDiv).style.display = "flex"
        }
        else{
            document.getElementById(eachDiv).style.display = "none"
        }
    }
}

createClassTab?.addEventListener('click', () => changeDisplay('createClass'))

createUserTab?.addEventListener('click', async () => {
    changeDisplay('createUser')
    let allClasses = await fetchData("classes")
    let stdCourse = document.getElementById('stdCourse')
    let str = ""
    allClasses.forEach((e)=>{
        str += `<option value="${e.courseName} by ${e.classTeacher}">${e.courseName} by ${e.classTeacher}</option>`
    })
    stdCourse.innerHTML = str
})

manageAttendanceTab?.addEventListener('click', () => changeDisplay('manageAttendance'))

viewStudentsTab?.addEventListener('click', async () => {
    changeDisplay('viewStudents')
    let table = document.getElementById('user-table')
    let allUsers = await fetchData("users")
    allUsers.forEach((e)=>{
        table.innerHTML += `
            <tr>
                <td>${e.stdName}</td>
                <td>${e.fName}</td>
                <td>${e.rollNo}</td>
                <td>${e.contactNo}</td>
                <td>${e.stdCourse}</td>
                <td>${e.cnic}</td>
            </tr>
        `
    })
})

viewClassesTab?.addEventListener('click', async () => {
    changeDisplay('viewClasses')
    let table = document.getElementById('class-table')
    let allClasses = await fetchData("classes")
    // console.log(allClasses);
    allClasses.forEach((e)=>{
        table.innerHTML += `
            <tr>
                <td>${e.courseName}</td>
                <td>${e.classTeacher}</td>
                <td>${e.classTiming}</td>
                <td>${e.batchNo}</td>
                <td>${e.classSchedule}</td>
                <td>${e.section}</td>
            </tr>
        `
    })
})