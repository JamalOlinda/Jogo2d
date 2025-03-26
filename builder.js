class Hamburguer{
    constructor(pao, carne, queijo, salada, molho){
        this.pao = pao
        this.carne = carne
        this.queijo = queijo
        this.salada = salada
        this.molho = molho
    }
getDescricao(){
    return `Hamburguer com pao ${this.pao}, carne ${this.carne}, queijo ${this.queijo}, ${this.salada? 'com salada' : 'sem salada'}, molho ${this.molho}`


}
}


const burguer = new Hamburguer ('brioche', 'costela', 'mussarela', true, 'maionese caseira')
console.log(burguer.getDescricao())

class HamburguerBuilder{
    constructor(){
        this.pao = 'rosetta'
        this.carne = 'picanha'
        this.queijo = 'prato'
        this.salada = true
        this.molho = 'mostarda'
    }
    setPao(pao){
        this.pao = pao;
        return this;
    }
    setCarne(carne){
        this.carne = carne;
        return this;
    }
    setQueijo(queijo){
        this.queijo = queijo;
        return this;
    }
    setMolho(molho){
        this.molho = molho;
        return this;
    }
    addSalada(){
        this.salada = !this.salada
        return this;
    }
}
const burguer2 = new HamburguerBuilder()
burguer2.setPao('brioche')
