const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');

let gameOver = false;
const gravidade = 0.5;
const numColunas = 10;  // Supondo que o spritesheet tenha 10 frames
const numLinhas = 2;  
const frameWidth = 120; 
const frameHeight = 40; 
let frameAtual = 0;
let linhaAtual = 0;
let contadorFrame = 5;  // Inicializamos com 0 para o contador de quadros
const velocidadeAnimacao = 10;  // Quanto maior, mais lento será a animação

const personagemSprite = new Image();
personagemSprite.src = 'JOGO2DV1/Personagem.png';  

const imagemFundo = new Image();
imagemFundo.src = 'JOGO2DV1/FUNDO.png';  

// Imagem do Game Over
const gameOverImage = new Image();
gameOverImage.src = 'gameover.png'; // Substitua com o caminho correto da imagem

// Função que roda o loop do jogo
personagemSprite.onload = imagemFundo.onload = gameOverImage.onload = () => {
    console.log("Imagens carregadas!");
    loop();  
};

// Definindo a classe base para as entidades
class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
}

// Classe do Personagem
class Personagem extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura);
        this.velocidadey = 0;
        this.pulando = false;

        this.hitbox = {
            largura: 100,
            altura: 30,
            offsetY: 10,
        };
    }

    // Atualiza a posição da hitbox do personagem
    atualizarHitbox() {
        this.hitbox.x = this.x;
        this.hitbox.y = this.y + this.hitbox.offsetY;
    }

    // Desenha o personagem
    desenhar(ctx) {
        let sx = frameAtual * frameWidth;
        let sy = linhaAtual * frameHeight;

        ctx.drawImage(
            personagemSprite,
            sx, sy,
            frameWidth, frameHeight,
            this.x, this.y,
            this.largura, this.altura
        );

        contadorFrame++;
        if (contadorFrame >= velocidadeAnimacao) {
            frameAtual = (frameAtual + 1) % numColunas;
            contadorFrame = 0;
            
            if (frameAtual === 5) {
                linhaAtual = (linhaAtual + 1) % numLinhas;
            }
        }
    }

    // Atualiza a posição do personagem
    atualizar() {
        if (this.pulando) {
            this.velocidadey -= gravidade;
            this.y -= this.velocidadey;

            this.atualizarHitbox();

            if (this.y >= canvas.height - 150) {
                this.velocidadey = 0;
                this.pulando = false;
                this.y = canvas.height - 150;
                this.atualizarHitbox();
            }
        }

        this.atualizarHitbox();
    }
}

// Classe do Obstáculo
class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, velocidadex) {
        super(x, y, largura, altura);
        this.velocidadex = velocidadex;
    }

    // Desenha o obstáculo
    desenhar(ctx) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.altura); 
        ctx.lineTo(this.x + this.largura / 2, this.y); 
        ctx.lineTo(this.x + this.largura, this.y + this.altura); 
        ctx.closePath();
        ctx.fill();
    }

    // Atualiza a posição do obstáculo
    atualizar() {
        this.x -= this.velocidadex;
        if (this.x <= 0 - this.largura) {
            this.x = canvas.width;
            this.velocidadex += 0.2;
            let nova_altura = (Math.random() * 50) + 100;
            this.altura = nova_altura;
            this.y = canvas.height - 194 - nova_altura;
        }
    }
}

// Classe do Jogo
class Jogo {
    constructor() {
        this.personagem = new Personagem(100, canvas.height - 150, 150, 60);
        this.obstaculo = new Obstaculo(canvas.width - 50, canvas.height - 194, 50, 100, 4);
        this.gameOver = false;
    }

    // Verifica colisão entre o personagem e o obstáculo
    verificarColisao() {
        if (
            this.personagem.hitbox.x < this.obstaculo.x + this.obstaculo.largura &&
            this.personagem.hitbox.x + this.personagem.hitbox.largura > this.obstaculo.x &&
            this.personagem.hitbox.y < this.obstaculo.y + this.obstaculo.altura &&
            this.personagem.hitbox.y + this.personagem.hitbox.altura > this.obstaculo.y
        ) {
            this.houveColisao();
        }
    }

    // Função que define o que acontece quando ocorre uma colisão
    houveColisao() {
        this.gameOver = true;
    }

    // Função principal do loop do jogo
    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);

        if (!this.gameOver) {
            this.personagem.desenhar(ctx);
            this.personagem.atualizar();
            this.obstaculo.desenhar(ctx);
            this.obstaculo.atualizar();
            this.verificarColisao();
            requestAnimationFrame(() => this.loop());
        } else {
            ctx.drawImage(gameOverImage, (canvas.width / 2) - (gameOverImage.width / 2), (canvas.height / 2) - (gameOverImage.height / 2));
        }
    }
}

// Instanciando o jogo e iniciando o loop
const jogo = new Jogo();

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !jogo.personagem.pulando && !jogo.gameOver) {
        jogo.personagem.velocidadey = 16;
        jogo.personagem.pulando = true;
    }
});

document.addEventListener('click', (e) => {
    if (jogo.gameOver) {
        location.reload(); // Corrigir a forma de recarregar a página
    }
});

jogo.loop();
