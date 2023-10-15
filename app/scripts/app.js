import $ from 'jquery';
(function(){
	var Memory = {
		
		init: function(cards){
			this.$game = $(".games__game");
			this.$modal = $(".games__modal");
			this.$overlay = $(".games__modal-overlay");
			this.$restartButton = $(".games__restart");
			this.cardsArray = $.merge(cards, cards);
			this.shuffleCards(this.cardsArray);
			this.setup();
		},
		shuffleCards: function(cardsArray){
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		setup: function(){
			this.html = this.buildHTML();
			this.$game.html(this.html);
			this.$memoryCards = $(".card");
			this.paused = false;
     		this.guess = null;
			this.binding();
		},
		binding: function(){
			this.$memoryCards.on("click", this.cardClicked);
			this.$restartButton.on("click", $.proxy(this.reset, this));
		},

		cardClicked: function(){
			var _ = Memory;
			var $card = $(this);
			if(!_.paused && !$card.find(".inside").hasClass("matched") && !$card.find(".inside").hasClass("picked")){
				$card.find(".inside").addClass("picked");
				if(!_.guess){
					_.guess = $(this).attr("data-id");
				} else if(_.guess == $(this).attr("data-id") && !$(this).hasClass("picked")){
					
					$(".picked").addClass("matched");
					_.guess = null;
						} else {
							_.guess = null;
							_.paused = true;
							setTimeout(function(){
								$(".picked").removeClass("picked");
								Memory.paused = false;
							}, 600);
						}
				if($(".matched").length == $(".card").length){
					_.win();
				}
			}
		},

		win: function(){
			this.paused = true;
			setTimeout(function(){
				Memory.showModal();
				Memory.$game.fadeOut();
			}, 1000);
		},

		showModal: function(){
			this.$overlay.show();
			this.$modal.fadeIn("slow");
		},

		hideModal: function(){
			this.$overlay.hide();
			this.$modal.hide();
		},

		reset: function(){
			this.hideModal();
			this.shuffleCards(this.cardsArray);
			this.setup();
			this.$game.show("slow");
		},
		shuffle: function(array){
			var counter = array.length, temp, index;
		   	while (counter > 0) {
	        	index = Math.floor(Math.random() * counter);
	        	counter--;
	        	temp = array[counter];
	        	array[counter] = array[index];
	        	array[index] = temp;
		    	}
		    return array;
		},

		buildHTML: function(){
			var frag = '';
			this.$cards.each(function(k, v){
				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
				<div class="front"><img src="'+ v.img +'"\
				alt="'+ v.name +'" /><p>123</p>\</div>\
				<div class="back"><img src="/images/card-bg.png"\
				alt="" /></div></div>\
				</div>';
			});
			return frag;
		}
	};

	$(document).ready(function () {
		$(".games__button").click(function () {
			const email = $(".games__email").val();
			const attempts = $(".games__attempts").text();
			const $form = $(".games__modal__wrap");
			const $newBlock = $(".games__links__wrap");
	
			if (email.trim() === "") {
				alert("Пожалуйста, введите ваш email.");
				return;
			}
	
			if (!$(".games__input").prop("checked")) {
				alert("Для продолжения необходимо согласиться с правилами и обработкой персональных данных.");
				return;
			}
	
			$.ajax({
				type: "POST",
				url: "https://schuka.woman.ru/save_email",
				data: {
					email: email,
					attempts: attempts
				},
				success: function (response) {
					response = JSON.parse(response, (key, value) => {
						if (typeof value === "string") {
							return decodeURI(value);
						}
						return value;
					});

					console.log("Ответ от сервера: " + JSON.stringify(response));
					$(".games__link-vk").html('<a class="games__link" href="' + response.vk + '">Vk</a>');
					$(".games__link-ok").html('<a class="games__link" href="' + response.ok + '">Ok</a>');
					$(".games__link-tg").html('<a class="games__link" href="' + response.tg + '">Tg</a>');
					$(".games__link-your").html('<span class="games__link-text">Ваша ссылка:  </span><a class="games__link" href="' + response.link + '">' + response.link + '</a>');
					$form.hide();
					$newBlock.show();
				},
				error: function (xhr, status, error) {
					console.log("Ошибка: " + error);
				}
			});
		});
	});
	

	var cards = [
		{	
			name: "php",
			img: "/images/card-front-1.png",
			id: 1,
		},
		{
			name: "css3",
			img: "/images/card-front-2.png",
			id: 2
		},
		{
			name: "html5",
			img: "/images/card-front-3.png",
			id: 3
		},
		{
			name: "jquery",
			img: "/images/card-front-4.png",
			id: 4
		}, 
		{
			name: "javascript",
			img: "/images/card-front-5.png",
			id: 5
		},
		{
			name: "node",
			img: "/images/card-front-6.png",
			id: 6
		},
		{
			name: "photoshop",
			img: "/images/card-front-7.png",
			id: 7
		},
		{
			name: "python",
			img: "/images/card-front-8.png",
			id: 8
		},
	];
	Memory.init(cards);
})();