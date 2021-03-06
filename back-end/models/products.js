'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products.belongsTo(models.categories)
      products.belongsTo(models.users, {foreignKey: 'storeId'})
      products.belongsToMany(models.dropships, {through: models.products_dropships})
      //UNFINISHED
    }
  };
  products.init({
    name: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    categoryName: {
      type: DataTypes.STRING,
      references: {
        model: 'categories',
        key: 'name'
      }
    },
    variant: DataTypes.STRING,
    note: DataTypes.TEXT,
    storeId: {
      type: DataTypes.STRING,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING(1),
      defaultValue: 'N'
    }
  }, {
    sequelize,
    modelName: 'products',
    underscored: false
  });
  return products;
};