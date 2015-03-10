/*(function () {*/
    'use strict';
    var n, //taille de la grille
        nmb = 0, //variable qui contient le nombre de cellules vivantes autour de la cellule étudiée
        grille = [], //premier tableau
        grille2 = [], //deuxième tableau
        grilleHash = [], //le tableau des différents états hashés
        p = 0, //va permettre l'alternance entre les tableaux
        etatJeu = 0, //va déterminer si le jeu est actif ou non.
        table = document.getElementById('table');
    do {
        n = parseInt(window.prompt("Taille de la grille ?"), 10);
    } while (isNaN(n));

    /**
     * nomfct: ce qu'elle fait
     * @param: nom(type)
     * @return: ce qui est retourné
     */

    /**
     * remplalea: Remplit le tableau aléatoirement (celui du HTML et celui de la dataJS)
     */
    function remplalea() {
        if (etatJeu == 0) {
            for (var i=0; i<n; i++) {
                for (var j=0; j<n; j++) {
                    var value = Math.floor(Math.random() * 2);
                    grille[i][j] = value;
                    var cell = document.querySelector('.cell[data-x="'+j+'"][data-y="'+i+'"]');
                    if (value && !cell.classList.contains('green')) cell.classList.add('green'); //si la valeur aléatoire est égale à 1 ET que la case n'est pas déjà verte alors on rajoute la classe green)
                    else if ((value==0) && cell.classList.contains('green')) cell.classList.remove('green'); //si la valeur aléatoire est égale à 0 ET que la case est déjà verte alors on enlève la classe green)
                }
            }
        }
    }

    /**
     * ChangeCellState: foncion activée lorsque l'utiisateur clique sur une cellule qui va changer la couleur du tableau affiché dans le HTML et la case du tableau dans la dataJS (ici grille)
     * @param: e(event)
     */
    function ChangeCellState(e) {
        e.preventDefault();
        if (etatJeu == 0) {
            this.classList.toggle('green');
            grille[parseInt(this.getAttribute('data-x'))][parseInt(this.getAttribute('data-y'))] = (grille[parseInt(this.getAttribute('data-x'))][parseInt(this.getAttribute('data-y'))] + 1) % 2; // ça rajoute 1 à la case de la cellule et ça met le tout modulo 2 pour que ça reste entre 1 et 0 et pour éviter d'utiliser un if
        }
    }

    /**
     * init: va générer les deux grilles de la dataJS et créer le tableau en HTML avec des cellules mortes
     * @param: grille(array)
     */
    function init(grille) {
        for (var i=0; i<n; i++) {
            grille[i] = [];
            grille2[i] = [];
            var tr = document.createElement('tr');
            for (var j=0; j<n; j++) {
                var value = 0;
                grille[i][j] = value;
                var td = document.createElement('td');
                td.setAttribute('data-x',j);
                td.setAttribute('data-y',i);
                td.className = 'cell';
                tr.appendChild(td);
                td.addEventListener('click', ChangeCellState, false)
            }
            table.appendChild(tr);
        }
    }

    /**
     * changeTab: Va parcourir le tableau et compter le nombre de cellules vivantes autour de la cellule puis va lancer la fonction newState
     * @param: t(array), t2(array) -> t l'ancien tableau, t2 le nouveau tableau
     */
    function changeTab(t,t2) {
        for(var i=0; i<n; i++) {
            for(var j=0; j<n; j++) {
                nmb = t[(i-1+n)%n][(j-1+n)%n] + t[(i-1+n)%n][(j+n)%n] + t[(i-1+n)%n][(j+1+n)%n] + t[(i+n)%n][(j-1+n)%n] + t[(i+n)%n][(j+1+n)%n] + t[(i+1+n)%n][(j-1+n)%n] + t[(i+1+n)%n][(j+n)%n] + t[(i+1+n)%n][(j+1+n)%n];
                newState(t,t2,i,j); //change l'état de t2 (le nouveau tableau) à partir de t (l'ancien)
            }
        }
        endGame(t2);
    }

    /**
     * newState: gère le nouvel état de la cellule
     * @param: tab(array), tab2(array), x(int), y(int) -> tab l'ancien tableau, tab2 le nouveau tableau, x et y les coordonnées de la cellule
     */
    function newState(tab,tab2,x,y){
        if (nmb > 3 || nmb < 2) {
            tab2[x][y] = 0; //si moins de 2 ou plus de 3 cellules vivantes
            var cell = document.querySelector('.cell[data-x="'+x+'"][data-y="'+y+'"]');
            if(cell.classList.contains('green')) cell.classList.remove('green');
        }
        else if(nmb == 3) {
            tab2[x][y] = 1; //si 3 cellules vivantes autour
            var cell = document.querySelector('.cell[data-x="'+x+'"][data-y="'+y+'"]');
            if(!cell.classList.contains('green')) cell.classList.add('green');
        }
        else if(nmb == 2) tab2[x][y] = tab[x][y]; //si 2 cellules vivantes autour
    }

    /**
     * tour: gère l'alternance entre les deux tableaux pour éviter de copier le contenu de t2 à l'intérieur de t à chaque fois, càd que le deuxième tableau sera créé à partir du premier et inversement.
     * @param: t(array), t2(array) -> t le premier tableau qui sera utilisé
     */
    function tour(t,t2) {
        p++;
        if((p%2)==0) changeTab(t2,t);
        else changeTab(t,t2);
    }

    /**
     * endGame: détecte la fin de partie vérifiant si l'état actuel est déjà apparu auparavant
     * @param: tab(array)
     */
    function endGame(tab) {
        var endTab;
        for (var i=0;i<grilleHash.length;i++) {
            console.log(grilleHash[i] + " | " + HashCode.value(tab));
            if (grilleHash[i] == HashCode.value(tab)) {
                if (JSON.stringify(tab) == endTab) PauseJDV();
                endTab = JSON.stringify(tab);
            }
        }
        grilleHash.push(HashCode.value(tab));
    }
    
    /**
     * StartJDV : Lance le jeu de la vie en boucle.
     */
    function StartJDV() {
        etatJeu = setInterval(function(){tour(grille,grille2)},300); //toutes les 500 millisecondes on va lancer la fonction tour
        console.log("Jeu démarré");
    }
    
    /**
     * PauseJDV : Met le jeu de la vie en pause.
     */
    function PauseJDV() {
        clearInterval(etatJeu);
        console.log("Jeu mis en pause");
    }

    init(grille); //on initialise la grille et on l'affiche
/*})();*/