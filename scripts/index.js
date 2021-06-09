let state = []
let container = document.querySelector('.files')

const setState = (newState) => {
    state = newState
}

const Log = (message) => {
    const consoleContainer = document.querySelector('.console')
    console.log(message)
    consoleContainer.textContent = message.toString()
}

const render = () => {
    Log(state)
    const ul = document.createElement('ul')

    container.innerHTML = ""

    state?.map((item, index) => {
        const li = document.createElement('li')
        li.innerHTML = `${item?.name} <span class="removeLink" onclick="remove(${index})">Remove</span>`
        ul.appendChild(li)
    })

    container.appendChild(ul)
}

const remove = (index) => {
    setState(Array.from(state).reduce((a, i, j) => j !== index ? a.concat(i) : a, []))
    render()
}

(() => {
    container = document.querySelector('.files')
    const form = document.getElementById('form')
    const files = document.getElementById('files')

    files.addEventListener('change', (e) => {
        Array.from(e?.target?.files).map(file => {
            setState([...state, file])
        })

        console.log(e?.target)

        try{
            e.target.value = '';
            if(e.target.value){
                e.target.type = "text";
                e.target.type = "file";
            }
        }catch(e){}

        render()
    })

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        try {
            const formData = new FormData()
            
            Array.from(state).map((item, index) => {
                formData.append(`image_${index}`, item)
            })

            await fetch('http://localhost:9000', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        } catch(e) {
            Log(`${e.message}: El servidor backend no responde`)
        }
    })
})()