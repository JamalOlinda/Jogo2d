const canvas = document.getElementById('jogo2d');
const ctx = canvas.getContext('2d');

let gameOver = false;
const gravidade = 0.5;
const numColunas = 10;
const numLinhas = 2;
const frameWidth = 120;
const frameHeight = 40;
let frameAtual = 0;
let linhaAtual = 0;
let contadorFrame = 5;
const velocidadeAnimacao = 10;

const ObstaculoSprite = new Image();
ObstaculoSprite.src = 'Inimigo.png'; // Mantendo a imagem do inimigo

const personagemSprite = new Image();
personagemSprite.src = '../JOGO2DV1/Personagem.png';

const imagemFundo = new Image();
imagemFundo.src = '../JOGO2DV1/FUNDO.png';

const gameOverImage = new Image();
gameOverImage.src = './gameover.png';

personagemSprite.onload = imagemFundo.onload = gameOverImage.onload = () => {
    console.log("Imagens carregadas!");
    loop();
};

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
}

class Personagem extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura);
        this.velocidadey = 0;
        this.pulando = false;
        this.viradoParaDireita = true; // Flag para indicar se o personagem está virado para a direita
    }

    // Atualizar a hitbox triangular do personagem (3 pontos)
    atualizarHitbox() {
        // Definir os 3 pontos do triângulo
        this.hitbox = {
            p1: { x: this.x + this.largura / 2, y: this.y }, // Ponto superior (vértice superior)
            p2: { x: this.x, y: this.y + this.altura }, // Ponto inferior esquerdo
            p3: { x: this.x + this.largura, y: this.y + this.altura } // Ponto inferior direito
        };
    }

    // Função para desenhar a hitbox triangular
    desenharHitbox(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.hitbox.p1.x, this.hitbox.p1.y);
        ctx.lineTo(this.hitbox.p2.x, this.hitbox.p2.y);
        ctx.lineTo(this.hitbox.p3.x, this.hitbox.p3.y);
        ctx.closePath();
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }

    desenhar(ctx) {
        let sx = frameAtual * frameWidth;
        let sy = linhaAtual * frameHeight;

        if (!this.viradoParaDireita) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                personagemSprite,
                sx, sy,
                frameWidth, frameHeight,
                -this.x - this.largura, this.y,
                this.largura, this.altura
            );
            ctx.restore();
        } else {
            ctx.drawImage(
                personagemSprite,
                sx, sy,
                frameWidth, frameHeight,
                this.x, this.y,
                this.largura, this.altura
            );
        }

        contadorFrame++;
        if (contadorFrame >= velocidadeAnimacao) {
            frameAtual = (frameAtual + 1) % numColunas;
            contadorFrame = 0;

            if (frameAtual === 5) {
                linhaAtual = (linhaAtual + 1) % numLinhas;
            }
        }
    }

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

    mover(direcao) {
        if (direcao === 'esquerda') {
            this.viradoParaDireita = false; // Virado para a esquerda
            this.x -= 5; // Movimenta o personagem para a esquerda
        } else if (direcao === 'direita') {
            this.viradoParaDireita = true; // Virado para a direita
            this.x += 5; // Movimenta o personagem para a direita
        }
    }
}

class Obstaculo extends Entidade {
    #time_to_next
    #proximo_obstaculo
    constructor(x, y, largura, altura, velocidadex) {
        super(x, y, largura, altura);
        this.velocidadex = velocidadex;
        this.#time_to_next =
        this.y = canvas.height - 80 - this.altura; // Mantém a posição Y fixa
        this.hitbox = {
            p1: { x: this.x + this.largura / 2, y: this.y }, // Ponto superior
            p2: { x: this.x, y: this.y + this.altura }, // Ponto inferior esquerdo
            p3: { x: this.x + this.largura, y: this.y + this.altura } // Ponto inferior direito
        };
    }

    desenhar(ctx) {
        ctx.drawImage(ObstaculoSprite, this.x, this.y, this.largura, this.altura);
    }

    atualizarHitbox() {
        // Atualiza a hitbox triangular do obstáculo (inimigo)
        this.hitbox = {
            p1: { x: this.x + this.largura / 2, y: this.y },
            p2: { x: this.x, y: this.y + this.altura },
            p3: { x: this.x + this.largura, y: this.y + this.altura }
        };
    }

    atualizar() {
        this.x -= this.velocidadex; // Move o inimigo para a esquerda

        // Se o inimigo atingir a borda da tela, inverte a direção
        if (this.x <= 0 - this.largura) {
            this.x = canvas.width;
            this.velocidadex += 0.2;

            let nova_altura = (Math.random() * 50) + 100;
            this.altura = nova_altura; // Aumenta a altura do inimigo

            // Mantém a posição Y fixa
            this.y = canvas.height - 80 - this.altura;
        }

        this.atualizarHitbox(); // Atualiza a hitbox com a nova posição
    }
}

// Função para verificar se dois triângulos colidem (usando o método de orientação de área)
function verificarColisaoTriangular(p1, p2, p3, p4, p5, p6) {
    const det1 = (p2.x - p1.x) * (p4.y - p1.y) - (p2.y - p1.y) * (p4.x - p1.x);
    const det2 = (p3.x - p2.x) * (p5.y - p2.y) - (p3.y - p2.y) * (p5.x - p2.x);
    const det3 = (p1.x - p3.x) * (p6.y - p3.y) - (p1.y - p3.y) * (p6.x - p3.x);

    return det1 * det2 >= 0 && det2 * det3 >= 0;
}

class Jogo {
    constructor() {
        this.personagem = new Personagem(100, canvas.height - 150, 150, 60);
        this.obstaculo = new Obstaculo(canvas.width - 50, canvas.height - 150, 50, 50, 4); // Inimigo quadrado
        this.gameOver = false;
        this.pontuacao = 0;
        this.obstaculosPassados = 0; // Contador de obstáculos passados
    }

    verificarColisao() {
        const p1 = this.personagem.hitbox.p1;
        const p2 = this.personagem.hitbox.p2;
        const p3 = this.personagem.hitbox.p3;
        const p4 = this.obstaculo.hitbox.p1;
        const p5 = this.obstaculo.hitbox.p2;
        const p6 = this.obstaculo.hitbox.p3;

        if (verificarColisaoTriangular(p1, p2, p3, p4, p5, p6)) {
            this.houveColisao();
        }
    }

    houveColisao() {
        this.gameOver = true;
    }

    // Atualiza a pontuação a cada quadro
    atualizarPontuacao() {
        if (this.obstaculo.x + this.obstaculo.largura < 10) {
            if (!this.obstaculo.passou) {
                this.obstaculosPassados++;
                this.pontuacao = this.obstaculosPassados * 10;
                this.obstaculo.passou = true;
            }
        } else {
            this.obstaculo.passou = false;
        }
    }

    desenharPontuacao() {
        ctx.font = '20px "Fonte"';
        ctx.fillStyle = 'black';
        ctx.fillText(`Almas: ${this.pontuacao}`, 10, 30);
    }

    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height);

        if (!this.gameOver) {
            this.personagem.desenhar(ctx);
            this.personagem.atualizar();
            this.obstaculo.desenhar(ctx);
            this.obstaculo.atualizar();
            this.verificarColisao();
            this.atualizarPontuacao();
            this.desenharPontuacao();
            requestAnimationFrame(() => this.loop());
        } else {
            ctx.drawImage(gameOverImage, (canvas.width / 2) - (gameOverImage.width / 2), (canvas.height / 2) - (gameOverImage.height / 2));
            ctx.fillStyle = 'black';
            ctx.font = '30px "Fonte"';
            ctx.fillText(`Almas perdidas: ${this.pontuacao}`, (canvas.width / 2) - 100, (canvas.height / 2) + 100);
        }
    }
}

const jogo = new Jogo();

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        jogo.personagem.mover('esquerda');
    } else if (e.code === 'ArrowRight') {
        jogo.personagem.mover('direita');
    }
});

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !jogo.personagem.pulando && !jogo.gameOver) {
        jogo.personagem.velocidadey = 16;
        jogo.personagem.pulando = true;
    }
});

document.addEventListener('click', (e) => {
    if (jogo.gameOver) {
        location.reload();
    }
});

jogo.loop();
