const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();

async function seedUsers() {
    let testUsers = [
        {
            name: 'liam maguire',
            email: 'liam.maguire@email.com'
        },
        {
            name: 'test user one',
            email: 'testonee@email.com'
        },
        {
            name: 'test two',
            email: 'testtwo@email.com'
        },
        {
            name: 'test three',
            email: 'liam.maguire@email.com'
        },
        {
            name: 'test four',
            email: 'liam.maguire@email.com'
        },
    ]

    for (t in testUsers) {
        let res = await db.collection('users').add(testUsers[t]);
    }
}

async function getUsers() {
    const usersRef = db.collection('users');
    let out = []
    let snapshot = await usersRef.get();
    snapshot.forEach(doc => {
        obj = doc.data()
        obj.id = doc.id
        out.push(obj)
    });
    return out;
}

async function run() {
    let users = []
    users = await getUsers()
    if (users.length == 0) {
        await seedUsers();
        users = await getUsers();
    }
    makeCoffeeCatchups(users)
}

async function makeCoffeeCatchups(users) {

    if ((users.length % 2) != 0){
        users.push({id: "Bad luck you miss out this week"})
    }

    coffeeCatchUps = []
    for (u in users) {
        catchUp = await createCatchUp(coffeeCatchUps, users, users[u])

        if (catchUp != null) {
            coffeeCatchUps.push(catchUp)
        }
    }
    console.log(coffeeCatchUps.length)
    for (c in coffeeCatchUps) {
        console.log(coffeeCatchUps[c])
        let res = await db.collection('catchups').add(coffeeCatchUps[c]);
    }
}

async function createCatchUp(catchups, arr, user) {
    if (checkIfAlreadyInArray(catchups, user.id)) {
        console.log("null")
        return null
    }
    let matched = false

    while (!matched) {
        let partner = arr[Math.floor(Math.random() * arr.length)];
        if (partner.id === user.id) {
            continue;
        }
        if (checkIfAlreadyInArray(catchups, partner.id)) {
            continue;
        }
        if (await existCheck(user.id, partner.id)) {
            continue
        }

        console.log(catchups.length)
        matched = true
        return { userA: user.id, userB: partner.id }
    }
}

function checkIfAlreadyInArray(arr, id) {
    exists = false
    for (a in arr) {
        if (arr[a].userA === id || arr[a].userB === id) {
            return true
        }
    }
    return false
}

// TODO change data structure so this can be done in a single array
// TODO change code format
// Checks that the two users haven't already had a catchup through db queries
async function existCheck(userOne, userTwo) {
    let prev = []
    const firstCheck = await db.collection("catchups").where("userA", "==", userOne).where("userB", "==", userTwo).get()
    firstCheck.forEach(doc => {
        prev.push(doc.id)
    })

    if (prev.length > 0) {
        console.log(prev)
        return true
    }

    prev = []
    const secondCheck = await db.collection("catchups").where("userA", "==", userTwo).where("userB", "==", userOne).get()
    firstCheck.forEach(doc => {
        prev.push(doc.id)
    })

    if (prev.length > 0) {
        return true
    }
    return false;
}

run();
