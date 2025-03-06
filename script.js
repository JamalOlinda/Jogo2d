const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');

const gravidade = 0.5;
const numColunas = 3; 
const numLinhas = 2;  
const frameWidth = 120; // Largura de cada frame (600px / 3)
const frameHeight = 40; // Altura de cada frame (160px / 2)
let frameAtual = 0;
let linhaAtual = 0;
let contadorFrame = 0;
const velocidadeAnimacao = 8; // Velocidade da troca de frames

// Carregar a imagem diretamente no JavaScript
const personagemSprite = new Image();
personagemSprite.src = '__Run-ezgif.com-gif-to-sprite-converter.png';  // Caminho correto da imagem

const imagemFundo = new Image();
imagemFundo.src = 'FUNDO.png';  // Caminho correto da imagem de fundo

// Verificar se a imagem foi carregada corretamente
personagemSprite.onload = imagemFundo.onload = () => {
    console.log("Imagens carregadas!");
    loop();  // Inicia o loop de animação assim que as imagens estiverem carregadas
};

// Caso as imagens já estejam carregadas (caso o onload seja chamado rapidamente)
if (personagemSprite.complete && imagemFundo.complete) {
    console.log("Imagens carregadas previamente!");
    loop();
}

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && personagem.pulando === false) {
        personagem.velocidadey = 15;
        personagem.pulando = true;
    }
});

const personagem = {
    x: 100,  // Posição fixa no eixo X
    y: canvas.height - 150,  // Posição no eixo Y
    largura: 150,            // Largura do personagem
    altura: 60,              // Altura do personagem
    velocidadey: 0,          // Velocidade do personagem no eixo Y
    pulando: false           // Estado de pulo
};

function desenharPersonagem() {
    let sx = frameAtual * frameWidth;
    let sy = linhaAtual * frameHeight;

    // Desenhando a imagem no canvas
    ctx.drawImage(
        personagemSprite,
        sx, sy,
        frameWidth, frameHeight,
        personagem.x, personagem.y,
        personagem.largura, personagem.altura
    );

    contadorFrame++;
    if (contadorFrame >= velocidadeAnimacao) {
        frameAtual = (frameAtual + 10) % numColunas;  // Troca de frame por coluna
        contadorFrame = 0;

        // Altere a linha da animação de acordo com o frame atual
        if (frameAtual === 0) {
            linhaAtual = (linhaAtual + 1) % numLinhas;
        }
    }
}

function atualizarPersonagem() {
    // Verifica o pulo, mas o personagem não se move horizontalmente
    if (personagem.pulando) {
        personagem.velocidadey -= gravidade;
        personagem.y -= personagem.velocidadey;

        if (personagem.y >= canvas.height - personagem.altura) {
            personagem.velocidadey = 0;
            personagem.pulando = false;
            personagem.y = canvas.height - personagem.altura;
        }
    }
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela

    // Desenha a imagem de fundo
    ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);

    desenharPersonagem();  // Desenha o personagem no canvas
    atualizarPersonagem(); // Atualiza o estado do personagem (pulo, etc)
    requestAnimationFrame(loop); // Repite o loop
}