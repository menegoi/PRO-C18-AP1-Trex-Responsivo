//Criar variáveis
var trex, trexRun, trexCollided;
var solo, imgSolo,soloInvisivel;
var imgNuvem, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var grupoObstaculos, grupoNuvens;
var fimDeJogo, imgFimDeJogo, reiniciar, imgReiniciar;
var somJump, somCheckPoint, somFimDeJogo;

//Definir pontuação do jogo
var score = 0;

//Estado de Jogo
const PLAY = 1;
const END = 0;

var gameState = PLAY;
 
function preload(){

  //Adicionar animação do T-Rex Correndo
  trexRun = loadAnimation("trex1.png", "trex2.png","trex3.png" );
  trexCollided = loadAnimation("trex_collided.png");

  //Carregar imagens
  imgSolo = loadImage("ground2.png");
  imgNuvem = loadImage("cloud.png");
  imgFimDeJogo = loadImage("gameOver.png");
  imgReiniciar = loadImage("restart.png");

  //Imagens dos obstáculos
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");

  //Carregar efeitos sonoros
  somJump = loadSound("jump.mp3");
  somCheckPoint = loadSound("checkPoint.mp3");
  somFimDeJogo = loadSound("die.mp3");

}

function setup(){
  createCanvas(windowWidth,windowHeight);

  //Definir grupos
  grupoNuvens = new Group();
  grupoObstaculos = Group();
  
  //crie um sprite de trex
  trex = createSprite(width*0.1,height*0.8,width*0.05,height*0.15);
  trex.addAnimation("correndo", trexRun);
  trex.addAnimation("trexCollided", trexCollided);
  //trex.scale = 0.5;

  trex.setCollider("circle",0,0,40)
  trex.debug = false;

  //Criar sprite do solo
  solo = createSprite(width/2,height*0.85,width,height*0.08);
  solo.addImage("solo",imgSolo);

  //Criar Sprite do Solo Invisível
  soloInvisivel =  createSprite(width/2,height*0.9,width,height*0.05);
  soloInvisivel.visible = false;

  //Criar Icones de Fim de Jogo
  fimDeJogo = createSprite(width/2,height/2);
  fimDeJogo.addImage("fimDeJogo",imgFimDeJogo);
  //fimDeJogo.scale = 0.5;
  fimDeJogo.visible = false;
  
  reiniciar = createSprite(width/2,height*0.4);
  reiniciar.addImage("reiniciar",imgReiniciar);
  //reiniciar.scale = 0.5;
  reiniciar.visible = false;
  
  
}
 
function draw(){

  //Definir fundo e limpar a tela
  background("white")

  //Marcar pontuação do Jogo
  text("Pontuação: " + score, width*0.9, height*0.08);

  //Adicionar efeito Sonoro CheckPoint
  if(score>0 && score % 500 === 0){
    somCheckPoint.play();
  }


  //Definir o comportamento dos  objetos em cada estado do jogo
  if(gameState === PLAY){

    //Atualização da pontuação
    score = score + Math.round(frameRate()/60);

    //Fazer o T-Rex saltar na tela
    if((keyDown("space") && trex.isTouching(solo)) || touches.length > 0){

      somJump.play();
      trex.velocityY = -15;

      //Limpar a matriz touches
      touches = [];

    }
    //Atribuir velocidade ao T-Rex
    trex.velocityY = trex.velocityY + 0.5;

    //Atribuir velocidade ao T-Rex a partir do movimento do solo
    solo.velocityX = -(4 + 3*score/1000);

      //Reiniciar posição do solo
    if(solo.x < 0){
      solo.x = width/2;
    }

  //Gerar nuvens
  gerarNuvens();

  //Gerar obstáculos do solo
  gerarObstaculos();

  if(grupoObstaculos.isTouching(trex)){
    gameState = END;
    somFimDeJogo.play();
  }

  }
  else if(gameState === END){
    //Atribuir velocidade ao T-Rex a partir do movimento do solo
    solo.velocityX = 0;

    //Zerar velocidade dos obstaculos e nuvens
    grupoObstaculos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

     //Alterar Animação T-Rex
     trex.changeAnimation("trexCollided");
     trex.velocityY = 0;
     
     // Definir tempo de vida no modo Encerrar
     grupoObstaculos.setLifetimeEach(-1);
     grupoNuvens.setLifetimeEach(-1);
     
     //Visualizar Icones Fim de Jogo e Reiniciar
     fimDeJogo.visible = true;
     reiniciar.visible = true;

     //Reiniciar o jogo caso o botão reiniciar seja pressionado
     if(mousePressedOver(reiniciar) || touches.length > 0){

      //Limpar matriz touches
      touches = [];

      //Reiniciar jogo
       reset();
     }

  }

  //Fazer o Trex colidir com o solo
  trex.collide(soloInvisivel);

  //Desenhar sprites na tela
  drawSprites();

}
function gerarNuvens(){
  //Escrever aqui o código para gerar as nuvens
  if(frameCount % 80 === 0){
    var nuvem = createSprite(width,height*0.1,width*0.2, height*0.07);
    nuvem.velocityX = -3;
    
    //Adicionar imagem da nuvem nos sprites
    nuvem.addImage(imgNuvem);
    nuvem.scale = random(0.6,1);
    
    //Tornar posição Y da nuvem aleatória
    nuvem.y = Math.round(random(height*0.08,height*0.6));
    
    //Garantir que profundidade da nuvem seja maior que a do T-Rex
    nuvem.depth = trex.depth;
    trex.depth = trex.depth +1;

    //Adicionar nuvem criada ao grupo de nuvens
    grupoNuvens.add(nuvem);
   
    
  } 
}
function gerarObstaculos(){
  if(frameCount % 60 === 0){
    var obstaculo = createSprite(width,height*0.85,width*0.03,height*0.12);
    obstaculo.velocityX = -(5 + score/1000);
    
    //Criar Obstáculos aleatórios
    var rand = Math.round(random(1,6));
    
    switch(rand){
      case 1: obstaculo.addImage(obstaculo1);
              break;
      case 2: obstaculo.addImage(obstaculo2);
              break;
      case 3: obstaculo.addImage(obstaculo3);
              break;
      case 4: obstaculo.addImage(obstaculo4);
              break;
      case 5: obstaculo.addImage(obstaculo5);
              break;
      case 6: obstaculo.addImage(obstaculo6);
              break;
              default: break;
    }
    
    // Alterar escala e vida útil
    //obstaculo.scale = 0.5;
    obstaculo.lifetime = 300;

    //Adicionar nuvem criada ao grupo de nuvens
    grupoObstaculos.add(obstaculo);
    
  }
  
}
function reset(){
  gameState = PLAY;
  fimDeJogo.visible = false;
  reiniciar.visible = false;
  score = 0;

  grupoNuvens.destroyEach();
  grupoObstaculos.destroyEach();

  trex.changeAnimation("correndo",trexRun);

}

