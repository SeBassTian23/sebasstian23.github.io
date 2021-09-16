/**
 * Return a html formatted formula
 */

class MolecularFormula {
    constructor(str){
        this.str = str || "";
        this.sub = {"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉"};
        this.sup = {"0":"⁰","1":"¹","2":"²","3":"³","4":"⁴","5":"⁵","6":"⁶","7":"⁷","8":"⁸","9":"⁹"};
    }
    get formula() {
        return this.str;
    }
    set formula(str) {
        this.str = str;
    }
    get html(){
        var regex = /([A-Z][a-z]?)(\d*(?:(?:[\.|\,])\d+(?:\%)?)?)|(?:[\(|\[])([^()]*(?:(?:[\(|\[]).*(?:[\)|\]]))?[^()]*)(?:[\)|\]])(\d*(?:(?:[\.|\,]?)\d+(?:\%)?))/g;
        return (str.match(regex) || []).map(e => e.replace(regex, '$1<sub>$2</sub>').replace('<sub></sub>','')).join("") || str;    
    }
    get utf8(){
        return str.replace(/\d/g,function(s,key){
		    return this.sub[s] || s;
        });
    }
    get isValid(){
        return true;
    }
}