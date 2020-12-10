console.log("Achelia Selim")

const max_bewertung = 5;
let aktuel_bewertung = 0;
let anzahl_bewertungen = 20 ;

console.log(max_bewertung, aktuel_bewertung, anzahl_bewertungen)


//Uncaught TypeError: Assignment to constant variable.
//max_bewertung = 8

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let movies = ['Harry Poter', 'Hunger games', 'Fast and Furious', 'Ayla', 'Wonder', 'After', 'The Lord of the Rings', 'Starwars', 'the Lion King', 'Recep Ivedik']
let name = movies[Math.floor(Math.random() * 10 )]

let arr = [name, aktuel_bewertung,anzahl_bewertungen]

 let ratings = {
    name_: name, 
    aktuel_bewertung_ : aktuel_bewertung, 
    anzahl_bewertungen_ : anzahl_bewertungen

  }
let arrrating = [ratings]
rl.question(`Bewerte mit einem Wert zwischen 1 und 5 ${name} >>   `, 
function(aktuel_bewertung) {

      if(aktuel_bewertung<= max_bewertung && aktuel_bewertung>0){
      console.log(`Ihre Bewertung ${aktuel_bewertung} wurde erhalten. `);
      anzahl_bewertungen++
      arrrating.push({name,aktuel_bewertung,anzahl_bewertungen})
      //ratings.aktuel_bewertung_ = aktuel_bewertung
      //arr[1] = aktuel_bewertung
      console.log(arrrating)
      rl.close()
       }
       else {
      console.log("Versuchen Sie noch einmal! Das Wert soll zwischen 1 und 5 sein!")
      rl.close()
        }
  })

 


 
  










