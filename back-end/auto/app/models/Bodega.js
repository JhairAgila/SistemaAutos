"use strict";

module.exports = (sequelize, DataTypes) => {
    const bodega = sequelize.define(
        "bodega",
        {
            nombre: {type: DataTypes.STRING(100)},
            ubicacion: {type: DataTypes.STRING(150)},
            tamanio: {type: DataTypes.FLOAT},
            external_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
        },
        { freezeTableName: true}
    );

    bodega.associate = function(models){
        bodega.hasMany(models.existencia, {
            foreignKey: "bodega_id",
            as: "existenciasB"
        });
    }
    return bodega;
}