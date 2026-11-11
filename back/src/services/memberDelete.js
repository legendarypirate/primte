const {
  sequelize,
  Member,
  Registration,
  Attendance,
  MemberPointEvent,
  MemberProgress,
  Judge,
  Payment,
  Order,
  OrderItem,
  Transaction,
} = require('../models');
const { removeCompetitorsByMemberId } = require('./competitorService');

async function setForeignKeyAction(table, constraint, column, refTable, { onDelete, onUpdate }) {
  await sequelize.query(`ALTER TABLE "${table}" DROP CONSTRAINT IF EXISTS "${constraint}"`);
  await sequelize.query(
    `ALTER TABLE "${table}" ADD CONSTRAINT "${constraint}" FOREIGN KEY ("${column}") REFERENCES "${refTable}"("id") ON UPDATE ${onUpdate} ON DELETE ${onDelete}`
  );
}

async function ensureMemberCascadeFks() {
  const [rows] = await sequelize.query(`
    SELECT
      con.conname AS constraint_name,
      src.relname AS table_name,
      src_att.attname AS column_name,
      dst.relname AS ref_table,
      con.confdeltype AS delete_action,
      con.confupdtype AS update_action
    FROM pg_constraint con
    JOIN pg_class src ON src.oid = con.conrelid
    JOIN pg_class dst ON dst.oid = con.confrelid
    JOIN pg_namespace nsp ON nsp.oid = src.relnamespace AND nsp.nspname = 'public'
    JOIN pg_attribute src_att
      ON src_att.attrelid = src.oid AND src_att.attnum = con.conkey[1]
    WHERE con.contype = 'f'
      AND dst.relname IN ('members', 'competitors', 'scores')
      AND src.relkind = 'r'
      AND array_length(con.conkey, 1) = 1
  `);
  for (const row of rows) {
    const setNull = row.table_name === 'judges' || row.column_name === 'parent_id';
    const onDelete = setNull ? 'SET NULL' : 'CASCADE';
    if (row.delete_action === (setNull ? 'n' : 'c') && row.update_action === 'c') continue;
    try {
      await setForeignKeyAction(row.table_name, row.constraint_name, row.column_name, row.ref_table, {
        onDelete,
        onUpdate: 'CASCADE',
      });
    } catch (err) {
      console.warn(`Could not update ${row.constraint_name}:`, err.message);
    }
  }
}

async function deleteMember(member) {
  await sequelize.transaction(async (t) => {
    await removeCompetitorsByMemberId(member.id, { transaction: t });
    await Registration.destroy({ where: { memberId: member.id }, transaction: t });
    await Attendance.destroy({ where: { memberId: member.id }, transaction: t });
    await MemberPointEvent.destroy({ where: { memberId: member.id }, transaction: t });
    await MemberProgress.destroy({ where: { memberId: member.id }, transaction: t });
    await Judge.update({ memberId: null }, { where: { memberId: member.id }, transaction: t });
    await Payment.destroy({ where: { memberId: member.id }, transaction: t });

    const orders = await Order.findAll({
      where: { memberId: member.id },
      attributes: ['id'],
      transaction: t,
    });
    const orderIds = orders.map((row) => row.id);
    if (orderIds.length) {
      await OrderItem.destroy({ where: { orderId: orderIds }, transaction: t });
      await Order.destroy({ where: { id: orderIds }, transaction: t });
    }

    await Transaction.destroy({ where: { memberId: member.id }, transaction: t });
    await Member.update({ parentId: null }, { where: { parentId: member.id }, transaction: t });
    await member.destroy({ transaction: t });
  });
}

module.exports = { deleteMember, ensureMemberCascadeFks };
