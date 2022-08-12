---
header-includes:
- \usepackage{tikz}
- \usetikzlibrary{calc,patterns,positioning,matrix,plotmarks,trees,shapes,decorations}
- \usepackage{color,soul,soulutf8}
---

#sistemi_e_reti #classificazioni_reti



---

# Classificazione e topologia delle reti



### In base all'estensione

- **Local Area Network (LAN)**

	Reti non molto grandi, la cui estensione è confinata ad un edificio o un campus.



- ==ciao==



- **Metropolitan Area Network (MAN)**

	Rete che copre l'area di una città, di una provincia o di una piccola città.



- **Wide Area Network (WAN)**

	Rete estesa geograficamente, che connette reti LAN e MAN sparse nel mondo.



### In base alla topologia

- **Topologia a BUS**

	Si ha un unico cavo (BUS) a cui sono collegati tutti i dispositivi (host o nodi).

	Se il singolo cavo viene tranciato tutti i dispositivi perdono il collegamento (Single Point of Failure).

	I messaggi vengono inviati in **==broadcast==** $\longrightarrow$ Il messaggio viene inviato a molteplici dispositivi, visto da tutti.



- **Topologia ad Anello**

	Si crea un circuito di rete continuo in cui sono trasmessi i dati.

	- **Unidirezionale**

		Gli host sono collegati dal una linea continua che "gira" in una sola direzione.

	- **Bidirezionale**

		Il modello di topologia ad anello unidirezionale è particolarmente sensibile ai guasti, quindi si è iniziato ad implementare il modello ==bidirezionale==.

		Quando si verifica un guasto in un punto della rete si può avere un anello secondario di scorta che permette comunque la trasmissione dei dati.



\begin{center}\begin{tikzpicture}[scale=.7, transform shape]

\draw[step=.5cm,very thin, fill=black!92] (-5,2) -- ++(0,-9) -- ++(19,0) -- ++(0,9) -- cycle;

% Anello Unidirezionale
\node[color = white, scale = 1.5] at(0,1) {Anello Unidirezionale};
\node[rectangle, color = white, draw = white, fill = cyan!80!black] (A) at(0,0) {Computer A};
\node[rectangle, color = white, draw = white, fill = cyan!80!black] (B) at(-3,-3) {Computer B};
\node[rectangle, color = white, draw = white, fill = cyan!80!black] (C) at(0,-6) {Computer C};
\node[rectangle, color = white, draw = white, fill = cyan!80!black] (D) at(3,-3) {Computer D};

% Cerchio Esterno
\draw[->, color = white, very thick]
(A.west) to[out = 190, in = 90] (B.north);
\draw[->, color = white, very thick]
(B.south) to[out = -90, in = 170] (C.west);
\draw[->, color = white, very thick]
(C.east) to[out = 10, in = -90] (D.south);
\draw[->, color = white, very thick]
(D.north) to[out = 90, in = -10] (A.east);



% Anello Bidirezionale
\node[color = white, scale = 1.5] at(9,1) {Anello Bidirezionale};
\node[rectangle, color = white, draw = white, fill = cyan!80!black] (A) at(9,0) {Computer A};
\node[rectangle, color = white, draw = white, fill = cyan!80!black] (B) at(6,-3) {Computer B};
\node[rectangle, color = white, draw = white, fill = cyan!80!black] (C) at(9,-6) {Computer C};
\node[rectangle, color = white, draw = white, fill = cyan!80!black] (D) at(12,-3) {Computer D};

% Cerchio Esterno
\draw[->, color = red!80, very thick]
(A.west) to[out = 190, in = 90] node[pos = 0.5,cross out, draw, minimum height = .5cm, minimum width = .5cm, rotate = -20] {} (B.north);
\draw[->, color = white, very thick]
(B.south) to[out = -90, in = 170] (C.west);
\draw[->, color = white, very thick]
(C.east) to[out = 10, in = -90] (D.south);
\draw[->, color = white, very thick]
(D.north) to[out = 90, in = -10] (A.east);
 
% Cerchio Interno
\draw[<-, color = white, very thick]
(A.south) to[out = 180, in = 90] (B.north east);
\draw[<-, color = white, very thick]
(B.south east) to[out = -90, in = 180] (C.north);
\draw[<-, color = white, very thick]
(C.north) to[out = 0, in = -90] (D.south west);
\draw[<-, color = white, very thick]
(D.north west) to[out = 90, in = 0] (A.south);

\end{tikzpicture}\end{center}


- **Topologia a Stella**

	Tutti gli host sono collegati a un punto centrale, detto centro stella.



- **Topologia a Stella Estesa**

	Collega tra loro più topologie a stella tramite una **Gerarchia ad Albero**

	E' tra le più usate per grandi edifici.



- **Topologia a Maglia Completa**

	I vari nodi sono tutti ==collegati tra di loro in maniera diretta==. 





