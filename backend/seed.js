const bcrypt = require('bcrypt');
const { sequelize, User, Event, Announcement } = require('./models/index');
//const defineUser = require('./models/user');
//const User = defineUser(sequelize);

async function seed() {
  try {
    await sequelize.sync({ force: true });  // Tüm tabloları sıfırla

    const users = [
      {
        firstName: 'Ali',
        lastName: 'Veli',
        email: 'ali@example.com',
        password: await bcrypt.hash('123456', 10),
        isAdmin: false,
        approved: true,
        passwordChanged: true,
        points: 10,
        conversionCount: 2,
      },
      {
        firstName: 'Ayşe',
        lastName: 'Yılmaz',
        email: 'ayse@example.com',
        password: await bcrypt.hash('123456', 10),
        isAdmin: false,
        approved: true,
        passwordChanged: true,
        points: 20,
        conversionCount: 4,
      },
      {
        firstName: 'Mehmet',
        lastName: 'Demir',
        email: 'mehmet@example.com',
        password: await bcrypt.hash('123456', 10),
        isAdmin: false,
        approved: true,
        passwordChanged: true,
        points: 5,
        conversionCount: 1,
      },
      {
        firstName: 'Admin1',
        lastName: 'Yönetici',
        email: 'admin1@example.com',
        password: await bcrypt.hash('admin123', 10),
        isAdmin: true,
        approved: true,
        passwordChanged: true,
        points: 0,
        conversionCount: 0,
      },
      {
        firstName: 'Admin2',
        lastName: 'Yönetici',
        email: 'admin2@example.com',
        password: await bcrypt.hash('admin123', 10),
        isAdmin: true,
        approved: true,
        passwordChanged: true,
        points: 0,
        conversionCount: 0,
      },
    ];

    for (const user of users) {
      await User.create(user);
    }

    console.log('Seed işlemi tamamlandı!');
    process.exit(0);
  } catch (error) {
    console.error('Seed sırasında hata:', error);
    process.exit(1);
  }
}

seed();
