
$("h1").click(function(){
  $("h1").css("color","blue");
});
// $("button").html("<em>hey</em>");
// console.log($("a").attr("href"));
// $("body").keydown(function(event){
//   if(event.key==="k"){
//
//     $("h1").text("yakov");
//     }
//
//
//
//     else{
//       console.log(event.key);
//     }
//
//
// });
$("button").on("click",function(){
  $("h1").slideUp().slideDown().animate({opacity:0.5});
});
