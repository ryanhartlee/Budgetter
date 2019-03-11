//Materialize JS------

//GLOBAL VARIABLES
var income = 0;
var bal = 0;
var date;


$(document).ready(function () {

  //route to get personalize data from database
  $.ajax("/personalize", {
    type: "GET",
  }).then(function (data) {

    $(".colornav").css("background-color", data.personalize);
    $("#username").text(data.userName);
    $("#income").text("$" + data.monthlyIncome);
    income = data.monthlyIncome;
  });

  //ON CLICK EVENTS
  $("#addExp").on("click", sumbitExp);
  $("#incomeUpdation").on("click", changeIncome);
  $('#viewexpenses').on('click', viewExpenses);

  //route to update personalize 
  $("#dropdown1 li").on("click", function () {
    var colorValue = {
      personalize: $(this).text()
    };
    $.ajax("/personalize/update", {
      type: "PUT",
      data: colorValue
    }).then(function () {
      location.reload();
    });
  })

  //DROPDOWN TRIGGERS
  $('.dropdown-trigger').dropdown();
  $('.dropdown-trigger2').dropdown();
  $('.sidenav').sidenav();
  $('.modal').modal();
  $('select').formSelect();
  $('#showexpenses').hide();
  $('#viewGraph').on('click', function () {
    graph();
  })


  // VEIW EXPENSES ACCORDING TO CATEGORY
  $('#dropdown3 li').on('click', function () {
    var category = $(this).text();
    $('#expTable').empty();
    $.ajax("/expense/" + category, {
      type: "GET",
    }).then(function (data) {
      displayData(data, category);
    })
  });

  //VEIW EXPENSES ACCORDING TO DATE
  $('#dropdown2 li').on('click', function () {
    var userChoice = $(this).text();
    $('#expTable').empty();
    $.ajax("/current/days", {
      type: "GET",
    }).then(function (data) {
      if (userChoice === "This Week") {
        thisWeekData(data, userChoice);
      }
      if (userChoice === "This Month") {
        thisMonthData(data, userChoice);
      }
      if (userChoice === "This Year") {
        thisYearData(data, userChoice);
      }
    });
  });
});


//DISPLAY DATA ACCORDING TO DATES
function displayDateData(data, userChoice, startDate) {
  var total=0;
  var userDate;
  for (let i = 0; i < data.length; i++) {
    userDate = moment(data[i].createdAt).format("D");
    date = moment(data[i].createdAt).format("dddd, MMMM Do YYYY");
    if (userDate >= startDate) {
      let row = $("<tr>");
      row.append("<td>" + date);
      row.append("<td>" + "$" + data[i].expenses);
      row.append("<td>" + data[i].notes);
      row.append("<td>" + data[i].category);
      row.append("<button class='btn deleteExp' data-name=" + data[i].id + ">Delete</button>");
      $("#expTable").append(row);
      total += data[i].expenses;
    }
  }
  $("#total").text(userChoice + " Total: $ " + total);
}


//DISPLAY DATA ACCORDING TO CATEGORY
function displayData(data, choice) {
  var total=0;
  for (let i = 0; i < data.length; i++) {
    date = moment(data[i].createdAt).format("dddd, MMMM Do YYYY");
    let row = $("<tr>");
    row.append("<td>" + date);
    row.append("<td>" + "$" + data[i].expenses);
    row.append("<td>" + data[i].notes);
    row.append("<td>" + data[i].category);
    row.append("<button class='btn deleteExp' data-name=" + data[i].id + ">Delete</button>");
    $("#expTable").append(row);
    total += data[i].expenses;
  }
  $("#total").text(choice + " Total: $" + total);
}


//CALCULATE STARTING DATE OF THIS WEEK
function thisWeekData(data, userChoice) {
  var startOfWeek = moment().startOf('week').toDate();
  var startDate = moment(startOfWeek).format("D");
  displayDateData(data, userChoice, startDate);
}

//CALCULATE STARTING DATE OF THIS MONTH
function thisMonthData(data, userChoice) {
  var startOfMonth = moment().startOf('month').toDate();
  var startDate = moment(startOfMonth).format("D");
  displayDateData(data, userChoice, startDate); 
}

//CALCULATE STARTING DATE OF THIS YEAR
function thisYearData(data, userChoice) {
  var startOfYear = moment().startOf('year').toDate();
  var startDate = moment(startOfYear).format("D");
  displayDateData(data, userChoice, startDate); 
}

//delete function******
function deleteEntry(id) {
  console.log(id);
  $.ajax({
    method: "DELETE",
    url: "/api/user/income/" + id//*******/
  })
    .then(function () {
      viewExpenses();
    });
};

//Submits new Entry****Needs route
function sumbitExp() {
  var amount = $("#addexpense-amount").val();
  var notes = $("#addexpense-note").val();
  if (amount === "") {
    alert("please enter the amount");
  }
  else if (notes === "") {
    alert("please enter notes");
  }
  else {
    var newExpense = {
      expenses: $("#addexpense-amount").val().trim(),
      notes: $("#addexpense-note").val().trim(),
      category: $("#expCategory option:selected").text()
    };
    $.ajax("/user/addexpenses", {
      type: "POST",
      data: newExpense
    }).then(function (data) {
      $("#addexpense-amount").val("");
      $("#addexpense-note").val("");
      alert("New Expense is added to your account");
      viewExpenses();
    })
  }
};

// Graph
var entertainmentTotal = 0;
var billsTotal = 0;
var foodTotal = 0;

function graph() {
  var data = [{
    values: [entertainmentTotal, billsTotal, foodTotal],
    labels: ['Bills', 'Entertainment', 'Food'],
    type: 'pie'
  }];

  Plotly.newPlot('myDiv', data, {}, { showSendToCloud: true });
};

//Show Expenses
function viewExpenses() {
  $('#jumbo').hide();
  $('#showexpenses').show();
  $('#expTable').empty();
  var total = 0;

  $.get("/user", function (data) {
    for (let i = 0; i < data.length; i++) {
      date = moment(data[i].createdAt).format("dddd, MMMM Do YYYY");
      let row = $("<tr>");
      row.append("<td>" + date);
      row.append("<td>" + "$" + data[i].expenses);
      row.append("<td>" + data[i].notes);
      row.append("<td>" + data[i].category);
      row.append("<button class='btn deleteExp' data-name=" + data[i].id + ">Delete</button>");
      $("#expTable").append(row);
      total += data[i].expenses;

      // Graph Variables
      if (data[i].category === "Bills") {
        entertainmentTotal += data[i].expenses
        console.log("enter" + entertainmentTotal);
      }
      else if (data[i].category === "Entertainment") {
        billsTotal += data[i].expenses
        console.log("bills" + billsTotal);
      }
      else {
        foodTotal += data[i].expenses
        console.log("Food" + foodTotal);
      };
    }
    bal = income - total;
    $("#total").text("Total: $" + total);
    $("#Bal").text("Balance: $" + bal);
    $("#inc").text("Monthly Income: $" + income);
  })
};

//TO UPDATE MONTHLY INCOME
function changeIncome() {
  if (($("#updateIncome").val()) === "") {
    alert("please enter your new Income");
  }
  else {
    var newIncome = {
      monthlyIncome: $("#updateIncome").val().trim()
    };
    $.ajax("/update/income", {
      type: "PUT",
      data: newIncome
    }).then(function (data) {
      location.reload();
    });
  }
}
// Delete expense from table
$('#expTable').on('click', "button", function () {
  var id = $(this).attr("data-name");
  console.log("id=" + id);
  // console.log(id);
  deleteEntry(id);
});

