(function(global){
"use strict";
const valid=(...xs)=>xs.every(x=>Number.isFinite(Number(x)));
function emi(P,annual,months){P=+P;annual=+annual;months=+months;if(!valid(P,annual,months)||P<=0||annual<0||months<=0)return null;const r=annual/1200;if(r===0)return P/months;const x=(1+r)**months;return P*r*x/(x-1)}
function loanSchedule(P,annual,months,extra=0,max=1200){P=+P;annual=+annual;months=Math.round(+months);extra=+extra;if(!valid(P,annual,months,extra)||P<=0||annual<0||months<=0||extra<0)return null;const baseEmi=emi(P,annual,months),r=annual/1200,payment=baseEmi+extra;let b=P,m=0,totalInterest=0,totalPaid=0;const schedule=[];while(b>.01&&m<max){m++;const opening=b,it=opening*r,pay=Math.min(payment,opening+it),principal=Math.max(0,pay-it);b=Math.max(0,opening+it-pay);totalInterest+=it;totalPaid+=pay;schedule.push({month:m,opening,interest:it,principal,payment:pay,closing:b})}return{possible:b<=.01,baseEmi,payment,months:m,totalInterest,totalPaid,balance:b,schedule}}
function amortize(P,annual,payment,max=1200){P=+P;annual=+annual;payment=+payment;if(!valid(P,annual,payment)||P<=0||annual<0||payment<=0)return null;const r=annual/1200;if(r>0&&payment<=P*r)return{possible:false,months:0,interest:0,total:0,balance:P,schedule:[]};let b=P,m=0,i=0,paid=0;const schedule=[];while(b>.01&&m<max){m++;const opening=b,it=opening*r,pay=Math.min(payment,opening+it),principal=Math.max(0,pay-it);b=Math.max(0,opening+it-pay);i+=it;paid+=pay;schedule.push({month:m,opening,interest:it,principal,payment:pay,closing:b})}return{possible:b<=.01,months:m,interest:i,total:paid,balance:b,schedule}}
function prepaymentPlan(P,annual,months,after,amount,max=1200){P=+P;annual=+annual;months=Math.round(+months);after=Math.round(+after);amount=+amount;if(!valid(P,annual,months,after,amount)||P<=0||annual<0||months<=0||after<0||after>=months||amount<0)return null;const base=loanSchedule(P,annual,months,0,max);if(!base||!base.possible)return null;const pay=base.baseEmi,r=annual/1200;let b=P,m=0,totalInterest=0,totalPaid=0,before=null,effectivePrepay=0;const schedule=[];while(b>.01&&m<max){m++;const opening=b,it=opening*r,regularPay=Math.min(pay,opening+it);b=Math.max(0,opening+it-regularPay);totalInterest+=it;totalPaid+=regularPay;if(m===after){before=b;effectivePrepay=Math.min(amount,b);b=Math.max(0,b-effectivePrepay);totalPaid+=effectivePrepay}schedule.push({month:m,opening,interest:it,payment:regularPay,prepayment:m===after?effectivePrepay:0,closing:b});if(b<=.01)break}return{possible:b<=.01,emi:pay,outstandingBefore:before===null?P:before,effectivePrepay,newTenureMonths:m,monthsSaved:Math.max(0,base.months-m),baselineInterest:base.totalInterest,newInterest:totalInterest,interestSaved:Math.max(0,base.totalInterest-totalInterest),baselineTotal:base.totalPaid,newTotal:totalPaid,schedule,baselineSchedule:base.schedule}}
function prepayment(P,annual,months,after,amount){return prepaymentPlan(P,annual,months,after,amount)}
function creditMinimumPlan(balance,monthly,minPct,minFloor,max=1200){balance=+balance;monthly=+monthly;minPct=+minPct;minFloor=+minFloor;if(!valid(balance,monthly,minPct,minFloor)||balance<=0||monthly<0||minPct<=0||minFloor<0)return null;const r=monthly/100;let b=balance,m=0,paid=0,interest=0;const schedule=[];while(b>.01&&m<max){m++;const opening=b,it=opening*r,due=Math.min(opening+it,Math.max(opening*minPct/100,minFloor)),close=Math.max(0,opening+it-due);paid+=due;interest+=it;schedule.push({month:m,opening,payment:due,interest:it,closing:close});if(close>=opening-.0001&&opening>minFloor)return{possible:false,months:m,totalPaid:paid,totalInterest:interest,balance:close,firstPayment:schedule[0]?.payment||0,schedule};b=close}return{possible:b<=.01,months:m,totalPaid:paid,totalInterest:interest,balance:b,firstPayment:schedule[0]?.payment||0,schedule}}
function creditMinimum(balance,monthly,minPct,minFloor,max=1200){return creditMinimumPlan(balance,monthly,minPct,minFloor,max)}
function creditFixedPlan(balance,monthly,payment,max=1200){balance=+balance;monthly=+monthly;payment=+payment;if(!valid(balance,monthly,payment)||balance<=0||monthly<0||payment<=0)return null;const r=monthly/100;if(payment<=balance*r&&r>0)return{possible:false,months:0,totalPaid:0,totalInterest:0,balance,schedule:[]};let b=balance,m=0,paid=0,interest=0;const schedule=[];while(b>.01&&m<max){m++;const opening=b,it=opening*r,pay=Math.min(payment,opening+it),close=Math.max(0,opening+it-pay);paid+=pay;interest+=it;schedule.push({month:m,opening,payment:pay,interest:it,closing:close});b=close}return{possible:b<=.01,months:m,totalPaid:paid,totalInterest:interest,balance:b,schedule}}
function simpleInterest(P,annual,years){P=+P;annual=+annual;years=+years;if(!valid(P,annual,years)||P<0||annual<0||years<0)return null;const interest=P*annual*years/100;return{interest,total:P+interest}}
function compound(P,annual,years,n=4){P=+P;annual=+annual;years=+years;n=+n;if(!valid(P,annual,years,n)||P<0||annual<0||years<0||n<=0)return null;const total=P*(1+annual/(100*n))**(n*years);return{interest:total-P,total}}
function sip(payment,annual,months,timing='end'){payment=+payment;annual=+annual;months=+months;if(!valid(payment,annual,months)||payment<0||annual<0||months<=0)return null;const r=annual/1200;let fv;if(r===0)fv=payment*months;else fv=payment*((1+r)**months-1)/r;if(timing==='begin')fv*=1+r;const invested=payment*months;return{invested,gain:fv-invested,total:fv}}
function recurring(payment,annual,months){return sip(payment,annual,months,'end')}
function lumpsum(P,annual,years){return compound(P,annual,years,1)}
function cagr(start,end,years){start=+start;end=+end;years=+years;if(!valid(start,end,years)||start<=0||end<0||years<=0)return null;return((end/start)**(1/years)-1)*100}
function inflation(cost,annual,years){cost=+cost;annual=+annual;years=+years;if(!valid(cost,annual,years)||cost<0||annual<0||years<0)return null;const future=cost*(1+annual/100)**years;return{future,increase:future-cost}}
function percentage(part,whole){part=+part;whole=+whole;if(!valid(part,whole)||whole===0)return null;return part/whole*100}
function pctChange(oldV,newV){oldV=+oldV;newV=+newV;if(!valid(oldV,newV)||oldV===0)return null;return(newV-oldV)/Math.abs(oldV)*100}
function discount(price,pct){price=+price;pct=+pct;if(!valid(price,pct)||price<0||pct<0)return null;const saving=price*pct/100;return{saving,final:price-saving}}
function fuel(distance,mileage,price){distance=+distance;mileage=+mileage;price=+price;if(!valid(distance,mileage,price)||distance<0||mileage<=0||price<0)return null;const litres=distance/mileage;return{litres,cost:litres*price}}
/* CALCKOSH_INVESTMENT_V6 */
function fdPlan(P,annual,years,n=4){
  P=+P;annual=+annual;years=+years;n=+n;
  if(!valid(P,annual,years,n)||P<0||annual<0||years<0||n<=0)return null;
  const base=compound(P,annual,years,n);
  if(!base)return null;
  const factor=1+annual/(100*n),schedule=[{year:0,balance:P,interest:0}];
  const whole=Math.floor(years);
  for(let y=1;y<=whole;y++){
    const b=P*factor**(n*y);
    schedule.push({year:y,balance:b,interest:b-P});
  }
  if(Math.abs(years-whole)>1e-9){
    schedule.push({year:years,balance:base.total,interest:base.interest});
  }else if(schedule.length){
    schedule[schedule.length-1]={year:years,balance:base.total,interest:base.interest};
  }
  const effectiveAnnual=((1+annual/(100*n))**n-1)*100;
  return{principal:P,interest:base.interest,total:base.total,effectiveAnnual,schedule};
}
function contributionPlan(payment,annual,months,timing='end'){
  payment=+payment;annual=+annual;months=Math.round(+months);
  if(!valid(payment,annual,months)||payment<0||annual<0||months<=0)return null;
  const r=annual/1200,schedule=[];
  let balance=0,invested=0;
  for(let m=1;m<=months;m++){
    if(timing==='begin') balance=(balance+payment)*(1+r);
    else balance=balance*(1+r)+payment;
    invested+=payment;
    schedule.push({month:m,invested,balance,gain:balance-invested});
  }
  const effectiveAnnual=((1+r)**12-1)*100;
  return{payment,invested,gain:balance-invested,total:balance,months,effectiveAnnual,schedule};
}
function lumpsumPlan(P,annual,years){
  P=+P;annual=+annual;years=+years;
  if(!valid(P,annual,years)||P<0||annual<0||years<0)return null;
  const base=lumpsum(P,annual,years);
  if(!base)return null;
  const factor=1+annual/100,schedule=[{year:0,balance:P,gain:0}];
  const whole=Math.floor(years);
  for(let y=1;y<=whole;y++){
    const b=P*factor**y;
    schedule.push({year:y,balance:b,gain:b-P});
  }
  if(Math.abs(years-whole)>1e-9){
    schedule.push({year:years,balance:base.total,gain:base.interest});
  }else if(schedule.length){
    schedule[schedule.length-1]={year:years,balance:base.total,gain:base.interest};
  }
  return{principal:P,gain:base.interest,total:base.total,multiple:P?base.total/P:0,schedule};
}
function cagrPlan(start,end,years){
  start=+start;end=+end;years=+years;
  const rate=cagr(start,end,years);
  if(rate===null)return null;
  const factor=1+rate/100,schedule=[{year:0,value:start}];
  const whole=Math.floor(years);
  for(let y=1;y<=whole;y++)schedule.push({year:y,value:start*factor**y});
  if(Math.abs(years-whole)>1e-9) schedule.push({year:years,value:end});
  else if(schedule.length) schedule[schedule.length-1]={year:years,value:end};
  const totalReturn=(end-start)/start*100;
  const gain=end-start,multiple=end/start;
  const doublingYears=rate>0?Math.log(2)/Math.log(1+rate/100):null;
  return{rate,totalReturn,gain,multiple,doublingYears,schedule};
}
const api={fdPlan,contributionPlan,lumpsumPlan,cagrPlan,emi,loanSchedule,amortize,prepayment,prepaymentPlan,creditMinimum,creditMinimumPlan,creditFixedPlan,simpleInterest,compound,sip,recurring,lumpsum,cagr,inflation,percentage,pctChange,discount,fuel};
if(typeof module!=='undefined'&&module.exports)module.exports=api;global.Calculators=api;
})(typeof window!=='undefined'?window:globalThis);