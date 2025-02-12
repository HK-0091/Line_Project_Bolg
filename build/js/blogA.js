let basicBox = document.getElementById("basicBox");
let bodyScroll = document.body;
let gameCanvas = document.getElementById("gameCanvas");
let ctx = gameCanvas.getContext("2d");
let monster;
let spaceBackground;
let bullet;
let spaceship;
let spaceshipX = 0;
let spaceshipY = 0;
let itemA;
let itemB;
let itemC;
let titleBoxLight = document.getElementById("titleBoxLight");
let tempLight = getComputedStyle(titleBoxLight).getPropertyValue("display");
let tempValue = {};
let tempBulletArray = [];
let score = 0;
let enemySpaceshipArray = [];
let gameOverValue = false;
let firstGameOverValue = true;
let itemTemp = [];

//아이템 클래스
class item {
	constructor() {
		this.value = 0;
		this.x = 0;
		this.y = 0;
	}
	itemInit() {
		this.value = randomValue(1, 3);
		this.x = randomValue(100, 200);
		this.y = randomValue(gameCanvas.height - 45, 5);
		itemTemp.push(this);
	}
	itemGet() {
		for (let i = 0; i < itemTemp.length; i++) {
			if (spaceshipX <= itemTemp[i].x + 60 && spaceshipX + 60 >= itemTemp[i].x
				&& spaceshipY >= itemTemp[i].y && spaceshipY - 80 <= itemTemp[i].y) {
				if (itemTemp[i].value == 1) {
					scrollLocation('article2');
				} else if (itemTemp[i].value == 2) {
					scrollLocation('article3');
				}
			}
		}
	}
}

//적 클래스
class enemySpaceship {
	constructor() {
		this.x = 0;
		this.y = 0;
	}
	enemySpaceshipInit() {
		this.x = 550;
		this.y = randomValue(gameCanvas.height - 40, 0);
		enemySpaceshipArray.push(this);
	}
	monsterMoving() {
		this.x -= 2;
	}
}

// 우주선, 총알
class shipBullet {
	constructor() {
		this.bulletX = 0;
		this.bulletY = 0;
	}
	bulletPosition() {
		this.bulletX = spaceshipX + 26;
		this.bulletY = spaceshipY + 14;
		this.bullet = true;
		tempBulletArray.push(this);
	}
	shot() {
		this.bulletX += 8;
	}
	bulletAttack() {
		for (let i = 0; i < enemySpaceshipArray.length; i++) {
			if (
				this.bulletY >= enemySpaceshipArray[i].y &&
				this.bulletY <= enemySpaceshipArray[i].y + 40 &&
				this.bulletX >= enemySpaceshipArray[i].x &&
				this.bulletX <= enemySpaceshipArray[i].x + 40
			) {
				score++;
				enemySpaceshipArray.splice(i, 1);
				this.bullet = false;
			} else { }
		}
	}
}

//능력치 아이콘 높이
function iconHeight(value1, value2, value3) {
	$(value1).delay(value2).animate({
		marginTop: value3
	}, 1000, 'swing');
}

//능력치 값 높이
function valueHeight(value1, value2, value3, value4) {
	$(value1).delay(value2).animate({
		marginTop: value3,
		height: value4
	}, 1000, 'swing');
}

//스크롤
function scrollLocation(name) {
	let articleLocation = document.querySelector('.' + name).offsetTop;
	basicBox.scrollTo({ top: articleLocation, behavior: 'smooth' });
}

//아이템 생성
function itemFunc() {
	setTimeout(function () {
		let items = new item();
		items.itemInit();
		itemFunc();
	}, 3000);
	setTimeout(function () {
		itemTemp.shift();
	}, 5000);
}

//이미지 생성
function imageLoad() {
	itemA = new Image();
	itemA.src = "../img/present.png";
	itemB = new Image();
	itemB.src = "../img/present2.png";
	itemC = new Image();
	itemC.src = "../img/dynamite.png";
	spaceBackground = new Image();
	spaceBackground.src = "../img/background.PNG";
	spaceship = new Image();
	spaceship.src = "../img/ship.png";
	bullet = new Image();
	bullet.src = "../img/shipBullet.png";
	monster = new Image();
	monster.src = "../img/monster.png";
}

//랜더링
function render() {
	ctx.drawImage(spaceBackground, 0, 0, gameCanvas.width, gameCanvas.height);
	ctx.drawImage(spaceship, spaceshipX, spaceshipY, 40, 40);
	for (let i = 0; i < tempBulletArray.length; i++) {
		if (tempBulletArray[i].bullet) {
			ctx.drawImage(bullet, tempBulletArray[i].bulletX, tempBulletArray[i].bulletY, 12, 12);
		}
	}
	for (let i = 0; i < enemySpaceshipArray.length; i++) {
		ctx.drawImage(monster, enemySpaceshipArray[i].x, enemySpaceshipArray[i].y, 56, 40);
	}
	for (let i = 0; i < itemTemp.length; i++) {
		if (itemTemp[i].value == 1) {
			ctx.drawImage(itemA, itemTemp[i].x, itemTemp[i].y, 40, 30);
		} else if (itemTemp[i].value == 2) {
			ctx.drawImage(itemB, itemTemp[i].x, itemTemp[i].y, 40, 30);
		}
	}
}

//게임 실행
function renderGame() {
	if (gameOverValue) {
		updateSpaceship();
		limitShip();
		render();
		gameOver();
		requestAnimationFrame(renderGame);
		ctx.fillText(`score : ${score}`, 15, 15);
		ctx.font = "1rem serif";
		ctx.fillStyle = 'white';
	} else if (firstGameOverValue) {
		render();
		requestAnimationFrame(renderGame);
	}
}

//반짝이는 효과
function light() {
	setTimeout(function () {
		if (tempLight == "none") {
			titleBoxLight.style.display = "block";
			tempLight = "block";
		} else if (tempLight == "block") {
			titleBoxLight.style.display = "none";
			tempLight = "none";
		} else { }
		light();
	}, 500);
}

//화살표 누를시 버튼 CSS 변경
function setPositionShip() {
	$(document).on("keydown", function (e) {
		tempValue[e.key] = true;
		if (e.key == " ") {
			$("#centerButton").css("background-color", "#751B1B");
			$("#centerButton").css("box-shadow", "0px 0px 0px black");
			$("#centerButton").css("margin-top", "-2.1rem");
		} else if (e.key == 'ArrowLeft') {
			$("#leftArrow").css("display", "none");
		} else if (e.key == 'ArrowRight') {
			$("#rightArrow").css("display", "none");
		} else if (e.key == 'ArrowUp') {
			$("#upArrow").css("display", "none");
		} else if (e.key == 'ArrowDown') {
			$("#downArrow").css("display", "none");
		}
	});
	$(document).on("keyup", function (e) {
		delete tempValue[e.key];
		if (e.key == " ") {
			creatBullet();
			$("#centerButton").css("box-shadow", "0px 0.3125rem 0px black");
			$("#centerButton").css("background-color", "red");
			$("#centerButton").css("margin-top", "-2.5rem");
		} else if (e.key == 'ArrowLeft') {
			$("#leftArrow").css("display", "block");
		} else if (e.key == 'ArrowRight') {
			$("#rightArrow").css("display", "block");
		}
		else if (e.key == 'ArrowUp') {
			$("#upArrow").css("display", "block");
		}
		else if (e.key == 'ArrowDown') {
			$("#downArrow").css("display", "block");
		}
	});
}

//비행기 리미트
function limitShip() {
	if (spaceshipY < 0) {
		spaceshipY = 0;
	}
	if (spaceshipX < 5) {
		spaceshipX = 5;
	}
	if (spaceshipY > 315) {
		spaceshipY = 315;
	}
	if (spaceshipX > 590) {
		spaceshipX = 590;
	}
}

//비행기 위치 변경
function updateSpaceship() {
	if ('ArrowDown' in tempValue) {
		spaceshipY += 5;
	}
	if ('ArrowUp' in tempValue) {
		spaceshipY -= 5;
	}
	if ('ArrowRight' in tempValue) {
		spaceshipX += 5;
	}
	if ('ArrowLeft' in tempValue) {
		spaceshipX -= 5;
	}
	for (let i = 0; i < tempBulletArray.length; i++) {
		if (tempBulletArray[i].bullet) {
			tempBulletArray[i].shot();
			tempBulletArray[i].bulletAttack();
		} else { }
	}
	for (let i = 0; i < enemySpaceshipArray.length; i++) {
		enemySpaceshipArray[i].monsterMoving();
	}
	for (let i = 0; i < itemTemp.length; i++) {
		itemTemp[i].itemGet();
	}
}

//총알 생성
function creatBullet() {
	let tempBulletBox = new shipBullet();
	tempBulletBox.bulletPosition();
}

//랜덤 숫자
function randomValue(min, max) {
	let randomValue = Math.floor(Math.random() * (max - min + 1)) + min
	return randomValue;
}

//게임 끝
function gameOver() {
	for (let i = 0; i < enemySpaceshipArray.length; i++) {
		if (enemySpaceshipArray[i].x <= 0) {
			$(".gameOver").css("display", "block");
			gameOverValue = false;
		}
	}
}

//적군 생성
function createEnemySpaceship() {
	setTimeout(function () {
		let enemy = new enemySpaceship();
		enemy.enemySpaceshipInit();
		createEnemySpaceship();
	}, 1000);
}

//게임 시작
function gameStart() {
	$(".gameStart").on("click", function () {
		$(".gameStart").css("display", "none");
		gameOverValue = true;
		firstGameOverValue = false;
		renderGame();
	});
}

//게임 재 시작
function gameRestart() {
	$(".gameOver").on("click", function () {
		$(".gameOver").css("display", "none");
		score = 0;
		tempBulletArray = [];
		enemySpaceshipArray = [];
		itemTemp = [];
		spaceshipX = 0;
		spaceshipY = 0;
		gameOverValue = true;
		renderGame();
	});
}

$("#manualBtn").on("click", function () {
	$("#manual").css(
		'display', 'block'
	);
});

$("#deleteBox").on("click", function () {
	$("#manual").css(
		'display', "none"
	);
});

//개인정보
$("#human").on("click", function () {
	if (matchMedia("screen and (min-width: 1024px)").matches) {
		$(".kwanghoBox").animate({
			marginLeft: '-34rem',
			opacity: "1"
		}, 1000, 'swing');
	}
	if (matchMedia("screen and (max-width: 480px)").matches) {
		$(".kwanghoBox").animate({
			opacity: "1"
		}, 1000, 'swing');
	}

	if (matchMedia("screen and (min-width: 1024px)").matches) {
		$(".addressBox").animate({
			marginLeft: '10rem',
			opacity: "1"
		}, 1000, 'swing');
	}
	if (matchMedia("screen and (max-width: 480px)").matches) {
		$(".addressBox").animate({
			marginLeft: '-11.5rem',
			opacity: "1"
		}, 1000, 'swing');
	}
	$(".fontA").animate({
		marginTop: "10rem",
		marginLeft: "25rem",
		opacity: '0'
	}, 1000, "swing");
	$(".fontB").animate({
		marginTop: "17rem",
		marginLeft: "-75rem",
		opacity: '0'
	}, 1000, "swing");
	$(".programIcon").animate({
		opacity: '0'
	});
	$(".levelValue").animate({
		opacity: '0'
	});

	valueHeight('.value1', '100', '0rem', '0rem');
	iconHeight('.programIcon1', '100', '0rem');

	valueHeight('.value2', '100', '0rem', '0rem');
	iconHeight('.programIcon2', '100', '0rem');

	valueHeight('.value3', '100', '0rem', '0rem');
	iconHeight('.programIcon3', '100', '0rem');

	valueHeight('.value4', '100', '0rem', '0rem');
	iconHeight('.programIcon4', '100', '0rem');

	valueHeight('.value5', '100', '0rem', '0rem');
	iconHeight('.programIcon5', '100', '0rem');

	valueHeight('.value6', '100', '0rem', '0rem');
	iconHeight('.programIcon6', '100', '0rem');

	valueHeight('.value7', '100', '0rem', '0rem');
	iconHeight('.programIcon7', '100', '0rem');

	valueHeight('.value8', '100', '0rem', '0rem');
	iconHeight('.programIcon8', '100', '0rem');

	valueHeight('.value9', '100', '0rem', '0rem');
	iconHeight('.programIcon9', '100', '0rem');
});

//능력치
$("#swordIcon").on('click', function () {
	if (matchMedia("screen and (min-width: 1024px)").matches) {
		$(".kwanghoBox").animate({
			marginLeft: '-140rem',
			opacity: "0"
		}, 1000, 'swing');
	}
	if (matchMedia("screen and (max-width: 480px)").matches) {
		$(".kwanghoBox").animate({
			opacity: "0"
		}, 1000, 'swing');
	}

	if (matchMedia("screen and (min-width: 1024px)").matches) {
		$(".addressBox").animate({
			marginLeft: '75rem',
			opacity: "0"
		}, 1000, 'swing');
	}
	if (matchMedia("screen and (max-width: 480px)").matches) {
		$(".addressBox").animate({
			marginLeft: '50rem',
			opacity: "0"
		}, 1000, 'swing');
	}
	$(".fontA").animate({
		marginLeft: '-35rem',
		opacity: '1'
	}, 1000, 'swing');

	$(".fontB").animate({
		marginLeft: '-17.5rem',
		opacity: '1'
	}, 1000, 'swing');

	$(".levelValue").delay(500).animate({
		opacity: "1"
	});

	$(".programIcon").delay(500).animate({
		opacity: "1"
	});

	valueHeight('.value1', '500', '-5rem', '5rem');
	iconHeight('.programIcon1', '500', '-5rem');

	valueHeight('.value2', '1000', '-7.5rem', '7.5rem');
	iconHeight('.programIcon2', '1000', '-7.5rem');

	valueHeight('.value3', '1500', '-7rem', '7rem');
	iconHeight('.programIcon3', '1500', '-7rem');

	valueHeight('.value4', '2000', '-6.5rem', '6.5rem');
	iconHeight('.programIcon4', '2000', '-6.5rem');

	valueHeight('.value5', '2500', '-6rem', '6rem');
	iconHeight('.programIcon5', '2500', '-6rem');

	valueHeight('.value6', '3000', '-5rem', '5rem');
	iconHeight('.programIcon6', '3000', '-5rem');

	valueHeight('.value7', '3500', '-8rem', '8rem');
	iconHeight('.programIcon7', '3500', '-8rem');

	valueHeight('.value8', '4000', '-6rem', '6rem');
	iconHeight('.programIcon8', '4000', '-6rem');

	valueHeight('.value9', '4500', '-8.5rem', '8.5rem');
	iconHeight('.programIcon9', '4500', '-8.5rem');
});

//카드 클릭
function cardClick(className, link1, link2) {
	$(className + ' > .contentBox1').on('click', function () {
		window.open(link1, '_blank');
	});

	$(className + ' > .contentBox2').on('click', function () {
		window.open(link2, '_blank');
	});
}

//포트폴리오 링크
cardClick('.card6', 'http://kkms4001.iptime.org:4113/', '');
cardClick('.card2', 'http://kkms4001.iptime.org/~c17st01/project/2.matrixCalculator/build/html/matrix.html', '');
cardClick('.card3', 'http://kkms4001.iptime.org/~c17st01/project/3.converter/build/html/jinsoo.html', '');
cardClick('.card4', 'http://kkms4001.iptime.org:4152/', '');
cardClick('.card5', 'http://kkms4001.iptime.org:4191/', '');
$('.card1 > .contentBox1').on('click', function () {
	scrollLocation('article1');
});
$('.card6 > .contentBox2').on('click', function () {
	//피피티 확인하기
	window.open('','_blank');
});

$(".introduce").animate({
	marginLeft: '-80rem',
	opacity: "0.7"
}, 1000, 'swing');

$(".introduce2").animate({
	marginLeft: '-80rem'
}, 1000, 'swing');

$(".introA").animate({
	opacity: "1"
}, 1000, 'swing');

$(".introB").animate({
	opacity: "0.7"
}, 1000, 'swing');

$('.human').hover(function () {
	$('.iconJumpH1').css('opacity', '1');
}, function () {
	$('.iconJumpH1').css('opacity', '0');
});

$('.swordIcon').hover(function () {
	$('.iconJumpH2').css('opacity', '1');
}, function () {
	$('.iconJumpH2').css('opacity', '0');
});

$('.addressBoxA ').click(()=>{
	$('.address').html("Name: 강광호<br><br>Birthday: 1996.01.09<br><br>Address: 경기도 시흥시 정왕동<br><br>Mobile: 010 2281 4382<br><br>License: 무대기계3급, ITQ OA Master, 컴퓨터활용능력2급, <br>운전면허1종보통</p>");
});

$('.addressBoxB ').click(()=>{
	$('.address').html("College: 디지털서울문화예술대학교(졸업)<br><br>Department: 실용무용과<br><br>High School: 정왕고등학교(이과)");
});

$('.addressBoxC ').click(()=>{
	$('.address').html("[Career]<br><br>- Expression Crew '마리오네트' 공연 ( 2014 )<br><br>- SMART 무대팀에서 근무( 2016 - 2017 )<br><br>- 기광정밀 '방위산업체'( 2017 - 2020 )<br><br>- 무대 조감독으로 각종 공연 진행( 2021 - 2022 )");
});



itemFunc();
gameRestart();
gameStart();
imageLoad();
render();
createEnemySpaceship();
setPositionShip();
light();