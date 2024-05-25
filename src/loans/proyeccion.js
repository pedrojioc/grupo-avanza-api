const capital = 1_000_000
const plazo = 6
const interes = 0.1
let deuda = capital
let totalInteres = 0
const cuotaCapital = capital / plazo

console.log('Cuota fija a capital: ', Math.round(cuotaCapital))

for (let i = 0; i < plazo; i++) {
  const cuotaInteres = Math.round(deuda * interes)
  const totalCuota = Math.round(cuotaInteres + cuotaCapital)
  deuda -= cuotaCapital
  totalInteres += cuotaInteres
  // console.log("Interes: ", cuotaInteres)
  console.log(totalCuota)
}

//console.log('Total interes', totalInteres)
