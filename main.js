'use strict'

const abrirModal = () => document.getElementById('modal').classList.add('active')
const abrirModal2 = () => document.getElementById('modal2').classList.add('active')

const fecharModal2 = () => {
    document.getElementById('modal2').classList.remove('active')
}

const fecharModal = () => {
    limparCampos()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

// CRUD - create read update delete
    const deletarAluno = (index) => {
    const dbClient = verAluno()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

const atualizarAluno = (index, client) => {
    const dbClient = verAluno()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

const verAluno = () => getLocalStorage()

const limparAluno = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push (client)
    setLocalStorage(dbClient)
}

const validarCampos = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const limparCampos = () => {
    const campos = document.querySelectorAll('.modal-field')
    campos.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const salvarAluno = () => {
    debugger
    if (validarCampos()) {
        const aluno = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            limparAluno(aluno)
            updateTable()
            fecharModal()
        } else {
            atualizarAluno(index, aluno)
            updateTable()
            fecharModal()
        }
    }
}

const createRow = (aluno, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${aluno.nome}</td>
        <td>${aluno.email}</td>
        <td>${aluno.celular}</td>
        <td>${aluno.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = verAluno()
    clearTable()
    dbClient.forEach(createRow)
}

const preencherCampos = (aluno) => {
    document.getElementById('nome').value = aluno.nome
    document.getElementById('email').value = aluno.email
    document.getElementById('celular').value = aluno.celular
    document.getElementById('cidade').value = aluno.cidade
    document.getElementById('nome').dataset.index = aluno.index
}

const editarAluno = (index) => {
    const aluno = verAluno()[index]
    aluno.index = index
    preencherCampos(aluno)
    abrirModal()
}

const editarDeletar = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editarAluno(index)
        } else {
            const aluno = verAluno()[index]
            let avisoDelete = document.querySelector('#avisoDelete')

            avisoDelete.textContent = `Deseja realmente excluir o aluno ${aluno.nome}?`
            abrirModal2()

        // APAGAR O REGISTRO
            document.getElementById('apagar').addEventListener('click', () => {
               deletarAluno(index)
                updateTable()
                fecharModal2()
            })
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarAluno')
    .addEventListener('click', abrirModal)

document.getElementById('modalClose')
    .addEventListener('click', fecharModal)

// modal apagar
document.getElementById('modalClose2')
    .addEventListener('click', fecharModal2)

document.getElementById('salvar')
    .addEventListener('click', salvarAluno)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editarDeletar)

document.getElementById('cancelar')
    .addEventListener('click', fecharModal)

// modal apagar
document.getElementById('cancelar2')
    .addEventListener('click', fecharModal2)
