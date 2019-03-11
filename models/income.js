//INCOME MODEL TO STORE USERS EXPENSES

module.exports = function(sequelize, DataTypes) {
    let income = sequelize.define("income", {
            // monthlyIncome: {
            //     type: DataTypes.INTEGER,
            //     allowNull: false
            // },
            expenses: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING,
                defaultValue: "Personal"
            }, 
            notes: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    len: [1]
                }
            }
        });

        income.associate = function(models) {
            income.belongsTo(models.userSignUp, {
                foreignKey: {
                    allowNull: false
                }
            });
        }

        return income;
};

