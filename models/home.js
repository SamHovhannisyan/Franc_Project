'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Home extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Home.init({
    textAm: DataTypes.STRING,
    textRu: DataTypes.STRING,
    textEn: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Home',
  });
  return Home;
};