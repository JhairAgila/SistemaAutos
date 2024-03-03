"use strict";

module.exports = (sequelize, DataTypes) => {
    const orden = sequelize.define(
        "orden",
        {
            fecha: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
            subtotal: {type: DataTypes.FLOAT},
            iva: {type: DataTypes.FLOAT},
            total: {type: DataTypes.FLOAT},
            external_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4},
        }
    )

    orden.associate = function(models){
        orden.belongsTo(models.user, {
            foreignKey: 'consumer_id',
            targetKey: 'id'
        });
        orden.belongsTo(models.user, {
            foreignKey: 'salesman_id',
            targetKey: 'id'
        });
        orden.belongsToMany(models.auto, {
            as: "detallesOrden",
            through: "detalle",
            foreignKey: 'orden_id',
            otherKey: "auto_id",
            timestamps: true
        });
    }

    return orden;

};