/**
 * Generate A list of protein parameters
 */

// const aaEC = require('./protein/extinction-coefficient.js');

class ProteinParameters {
	constructor(sequence) {
		this.aa_sequence = sequence? sequence.toUpperCase() : "";
		this.gravy = {
			"A": 1.800,
			"R": -4.500,
			"N": -3.500,
			"D": -3.500,
			"C": 2.500,
			"Q": -3.500,
			"E": -3.500,
			"G": -0.400,
			"H": -3.200,
			"I": 4.500,
			"L": 3.800,
			"K": -3.900,
			"M": 1.900,
			"F": 2.800,
			"P": -1.600,
			"S": -0.800,
			"T": -0.700,
			"W": -0.900,
			"Y": -1.300,
			"V": 4.200
		};
		this.pK = {
			cterm: 3.55,	//C-terminal charge
			D: 4.05,		//D charge
			E: 4.45,		//E charge
			C: 9,			//C charge
			Y: 10,			//Y charge
			H: 5.98,		//H charge
			nterm: 8.2,		//NH2charge
			K: 10,			//K charge
			R: 12			//R charge   
		};
		this.aminoacids = [
			{
				"#id": 0,
				"full name": "Glycine",
				"three letter code": "Gly",
				"single letter code": "G",
				"monoisotopic mass": 57.021464,
				"average mass": 57.05,
				"composition": "C2H3NO",
				"empirical formula": "C2H5NO2"
			},
			{
				"#id": 1,
				"full name": "Alanine",
				"three letter code": "Ala",
				"single letter code": "A",
				"monoisotopic mass": 71.037114,
				"average mass": 71.08,
				"composition": "C3H5NO",
				"empirical formula": "C3H7NO2"
			},
			{
				"#id": 2,
				"full name": "Serine",
				"three letter code": "Ser",
				"single letter code": "S",
				"monoisotopic mass": 87.032029,
				"average mass": 87.08,
				"composition": "C3H5NO2",
				"empirical formula": "C3H7NO3"
			},
			{
				"#id": 3,
				"full name": "Proline",
				"three letter code": "Pro",
				"single letter code": "P",
				"monoisotopic mass": 97.052764,
				"average mass": 97.12,
				"composition": "C5H7NO",
				"empirical formula": "C5H9NO2"
			},
			{
				"#id": 4,
				"full name": "Valine",
				"three letter code": "Val",
				"single letter code": "V",
				"monoisotopic mass": 99.068414,
				"average mass": 99.13,
				"composition": "C5H9NO",
				"empirical formula": "C5H11NO2"
			},
			{
				"#id": 5,
				"full name": "Threonine",
				"three letter code": "Thr",
				"single letter code": "T",
				"monoisotopic mass": 101.04768,
				"average mass": 101.11,
				"composition": "C4H7NO2",
				"empirical formula": "C4H9NO3"
			},
			{
				"#id": 6,
				"full name": "Cysteine",
				"three letter code": "Cys",
				"single letter code": "C",
				"monoisotopic mass": 103.00919,
				"average mass": 103.14,
				"composition": "C3H5NOS",
				"empirical formula": "C3H7NO2S"
			},
			{
				"#id": 7,
				"full name": "Leucine",
				"three letter code": "Leu",
				"single letter code": "L",
				"monoisotopic mass": 113.08406,
				"average mass": 113.16,
				"composition": "C6H11NO",
				"empirical formula": "C6H13NO2"
			},
			{
				"#id": 8,
				"full name": "Isoleucine",
				"three letter code": "Ile",
				"single letter code": "I",
				"monoisotopic mass": 113.08406,
				"average mass": 113.16,
				"composition": "C6H11NO",
				"empirical formula": "C6H13NO2"
			},
			{
				"#id": 9,
				"full name": "Asparagine",
				"three letter code": "Asn",
				"single letter code": "N",
				"monoisotopic mass": 114.04293,
				"average mass": 114.1,
				"composition": "C4H6N2O2",
				"empirical formula": "C4H8N2O3"
			},
			{
				"#id": 10,
				"full name": "Aspartic Acid",
				"three letter code": "Asp",
				"single letter code": "D",
				"monoisotopic mass": 115.02694,
				"average mass": 115.09,
				"composition": "C4H5NO3",
				"empirical formula": "C4H7NO4"
			},
			{
				"#id": 11,
				"full name": "Glutamine",
				"three letter code": "Gln",
				"single letter code": "Q",
				"monoisotopic mass": 128.05858,
				"average mass": 128.13,
				"composition": "C5H8N2O2",
				"empirical formula": "C5H10N2O3"
			},
			{
				"#id": 12,
				"full name": "Lysine",
				"three letter code": "Lys",
				"single letter code": "K",
				"monoisotopic mass": 128.09496,
				"average mass": 128.17,
				"composition": "C6H12N2O",
				"empirical formula": "C6H14N2O2"
			},
			{
				"#id": 13,
				"full name": "Glutamic Acid",
				"three letter code": "Glu",
				"single letter code": "E",
				"monoisotopic mass": 129.04259,
				"average mass": 129.12,
				"composition": "C5H7NO3",
				"empirical formula": "C5H9NO4"
			},
			{
				"#id": 14,
				"full name": "Methionine",
				"three letter code": "Met",
				"single letter code": "M",
				"monoisotopic mass": 131.04048,
				"average mass": 131.2,
				"composition": "C5H9NOS",
				"empirical formula": "C5H11NO2S"
			},
			{
				"#id": 15,
				"full name": "Histidine",
				"three letter code": "His",
				"single letter code": "H",
				"monoisotopic mass": 137.05891,
				"average mass": 137.14,
				"composition": "C6H7N3O",
				"empirical formula": "C6H9N3O2"
			},
			{
				"#id": 16,
				"full name": "Phenylalanine",
				"three letter code": "Phe",
				"single letter code": "F",
				"monoisotopic mass": 147.06841,
				"average mass": 147.18,
				"composition": "C9H9NO",
				"empirical formula": "C9H11NO2"
			},
			{
				"#id": 17,
				"full name": "Arginine",
				"three letter code": "Arg",
				"single letter code": "R",
				"monoisotopic mass": 156.10111,
				"average mass": 156.19,
				"composition": "C6H12N4O",
				"empirical formula": "C6H14N4O2"
			},
			{
				"#id": 18,
				"full name": "Tyrosine",
				"three letter code": "Tyr",
				"single letter code": "Y",
				"monoisotopic mass": 163.06333,
				"average mass": 163.17,
				"composition": "C9H9NO2",
				"empirical formula": "C9H11NO3"
			},
			{
				"#id": 19,
				"full name": "Tryptophan",
				"three letter code": "Trp",
				"single letter code": "W",
				"monoisotopic mass": 186.07931,
				"average mass": 186.21,
				"composition": "C11H10N2O",
				"empirical formula": "C11H12N2O2"
			},
			{
				"#id": 128,
				"full name": "Stop",
				"three letter code": "[$]",
				"single letter code": "$",
				"monoisotopic mass": 0,
				"average mass": 0,
				"composition": "",
				"empirical formula": ""
			},
			{
				"#id": 129,
				"full name": "Unknown",
				"three letter code": "[X]",
				"single letter code": "X",
				"monoisotopic mass": 0,
				"average mass": 0,
				"composition": "",
				"empirical formula": ""
			}
		];
		this.hl = {
			"A": {
				"Mammalian": "4.4 hour",
				"Yeast": ">20 hour",
				"E. coli": ">10 hour"
			},
			"R": {
				"Mammalian": "1 hour",
				"Yeast": "2 min",
				"E. coli": "2 min"
			},
			"N": {
				"Mammalian": "1.4 hour",
				"Yeast": "3 min",
				"E. coli": ">10 hour"
			},
			"D": {
				"Mammalian": "1.1 hour",
				"Yeast": "3 min",
				"E. coli": ">10 hour"
			},
			"C": {
				"Mammalian": "1.2 hour",
				"Yeast": ">20 hour",
				"E. coli": ">10 hour"
			},
			"Q": {
				"Mammalian": "0.8 hour",
				"Yeast": "10 min",
				"E. coli": ">10 hour"
			},
			"E": {
				"Mammalian": "1 hour",
				"Yeast": "30 min",
				"E. coli": ">10 hour"
			},
			"G": {
				"Mammalian": "30 hour",
				"Yeast": ">20 hour",
				"E. coli": ">10 hour"
			},
			"H": {
				"Mammalian": "3.5 hour",
				"Yeast": "10 min",
				"E. coli": ">10 hour"
			},
			"I": {
				"Mammalian": "20 hour",
				"Yeast": "30 min",
				"E. coli": ">10 hour"
			},
			"L": {
				"Mammalian": "5.5 hour",
				"Yeast": "3 min",
				"E. coli": "2 min"
			},
			"K": {
				"Mammalian": "1.3 hour",
				"Yeast": "3 min",
				"E. coli": "2 min"
			},
			"M": {
				"Mammalian": "30 hour",
				"Yeast": ">20 hour",
				"E. coli": ">10 hour"
			},
			"F": {
				"Mammalian": "1.1 hour",
				"Yeast": "3 min",
				"E. coli": "2 min"
			},
			"P": {
				"Mammalian": ">20 hour",
				"Yeast": ">20 hour",
				"E. coli": "?"
			},
			"S": {
				"Mammalian": "1.9 hour",
				"Yeast": ">20 hour",
				"E. coli": ">10 hour"
			},
			"T": {
				"Mammalian": "7.2 hour",
				"Yeast": ">20 hour",
				"E. coli": ">10 hour"
			},
			"W": {
				"Mammalian": "2.8 hour",
				"Yeast": "3 min",
				"E. coli": "2 min"
			},
			"Y": {
				"Mammalian": "2.8 hour",
				"Yeast": "10 min",
				"E. coli": "2 min"
			},
			"V": {
				"Mammalian": "100 hour",
				"Yeast": ">20 hour",
				"E. coli": ">10 hour"
			}
		};
		this.grpmatrix = [
			{
				"x": "W",
				"W": 1,
				"C": 1,
				"M": 24.68,
				"H": 24.68,
				"Y": 1,
				"F": 1,
				"Q": 1,
				"N": 13.34,
				"I": 1,
				"R": 1,
				"D": 1,
				"P": 1,
				"T": -14.03,
				"K": 1,
				"E": 1,
				"V": -7.49,
				"S": 1,
				"G": -9.37,
				"A": -14.03,
				"L": 13.34
			},
			{
				"x": "C",
				"W": 24.68,
				"C": 1,
				"M": 33.6,
				"H": 33.6,
				"Y": 1,
				"F": 1,
				"Q": -6.54,
				"N": 1,
				"I": 1,
				"R": 1,
				"D": 20.26,
				"P": 20.26,
				"T": 33.6,
				"K": 1,
				"E": 1,
				"V": -6.54,
				"S": 1,
				"G": 1,
				"A": 1,
				"L": 20.26
			},
			{
				"x": "M",
				"W": 1,
				"C": 1,
				"M": -1.88,
				"H": 58.28,
				"Y": 24.68,
				"F": 1,
				"Q": -6.54,
				"N": 1,
				"I": 1,
				"R": -6.54,
				"D": 1,
				"P": 44.94,
				"T": -1.88,
				"K": 1,
				"E": 1,
				"V": 1,
				"S": 44.94,
				"G": 1,
				"A": 13.34,
				"L": 1
			},
			{
				"x": "H",
				"W": -1.88,
				"C": 1,
				"M": 1,
				"H": 1,
				"Y": 44.94,
				"F": -9.37,
				"Q": 1,
				"N": 24.68,
				"I": 44.94,
				"R": 1,
				"D": 1,
				"P": -1.88,
				"T": -6.54,
				"K": 24.68,
				"E": 1,
				"V": 1,
				"S": 1,
				"G": -9.37,
				"A": 1,
				"L": 1
			},
			{
				"x": "Y",
				"W": -9.37,
				"C": 1,
				"M": 44.94,
				"H": 13.34,
				"Y": 13.34,
				"F": 1,
				"Q": 1,
				"N": 1,
				"I": 1,
				"R": -15.91,
				"D": 24.68,
				"P": 13.34,
				"T": -7.49,
				"K": 1,
				"E": -6.54,
				"V": 1,
				"S": 1,
				"G": -7.49,
				"A": 24.68,
				"L": 1
			},
			{
				"x": "F",
				"W": 1,
				"C": 1,
				"M": 1,
				"H": 1,
				"Y": 33.6,
				"F": 1,
				"Q": 1,
				"N": 1,
				"I": 1,
				"R": 1,
				"D": 13.34,
				"P": 20.26,
				"T": 1,
				"K": -14.03,
				"E": 1,
				"V": 1,
				"S": 1,
				"G": 1,
				"A": 1,
				"L": 1
			},
			{
				"x": "Q",
				"W": 1,
				"C": -6.54,
				"M": 1,
				"H": 1,
				"Y": -6.54,
				"F": -6.54,
				"Q": 20.26,
				"N": 1,
				"I": 1,
				"R": 1,
				"D": 20.26,
				"P": 20.26,
				"T": 1,
				"K": 1,
				"E": 20.26,
				"V": -6.54,
				"S": 44.94,
				"G": 1,
				"A": 1,
				"L": 1
			},
			{
				"x": "N",
				"W": -9.37,
				"C": -1.88,
				"M": 1,
				"H": 1,
				"Y": 1,
				"F": -14.03,
				"Q": -6.54,
				"N": 1,
				"I": 44.94,
				"R": 1,
				"D": 1,
				"P": -1.88,
				"T": -7.49,
				"K": 24.68,
				"E": 1,
				"V": 1,
				"S": 1,
				"G": -14.03,
				"A": 1,
				"L": 1
			},
			{
				"x": "I",
				"W": 1,
				"C": 1,
				"M": 1,
				"H": 13.34,
				"Y": 1,
				"F": 1,
				"Q": 1,
				"N": 1,
				"I": 1,
				"R": 1,
				"D": 1,
				"P": -1.88,
				"T": 1,
				"K": -7.49,
				"E": 44.94,
				"V": -7.49,
				"S": 1,
				"G": 1,
				"A": 1,
				"L": 20.26
			},
			{
				"x": "R",
				"W": 58.28,
				"C": 1,
				"M": 1,
				"H": 20.26,
				"Y": -6.54,
				"F": 1,
				"Q": 20.26,
				"N": 13.34,
				"I": 1,
				"R": 58.28,
				"D": 1,
				"P": 20.26,
				"T": 1,
				"K": 1,
				"E": 1,
				"V": 1,
				"S": 44.94,
				"G": -7.49,
				"A": 1,
				"L": 1
			},
			{
				"x": "D",
				"W": 1,
				"C": 1,
				"M": 1,
				"H": 1,
				"Y": 1,
				"F": -6.54,
				"Q": 1,
				"N": 1,
				"I": 1,
				"R": -6.54,
				"D": 1,
				"P": 1,
				"T": -14.03,
				"K": -7.49,
				"E": 1,
				"V": 1,
				"S": 20.26,
				"G": 1,
				"A": 1,
				"L": 1
			},
			{
				"x": "P",
				"W": -1.88,
				"C": -6.54,
				"M": -6.54,
				"H": 1,
				"Y": 1,
				"F": 20.26,
				"Q": 20.26,
				"N": 1,
				"I": 1,
				"R": -6.54,
				"D": -6.54,
				"P": 20.26,
				"T": 1,
				"K": 1,
				"E": 18.38,
				"V": 20.26,
				"S": 20.26,
				"G": 1,
				"A": 20.26,
				"L": 1
			},
			{
				"x": "T",
				"W": -14.03,
				"C": 1,
				"M": 1,
				"H": 1,
				"Y": 1,
				"F": 13.34,
				"Q": -6.54,
				"N": -14.03,
				"I": 1,
				"R": 1,
				"D": 1,
				"P": 1,
				"T": 1,
				"K": 1,
				"E": 20.26,
				"V": 1,
				"S": 1,
				"G": -7.49,
				"A": 1,
				"L": 1
			},
			{
				"x": "K",
				"W": 1,
				"C": 1,
				"M": 33.6,
				"H": 1,
				"Y": 1,
				"F": 1,
				"Q": 24.68,
				"N": 1,
				"I": -7.49,
				"R": 33.6,
				"D": 1,
				"P": -6.54,
				"T": 1,
				"K": 1,
				"E": 1,
				"V": -7.49,
				"S": 1,
				"G": -7.49,
				"A": 1,
				"L": -7.49
			},
			{
				"x": "E",
				"W": -14.03,
				"C": 44.94,
				"M": 1,
				"H": -6.54,
				"Y": 1,
				"F": 1,
				"Q": 20.26,
				"N": 1,
				"I": 20.26,
				"R": 1,
				"D": 20.26,
				"P": 20.26,
				"T": 1,
				"K": 1,
				"E": 33.6,
				"V": 1,
				"S": 20.26,
				"G": 1,
				"A": 1,
				"L": 1
			},
			{
				"x": "V",
				"W": 1,
				"C": 1,
				"M": 1,
				"H": 1,
				"Y": -6.54,
				"F": 1,
				"Q": 1,
				"N": 1,
				"I": 1,
				"R": 1,
				"D": -14.03,
				"P": 20.26,
				"T": -7.49,
				"K": -1.88,
				"E": 1,
				"V": 1,
				"S": 1,
				"G": -7.49,
				"A": 1,
				"L": 1
			},
			{
				"x": "S",
				"W": 1,
				"C": 33.6,
				"M": 1,
				"H": 1,
				"Y": 1,
				"F": 1,
				"Q": 20.26,
				"N": 1,
				"I": 1,
				"R": 20.26,
				"D": 1,
				"P": 44.94,
				"T": 1,
				"K": 1,
				"E": 20.26,
				"V": 1,
				"S": 20.26,
				"G": 1,
				"A": 1,
				"L": 1
			},
			{
				"x": "G",
				"W": 13.34,
				"C": 1,
				"M": 1,
				"H": 1,
				"Y": -7.49,
				"F": 1,
				"Q": 1,
				"N": -7.49,
				"I": -7.49,
				"R": 1,
				"D": 1,
				"P": 1,
				"T": -7.49,
				"K": -7.49,
				"E": -6.54,
				"V": 1,
				"S": 1,
				"G": 13.34,
				"A": -7.49,
				"L": 1
			},
			{
				"x": "A",
				"W": 1,
				"C": 44.94,
				"M": 1,
				"H": -7.49,
				"Y": 1,
				"F": 1,
				"Q": 1,
				"N": 1,
				"I": 1,
				"R": 1,
				"D": -7.49,
				"P": 20.26,
				"T": 1,
				"K": 1,
				"E": 1,
				"V": 1,
				"S": 1,
				"G": 1,
				"A": 1,
				"L": 1
			},
			{
				"x": "L",
				"W": 24.68,
				"C": 1,
				"M": 1,
				"H": 1,
				"Y": 1,
				"F": 1,
				"Q": 33.6,
				"N": 1,
				"I": 1,
				"R": 20.26,
				"D": 1,
				"P": 20.26,
				"T": 1,
				"K": -7.49,
				"E": 1,
				"V": 1,
				"S": 1,
				"G": 1,
				"A": 1,
				"L": 1
			}
		];
	}
	formula(str){
		return str.replace(/\d/g,function(s,key){
			let sub = {"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉"};
			return sub[s] || s;
		});
	}
	get sequence(){
		return this.aa_sequence;
	}
	set sequence( sequence ){
		this.aa_sequence = sequence;
	}
	get length(){
		return this.AminoAcidCount.number;
	}
	get AminoAcidCount() {
		let len = (this.sequence.match(/[DEHRKCNGSQYTIFLWAMPV]/gi) || []).length;
		return {
			number: len,
			text: `Number of amino acids: ${len || "--" }`,
			html: `<p>Number of amino acids: <strong>${len || "--" }</strong></p>`,
		};
	}
	get AminoAcidComposition(){
		let len = this.length;
		let seq = this.sequence;
		let percent = false;
    
		let counts = {
			// Acidic
			D: (seq.match(/D/gi) || []).length,
			E: (seq.match(/E/gi) || []).length,

			// Basic
			H: (seq.match(/H/gi) || []).length,
			R: (seq.match(/R/gi) || []).length,
			K: (seq.match(/K/gi) || []).length,

			// Polar
			C: (seq.match(/C/gi) || []).length,
			N: (seq.match(/N/gi) || []).length,
			G: (seq.match(/G/gi) || []).length,
			S: (seq.match(/S/gi) || []).length,
			Q: (seq.match(/Q/gi) || []).length,
			Y: (seq.match(/Y/gi) || []).length,
			T: (seq.match(/T/gi) || []).length,

			// Hydrophobic
			I: (seq.match(/I/gi) || []).length,
			F: (seq.match(/F/gi) || []).length,
			L: (seq.match(/L/gi) || []).length,
			W: (seq.match(/W/gi) || []).length,
			A: (seq.match(/A/gi) || []).length,
			M: (seq.match(/M/gi) || []).length,
			P: (seq.match(/P/gi) || []).length,
			V: (seq.match(/V/gi) || []).length
		};


    // Result Output
			var html = `<div class="row">
			<div class="col-md-4">
				<table class="table table-sm table-bordered">
					<tr>
						<td class="bg-dark text-white"><b>Acidic</b></td>
						<td class="bg-dark text-white">${percent ? (((counts.D+counts.E)/len) * 100).toFixed(0) + '%' : counts.D+counts.E}</td>
					</tr>
					<tr>
						<td>Aspartic acid (Asp, D)</td>
						<td><b>${percent ? ((counts.D/len) * 100).toFixed(0) + '%' : counts.D}</b></td>
					</tr>
					<tr>
						<td>Glutamic acid (Glu, E)</td>
						<td><b>${percent ? ((counts.E/len) * 100).toFixed(0) + '%' : counts.E}</b></td>
					</tr>
				</table>

				<table class="table table-sm table-bordered">
					<tr>
						<td class="bg-dark text-white"><b>Basic</b></td>
						<td class="bg-dark text-white">${percent ? (((counts.H+counts.R+counts.K)/len) * 100).toFixed(0) + '%' : counts.H+counts.R+counts.K}</td>
					</tr>
					<tr>
						<td>Argenine (Arg, R)</td>
						<td><b>${percent ? ((counts.R/len) * 100).toFixed(0) + '%' : counts.R}</b></td>
					</tr>
					<tr>
						<td>Histidine (His, H)</td>
						<td><b>${percent ? ((counts.H/len) * 100).toFixed(0) + '%' : counts.H}</b></td>
					</tr>
					</tr>
						<td>Lysine (Lys, K)</td>
						<td><b>${percent ? ((counts.K/len) * 100).toFixed(0) + '%' : counts.K}</b></td>
					<tr>
				</table>
			</div>
			
			<div class="col-md-4">
				<table class="table table-sm table-bordered">
					<tr>
						<td class="bg-dark text-white"><b>Polar</b></td>
						<td class="bg-dark text-white">${percent ? (((counts.C+counts.N+counts.G+counts.S+counts.Q+counts.Y+counts.T)/len) * 100).toFixed(0) + '%' : counts.C+counts.N+counts.G+counts.S+counts.Q+counts.Y+counts.T}</td>
					</tr>
					<tr>
						<td>Asparagine (Asn, N)</td>
						<td><b>${percent ? ((counts.N/len) * 100).toFixed(0) + '%' : counts.N}</b></td>
					</tr>
					<tr>
						<td>Cysteine (Cys, C)</td>
						<td><b>${percent ? ((counts.C/len) * 100).toFixed(0) + '%' : counts.C}</b></td>
					</tr>
					<tr>
						<td>Glutamine (Glu, Q)</td>
						<td><b>${percent ? ((counts.Q/len) * 100).toFixed(0) + '%' : counts.Q}</b></td>
					</tr>
					<tr>
						<td>Glycine (Gly, G)</td>
						<td><b>${percent ? ((counts.G/len) * 100).toFixed(0) + '%' : counts.G}</b></td>
					</tr>
					<tr>
						<td>Serine (Ser, S)</td>
						<td><b>${percent ? ((counts.S/len) * 100).toFixed(0) + '%' : counts.S}</b></td>
					</tr>
					<tr>
						<td>Threonine (Thr, T)</td>
						<td><b>${percent ? ((counts.T/len) * 100).toFixed(0) + '%' : counts.T}</b></td>
					</tr>
					<tr>
						<td>Thyrosine (Tyr, Y)</td>
						<td><b>${percent ? ((counts.Y/len) * 100).toFixed(0) + '%' : counts.Y}</b></td>
					</tr>
				</table>
			</div>

			<div class="col-md-4 ">
				<table class="table table-sm table-bordered">
					<tr>
						<td class="bg-dark text-white"><b>Hydrophobic</b></td>
						<td class="bg-dark text-white">${percent ? (((counts.I+counts.F+counts.L+counts.W+counts.A+counts.M+counts.P+counts.V)/len) * 100).toFixed(0) + '%' : counts.I+counts.F+counts.L+counts.W+counts.A+counts.M+counts.P+counts.V}</td>
					</tr>
					<tr>
						<td>Alanine (Ala, A)</td>
						<td><b>${percent ? ((counts.A/len) * 100).toFixed(0) + '%' : counts.A}</b></td>
					</tr>
					<tr>
						<td>Isoleucine (Ile, I)</td>
						<td><b>${percent ? ((counts.I/len) * 100).toFixed(0) + '%' : counts.I}</b></td>		
					</tr>
					<tr>
						<td>Leucine (Leu, L)</td>
						<td><b>${percent ? ((counts.L/len) * 100).toFixed(0) + '%' : counts.L}</b></td>
					</tr>
					<tr>
						<td>Methionine (Met, M)</td>
						<td><b>${percent ? ((counts.M/len) * 100).toFixed(0) + '%' : counts.M}</b></td>
					</tr>
					<tr>
						<td>Phenylalanine (Phe, F)</td>
						<td><b>${percent ? ((counts.F/len) * 100).toFixed(0) + '%' : counts.F}</b></td>
					</tr>
					<tr>
						<td>Proline (Pro, P)</td>
						<td><b>${percent ? ((counts.P/len) * 100).toFixed(0) + '%' : counts.P}</b></td>
					</tr>
					<tr>
						<td>Tryptophan (Trp,W)</td>
						<td><b>${percent ? ((counts.W/len) * 100).toFixed(0) + '%' : counts.W}</b></td>
					</tr>
					<tr>
						<td>Valine (Val, V)</td>
						<td><b>${percent ? ((counts.V/len) * 100).toFixed(0) + '%' : counts.V}</b></td>
					</tr>
				</table>
			</div>
		</div>`;
		return {
			counts: counts,
			html: html
		};
		
	}
	get mass(){
		let seq = this.sequence;

		let m = {};
    this.aminoacids.map(function(x){
        if(x["single letter code"] !== undefined)
            m[x["single letter code"]] = {
                avg: x["average mass"],
                mono: x["monoisotopic mass"]
            };
    });
        
    // Acidic
    var D = (seq.match(/D/gi) || []).length;
    var E = (seq.match(/E/gi) || []).length;

    // Basic
    var H = (seq.match(/H/gi) || []).length;
    var R = (seq.match(/R/gi) || []).length;
    var K = (seq.match(/K/gi) || []).length;

    // Polar
    var C = (seq.match(/C/gi) || []).length;
    var N = (seq.match(/N/gi) || []).length;
    var G = (seq.match(/G/gi) || []).length;
    var S = (seq.match(/S/gi) || []).length;
    var Q = (seq.match(/Q/gi) || []).length;
    var Y = (seq.match(/Y/gi) || []).length;
    var T = (seq.match(/T/gi) || []).length;

    // Hydrophobic
    var I = (seq.match(/I/gi) || []).length;
    var F = (seq.match(/F/gi) || []).length;
    var L = (seq.match(/L/gi) || []).length;
    var W = (seq.match(/W/gi) || []).length;
    var A = (seq.match(/A/gi) || []).length;
    var M = (seq.match(/M/gi) || []).length;
    var P = (seq.match(/P/gi) || []).length;
    var V = (seq.match(/V/gi) || []).length;

    var avg =   (D*m.D.avg)+
                (E*m.E.avg)+
                (H*m.H.avg)+
                (R*m.R.avg)+
                (K*m.K.avg)+
                (C*m.C.avg)+
                (N*m.N.avg)+
                (G*m.G.avg)+
                (S*m.S.avg)+
                (Q*m.Q.avg)+
                (Y*m.Y.avg)+
                (T*m.T.avg)+
                (I*m.I.avg)+
                (F*m.F.avg)+
                (L*m.L.avg)+
                (W*m.W.avg)+
                (A*m.A.avg)+
                (M*m.M.avg)+
                (P*m.P.avg)+
                (V*m.V.avg)+
                18.01528;       // water
    var mono =  (D*m.D.mono)+
                (E*m.E.mono)+
                (H*m.H.mono)+
                (R*m.R.mono)+
                (K*m.K.mono)+
                (C*m.C.mono)+
                (N*m.N.mono)+
                (G*m.G.mono)+
                (S*m.S.mono)+
                (Q*m.Q.mono)+
                (Y*m.Y.mono)+
                (T*m.T.mono)+
                (I*m.I.mono)+
                (F*m.F.mono)+
                (L*m.L.mono)+
                (W*m.W.mono)+
                (A*m.A.mono)+
                (M*m.M.mono)+
                (P*m.P.mono)+
                (V*m.V.mono)+
                18.0105;        // Water

		return {
			number: {average: avg, monoisotopic: mono },
			text: `Average Mass: ${ avg || "--" } Da\nMonoisotopic Mass: ${ mono || "--" } Da`,
			html: `<p>Average Mass: <strong>${ avg || "--" } Da</strong><br>Monoisotopic Mass: <strong>${ mono || "--" } Da</strong></p>`
		}
	}
	get atomicComposition(){
		let seq = this.sequence;
		let m = {};
    this.aminoacids.map(function(x){
        if(x["single letter code"] !== undefined){
            if(m[x["single letter code"]] === undefined)
                m[x["single letter code"]] = { elements: {}, atoms: 0, formula: x["composition"] };
            var groups = x["composition"].match(/([A-Z]{1}[a-z]{0,1}\d{0,})/g);
            for(var i in groups){
                var group = groups[i].match(/(([A-Z]{1}[a-z]{0,1})(\d{0,}))/);
                m[x["single letter code"]].elements[group[2]] = Number(group[3]) || 1;
                m[x["single letter code"]].atoms += Number(group[3]) || 1;
            }
        }
    });

    var atomsTotal = 0;
    var C = 0;
    var H = 0;
    var N = 0;
    var O = 0;
    var S = 0;

    for(var e in m){
        var regex = new RegExp(`${e}`,'gi');
        var count = (seq.match(regex) || []).length;
        if(count > 0){
            atomsTotal += m[e].atoms * count;
            C += (m[e].elements.C * count) || 0;
            H += (m[e].elements.H * count) || 0;
            N += (m[e].elements.N * count) || 0;
            O += (m[e].elements.O * count) || 0;
            S += (m[e].elements.S * count) || 0;
        }
    }

    //Add Water
    atomsTotal += 3;
    H += 2;
    O += 1;

    let formula = "";
    if(C>0)
        formula += "C" + (C>1 ? C : "");
    if(H>0)
        formula += "H" + (H>1 ? H : "");
    if(N>0)
        formula += "N" + (N>1 ? N : "");
    if(O>0)
        formula += "O" + (O>1 ? O : "");
    if(S>0)
        formula += "S" + (S>1 ? S : "");

    return {
        atoms: atomsTotal,
        elements: {C: C, H: H, N: N, O: O, S: S},
        formula: formula,
				text: `Formula: ${this.formula(formula)}\n`
						+ `Total number of atoms: ${atomsTotal}`,
				html: `<p>Formula: <strong>${this.formula(formula)}</strong><br>Total number of atoms: <strong>${atomsTotal}</strong></p>`
    };

	}
	get isoElectricPoint(){

		var seq = this.sequence;

		// Acidic
		let D = (seq.match(/D/gi) || []).length;
		let E = (seq.match(/E/gi) || []).length;

		// Basic
		let H = (seq.match(/H/gi) || []).length;
		let R = (seq.match(/R/gi) || []).length;
		let K = (seq.match(/K/gi) || []).length;

		// Polar
		let C = (seq.match(/C/gi) || []).length;
		let Y = (seq.match(/Y/gi) || []).length;

		let pH = 6.5;             //starting point pI = 6.5 - theoretically it should be 7, but average protein pI is 6.5 so we increase the probability
		let pHprev = 0.0;         //of finding the solution
		let pHnext = 14.0;        //0-14 is possible pH range
		let e = 0.01;             //epsilon means precision [pI = pH ? E]
		let temp = 0.0;	

		let NQ, QN1, QN2, QN3, QN4, QN5, QP1, QP2, QP3, QP4;

		for(;;){                //the infinite loop
			//pK values from Bjellqvist 1994
			QN1 = -1/(1+Math.pow(10,(this.pK.cterm-pH)));	//C-terminal charge
			QN2 = -D/(1+Math.pow(10,(this.pK.D-pH)));	//D charge
			QN3 = -E/(1+Math.pow(10,(this.pK.E-pH)));	//E charge
			QN4 = -C/(1+Math.pow(10,(this.pK.C-pH)));		//C charge
			QN5 = -Y/(1+Math.pow(10,(this.pK.Y-pH)));	//Y charge
			QP1 = H/(1+Math.pow(10,(pH-this.pK.H)));	//H charge
			QP2 = 1/(1+Math.pow(10,(pH-this.pK.nterm)));	//NH2charge
			QP3 = K/(1+Math.pow(10,(pH-this.pK.K)));		//K charge
			QP4 = R/(1+Math.pow(10,(pH-this.pK.R)));		//R charge          

			NQ=QN1+QN2+QN3+QN4+QN5+QP1+QP2+QP3+QP4;

			if (pH>=14.0){
				pH = 'Something is wrong - pH is higher than 14';
				break;                                            
			}                                                 

			if(NQ<0){              //we are out of range, thus the new pH value must be smaller                 
				temp = pH;
				pH = pH-((pH-pHprev)/2);
				pHnext = temp;
			}
			else{                  //we used to small pH value, so we have to increase it                    
				temp = pH;
				pH = pH + ((pHnext-pH)/2);
				pHprev = temp;
			}
			if ((pH-pHprev<e)&&(pHnext-pH<e)) //terminal condition, finding isoelectric point with given precision
				break;	
		}

		return {
			number: pH,
			text: `Theoretical pI: ${pH.toFixed(2) || "--" }`,
			html: `<p>Theoretical pI: <strong>${pH.toFixed(2) || "--" }</strong></p>`,
			info: ``
		};
	}
	get titration(){
		let seq = this.sequence;

		// Acidic
		let D = (seq.match(/D/gi) || []).length;
		let E = (seq.match(/E/gi) || []).length;

		// Basic
		let H = (seq.match(/H/gi) || []).length;
		let R = (seq.match(/R/gi) || []).length;
		let K = (seq.match(/K/gi) || []).length;

		// Polar
		let C = (seq.match(/C/gi) || []).length;
		let Y = (seq.match(/Y/gi) || []).length;

		let NQ, QN1, QN2, QN3, QN4, QN5, QP1, QP2, QP3, QP4, pH;

		let chargeList = [];
		let pHList = [];
		let graph = [];

		for(var i = 0;i<13.9;(i+=0.1)){
			pH = i;

			// QN1 = -1/(1+Math.pow(10,(3.55-pH)));	//C-terminal charge
			// QN2 = -D/(1+Math.pow(10,(4.05-pH)));	//D charge
			// QN3 = -E/(1+Math.pow(10,(4.45-pH)));	//E charge
			// QN4 = -C/(1+Math.pow(10,(9-pH)));		//C charge
			// QN5 = -Y/(1+Math.pow(10,(10-pH)));	//Y charge
			// QP1 = H/(1+Math.pow(10,(pH-5.98)));	//H charge
			// QP2 = 1/(1+Math.pow(10,(pH-8.2)));	//NH2charge
			// QP3 = K/(1+Math.pow(10,(pH-10)));		//K charge
			// QP4 = R/(1+Math.pow(10,(pH-12)));		//R charge     

			QN1 = -1/(1+Math.pow(10,(this.pK.cterm-pH)));	//C-terminal charge
			QN2 = -D/(1+Math.pow(10,(this.pK.D-pH)));	//D charge
			QN3 = -E/(1+Math.pow(10,(this.pK.E-pH)));	//E charge
			QN4 = -C/(1+Math.pow(10,(this.pK.C-pH)));		//C charge
			QN5 = -Y/(1+Math.pow(10,(this.pK.Y-pH)));	//Y charge
			QP1 = H/(1+Math.pow(10,(pH-this.pK.H)));	//H charge
			QP2 = 1/(1+Math.pow(10,(pH-this.pK.nterm)));	//NH2charge
			QP3 = K/(1+Math.pow(10,(pH-this.pK.K)));		//K charge
			QP4 = R/(1+Math.pow(10,(pH-this.pK.R)));		//R charge  
			
			NQ=QN1+QN2+QN3+QN4+QN5+QP1+QP2+QP3+QP4;

			chargeList.push(NQ);
			pHList.push(pH);
			graph.push({x: pH, y:NQ});
		}

		return {
			netCharge: chargeList,
			pH: pHList,
			graph: graph
		};
	}
	get gravyIndex() {
		let len = this.length;
		let seq = this.sequence;
		let gravyscore = 0;
		let gravysequence = [];
		
		for(var i=0; i<len; i++){
			gravyscore += this.gravy[seq[i]];	
			gravysequence.push(this.gravy[seq[i]]);	
		}
		gravyscore /= len;

		return {
			sequence: gravysequence,
			number: gravyscore,
			text: `Grand average of hydropathicity (GRAVY): ${gravyscore.toFixed(3) || "--" }`,
			html: `<p>Grand average of hydropathicity (GRAVY): <strong>${gravyscore.toFixed(3) || "--" }</strong></p>`,
			info: '## GRAVY (Grand Average of Hydropathy)\n\n'
					+ 'The GRAVY value for a peptide or protein is calculated as the sum of hydropathy values [^10.1016/0022-2836(82)90515-0]'
					+ ' of all the amino acids, divided by the number of residues in the sequence.\n\n'
					+ '[^10.1016/0022-2836(82)90515-0]: Kyte, J. & Doolittle, R.F., 1982. **A simple method for displaying the hydropathic character of a protein.** *Journal of Molecular Biology*, 157(1), pp.105–132. Available at: <http://dx.doi.org/10.1016/0022-2836(82)90515-0>.\n'		
		};
	}
	get instabilityIndex(){
			let len = this.length;
			let seq = this.sequence;
			let DIWV = {};
			var x;
			for(var i in this.grpmatrix){
				for(var j in this.grpmatrix[i]){
					x = this.grpmatrix[i]['x'];
					if(j == 'x')
						continue;
					DIWV[`${x}${j}`] = Number(this.grpmatrix[i][j]);
				}
			}
			let DIWVsum = 0;
			for(i=0;i<len-1;i++){
				DIWVsum += DIWV[`${seq[i]}${seq[i+1]}`];
			}
			let ii = ((10/len) * DIWVsum).toFixed(2);
		
		return {
			number: ii,
			text: `Instability Index: ${ ii || "--" } - ${ii<=40 ? 'predicted to be stable' : 'predicted to be unstable' }`,
			html: `<p>Instability Index: <strong>${ ii || "--" }</strong> - <em>${ii<=40 ? 'predicted to be stable' : 'predicted to be unstable' }</em></p>`
		}
	}
	get halflife(){
		let nterm = this.sequence[0];
		let data = this.hl[nterm];

    return {
			halflife: data,
			text: `The estimated half-life is:\n${data['Mammalian']} (mammalian reticulocytes, in vitro).\n`
					+	`${data['Yeast']} (yeast, in vivo).\n`
					+ `${data['E. coli']} (Escherichia coli, in vivo).`,
			html: `<p>The estimated half-life is:<br>`
					+ `<strong>${data['Mammalian']}</strong> (mammalian reticulocytes, in vitro).<br>`
					+	`<strong>${data['Yeast']}</strong> (yeast, in vivo).<br>`
					+ `<strong>${data['E. coli']}</strong> (Escherichia coli, in vivo).</p>`
    };

	}
	get extinctionCoefficient(){

		let seq = this.sequence;

		let C = (seq.match(/C/gi) || []).length;
		let Y = (seq.match(/Y/gi) || []).length;
		let W = (seq.match(/W/gi) || []).length;

		let Tyr = 1490;
		let Trp = 5500;
		let Cys = 125;
		
		let E1 = (Y*Tyr) + (W*Trp) + (C*Cys);
		let abs1 = E1/this.mass.number.average;

		let E2 = (Y*Tyr) + (W*Trp);
		let abs2 = E2/this.mass.number.average;

		let c = {
			cysteins: {abs: abs1.toFixed(3), coefficient: E1},
			reduced: {abs: abs2.toFixed(3), coefficient: E2}
		};

		let text = `Extinction Coefficent (proteins measured in water at 280 nm)\n\n`
							+ `Cys residues form cystines (ελ=280nm): ${c.cysteins.coefficient} M⁻¹ cm⁻¹\n`
							+ `Abs 0.1%: ${c.cysteins.abs} L g⁻¹ cm⁻¹\n\n`
							+ `All Cysteins Reduced (ελ=280nm): ${c.reduced.coefficient} M⁻¹ cm⁻¹\n`
							+ `Abs 0.1%: ${c.reduced.abs} L g⁻¹ cm⁻¹`
		let html = `<p><strong>Extinction Coefficent</strong> <em>(proteins measured in water at 280 nm)</em><br><br>`
							+ `Cys residues form cystines (ελ=280nm): <strong>${c.cysteins.coefficient} M⁻¹ cm⁻¹</strong><br>`
							+ `Abs 0.1%: <strong>${c.cysteins.abs} L g⁻¹ cm⁻¹</strong><br>`
							+ `<br>`
							+ `All Cysteins Reduced (ελ=280nm): <strong>${c.reduced.coefficient} M⁻¹ cm⁻¹</strong><br>`
							+ `Abs 0.1%: <strong>${c.reduced.abs} L g⁻¹ cm⁻¹</strong><br>`
							+ `</p>`

		if( (C+Y+W) == 0 ){
			let failed = `As there are no Trp, Tyr or Cys in the region considered, your protein should not be visible by UV spectrophotometry.`
			text = `Extinction Coefficent (proteins measured in water at 280 nm)\n\n${failed}`;
			html = `<p><strong>Extinction Coefficent</strong> <em>(proteins measured in water at 280 nm)</em><br>${failed}</p>`
		}
		return {
			coefficient: c,
			text: text,
			html: html
		}
	}
	get aliphaticIndex(){
		/**
		 * Aliphatic Index
		 * 
		 * Aliphatic index = X(Ala) + a * X(Val) + b * ( X(Ile) + X(Leu) )  
		 * where X(Ala), X(Val), X(Ile), and X(Leu) are mole percent (100 X mole fraction) 
		 * of alanine, valine, isoleucine, and leucine. 
		 * The coefficients a and b are the relative volume of valine side chain (a = 2.9) 
		 * and of Leu/Ile side chains (b = 3.9) to the side chain of alanine. 
		 */

		let seq = this.sequence;
		let len = this.length;
		let ai = 0;

		var A = (seq.match(/A/gi) || []).length / len;
		var V = (seq.match(/V/gi) || []).length / len;

		var I = (seq.match(/I/gi) || []).length / len;
		var L = (seq.match(/L/gi) || []).length / len;

		[A,(2.9 * V), 3.9 * ( I + L )].map(function(x){
			if(x && !isNaN(x))
				ai += x;
		});

		ai *= 100;

		return {
			number: ai,
			text: `Aliphatic Index: ${ai.toFixed(3) || "--" }`,
			html: `<p>Aliphatic index: <strong>${ai.toFixed(3) || "--" }</strong></p>`,
			info: 'The aliphatic index of a protein is defined as the relative volume occupied by aliphatic '
					+ 'side chains (alanine, valine, isoleucine, and leucine). It may be regarded as a positive '
					+ 'factor for the increase of thermostability of globular proteins.\n\n'
					+ 'Ikai A (1980) Thermostability and aliphatic index of globular proteins. J Biochem. 88 (6), 1895-8.'
		};
	}
};