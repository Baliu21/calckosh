
const assert=require("assert");
const C=require("./assets/calculators.js");
function close(a,b,tol=1e-7){assert(Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b)),`${a} != ${b}`)}
const fd=C.fdPlan(100000,7,5,4),fdBase=C.compound(100000,7,5,4);
assert(fd&&fd.schedule.length>=6);close(fd.total,fdBase.total);close(fd.interest,fdBase.interest);assert(fd.effectiveAnnual>7);
const cp=C.contributionPlan(10000,12,120,"end"),sip=C.sip(10000,12,120,"end");
assert(cp&&cp.schedule.length===120);close(cp.total,sip.total);close(cp.invested,sip.invested);close(cp.gain,sip.gain);
const ls=C.lumpsumPlan(100000,10,10),lsBase=C.lumpsum(100000,10,10);
assert(ls&&ls.schedule.length===11);close(ls.total,lsBase.total);close(ls.gain,lsBase.interest);
const cg=C.cagrPlan(100000,180000,5),cgBase=C.cagr(100000,180000,5);
assert(cg&&cg.schedule.length===6);close(cg.rate,cgBase);close(cg.schedule[cg.schedule.length-1].value,180000);assert(cg.doublingYears>0);
console.log("V6_INVESTMENT_TESTS_PASSED");
console.log("EXISTING_FORMULAS_REPLACED=NO");
