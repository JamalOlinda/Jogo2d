class Loja {
    constructor (){
        this.assinantes = []
    }
    assinar(usuario){
        this.assinantes.push(usuario)
    }
    cancelarAssinatura(){

    }
    notificar(){
        this.assinantes.forEach(assinante => assinante.update(novaMSG))
    }
}
    class Pessoa {
        constructor(nome){
            this.nome = nome
        }
        update(novaMSG){
            console.log(`Notificado com ${novaMSG}`)
        }
    }
const loja = new Loja()
const pessoa = new Pessoa('ramon')
loja.assinar(pessoa)
loja.notificar('enviado a primeira notificação')