
const assert=require('assert');const C=require('./assets/calculators.js');
function near(a,b,t){assert(Math.abs(a-b)<=t,`${a} != ${b}`)}
near(C.emi(1000000,8.5,120),12398.57,1);
let p=C.prepayment(2000000,8.5,180,12,100000);assert(p.interestSaved>0&&p.monthsSaved>0);
let c=C.creditMinimum(100000,3.5,5,500);assert(c&&c.totalInterest>=0);
let a=C.amortize(100000,42,10000);assert(a.possible&&a.months>0);
near(C.simpleInterest(100000,8,3).interest,24000,.01);
near(C.compound(100000,8,5,1).total,146932.81,1);
let s=C.sip(10000,12,120,'end');assert(s.total>s.invested);
near(C.cagr(100000,180000,5),12.474,0.02);
near(C.inflation(100000,6,10).future,179084.77,1);
near(C.percentage(25,200),12.5,.0001);
near(C.pctChange(100,125),25,.0001);
near(C.discount(2000,25).final,1500,.001);
near(C.fuel(500,15,100).cost,3333.333,0.01);
console.log('ALL_CALCULATOR_TESTS_PASSED');
