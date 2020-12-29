const { Schema, model } = require('mongoose');

const RolesShopSchema = new Schema({
    guildID: {
        type: String,
        required: true
    },
    message: {
      id: {
        type: String,
        required: true,
        default: 'Not'
      },
      description: {
        type: String,
        required: true,
        default: 'Здесь вы можете преобрести роль нажав на реакцию'
      }
    },
    roles: {
      type: Array,
      required: true
    },
    config: {
      removeRoles: {
        type: Boolean,
        required: true,
        default: true
      }
    }
});

module.exports = model('roles-shops', RolesShopSchema);