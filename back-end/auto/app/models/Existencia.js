"use strict";

module.exports = (sequelize, DataTypes) => {
    const existencia = sequelize.define(
        "existencia",
        {
            cantidad: {type: DataTypes.INTEGER},
            valor: {type: DataTypes.FLOAT},
            external_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
        },
        {freezeTableName: true}
    );

    existencia.associate = function(models){
        existencia.belongsTo(models.auto, {
            foreignKey: "auto_id"
        });
        existencia.belongsTo(models.bodega, {
            foreignKey: "bodega_id",
        });
    }
    return existencia;

}