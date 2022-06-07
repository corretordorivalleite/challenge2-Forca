var palavra;
var sorteadas;
var erros = 0;
var acertos = 0;
var letrasErradas = [];
var letrasCertas = [];
var novaPalavra;
var terminar = false;
const palavras = ['gilberto', 'caetano', 'milton', 'toquinho', 'elis', 'vinicius', 'nara', 'taiguara', 'roberto', 'raul', 'djavan', 'cartola', 'paulinho', 'dorival', 'daniela', 'clara', 'martinho', 'jamelao', 'cazuza'];
var tela = document.getElementById('canvas');
var pincel = tela.getContext('2d');

//Começar o Jogo
function comecar(){
	pincel.clearRect(0, 0, 1200, 800);
	document.getElementById('inicial').style.display = 'none';
	document.getElementById('jogo').style.display = 'flex';
	palavra = sortearPalavra();
	desenharLinha(palavra.length);
}
//Adiciona uma nova palavra - nào é mostrada na tela.
function adicionar(){
	document.getElementById('inicial').style.display = 'none';
	document.getElementById('adicionar').style.display = 'flex';
}
//Guarda a palavra e dá início ao jogo.
function salvarComecar(){
	novaPalavra = document.getElementById('palavra').value;
	if(novaPalavra.length > 8){
		alert('Escreva uma palavra com 8 letras!');
	}else{
		palavras.push(novaPalavra);
		alert('Palavra adicionada!')
		pincel.clearRect(0, 0, 1200, 800);
		document.getElementById('adicionar').style.display = 'none';
		comecar();
	}
}
//Cancela a adição da palavra
function cancelar(){
	document.getElementById('adicionar').style.display = 'none';
	document.getElementById('inicial').style.display = 'flex';
}
//Começa novo jogo.
function novoJogo(){
	pincel.clearRect(0, 0, 1200, 800);
	palavra = sortearPalavra();
	desenharLinha(palavra.length);
	zerar();
}
//Interrompe o jogo em andamento - desiste
function desistir(){
	document.getElementById('jogo').style.display = 'none';
	document.getElementById('inicial').style.display = 'flex';
	zerar();
}

//Busca uma palavra para o jogo na matriz de palavras
function sortearPalavra(){
  	var num = Math.floor(Math.random() * palavras.length);
	return palavras[num].toUpperCase();
}

// Zera indicadores e contadores
function zerar(){
	letrasErradas = [];
	letrasCertas = [];
	erros = 0;
	acertos = 0;
	terminar = false;
}

//Estabelece parametros e quantidades de letras.
function margem(id, qtdLetras){
	var tamanho = 0;
	switch(id){
		case 1:
			for(var i = 1; i <= qtdLetras; i++){
				if(i == qtdLetras){
					tamanho += 80;
				}else{
					tamanho += 96;
				}
			}
			break;
		case 2:
			for(var i = 1; i <= qtdLetras; i++){
				if(i == qtdLetras){
					tamanho += 16;
				}else{
					tamanho += 40;
				}
			}
			break;
		default:
			break;
	}
	return tamanho;	
}

//Desenha linhas das letras
function desenharLinha(qtdLetras){
	var tamanho = margem(1, qtdLetras);
	var marginLeft = (1200 - tamanho) / 2;
	var marginTop = 652;
	
	for(var i = 0; i < qtdLetras; i++){
		pincel.fillStyle = '#0A3871';
		pincel.fillRect(marginLeft, marginTop, 80, 4);
		marginLeft += 96;
	}
}

//Afere se a letra digitada é correspondente
document.body.addEventListener('keypress', function (event) {
	if(carac(event)){
		if(!terminar){
			verificarLetra(event.key.toUpperCase());
		}
  	}
});
function carac(e){
	var char = String.fromCharCode(e.keyCode);
    var pattern = '[a-zA-Z]';
    if (char.match(pattern)) {
      return true;
	}
}
//A letra digitada existe na palavra sorteada?
function verificarLetra(letra){
	var x = false;
	for(var i = 0; i < palavra.length; i++){
		if(palavra[i] == letra){
			x = true;
		}
	}
	if(x){
		escreverLetraCorreta(letra);
	}else{
		escreverLetraIncorreta(letra);
		erros +=1;
		desenharForca(erros);
		if(erros == 8){
			final(2);
		}
	}
	
}
//A letra é correta, então escreve no tabuleiro.
function escreverLetraCorreta(letra){
	var control = false;
	for(var i = 0; i <= letrasCertas.length; i++){
		if(letrasCertas[i] == letra){
			control = true;
		}
	}
	if(!control){
		letrasCertas.push(letra);
		var marginTop = 564;
		var marginLeft = ((1200 - margem(1, palavra.length)) / 2) + 40;

		var margens = [];
		var controle = palavra.indexOf(letra);
		while(controle != -1){
			margens.push(controle);
			controle = palavra.indexOf(letra, controle + 1);
		}
		for(var i = 0; i < margens.length; i++){
			acertos += 1;
			marginLeft += (96 * margens[i]);
			pincel.textAlign = 'center';
			pincel.font ='72px Inter';
			pincel.lineWidth = 400;
			pincel.fillText(letra, marginLeft, marginTop + 72);
			marginLeft = ((1200 - margem(1, palavra.length)) / 2) + 40;
		}
		if(acertos == palavra.length){
			final(1);
		}
	}
}
//A letra digitada não é correta, é escrita no tabuleiro em local especifico.
function escreverLetraIncorreta(letra){
	var controle = false;
	for(var i = 0; i <= letrasErradas.length; i++){
		if(letrasErradas[i] == letra){
			controle = true;
		}
	}
	if(!controle){
		letrasErradas.push(letra);
	}
	var qtdLetras = letrasErradas.length;
	tamanho = margem(2, qtdLetras);
	var marginLeft = (1200 - tamanho) / 2;
	var marginTop = 684;
	pincel.clearRect(0, marginTop, 1200, 800);
	for(var i = 0; i < qtdLetras; i++){
		pincel.font ='24px Inter';
		pincel.lineHeight = '36px';
		pincel.fillText(letrasErradas[i], marginLeft + 9, marginTop + 72);
		marginLeft += 40;
	}
	if(erros == 8){
		final(2);
	}
}
//Usando o Canvas - cria a forca
function desenharForca(erros){
	for(var i = 1; i <= erros; i++){
		switch(i){
			case 1:
				pincel.fillStyle = '#0A3871';
				pincel.fillRect(453, 443, 294, 5);
				pincel.fillRect(533.67, 88, 4.5, 360);
				pincel.fillRect(537.07, 88, 177.75, 4.5);
				pincel.fillRect(711.75, 88, 4.5, 49.5);
				break;
			case 2:
				pincel.strokeStyle = '#0A3871';
				pincel.lineWidth = 4.5;
				pincel.beginPath();
        		pincel.arc(714, 169, 31.5, 0, 2 * Math.PI);
        		pincel.stroke();
				break;
			case 3:
				pincel.strokeStyle = '#0A3871';
				pincel.lineWidth = 4.5;
				pincel.beginPath();
        		pincel.arc(700.25, 160, 3, 0, 2 * Math.PI);
        		pincel.stroke();
				pincel.beginPath();        		
        		pincel.arc(727.75, 160, 3, 0, 2 * Math.PI);
        		pincel.stroke();
				pincel.beginPath();        		
        		pincel.arc(714, 169, 21.5, 0, Math.PI);
        		pincel.stroke();
				break;
			case 4:
				pincel.fillRect(711.75, 200.5, 4.5, 135);
				break;
			case 5:
				pincel.fillStyle = '#0A3871';
				pincel.lineWidth = 4.5;
				pincel.beginPath();
				pincel.moveTo(714, 200.5);
				pincel.lineTo(747.45, 272.5);
				pincel.stroke();
				break;
			case 6:
				pincel.fillStyle = '#0A3871';
				pincel.lineWidth = 4.5;
				pincel.beginPath();
				pincel.moveTo(714, 200.5);
				pincel.lineTo(675.45, 272.5);
				pincel.stroke();
				break;
			case 7:
				pincel.fillStyle = '#0A3871';
				pincel.lineWidth = 4.5;
				pincel.beginPath();
				pincel.moveTo(714, 331.62);
				pincel.lineTo(747.45, 407);
				pincel.stroke();
				break;
			case 8:
				pincel.fillStyle = '#0A3871';
				pincel.lineWidth = 4.5;
				pincel.beginPath();
				pincel.moveTo(714, 331.62);
				pincel.lineTo(675.45, 407);
				pincel.stroke();
				break;
			default:
				break;

		}
	}
}

//Completa a palavra ou chances de acertar - Finaliza.
function final(fim){
	var marginLeft = 1000;
	var marginTop = 300;
	terminar = true;
	switch(fim){
		case 1:
			pincel.fillStyle = 'blue';
			pincel.font ='36px Inter';
			pincel.lineWidth = 400;
			pincel.fillText('Boa!', marginLeft, marginTop);
			pincel.fillText('Acertooou!', marginLeft, marginTop + 50);
			break;
		case 2:
			pincel.fillStyle = 'red';
			pincel.font ='36px Inter';
			pincel.lineWidth = 400;
			pincel.fillText('  Puxa!', marginLeft, marginTop);
			pincel.fillText('Desta vez não deu!', marginLeft, marginTop + 50);
			pincel.font = '15px Inter';
			pincel.fillText('A Palavra correta :  ' + palavra , marginLeft, marginTop + 90);
			break;
		default:
			break;
	}
}
