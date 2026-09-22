const sequelize = require('../config/database');
const Admin = require('./admin');
const Role = require('./role');
const Parent = require('./parent');
const Member = require('./member');
const MemberType = require('./memberType');
const DevelopmentActivity = require('./developmentActivity');
const MatchType = require('./matchType');
const Division = require('./division');

const Product = require('./product');
const Competition = require('./competition');
const Training = require('./training');
const Notice = require('./notice');
const Transaction = require('./transaction');
const Order = require('./order');
const OrderItem = require('./orderItem');
const Registration = require('./registration');
const Attendance = require('./attendance');
const MemberProgress = require('./memberProgress');
const Payment = require('./payment');
const Setting = require('./setting');

Admin.belongsTo(Role, { foreignKey: 'roleId' });
Role.hasMany(Admin, { foreignKey: 'roleId' });

Parent.hasMany(Member, { foreignKey: 'parentAccountId', as: 'children' });
Member.belongsTo(Parent, { foreignKey: 'parentAccountId', as: 'parentAccount' });

Member.belongsTo(MemberType, { foreignKey: 'memberTypeId' });
MemberType.hasMany(Member, { foreignKey: 'memberTypeId' });
Member.belongsTo(DevelopmentActivity, { foreignKey: 'developmentActivityId' });
DevelopmentActivity.hasMany(Member, { foreignKey: 'developmentActivityId' });
Member.belongsTo(Member, { as: 'parent', foreignKey: 'parentId' });
Member.hasMany(Member, { as: 'legacyChildren', foreignKey: 'parentId' });

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
Registration.belongsTo(Division, { foreignKey: 'divisionId' });

Competition.belongsTo(MatchType, { foreignKey: 'matchTypeId' });

Member.hasMany(Attendance, { foreignKey: 'memberId' });
Attendance.belongsTo(Member, { foreignKey: 'memberId' });

Member.hasOne(MemberProgress, { foreignKey: 'memberId', as: 'progress' });
MemberProgress.belongsTo(Member, { foreignKey: 'memberId' });

Parent.hasMany(Payment, { foreignKey: 'parentId' });
Payment.belongsTo(Parent, { foreignKey: 'parentId' });
Payment.belongsTo(Member, { foreignKey: 'memberId' });

module.exports = {
  sequelize,
  Admin,
  Role,
  Parent,
  Member,
  MemberType,
  DevelopmentActivity,
  MatchType,
  Division,
  Product,
  Competition,
  Training,
  Notice,
  Transaction,
  Order,
  OrderItem,
  Registration,
  Attendance,
  MemberProgress,
  Payment,
  Setting,
};
