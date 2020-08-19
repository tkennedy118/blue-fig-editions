const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../models');

// This file empties the user and print database and seeds with simple information.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/blue-fig-editions', {
  useNewUrlParser: true,
  useFindAndModify: false
});

const userSeed = [
  {
    username: 'martino.admin',
    password: 'Toughpassword1'
  },
  {
    username: 'tyler.kennedy',
    password: 'Password1'
  },
  {
    username: 'mike.martino',
    password: 'Password1'
  }
];

const printSeed = [
  {
    name: 'Big Gilbert',
    description: 'Silkscreen mono-print and silkscreen 22x22',
    series: 'Space-scape',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636340/bluefig/Big-Gilbert_pulfnm.jpg'
  },
  {
    name: 'Sasha',
    description: 'Silkscreen mono-print and etching 20x20',
    series: 'Space-scape',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636368/bluefig/Sasha_dqfi1b.jpg',
  },
  {
    name: 'Enzo',
    description: 'Silkscreen mono-print and silkscreen 21x21',
    series: 'Space-scape',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636365/bluefig/Enzo_etzy2a.jpg'
  },
  {
    name: 'Landon',
    description: 'Silkscreen and monoprint 22x28',
    series: 'Landscape',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636369/bluefig/Landon_gj1u3o.jpg'
  },
  {
    name: 'Owen',
    description: 'Silkscreen and monoprint 22x18',
    series: 'Landscape',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636375/bluefig/Owen_kieapy.jpg'
  },
  {
    name: 'Kira',
    description: 'Monoprint / screen print 11x11, 8 of 12',
    series: 'Landscape',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636372/bluefig/Kira_ijgeet.jpg'
  },
  {
    name: 'Edna',
    description: 'none',
    series: 'none',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636365/bluefig/Edna_ge2khl.jpg'
  },
  {
    name: 'Edna L.',
    description: 'none',
    series: 'none',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636362/bluefig/Edna-L_ptursp.jpg'
  },
  {
    name: 'Jethro',
    description: 'none',
    series: 'none',
    price: 0,
    count: 10,
    image: 'https://res.cloudinary.com/tkennedy118/image/upload/v1597636363/bluefig/Jethro_fk4uve.jpg'
  }
];

// Encrypt passwords.
userSeed.forEach(user => {
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);
})

db.User
  .remove({})
  .then(() => db.User.collection.insertMany(userSeed))
  .then(async data => {
    console.log(data.result.n + ' user records inserted.');
  })
  .catch(err => {
    console.log(err);
    process.exit(0);
  });

db.Print 
  .remove({})
  .then(() => db.Print.collection.insertMany(printSeed))
  .then(async data => {
    console.log(data.result.n + ' print records inserted.');
  })
  .catch(err => {
    console.log(err);
    process.exit(0);
  });
