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
        this.hitbox = {
            largura: 100,
            altura: 30,
            offsetY: 10,
        };
    }

    atualizarHitbox() {
        this.hitbox.x = this.x;
        this.hitbox.y = this.y + this.hitbox.offsetY;
    }

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

class Obstaculo extends Entidade {
    constructor(x, y, largura, altura, velocidadex) {
        super(x, y, largura, altura);
        this.velocidadex = velocidadex;
        this.y = canvas.height - 80 - this.altura; // Mantém a posição Y fixa
        this.passou = false; // Variável para marcar se o obstáculo passou
        this.#time_to_next = Math.floor(Math.random() * (200 - 100 + 1) + 100); // Gera um número aleatório entre 100 e 200 para a distância entre os obstáculos
        this.hitbox = {
            x: this.x,
            y: this.y,
            largura: largura, // A hitbox será um quadrado do mesmo tamanho do inimigo
            altura: altura
        };
    }

    desenhar(ctx) {
        ctx.drawImage(ObstaculoSprite, this.x, this.y, this.largura, this.altura); // Desenha o inimigo com a imagem
    }

    atualizarHitbox() {
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        this.hitbox.largura = this.largura;
        this.hitbox.altura = this.altura;
    }

    desenharHitbox(ctx) {
        ctx.beginPath();
        ctx.rect(this.hitbox.x, this.hitbox.y, this.hitbox.largura, this.hitbox.altura);
        ctx.closePath();
        ctx.strokeStyle = 'blue'; // Cor para a hitbox do inimigo
        ctx.stroke();
    }

    atualizar() {
        this.x -= this.velocidadex; // Move o inimigo para a esquerda

        // Quando o obstáculo passa completamente pela tela
        if (this.x + this.largura < 0) {
            this.passou = true;

            // Gerar o valor aleatório para o próximo obstáculo
            this.#time_to_next = Math.floor(Math.random() * (200 - 100 + 1) + 100); // Novo valor entre 100 e 200

            // Ajustar a posição do novo obstáculo
            this.x = canvas.width + this.#time_to_next; // A posição do próximo obstáculo será a distância do obstáculo anterior mais esse valor aleatório

            // Atualizando as propriedades do obstáculo
            let nova_altura = (Math.random() * 50) + 100;
            this.altura = nova_altura;
            this.y = canvas.height - 80 - this.altura; // Mantém a posição Y fixa
        }

        this.atualizarHitbox();
    }
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
        if (
            this.personagem.hitbox.x < this.obstaculo.hitbox.x + this.obstaculo.hitbox.largura &&
            this.personagem.hitbox.x + this.personagem.hitbox.largura > this.obstaculo.hitbox.x &&
            this.personagem.hitbox.y < this.obstaculo.hitbox.y + this.obstaculo.hitbox.altura &&
            this.personagem.hitbox.y + this.personagem.hitbox.altura > this.obstaculo.hitbox.y
        ) {
            this.houveColisao();
        }
    }

    houveColisao() {
        this.gameOver = true;
    }

    // Atualiza a pontuação a cada quadro
    atualizarPontuacao() {
        // Verifica se o obstáculo passou completamente do lado esquerdo da tela
        if (this.obstaculo.x + this.obstaculo.largura < 10) {
            if (!this.obstaculo.passou) {
                this.obstaculosPassados++; // Aumenta o contador de obstáculos passados
                this.pontuacao = this.obstaculosPassados * 10; // Atualiza a pontuação
                this.obstaculo.passou = true; // Marca o obstáculo como "passado"
            }
        } else {
            this.obstaculo.passou = false; // Se o obstáculo não saiu da tela, reseta a marcação
        }
    }

    desenharPontuacao() {
        ctx.font = '20px "Fonte"'; // Mantendo a sua fonte original
        ctx.fillStyle = 'black'; // Cor do texto
        ctx.fillText(`Almas: ${this.pontuacao}`, 10, 30); // Exibe a pontuação no canto superior esquerdo
    }

    loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas a cada frame
        ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height); // Desenha o fundo

        if (!this.gameOver) {
            this.personagem.desenhar(ctx); // Desenha o personagem
            this.personagem.atualizar(); // Atualiza a posição do personagem
            this.obstaculo.desenhar(ctx); // Desenha o obstáculo (inimigo)
            this.obstaculo.atualizar(); // Atualiza a posição do obstáculo
            this.verificarColisao(); // Verifica a colisão
            this.atualizarPontuacao(); // Atualiza a pontuação
            this.desenharPontuacao(); // Desenha a pontuação
            requestAnimationFrame(() => this.loop()); // Continua o loop do jogo
        } else {
            // Tela de Game Over
            ctx.drawImage(gameOverImage, (canvas.width / 2) - (gameOverImage.width / 2), (canvas.height / 2) - (gameOverImage.height / 2));
            ctx.fillStyle = 'black'; // Cor do texto
            ctx.font = '30px "Fonte"'; // Mantendo a sua fonte original
            ctx.fillText(`Almas perdidas: ${this.pontuacao}`, (canvas.width / 2) - 150, canvas.height / 2 + 40);
        }
    }
}

const jogo = new Jogo();
