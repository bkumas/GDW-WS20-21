console.log("Achelia Selim")

const max_bewertung = 5;
let aktuel_bewertung = 2;
let anzahl_bewertungen = 20 ;

console.log(max_bewertung, aktuel_bewertung, anzahl_bewertungen)

anzahl_bewertungen = "Ich war vorher INT";
console.log(max_bewertung, aktuel_bewertung, anzahl_bewertungen)

const { RSA_X931_PADDING } = require('constants');
//Uncaught TypeError: Assignment to constant variable.
//max_bewertung = 8

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let movies = ['Harry Poter', 'Hunger games', 'Fast and Furious', 'Ayla', 'Wonder', 'After', 'The Lord of the Rings', 'Starwars', 'the Lion King', 'Recep Ivedik']

    rl.question(`Bewerte mit einem Wert zwischen 1 und 5 ${movies[Math.floor(Math.random() * 10 )]} >>   `, function(aktuel_bewertung) {

      if(aktuel_bewertung<=5 && aktuel_bewertung>0){
      console.log(`Ihre Bewertung ${aktuel_bewertung} wurde erhalten. `);
      rl.close()

       }
       else {
      console.log("Versuchen Sie noch einmal! Das Wert soll zwischen 1 und 5 sein")
      rl.close()
        }
  })
  










