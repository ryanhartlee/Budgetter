$(document).ready(function(){
    $("#register").on("click",newUserDetails);
})
//function to store new user details.
function newUserDetails(event){
    event.preventDefault();
    console.log('newUserDetails called');
    
    var pwd=$("#password").val();
    var confirmpwd=$("#confirmpassword").val();
    var monthlyIncome = decimalCheck($('#monthlyIncome').val());

    if(($("#username").val()) === ""){
        alert("Please enter valid username");
    } 
    else if(pwd === "" || pwd.length < 6){
        alert("Please set your password to more than 6 characters");
    } 
    else if(monthlyIncome === "" || !monthlyIncome){
        alert("Please enter a valid income");
    } 
    else if(pwd !== confirmpwd){
        alert("password does not match");
    }
    else{
       
       var newUser={
           username:$("#username").val().trim(),
           password:$("#password").val().trim(),
           monthlyIncome:$("#monthlyIncome").val().trim()
       };

       console.log('newUser' ,newUser);
       
      $.ajax("/signup/post",{
          type:"POST",
          data:newUser
      }).then(function(data){
          console.log("hello")
           alert("you are successfuly registered");
           window.location = '/';
      })  
    }

    
    
}




    function decimalCheck(num){
        // var regEx = /^(\$)?([1-9]{1}[0-9]{0,2})(\,\d{3})*(\.\d{2})?$|^(\$)?([1-9]{1}[0-9]{0,2})(\d{3})*(\.\d{2})?$|^(0)?(\.\d{2})?$|^(\$0)?(\.\d{2})?$|^(\$\.)(\d{2})?$/

        const regEx = /^(0|0?[1-9]\d*)\.\d\d$/;

        return regEx.test(num)
    }