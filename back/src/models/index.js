const sequelize = require('../config/database');
const Admin = require('./admin');
const Role = require('./role');
const Member = require('./member');
const MemberType = require('./memberType');
const DevelopmentActivity = require('./developmentActivity');
const Product = require('./product');
const Competition = require('./competition');
const Training = require('./training');
const Notice = require('./notice');
const Transaction = require('./transaction');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Registration = require('./registration');
const Attendance = require('./attendance');
const Setting = require('./setting');

Admin.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(Admin, { foreignKey: 'roleId' });

Member.belongsTo(MemberType, { foreignKey: 'memberTypeId' });
MemberType.hasMany(Member, { foreignKey: 'memberTypeId' });
Member.belongsTo(DevelopmentActivity, { foreignKey: 'developmentActivityId' });
DevelopmentActivity.hasMany(Member, { foreignKey: 'developmentActivityId' });
Member.belongsTo(Member, { as: 'parent', foreignKey: 'parentId' });
Member.hasMany(Member, { as: 'children', foreignKey: 'parentId' });

Member.hasMany(Transaction, { foreignKey: 'memberId' });
Transaction.belongsTo(Member, { foreignKey: 'memberId' });

Member.hasMany(Order, { foreignKey: 'memberId' });
Order.belongsTo(Member, { foreignKey: 'memberId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

Member.belongsToMany(Competition, { through: Registration, foreignKey: 'memberId' });
Competition.belongsToMany(Member, { through: Registration, foreignKey: 'competitionId' });
Registration.belongsTo(Member, { foreignKey: 'memberId' });
Registration.belongsTo(Competition, { foreignKey: 'competitionId' });

Member.hasMany(Attendance, { foreignKey: 'memberId' });
Attendance.belongsTo(Member, { foreignKey: 'memberId' });

module.exports = {
  sequelize,
  Admin,
  Role,
  Member,
  MemberType,
  DevelopmentActivity,
  Product,
  Competition,
  Training,
  Notice,
  Transaction,
  Order,
  OrderItem,
  Registration,
  Attendance,
  Setting,
};
