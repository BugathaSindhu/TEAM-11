const db = require('../config/database');

class UserReward {
  static async create(userRewardData) {
    const { user_id, reward_id } = userRewardData;

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO user_rewards (user_id, reward_id, status) 
         VALUES (?, ?, 'redeemed')`,
        [user_id, reward_id],
        function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, ...userRewardData, status: 'redeemed' });
        }
      );
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT ur.*, r.name as reward_name, r.description as reward_description, r.points_required
         FROM user_rewards ur
         JOIN rewards r ON ur.reward_id = r.id
         WHERE ur.user_id = ?
         ORDER BY ur.redeemed_at DESC`,
        [userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = UserReward;

