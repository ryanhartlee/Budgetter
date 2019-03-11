//USER MODEL TO STORE USERS DETAILS

//DEPENDENCEIS

//USED TO ENCRYPT THE PASSWORD
var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
    let userSignUp = sequelize.define("userSignUp", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 30]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 15]
            }
        },
        monthlyIncome: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        personalize:{
            type: DataTypes.STRING,
            defaultValue:"ee6e73"
        }
    });

    userSignUp.associate = function(models) {
        // Associating USER with INCOME
        // When an USER is deleted, also delete any associated INCOME DETAILS
        userSignUp.hasMany(models.income, {
          onDelete: "cascade"
        });
      };
    


// Creating a custom method for our User model. This will check if an unhashed password
// entered by the user can be compared to the hashed password stored in our database

    userSignUp.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };
    
// Hooks are automatic methods that run during various phases of the User Model lifecycle
// In this case, before a User is created, we will automatically hash their password

      
    userSignUp.hook("beforeCreate", function(user) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
    });

    return userSignUp;
};

