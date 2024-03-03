"use strict";
module.exports = ( sequelize, DataTypes ) => {
    const auto = sequelize.define('auto', {
        modelo: {type: DataTypes.STRING(100)},
        descripcion: {type: DataTypes.STRING(200)},
        marca: {type: DataTypes.ENUM(['TOYOTA', 'HYUNDAI', 'KIA', 'MAZDA', 'CHEVROLET'])}, 
        fotos: {type: DataTypes.STRING},
        precio: {type: DataTypes.FLOAT}, 
        color: {type: DataTypes.ENUM(['BLANCO', 'ROJO', 'NEGRO', 'GRIS', 'AZUL', 'PLATA' ])},
        external_id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4}
    },
    {timestamps: false, freezeTableName: true}
    );
    auto.associate = function(models){
        auto.hasMany(models.existencia, {
            foreingKey: "auto_id",
            as: "existenciasA"
        });
        auto.belongsToMany(models.orden, {
            as: "detallesAuto",
            through: "detalle",
            foreignKey: 'auto_id',
            otherKey: "orden_id",
            timestamps: true
        });
        auto.belongsTo(models.user, {
            foreingKey: 'user_id'
        });
    }
    return auto;
}