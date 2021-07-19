const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fruitsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true
});

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
   required: true
  },

  rating: {
    type: Number,
    min: [0, 'the minimum rating is 0'],
    max: [10, 'the maximum rating is 10']
  },
  review: String
});


const Fruit = mongoose.model('Fruit', fruitSchema);

const fruit = new Fruit({
  name: 'apple',
  rating: 5,
  review: "the best fruit ever!"
});
//fruit.save();





const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favorFruit:fruitSchema
});
const pineapple = new Fruit({
  name: 'pineapple',
  rating: 1,
  review: "i love pineapple"
});

//pineapple.save();

const gamba = new Fruit({
  name: 'gamba',
  rating: 10,
  review: "i love gamba"
});
//gamba.save();


const Person = mongoose.model('Person', personSchema)
const person = new Person({
  name: "yakov",
  age: 15,
  favorFruit:pineapple
});
//person.save();


// const banna = new Fruit({
//    name: 'banna',
//    rating: 10,
//    review: "bay bay"
//  });
//
//
//  const kiwi = new Fruit({
//     name: 'kiwi',
//     rating: 7,
//     review: "good lack"
//   });
//
//
//   const orange = new Fruit({
//      name: 'orange',
//      rating: 5,
//      review: "best day"
//    });

// Fruit.insertMany([banna,kiwi,orange] , function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("seccesffuly added!");
//   }
// });



// Fruit.deleteMany({name:"apple"},function(err){
//   if(err){
//     console.log(err);
//   } else {
//     console.log("sueccesffuly deleted!");
//   }
// });




// Person.deleteMany({name: 'yakov'}, function (err) {
//   if(err){
//     console.log(err);
//   } else {
//     console.log("sueccesffuly updated!");
//   }
// });




Person.updateOne({name:"amy"},{favorFruit:gamba}, function (err) {
  if(err){
    console.log(err);
  } else {
    console.log("sueccesffuly updated!");
  }
});


Fruit.find(function(err, fruits) {
  if (err) {
    console.log(err);
  } else {
    mongoose.connection.close();
    fruits.forEach(function(fruit) {
      console.log(fruit.name);
    });

  }
});
