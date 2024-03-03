"use strict";

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      // cedula: { type: DataTypes.STRING, primaryKey: true },
      apellidos: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      nombres: { type: DataTypes.STRING(150), defaultValue: "NONE" },
      direccion: { type: DataTypes.STRING, defaultValue: "NONE" },
      celular: { type: DataTypes.STRING(20), defaultValue: "NONE" },
      fecha_nac: { type: DataTypes.DATEONLY },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    { freezeTableName: true }
  );

  user.associate = function (models) {
    user.hasOne(models.cuenta, { foreignKey: "id_user", as: "cuenta" });
    user.belongsTo(models.rol, { foreignKey: "rol_id" });
    user.hasMany(models.auto, {
      foreignKey: "user_id",
      as: "autos",
    });
    user.hasOne(models.orden, {
      foreignKey: "consumer_id",
      sourceKey: "id",
    });
    user.hasOne(models.orden, {
      foreignKey: "salesman_id",
      sourceKey: "id"
    });
  };

  return user;
};
