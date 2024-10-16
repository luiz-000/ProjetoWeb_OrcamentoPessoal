class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let x in this) {
            if (this[x] == '' || this[x] == undefined || this[x] == null) {
                return false
            }
        }
        return true
    }
}


class Bd {
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    guardarDespesa(despesa) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(despesa))

        localStorage.setItem('id', id)
    }

    recuperaTodosRegistrosDespesa(){

        let arrayDespesas = []

        let id = localStorage.getItem('id')

        for(let x = 1; x<=id; x++){
            let despesa = JSON.parse(localStorage.getItem(x))
            
            if(despesa === null){
                continue
            }

            despesa.id = x
            arrayDespesas.push(despesa)
        }

        return arrayDespesas
    }

    recuperaRegistroDespesaFiltrado(despesaEscolhida){
        
        let arrayDespesasFiltradas = []

        arrayDespesasFiltradas = this.recuperaTodosRegistrosDespesa()

        if(despesaEscolhida.ano != ''){
            arrayDespesasFiltradas = arrayDespesasFiltradas.filter(f => f.ano == despesaEscolhida.ano)
        }
        if(despesaEscolhida.mes != ''){
            arrayDespesasFiltradas = arrayDespesasFiltradas.filter(f => f.mes == despesaEscolhida.mes)
        }
        if(despesaEscolhida.dia != ''){
            arrayDespesasFiltradas = arrayDespesasFiltradas.filter(f => f.dia == despesaEscolhida.dia)
        }
        if(despesaEscolhida.tipo != ''){
            arrayDespesasFiltradas = arrayDespesasFiltradas.filter(f => f.tipo == despesaEscolhida.tipo)
        }
        if(despesaEscolhida.descricao != ''){
            arrayDespesasFiltradas = arrayDespesasFiltradas.filter(f => f.descricao == despesaEscolhida.descricao)
        }
        if(despesaEscolhida.valor != ''){
            arrayDespesasFiltradas = arrayDespesasFiltradas.filter(f => f.valor == despesaEscolhida.valor)
        }

        return arrayDespesasFiltradas
    }

    removerDespesa(idDespesa){

        localStorage.removeItem(idDespesa)
    }
}
let bd = new Bd()


function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    if (despesa.validarDados()) {
        bd.guardarDespesa(despesa)

        $('#feedbackRegistroDespesa').modal('show')
        $('#tituloModal').removeClass('text-danger').addClass('text-success')
        $('#modalLabel').text('Sucesso')
        $('#mensagemModal').text('Registro de despesa realizado com sucesso!')
        $('#botaoModal').removeClass('btn-danger').addClass('btn-success')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {

        $('#feedbackRegistroDespesa').modal('show')
        $('#tituloModal').removeClass('text-success').addClass('text-danger')
        $('#modalLabel').text('Erro')
        $('#mensagemModal').text('Existem campos que não foram preenchidos!')
        $('#botaoModal').removeClass('btn-success').addClass('btn-danger')
    }
}


function listarDespesas(){
    let despesas = []

    despesas = bd.recuperaTodosRegistrosDespesa()

    mostrarDespesasNaTabela(despesas)
}


function filtrarDespesas(){

    let despesaFiltrada = []

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesaEscolhida = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)

    despesaFiltrada = bd.recuperaRegistroDespesaFiltrado(despesaEscolhida)

    mostrarDespesasNaTabela(despesaFiltrada)
}


function mostrarDespesasNaTabela(despesa){

    let corpoTabelaDespesas = document.getElementById('corpoTabelaDespesas')

    corpoTabelaDespesas.innerHTML = ''

    for(let x = 0; x<despesa.length; x++){
        
        let linhas = corpoTabelaDespesas.insertRow()

        linhas.insertCell(0).innerHTML = `${despesa[x].dia}/${despesa[x].mes}/${despesa[x].ano}`

        switch(despesa[x].tipo){
            case '1':
                despesa[x].tipo = 'Supermercado'
                break
            case '2':
                despesa[x].tipo = 'Internet'
                break
            case '3':
                despesa[x].tipo = 'Lazer'
                break
            case '4':
                despesa[x].tipo = 'Água'
                break
            case '5':
                despesa[x].tipo = 'Luz'
                break
            case '6':
                despesa[x].tipo = 'Gás'
                break
        }
        linhas.insertCell(1).innerHTML = despesa[x].tipo

        linhas.insertCell(2).innerHTML = despesa[x].descricao
        linhas.insertCell(3).innerHTML = despesa[x].valor

        let botao = document.createElement('button')
        botao.className = 'btn - btn-danger'
        botao.innerHTML = '<i class="fas fa-trash"> </i>'
        
        
        botao.id = `idBotaoDaDespesa${despesa[x].id}`
        botao.id = botao.id.slice(-1)


        botao.onclick = function(){

            bd.removerDespesa(this.id)

            $('#feedbackExclusaoDespesa').modal('show')
            $('#tituloModal').addClass('text-success')
            $('#modalLabel').text('Sucesso')
            $('#mensagemModal').text('Exclusão de reserva realizado com sucesso!')
            $('#botaoModal').addClass('btn-success')

            $('#feedbackExclusaoDespesa').on('hidden.bs.modal', function () {
                window.location.reload();
            });
        }

        linhas.insertCell(4).append(botao)
    }
}