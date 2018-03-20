class Game {
    constructor(cardBack, difficulty) {
        this.cardBack = cardBack;
        this.difficulty = difficulty;

        this.isClickCardEnabled = true;
        this.openCardsList = [];
        this.gameTime = 0;
        this.removedCardCounter = 0;
        this.backSideURLs = {
            mapleleaf: 'images/card-back/card-back-side-3.png',
            leaf: 'images/card-back/card-back-side-2.png',
            snowflake: 'images/card-back/card-back-side-1.png'
        };
        this.snowflake = this.leaf = this.mapleleaf = [
              'images/cards/card-1.png',
              'images/cards/card-2.png',
              'images/cards/card-3.png',
              'images/cards/card-4.png',
              'images/cards/card-5.png',
              'images/cards/card-6.png',
              'images/cards/card-7.png',
              'images/cards/card-8.png',
              'images/cards/card-9.png',
              'images/cards/card-10.png',
              'images/cards/card-11.png',
              'images/cards/card-12.png'
        ];

    }
    start() {
        this.infoContainer = document.querySelector('.game-info-container');
        this.gameContainer = document.querySelector('.game-container');
        this.gameCardContainer = document.querySelector('.game-card-container');
        this.gameOverContainer = document.querySelector('.game-over-container');
        this.quitButtons = document.getElementsByClassName('quit-game-button');
        this.timeContainer = document.querySelector('.time-text');

        this.onCardClickedBinded = this.onCardClicked.bind(this);
        this.quitGameClickedBinded = this.quitGameClicked.bind(this);

        this.buildCardsList();
        this.renderCards();
        this.startGameTimer();
        this.addListeners();
    }
    buildCardsList() {
        let listUnicCardsURLs = this[this.cardBack].getRandItemsRange(this.difficulty);
        let listCardsURLs = listUnicCardsURLs.concat(listUnicCardsURLs);
        let cardNum = 0;
        let lengthURLs = listCardsURLs.length;
        let backSideImgSrc = this.backSideURLs[this.cardBack];

        this.gameCardList = listCardsURLs.map( (el, i) => {
            if ( i === lengthURLs / 2 ) { cardNum = 0; }
            let cardsWrapper = document.createElement('div');
            let cardBack = document.createElement('div');
            let cardFront = document.createElement('div');
            let backSideImg = new Image();
            let imageFront = new Image();
            imageFront.src = el;
            backSideImg.src = backSideImgSrc;



            cardsWrapper.className = 'card';
            cardsWrapper.dataset.number = 'card' + cardNum++;
            cardBack.className = 'card-back';
            cardFront.className = 'card-front';

            cardBack.appendChild(backSideImg);
            cardFront.appendChild(imageFront);
            cardsWrapper.appendChild(cardBack);
            cardsWrapper.appendChild(cardFront);

            return cardsWrapper;
        }).shuffle();
    }
    renderCards() {
        this.infoContainer.style.display = 'none';

        this.gameCardContainer.innerHTML = '';
        this.gameContainer.style.display = 'block';
        this.gameContainer.classList.add('cards-set' + this.difficulty);

        this.gameCardList.forEach((el) => this.gameCardContainer.appendChild(el));
    }
    addListeners() {
        let cards = document.getElementsByClassName('card');

        Array.from(cards).forEach(el => el.addEventListener('click', this.onCardClickedBinded));
        Array.from(this.quitButtons).forEach(el => el.addEventListener('click', this.quitGameClickedBinded));
    }
    removeListeners() {
        let cards = document.getElementsByClassName('card');

        Array.from(cards).forEach(el => el.removeEventListener('click', this.onCardClickedBinded));
        Array.from(this.quitButtons).forEach(el => el.removeEventListener('click', this.quitGameClickedBinded));
    }
    onCardClicked(e) {
        let currentCard = e.currentTarget;

        if (!this.isClickCardEnabled || currentCard.classList.contains('card-open')) return;

        currentCard.classList.add('card-open');
        this.openCardsList.push(currentCard);

        if (this.openCardsList.length === 2) {
            this.isClickCardEnabled = false;
            this.cardOpenTimeOut = setTimeout(() => {
                if (this.openCardsList[0].dataset.number === this.openCardsList[1].dataset.number) {

                    this.openCardsList.forEach(el => el.classList.add('card-hidden'));

                    this.removedCardCounter += 2;
                    this.openCardsList.length = 0;

                    this.isClickCardEnabled = true;

                    if (this.removedCardCounter === this.gameCardList.length) {
                        clearInterval(this.gameInterval);
                        this.gameCardContainer.innerHTML = '';
                        this.gameContainer.style.display = 'none';
                        this.gameOverContainer.style.display = 'block';
                        this.gameOverContainer.querySelector('.time').innerHTML = '' + this.gameTime;
                    }
                } else {
                    this.openCardsList.forEach(el => el.classList.remove('card-open'));
                    this.openCardsList.length = 0;
                    this.isClickCardEnabled = true;
                }
            }, 1000);
        }
    }
    startGameTimer() {
        this.timeContainer.innerHTML = '' + this.gameTime;
        this.gameInterval = setInterval(() => {
            this.timeContainer.innerHTML = '' + ++this.gameTime;
        }, 1000);
    }

    quitGameClicked() {
        this.gameCardContainer.innerHTML = '';
        this.gameContainer.style.display = 'none';
        this.gameOverContainer.style.display = 'none';
        this.infoContainer.style.display = 'block';
        this.gameContainer.classList.remove('cards-set8', 'cards-set12', 'cards-set16');

        this.removeListeners();
        clearTimeout(this.cardOpenTimeOut);
        clearInterval(this.gameInterval);
        for (let prop in this) {
            delete this[prop];
        }
    }
}
