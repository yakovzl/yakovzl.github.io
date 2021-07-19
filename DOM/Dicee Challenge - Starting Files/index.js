var randomNumber1=Math.floor(Math.random()*6+1);
var randomNumber2=Math.floor(Math.random()*6+1);

document.querySelector("img").setAttribute("src","images/dice"+randomNumber1+".png");
document.querySelectorAll("img")[1].setAttribute("src","images/dice"+randomNumber2+".png");

if(randomNumber1>randomNumber2)
{
  document.querySelector("h1").innerHTML="🏁 winer is player 1";
}
else if(randomNumber2>randomNumber1){
  document.querySelector("h1").innerHTML="winer is player 2";
}
else{
  document.querySelector("h1").innerHTML="there is no winer here";
}
