document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = "http://localhost:3000/monsters"
    const createMonsterDiv = document.getElementById('create-monster')
    const monsterContainer = document.getElementById('monster-container')
    const forwardButton = document.getElementById('forward')
    const backButton = document.getElementById('back')

    let currentPage = 1
    let allMonsters = []

    function createMonsterForm() {
        createMonsterDiv.innerHTML = `
            <form id='monster-form'>
                <input id="name" placeholder="name..." required />
                <input id="age" type="number" placeholder="age..." required />
                <input id="description" placeholder="description..." required />
                <button type="submit">Create</button>
            </form>
        `
        document.getElementById('monster-form').addEventListener('submit', createMonster)
    }

    function fetchAllMonsters(){
        fetch(apiUrl)
            .then((response) => response.ok ? response.json() : Promise.reject('Failed to fetch monsters'))
            .then((monsters) => {
                allMonsters = monsters
                displayMonsters(currentPage)
            })
            .catch((error) => console.error('Error fetching monsters:', error))
    }

    function displayMonsters(page) {
        const startIndex = (page - 1) * 50
        const endIndex = page * 50
        const monstersToDisplay = allMonsters.slice(startIndex, endIndex)
        monsterContainer.innerHTML = ''

        monstersToDisplay.forEach((monster) => {
            const monsterDiv = document.createElement('div')
            monsterDiv.className = 'monster'
            monsterDiv.innerHTML = `
                    <h2>${monster.name}</h2>
                    <p><strong>Age: ${monster.age}</strong></p>
                    <p>Bio: ${monster.description}</p>
            `
            monsterContainer.appendChild(monsterDiv)
        })
    }

    function loadNextPage() {
        if (currentPage * 50 < allMonsters.length) {
            currentPage++
            displayMonsters(currentPage)
        }
    }

    function loadPreviousPage() {
        if (currentPage > 1) {
            currentPage--
            displayMonsters(currentPage)
        }
    }

    function createMonster(e) {
        e.preventDefault()
        const newMonster = {
            name: document.getElementById('name').value,
            age: document.getElementById('age').value,
            description: document.getElementById('description').value,
        }

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newMonster)
        })
            .then((response) => response.ok ? response.json() : Promise.reject('Failed to create monsters'))
            .then((createdMonster) => {
                allMonsters.push(createdMonster)
                if (allMonsters.length <= currentPage * 50) {
                    displayMonsters(currentPage)
                }
                document.getElementById('monster-form').reset()
            })
            .catch((error) => console.error('Error creating monster:', error))
    }

    backButton.addEventListener("click", loadPreviousPage)
    forwardButton.addEventListener("click", loadNextPage)

    createMonsterForm()
    fetchAllMonsters()
})