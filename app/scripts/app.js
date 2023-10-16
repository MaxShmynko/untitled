import $ from 'jquery';
let counter = 0;
$(".games__button__start").removeClass('hidden');
$(".games__button__start").addClass('visible');


  document.querySelector(".games__button__start").onclick = function(){
	$(".games__button__start").removeClass('visible');
	$(".games__button__start").addClass('hidden');
	var Memory = {
		
		init: function(cards){
			this.$game = $(".games__game");
			this.$modal = $(".games__modal");
			this.$overlay = $(".games__modal-overlay");
			this.$restartButton = $(".games__restart");
			this.$questionCounter = $(".popup__attempts");
			this.cardsArray = $.merge(cards, cards);
			this.shuffleCards(this.cardsArray);
			this.setup();
			$( ".back:eq(1)" ).addClass('color');
			$( ".back:eq(3)" ).addClass('color');
			$( ".back:eq(4)" ).addClass('color');
			$( ".back:eq(6)" ).addClass('color');
			$( ".back:eq(9)" ).addClass('color');
			$( ".back:eq(11)" ).addClass('color');
			$( ".back:eq(12)" ).addClass('color');
			$( ".back:eq(14)" ).addClass('color');
			$( ".back:eq(16)" ).addClass('color');
		},
		shuffleCards: function(cardsArray){
			this.$cards = $(this.shuffle(this.cardsArray));
		},

		setup: function(){
			if($(window).width() >= 1000){
				this.html = this.buildHTML();
			} else {
				this.html = this.buildHTMLMobile();
			}
			counter = 0;
			this.$game.html(this.html);
			this.$memoryCards = $(".card");
			this.paused = false;
     		this.guess = null;
			this.binding();
			setTimeout(function() { $(".inside").addClass('picked'); }, 0);
			setTimeout(function() { $(".inside").removeClass('picked'); }, 4000);
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
					counter += 1;
						} else {
							_.guess = null;
							_.paused = true;
							counter += 1;
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
			this.$questionCounter.text(counter);
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
			$( ".back:eq(1)" ).addClass('color');
			$( ".back:eq(3)" ).addClass('color');
			$( ".back:eq(4)" ).addClass('color');
			$( ".back:eq(6)" ).addClass('color');
			$( ".back:eq(9)" ).addClass('color');
			$( ".back:eq(11)" ).addClass('color');
			$( ".back:eq(12)" ).addClass('color');
			$( ".back:eq(14)" ).addClass('color');
			$( ".back:eq(16)" ).addClass('color');
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
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="/images/card-bg.png"\
				alt="" /></div></div>\
				</div>';
			});
			return frag;
		},

		buildHTMLMobile: function(){
			var frag = '';
			this.$cards.each(function(k, v){
				frag += '<div class="card" data-id="'+ v.id +'"><div class="inside">\
				<div class="front"><img src="'+ v.imgMob +'"\
				alt="'+ v.name +'" /></div>\
				<div class="back"><img src="/images/card-bg-mob.png"\
				alt="" /></div></div>\
				</div>';
			});
			return frag;
		}
	};

	$(document).ready(function () {
		$(".games__button").click(function () {
			const email = $(".games__email").val();
			const steps = $(".popup__attempts").text();
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
					steps: steps
				},

				
				success: function (response) {
					response = JSON.parse(response, (key, value) => {
						if (typeof value === "string") {
							return decodeURI(value);
						}
						return value;
					});

					$(".games__link-vk").html('<a class="games__link" href="' + response.vk + '"target="_blank">Vk</a>');
					$(".games__link-ok").html('<a class="games__link" href="' + response.ok + '"target="_blank">Ok</a>');
					$(".games__link-tg").html('<a class="games__link" href="' + response.tg + '"target="_blank">Tg</a>');
					$(".games__link-your").html('<span class="games__link-text">Ваша ссылка:  </span><a class="games__link" href="' + response.link + '">' + response.link + '</a>');
					$form.hide();
					$newBlock.show();
				},
			});
		});
	});
	

	var cards = [
		{	
			name: "Кот Баюн",
			img: "/images/card-front-1.png",
			imgMob: "/images/card-front-1-mob.png",
			id: 1,
		},
		{
			name: "Емеля",
			img: "/images/card-front-2.png",
			imgMob: "/images/card-front-2-mob.png",
			id: 2
		},
		{
			name: "Щука Василиса",
			img: "/images/card-front-3.png",
			imgMob: "/images/card-front-3-mob.png",
			id: 3
		},
		{
			name: "Кощей",
			img: "/images/card-front-4.png",
			imgMob: "/images/card-front-4-mob.png",
			id: 4
		}, 
		{
			name: "Царевна Анфиса",
			img: "/images/card-front-5.png",
			imgMob: "/images/card-front-5-mob.png",
			id: 5
		},
		{
			name: "Лорд Ротман",
			img: "/images/card-front-6.png",
			imgMob: "/images/card-front-6-mob.png",
			id: 6
		},
		{
			name: "Царь Феофан",
			img: "/images/card-front-7.png",
			imgMob: "/images/card-front-7-mob.png",
			id: 7
		},
		{
			name: "Обжирало и Облипало",
			img: "/images/card-front-8.png",
			imgMob: "/images/card-front-8-mob.png",
			id: 8
		},
	];
	
	Memory.init(cards);
};