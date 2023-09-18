const Sequelize = require('sequelize');
const sequelize = new Sequelize('social-appli','root','Karthik@26',{
    dialect:"mysql",host:'localhost'
})

module.exports = sequelize;

