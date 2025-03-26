class Notificacao{
    enviarNotif(mensagem){
        console.log(mensagem)
    }
}
class NotificacaoSMS extends Notificacao{
    enviarNotif(mensagem){
        console.log(`mensagem via SMS ${mensagem}`)
    }
}
class NotificacaoEMAIL extends Notificacao{
    enviarNotif(mensagem){
        console.log(`mensagem via EMAIL ${mensagem}`)
    }
}
class FactoryNotificacao{
    static criarNotificacao(tipo){
        switch (tipo){
            case 'sms':
                return new NotificacaoSMS()
            case 'email':
                return new NotificacaoEMAIL()
            default:
                throw new Error("tipo desconhecido");
        }
    }
}
const notif = FactoryNotificacao.criarNotificacao('email').enviarNotif('Aqui vai')