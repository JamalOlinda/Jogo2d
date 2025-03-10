const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');

const gravidade = 0.5;
const numColunas = 3; 
const numLinhas = 2;  
const frameWidth = 120; 
const frameHeight = 40; 
let frameAtual = 0;
let linhaAtual = 0;
let contadorFrame = 0;
const velocidadeAnimacao = 8; 
let gameOver = false

const personagemSprite = new Image();
personagemSprite.src = 'Personagem.png';  

const imagemFundo = new Image();
imagemFundo.src = 'FUNDO.png';  


personagemSprite.onload = imagemFundo.onload = () => {
    console.log("Imagens carregadas!");
    loop();  
};


if (personagemSprite.complete && imagemFundo.complete) {
    console.log("Imagens carregadas previamente!");
    loop();
}

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && personagem.pulando === false) {
        personagem.velocidadey = 15;
        personagem.pulando = true;
    }
})
document.addEventListener('click', (e) => {
    if(gameOver == true){
        location.reload
    }
})

const personagem = {
    x: 100,  
    y: canvas.height - 150,
    largura: 150,            
    altura: 60,             
    velocidadey: 0,          
    pulando: false         
};

function desenharPersonagem() {
    let sx = frameAtual * frameWidth;
    let sy = linhaAtual * frameHeight;

    
    ctx.drawImage(
        personagemSprite,
        sx, sy,
        frameWidth, frameHeight,
        personagem.x, personagem.y,
        personagem.largura, personagem.altura
    );

    contadorFrame++;
    if (contadorFrame >= velocidadeAnimacao) {
        frameAtual = (frameAtual + 10) % numColunas;  
        contadorFrame = 0;

        
        if (frameAtual === 0) {
            linhaAtual = (linhaAtual + 1) % numLinhas;
        }
    }
}

function atualizarPersonagem() {
    if (personagem.pulando) {
        personagem.velocidadey -= gravidade;
        personagem.y -= personagem.velocidadey;

        if (personagem.y >= canvas.height - 150) {
            personagem.velocidadey = 0;
            personagem.pulando = false;
            personagem.y = canvas.height - 150;
        }
    }
}

const obstaculo = {
    x:canvas.width-50,
    y:canvas.height-194,
    largura:50,
    altura:100,
    velocidadex:3
}

function desenharObstaculo (){
    ctx.fillStyle= 'red'
    ctx.fillRect(obstaculo.x,obstaculo.y,obstaculo.largura,obstaculo.altura)
}

function atualizarObstaculo (){
    obstaculo.x -= obstaculo.velocidadex
    if(obstaculo.x <= 0 - obstaculo.largura){
        obstaculo.x = canvas.width
        obstaculo.velocidadex += 0.2
        let nova_altura = (Math.random() * 50) + 100
        obstaculo.altura = nova_altura
        obstaculo.y = 307 - nova_altura
    }
}
function houveColisao(){
    personagem.velocidadey = 0
    obstaculo.velocidadex = 0
    ctx.fillStyle = 'red'
    ctx.fillRect((canvas.width/2)-200,(canvas.height/2)-50,400,100)
    gameOver = true
    
}
function verificarColisao(){
    if(
        personagem.x < obstaculo.x + obstaculo.largura &&
        personagem.x + personagem.largura > obstaculo.x &&
        personagem.y < obstaculo.y + obstaculo.altura &&
        personagem.y + personagem.altura > obstaculo.y
    ){
        houveColisao()
    }
}


function loop() {
    if (gameOver == false) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);

    desenharPersonagem();
    atualizarPersonagem(); 
    desenharObstaculo();
    atualizarObstaculo();
    verificarColisao();
    requestAnimationFrame(loop); 
}
}