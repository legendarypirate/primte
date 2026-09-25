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
const ProductCategory = require('./productCategory');
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
const SitePage = require('./sitePage');
const SiteLayout = require('./siteLayout');

const ScoringProfile = require('./scoringProfile');
const Match = require('./match');
const MatchDivision = require('./matchDivision');
const MatchCategory = require('./matchCategory');
const Squad = require('./squad');
const Stage = require('./stage');
const Competitor = require('./competitor');
const Score = require('./score');
const StageResult = require('./stageResult');
const MatchResult = require('./matchResult');
const ScoreRevision = require('./scoreRevision');
const AuditLog = require('./auditLog');
const SyncOperation = require('./syncOperation');
const Official = require('./official');

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
Competition.hasOne(Match, { foreignKey: 'competitionId' });
Match.belongsTo(Competition, { foreignKey: 'competitionId' });

Member.hasMany(Attendance, { foreignKey: 'memberId' });
Attendance.belongsTo(Member, { foreignKey: 'memberId' });

Member.hasOne(MemberProgress, { foreignKey: 'memberId', as: 'progress' });
MemberProgress.belongsTo(Member, { foreignKey: 'memberId' });

Parent.hasMany(Payment, { foreignKey: 'parentId' });
Payment.belongsTo(Parent, { foreignKey: 'parentId' });
Payment.belongsTo(Member, { foreignKey: 'memberId' });

Match.belongsTo(ScoringProfile, { foreignKey: 'scoringProfileId', targetKey: 'id' });
Match.hasMany(MatchDivision, { foreignKey: 'matchId' });
Match.hasMany(MatchCategory, { foreignKey: 'matchId' });
Match.hasMany(Squad, { foreignKey: 'matchId' });
Match.hasMany(Stage, { foreignKey: 'matchId' });
Match.hasMany(Competitor, { foreignKey: 'matchId' });
Match.hasMany(Score, { foreignKey: 'matchId' });
Match.hasMany(StageResult, { foreignKey: 'matchId' });
Match.hasMany(MatchResult, { foreignKey: 'matchId' });

MatchDivision.belongsTo(Match, { foreignKey: 'matchId' });
MatchCategory.belongsTo(Match, { foreignKey: 'matchId' });
Squad.belongsTo(Match, { foreignKey: 'matchId' });
Stage.belongsTo(Match, { foreignKey: 'matchId' });

Competitor.belongsTo(Match, { foreignKey: 'matchId' });
Competitor.belongsTo(Registration, { foreignKey: 'registrationId' });
Competitor.belongsTo(Member, { foreignKey: 'memberId' });
Competitor.belongsTo(Squad, { foreignKey: 'squadId' });
Competitor.belongsTo(MatchDivision, { foreignKey: 'matchDivisionId' });
Competitor.belongsTo(MatchCategory, { foreignKey: 'categoryId' });
Squad.hasMany(Competitor, { foreignKey: 'squadId' });

Score.belongsTo(Match, { foreignKey: 'matchId' });
Score.belongsTo(Stage, { foreignKey: 'stageId' });
Score.belongsTo(Competitor, { foreignKey: 'competitorId' });
Score.hasMany(ScoreRevision, { foreignKey: 'scoreId' });

StageResult.belongsTo(Match, { foreignKey: 'matchId' });
StageResult.belongsTo(Stage, { foreignKey: 'stageId' });
StageResult.belongsTo(Competitor, { foreignKey: 'competitorId' });

MatchResult.belongsTo(Match, { foreignKey: 'matchId' });
MatchResult.belongsTo(Competitor, { foreignKey: 'competitorId' });

ScoreRevision.belongsTo(Score, { foreignKey: 'scoreId' });

Official.belongsTo(Admin, { foreignKey: 'adminId' });
Admin.hasOne(Official, { foreignKey: 'adminId' });

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
  ProductCategory,
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
  SitePage,
  SiteLayout,
  ScoringProfile,
  Match,
  MatchDivision,
  MatchCategory,
  Squad,
  Stage,
  Competitor,
  Score,
  StageResult,
  MatchResult,
  ScoreRevision,
  AuditLog,
  SyncOperation,
  Official,
};
