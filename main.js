'use strict'

const nodoPantalla      = document.querySelector('.pantalla'); 
const nodoInsertJugador = document.querySelector('#jugador'); 
const nodoBtnIniciar    = document.querySelector('#btn-jugador');
let   nodoMesa;
let   nodoJugador; 
let   nodoPuntosJugador; 
let   nodoCartasJugador; 
let   nodoCrupier; 
let   nodoPuntosCrupier; 
let   nodoCartasCrupier; 
let   btnAdd; 
let   btnPlantar; 
let   nodoResultado; 
let   nodobtnVolver; 
let   nodoMazo; 
let   jugador; 
let   crupier; 
let   baraja            = []; 
const barajaFamilias    = ['corazones', 'treboles', 'picas', 'rombos']; 
const barajaCartas      = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; 
const valorNormal       = ['2', '3', '4', '5', '6', '7', '8', '9', '10']; 
const valorFiguras      = ['J', 'Q', 'K']; 

class Jugador{
    constructor(nombre, turno, puntos){
        this.nombre = nombre;
        this.turno  = turno; 
        this.puntos = puntos;  
        this.cartas =[]; 
    }
}

function getJugador(){
    return nodoInsertJugador.value; 
}

function crearJugadores(){
    jugador = new Jugador(getJugador(), true, 0);
    crupier = new Jugador( 'crupier', false, 0); 
}

function crearElemento( nodo, padreNodo){
    nodo = document.createElement('div'); 
    padreNodo.appendChild(nodo); 
    return nodo; 
}

function mostrarJugador(){
    nodoJugador = crearElemento(nodoJugador, nodoPantalla); 
    nodoJugador.innerHTML = jugador.nombre; 
    jugador.turno === true ? nodoJugador.classList.add('turno') : nodoCrupier.classList.add('turno'); 
    btnsJugador(); 
    nodoPuntosJugador = crearElemento(nodoPuntosJugador, nodoJugador); 
}

function mostrarCrupier() {
    nodoCrupier = crearElemento( nodoCrupier, nodoPantalla )
    nodoCrupier.innerHTML = crupier.nombre; 
    nodoPuntosCrupier = crearElemento( nodoPuntosCrupier, nodoCrupier ); 
}

class Carta{
    constructor( numero, familia, valor, jugada){
        this.numero = numero; 
        this.familia = familia; 
        this.valor = valor; 
        this.jugada = jugada; 
    }
}

function getValor(carta){
    let valor; 
    if( valorNormal.includes(carta)){
        return valor = +carta; 
    } else if( valorFiguras.includes(carta)){
        return valor = 10; 
    } else {
        return valor = 1; 
    }
}

function crearBaraja(){
    for (let i = 0; i < barajaFamilias.length; i++){
        let familia = barajaFamilias[i]
        for( let i = 0; i < barajaCartas.length; i++ ){
            let carta = new Carta( barajaCartas[i], familia, getValor( barajaCartas[i]), false ); 
            baraja.push(carta); 
        }
    }
}

nodoBtnIniciar.addEventListener('click', ()=>{
    crearJugadores(); 
    crearMesa(); 
    crearBaraja(); 
    repartoInicial();
})

function crearMesa(){
    nodoPantalla.innerHTML = ''; 
    mostrarJugador(); 
    pintarMesa(); 
    mostrarCrupier(); 
    pintarNodoResultado(); 
}

function pintarMazo() {
    nodoMazo = crearElemento( nodoMazo, nodoMesa ); 
    nodoMazo.id = 'mazo'; 
}

function pintarMesa() {
    nodoMesa = crearElemento( nodoMesa, nodoPantalla ); 
    nodoMesa.classList.add('mesa'); 
    nodoCartasJugador = crearElemento( nodoCartasJugador, nodoMesa ); 
    nodoCartasCrupier = crearElemento( nodoCartasCrupier, nodoMesa ); 
    pintarMazo(); 
}

function pintarNodoResultado(){
    nodoResultado = crearElemento(nodoResultado, nodoPantalla); 
    nodoResultado.classList.add('resultado'); 
    nodoResultado.classList.add( 'oculto' ); 
}

function repartoInicial(){
    for( let i = 0; i < 4; i++ ){
        let carta = repartirCarta()
        if( jugador.turno === true ){
            jugador.cartas.push( carta ); 
            mostrarCarta( nodoCartasJugador, carta.numero, carta.familia );
            sumarCartas( jugador, nodoPuntosJugador ); 
            cambiarJugador(); 
        } else{
            crupier.cartas.push( carta ); 
            mostrarCarta( nodoCartasCrupier, carta.numero, carta.familia );
            cambiarJugador(); 
        }
    }
}

function crearBtn( nodo, nodoPadre){
    nodo = document.createElement('button'); 
    nodoPadre.appendChild(nodo); 
    return nodo; 
}

function btnsJugador(){
    btnAdd = crearBtn( btnAdd, nodoJugador ); 
    btnAdd.innerHTML = `<i class="fas fa-plus"></i>`; 
    btnAdd.addEventListener('click', ()=>{
        nuevaCarta(); 
    })
    btnPlantar = crearBtn( btnPlantar, nodoJugador ); 
    btnPlantar.innerHTML = `<i class="fas fa-hand-paper"></i>`;
    btnPlantar.addEventListener('click', ()=>{
        pasar(); 
    })
}

function nuevaCarta(){
    let carta = repartirCarta(); 
    jugador.cartas.push( carta ); 
    sumarCartas(jugador, nodoPuntosJugador); 
    mostrarCarta(nodoCartasJugador, carta.numero, carta.familia); 
} 

function pasar(){
    jugador.puntos = sumarCartas(jugador, nodoPuntosJugador); 
    cambiarJugador();
    nodoJugador.classList.remove('turno');
    nodoCrupier.classList.add('turno');
    crupierTurno(); 
}

function cartaAzar() {
    let numero = Math.random()*52; 
    return numero = Math.trunc(numero); 
}

function repartirCarta() { 
    let carta = baraja[cartaAzar()]; 
    if( carta.jugada === false ){
        carta.jugada = true; 
    } else {
        repartirCarta(); 
    }
    return carta;
}

function mostrarCarta( turno, cartaNumero, cartaFamilia){
    let nodoCarta = document.createElement('div'); 
    nodoCarta.innerHTML = `${cartaNumero}`; 
    let nodoImagen = document.createElement('img'); 
    nodoImagen.src = `img/${cartaFamilia}.png`; 
    nodoCarta.appendChild( nodoImagen ); 
    nodoCarta.classList.add('carta'); 
    turno.appendChild( nodoCarta ); 
}

function sumarCartas( jugadorTurno, nodo ) {
    let puntos = jugadorTurno.puntos; 
    for ( let i = 0; i < jugadorTurno.cartas.length; i++ ){
        if( jugadorTurno.cartas[i].numero === 1 && puntos + 11 <= 21){
            jugadorTurno.cartas[i].valor = 11; 
        }
        puntos += jugadorTurno.cartas[i].valor; 
    }
    obtenerResultado( puntos, jugadorTurno ); 
    mostrarPuntos( puntos , nodo ); 
    return puntos; 
}

function obtenerResultado(puntos, jugadorTurno){
    let mensaje; 
    if ( puntos > 21 && jugadorTurno === jugador) { 
        mensaje = `has perdido`;
        mostrarGanador(mensaje); 
    }
}

function mostrarPuntos( puntos, nodo ) {
    nodo.innerHTML = `puntos: ${puntos}`; 
}

function cambiarJugador(){
    if( jugador.turno === true ){
        jugador.turno = false; 
        crupier.turno = true; 
    } else{
        jugador.turno = true; 
        crupier.turno = false; 
    }
}

function crupierTurno(){
    nodoCrupier.appendChild(nodoPuntosCrupier); 
    let puntos = sumarCartas( crupier, nodoPuntosCrupier );  
    if( puntos < 17 ){
        setTimeout(() => {
            let carta = repartirCarta();
            crupier.cartas.push(carta)
            mostrarCarta(nodoCartasCrupier, carta.numero, carta.familia); 
            puntos  = sumarCartas( crupier, nodoPuntosCrupier ); 
            nodoPuntosCrupier.innerHTML = `puntos ${puntos}`; 
            crupierTurno(); 
        }, 1000);
    } else{
        setTimeout(() => {
            crupier.puntos = puntos; 
            mostrarGanador(ganador()); 
        }, 1000);
    }
}

function ganador(){
    let mensaje; 
    if ( jugador.puntos > crupier.puntos && jugador.puntos <= 21 ){
        mensaje = `ha ganado ${jugador.nombre}`; 
    }else if ( crupier.puntos  > jugador.puntos && crupier.puntos <= 21  ){
        mensaje = `Gana la banca`; 
    }else if( crupier.puntos > 21 && crupier.puntos > jugador.puntos ){
        mensaje = `ha ganado ${jugador.nombre}`; 
    } else if( jugador.puntos === crupier.puntos ){
        mensaje = `empate`; 
    } else if ( jugador.puntos >21){
        mensaje = `has perdido`; 
    }
    return mensaje; 
}

function mostrarGanador(resultado){
    nodoResultado.classList.remove('oculto'); 
    nodoResultado.innerHTML = resultado; 
    nodobtnVolver = crearBtn( nodobtnVolver, nodoResultado )
    nodobtnVolver.innerHTML = `<i class="fas fa-undo"></i>`; 
    nodobtnVolver.addEventListener('click', ()=>{
        nodoResultado.classList.add('oculto'); 
        volverAJugar(); 
    })
}

function volverAJugar(){
    if( jugador.turno === false ){
        cambiarJugador(); 
    }
    resetJugador(); 
    resetBaraja(); 
    crearMesa(); 
    crearBaraja(); 
    repartoInicial();
}

function resetJugador(){
    jugador.puntos = 0; 
    crupier.puntos = 0; 
    jugador.cartas = []; 
    crupier.cartas = []; 
}

function resetBaraja(){
    baraja = []; 
}