let arr1 = [1, 2, 3]
let arr2 = [4, 5, 6]

let fixtures = []

let totalLength = arr1.length + arr2.length

for (let i = 0; i < totalLength - 1; i++) {
    let thisWeek = []
    for (let j = 0; j < arr1.length; j++) {
        let fixture = [arr1[j], arr2[j]]
        thisWeek.push(fixture)
    }

    fixtures.push(thisWeek)

    let temp = arr1[arr1.length - 1]
    // for all except last 
    for (let x = arr1.length - 1; x > 1; x--) {
        console.log(x)
        console.log(x - 1)
        arr1[x] = arr1[x - 1]
    }
    // rotate first of arr2 to left
    arr1[1] = arr2[0]

    for (let x = 0; x < arr2.length - 1; x++) {
        arr2[x] = arr2[x + 1]
    }

    arr2[arr2.length - 1] = temp
}

console.log(fixtures)