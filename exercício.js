class Veículo {
    #velocidade
    constructor(tipo, marca, cor, velocidade, passageiros) {
        this.tipo = tipo,
        this.marca = marca,
        this.cor = cor,
        this.#velocidade = velocidade,
        this.passageiros = passageiros
    }
    acelerar = function (){
        this.velocidade += 10
        console.log(this.velocidade)
    }
    frear = function (){
        if (this.velocidade > 0){
            this.velocidade -= 5
            console.log(this.velocidade)
            
        }else{
            console.log("o carro já esta parado")
        }
    }
}
const carro = new Veículo(
    "SUV",
    "Chevrolet",
    "Prata",
    0,
    0
)
const carro2 = new Veículo(
    'sedan',
    'fiat',
    'preto',
    0,
    0
)

class Aviao extends Veículo{
    constructor(tipo, marca, cor, velocidade, passageiros, companhia){
        super(tipo, marca, cor, velocidade, passageiros);
        this.companhia = companhia

    }
}
class Barco extends Veículo{
    constructor(tipo, marca, cor, passageiros, noz){
        super(tipo, marca, cor, passageiros)
        this.noz = noz
    }
}
frearbarco = function(){
    if (this.noz > 0){
        this.noz -= 50
        console.log(this.noz)
        
    }else{
        console.log("o Barco já esta parado")
    }
}
acelerarBarco = function (){
    this.noz += 10
    console.log(this.noz)
}
const barco = new Barco('velejador', 'marca de barco', 2, 0)
acelerarBarco()