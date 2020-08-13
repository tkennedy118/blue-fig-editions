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
    password: 'Toughpassword1',
    cart: []
  },
  {
    username: 'tyler.kennedy',
    password: 'Password1',
    cart: []
  },
  {
    username: 'mike.martino',
    password: 'Password1',
    cart: []
  }
];

const printSeed = [
  {
    name: 'Big Gilbert',
    description: 'Silkscreen mono-print and silkscreen 22x22',
    series: 'Space-scape',
    price: 0,
    count: 10,
    image: 'Big-Gilbert.jpg'
  },
  {
    name: 'Sasha',
    description: 'Silkscreen mono-print and etching 20x20',
    series: 'Space-scape',
    price: 0,
    count: 10,
    image: 'Sasha.jpg',
  },
  {
    name: 'Enzo',
    description: 'Silkscreen mono-print and silkscreen 21x21',
    series: 'Space-scape',
    price: 0,
    count: 10,
    image: 'Enzo.jpg'
  },
  {
    name: 'Landon',
    description: 'Silkscreen and monoprint 22x28',
    series: 'Landscape',
    price: 0,
    count: 10,
    image: 'Landon.jpg'
  },
  {
    name: 'Owen',
    description: 'Silkscreen and monoprint 22x18',
    series: 'Landscape',
    price: 0,
    count: 10,
    image: 'Owen.jpg'
  },
  {
    name: 'Kira',
    description: 'Monoprint / screen print 11x11, 8 of 12',
    series: 'Landscape',
    price: 0,
    count: 10,
    image: 'Kira.jpg'
  },
  {
    name: 'Edna',
    description: 'none',
    series: 'none',
    price: 0,
    count: 10,
    image: 'Edna.jpg'
  },
  {
    name: 'Edna L.',
    description: 'none',
    series: 'none',
    price: 0,
    count: 10,
    image: 'Edna-L.jpg'
  },
  {
    name: 'Jethro',
    description: 'none',
    series: 'none',
    price: 0,
    count: 10,
    image: 'Jethro.jpg'
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
