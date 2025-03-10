class veículo {
    constructor(tipo, marca, cor, velocidade, passageiros) {
        this.tipo = tipo,
        this.marca = marca,
        this.cor = cor,
        this.velocidade = velocidade,
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
const carro = new veículo(
    "SUV",
    "Chevrolet",
    "Prata",
    0,
    0
)
const carro2 = new veículo(
    'sedan',
    'fiat',
    'preto',
    0,
    0
)
console.log(carro)
carro.acelerar()
carro.acelerar()
carro2.acelerar()
carro2.frear()
carro.frear()