const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');

const gravidade = 0.5;
const numColunas = 3; 
const numLinhas = 2;  
const frameWidth = 120; 
const frameHeight = 40; 
let frameAtual = 0;
let linhaAtual = 0;
let contadorFrame = 6;
const velocidadeAnimacao = 8; 
let gameOver = false;

const personagemSprite = new Image();
personagemSprite.src = 'Personagem.png';  

const imagemFundo = new Image();
imagemFundo.src = 'FUNDO.png';  

// Imagem do Game Over
const gameOverImage = new Image();
gameOverImage.src = 'gameover.png'; // Substitua com o caminho correto da imagem

personagemSprite.onload = imagemFundo.onload = gameOverImage.onload = () => {
    console.log("Imagens carregadas!");
    loop();  
};

if (personagemSprite.complete && imagemFundo.complete && gameOverImage.complete) {
    console.log("Imagens carregadas previamente!");
    loop();
}

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && personagem.pulando === false && !gameOver) {
        personagem.velocidadey = 16;
        personagem.pulando = true;
    }
});

document.addEventListener('click', (e) => {
    if(gameOver) {
        location.reload(); // Corrigir a forma de recarregar a página
    }
});

// Definindo o personagem e a hitbox
const personagem = {
    x: 100,  
    y: canvas.height - 150,
    largura: 150,            
    altura: 60,             
    velocidadey: 0,          
    pulando: false,         
    
    // Hitbox personalizada para o personagem
    hitbox: {
        largura: 100, // Ajuste para corresponder ao corpo do personagem
        altura: 30, // Ajuste para corresponder à altura do corpo do personagem
        offsetY: 10, // Deslocamento para ajustar a posição vertical da hitbox
    },

    // Atualizando a posição da hitbox
    atualizarHitbox: function() {
        this.hitbox.x = this.x; // Atualiza a posição horizontal da hitbox
        this.hitbox.y = this.y + this.hitbox.offsetY; // Atualiza a posição vertical da hitbox com o deslocamento
    }
};

// Função para desenhar o personagem
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

// Função para atualizar o personagem (movimentação e pulo)
function atualizarPersonagem() {
    if (personagem.pulando) {
        personagem.velocidadey -= gravidade;
        personagem.y -= personagem.velocidadey;

        // Atualizando a hitbox conforme o movimento vertical
        personagem.atualizarHitbox();

        if (personagem.y >= canvas.height - 150) {
            personagem.velocidadey = 0;
            personagem.pulando = false;
            personagem.y = canvas.height - 150;
            personagem.atualizarHitbox(); // Garantir que a hitbox seja atualizada no chão
        }
    }

    // Atualizando a hitbox conforme o movimento horizontal
    personagem.atualizarHitbox();
}

// Definindo o obstáculo
const obstaculo = {
    x: canvas.width - 50,
    y: canvas.height - 194,
    largura: 50,
    altura: 100,
    velocidadex: 4
};

// Função para desenhar o obstáculo
function desenharObstaculo() {
    ctx.fillStyle = 'red';
    ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
}

// Função para atualizar o obstáculo (movimento)
function atualizarObstaculo() {
    obstaculo.x -= obstaculo.velocidadex;
    if (obstaculo.x <= 0 - obstaculo.largura) {
        obstaculo.x = canvas.width;
        obstaculo.velocidadex += 0.2;
        let nova_altura = (Math.random() * 50) + 100;
        obstaculo.altura = nova_altura;
        obstaculo.y = 307 - nova_altura;
    }
}

// Função que define quando ocorre uma colisão
function houveColisao() {
    personagem.velocidadey = 0;
    obstaculo.velocidadex = 0;
    gameOver = true;
}

// Função para verificar a colisão entre o personagem e o obstáculo
function verificarColisao() {
    if (
        personagem.hitbox.x < obstaculo.x + obstaculo.largura &&
        personagem.hitbox.x + personagem.hitbox.largura > obstaculo.x &&
        personagem.hitbox.y < obstaculo.y + obstaculo.altura &&
        personagem.hitbox.y + personagem.hitbox.altura > obstaculo.y
    ) {
        houveColisao();
    }
}

// Função principal do loop do jogo
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        desenharPersonagem();
        atualizarPersonagem(); 
        desenharObstaculo();
        atualizarObstaculo();
        verificarColisao();
        requestAnimationFrame(loop); 
    } else {
        // Quando o jogo terminar, desenha a imagem de Game Over
        ctx.drawImage(gameOverImage, (canvas.width / 2) - (gameOverImage.width / 2), (canvas.height / 2) - (gameOverImage.height / 2));
    }
}
