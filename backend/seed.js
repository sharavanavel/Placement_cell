const bcrypt = require('bcryptjs');
const { sequelize, Coordinator } = require('./models');

const seedCoordinator = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connected!');

    // Sync models
    await sequelize.sync({ force: false });
    console.log('Models synchronized!');

    // Coordinators to create / update
    // NOTE: DO NOT pre-hash passwords here — the Coordinator model's
    // beforeCreate hook already does bcrypt hashing on create.
    const coordinators = [
      { email: 'admin@placement.com', password: 'admin123', name: 'Admin Coordinator' },
      { email: '123@gmail.com', password: '123456', name: 'Coordinator' }
    ];

    for (const coord of coordinators) {
      const existing = await Coordinator.findOne({ where: { email: coord.email } });
      if (!existing) {
        // Pass plain text — beforeCreate hook will hash it
        await Coordinator.create({
          email: coord.email,
          password: coord.password,
          name: coord.name
        });
        console.log(`Created coordinator: ${coord.email} / ${coord.password}`);
      } else {
        // For update, manually hash because there's no beforeUpdate hook
        const hashedPassword = await bcrypt.hash(coord.password, 10);
        await sequelize.query(
          'UPDATE coordinators SET password = ? WHERE email = ?',
          { replacements: [hashedPassword, coord.email] }
        );
        console.log(`Updated coordinator password: ${coord.email}`);
      }
    }

    console.log('Seeding done!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedCoordinator();
