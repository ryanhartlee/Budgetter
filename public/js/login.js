$(document).ready(function(){
    $("#login").on("click", checkAuthentication);
})
//function to store new user details.
function checkAuthentication(){
    if(($("#username").val()) === ""){
        alert("please enter valid username");
    } 
    else if(($("#password").val()) === ""){
        alert("please enter your password");
    } 
    else{
       var user={
           username:$("#username").val().trim(),
           password:$("#password").val().trim()
       };
      $.ajax("/user/login",{
          type:"POST",
          data:user
      }).then(function(data){
           console.log("login successfull");
           window.location.replace(data);
      }).catch(function(err) {
        $("#username").val("");
        $("#password").val("");
        alert("Invalid Username Or Password");
      });

    }
}
