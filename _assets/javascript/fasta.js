/**
 * Working with strings in the fasta format
 */
class FASTA{
  constructor(sequence){
    this.sequence = sequence;
    this.input = sequence;
    this.options = {
      width: 60,
      gap: false,
      block: 10,
      header: true,
      lineNum: false,
      lineNumPos: 'start' // start, end, between
    };
    this.el = null;
    this.dbs = {
        "ncbi": {
            "name": "NCBI",
            "example": "NCBI|NC_001638.1|NP_042570.1|11467095|NADH",
            "structure": ["NCBI","genome","accession","gi"],
            "link": "http://www.ncbi.nlm.nih.gov/protein/{{gi}}"
        },
        "jgi": {
            "name": "JGI",
            "example": "",
            "structure": ["jgi","database","integer"],
            "link": "http://genome.jgi-psf.org/cgi-bin/dispGeneModel?db={{database}}&tid={{integer}}"
        },
        "bbs": {
            "name": "GenInfo backbone seqid",
            "example": "bbs|123",
            "structure": ["bbs","integer"]
        },
        "bbm": {
            "name": "GenInfo backbone moltype",
            "example": "bbm|123",
            "structure": ["bbm","integer"]
        },
        "gim": {
            "name": "GenInfo import ID",
            "example": "gim|123",
            "structure": ["gim","integer"]
        },
        "gb": {
            "name": "GenBank",
            "example": "gb|M73307|AGMA13GT",
            "structure": ["gb","accession","locus"]
        },
        "emb": {
            "name": "EMBL",
            "example": "emb|CAM43271.1|",
            "structure": ["emb","accession","locus"]
        },
        "pir": {
            "name": "PIR",
            "example": "pir||G36364",
            "structure": ["pir","accession","name"]
        },
        "sp": {
            "name": "SWISS-PROT",
            "example": "sp|P01013|OVAX_CHICK",
            "structure": ["sp","accession","name"]
        },
        "pat": {
            "name": "patent",
            "example": "pat|US|RE33188|1",
            "structure": ["pat","country","patent","sequence-number"]
        },
        "pgp": {
            "name": "pre-grant patent",
            "example": "pgp|EP|0238993|7",
            "structure": ["pgp","country","application-number","sequence-number"]
        },
        "ref": {
            "name": "RefSeq",
            "example": "ref|NM_010450.1|",
            "structure": ["ref","accession","name"]
        },
        "gi": {
            "name": "GenInfo integrated database",
            "example": "gi|21434723",
            "structure": ["gi","integer"]
        },
        "dbj": {
            "name": "DDBJ",
            "example": "dbj|BAC85684.1|",
            "structure": ["dbj","accession","locus"]
        },
        "prf": {
            "name": "PRF",
            "example": "prf||0806162C",
            "structure": ["prf","accession","name"]
        },
        "pdb": {
            "name": "PDB",
            "example": "pdb|1I4L|D",
            "structure": ["pdb","entry","chain"]
        },
        "tpg": {
            "name": "third-party GenBank",
            "example": "tpg|BK003456|",
            "structure": ["tpg","accession","name"]
        },
        "tpe": {
            "name": "third-party EMBL",
            "example": "tpe|BN000123|",
            "structure": ["tpe","accession","name"]
        },		
        "tpd": {
            "name": "third-party DDBJ",
            "example": "tpd|FAA00017|",
            "structure": ["tpd","accession","name"]
        },
        "tr": {
            "name": "TrEMBL",
            "example": "tr|Q90RT2|Q90RT2_9HIV1",
            "structure": ["tr","accession","name"],
            "link": "https://www.uniprot.org/uniprot/{{accession}}"
        }
    };
  }
  // Get the current sequence
  get entry(){
    return this.sequence;
  }
  // Set the current sequence
  set entry( entry ){
    this.sequence = entry;
  }
  // Get output settings
  get settings(){
    return this.options;
  }
  // Set output settings
  set settings(options){
    this.options = {...this.options, ...options};
  }
  // Get the DOM element for output
  get element(){
    return this.el;
  }
  // Set the DOM element for output
  set element(element){
    this.el = element;
  }
  // Format Sequence
  get format(){
      let entry = this.sanitize;
      let seqlen = entry.length;
      let header = this.header;
      let options = this.options;
    
      // Determine width of sequence block
      var regex = new RegExp(`.{1,${options.width}}`,'g');
      entry = entry.match(regex) || [];
  
      // Determine gap and block size
      if(options.gap){
          for(var i in entry){
              var regex = new RegExp(`.{1,${options.block ? options.block : 10 }}`,'g');
              entry[i] = entry[i].match(regex);
              entry[i] = entry[i].join(" ");
          }
      }
      // Remove header
      if(!options.header || !header)
        header = "";
  
      if(options.lineNum){
          var ls = String(options.width * (entry.length-1)).length;
          var le = options.width;
          if(entry.length-2 > 0)
              le = entry[entry.length-2].length;
          var lb = 0;
          for(var i in entry){
              if(options.lineNumPos == 'start')
                  entry[i] = `${ String((options.width * Number(i))+1).padStart(ls, ' ') } ${entry[i]}`;
              if(options.lineNumPos == 'end')
                  entry[i] = `${entry[i].padEnd(le, ' ')} ${ (i < entry.length-1 ) ? (options.width * (Number(i)+1)) : seqlen }`;
              if(options.lineNumPos == 'between'){
                  var line = entry[i].split(' ');
                  for(var v in line){
                      lb += line[v].length;
                      if(lb < seqlen)
                          line[v] = String(lb).padStart(line[v].length, ' ');
                      else
                          line[v] = String('').padStart(line[v].length, ' ');
                  }
                  line = line.join(' ');
                  entry[i] = `${line}\n${entry[i]}`;
              }
          }
      }

      return `${header != "" ? header+'\n' : ''}${entry.join('\n')}`;
  }
  // Identify if the Sequence is AA or NT
  get identify(){
      let entry = this.sanitize;  
      let len = entry.length;
      let aa = (entry.match(/[ABCDEFGHIJKLMNOPQRSTUVWYZX]/gi) || []).length ;
      let nt = (entry.match(/[ACGTURYKMSWBDHVN]/gi) || []).length ;
  
        console.log(aa,nt)

      if(aa > nt)
          return 'aa';
      if(aa < nt)
          return 'nt';
      if(aa == nt || aa/len <= 0.5 || nt/len <= 0.5)
          return 'unknown';
      else
          return 'unknown';
  }
  // Check Sequence
  get check(){
  
  }
  // Check combined source
  get combined(){
    // nt,aa, options={}
  }
  // Get header and generate Link to fasta source if available
  get header() {
    if(this.isFasta)
      return this.sequence.split('\n')[0];
    else
      return null;
  }
  // Get link to fasta source if available
  get link() {
    // "ncbi": {
    //     "name": "NCBI",
    //     "example": "NCBI|NC_001638.1|NP_042570.1|11467095|NADH",
    //     "structure": ["NCBI","genome","accession","gi"],
    //     "link": "http://www.ncbi.nlm.nih.gov/protein/{gi}"
    // }
    if(!this.isFasta)
      return null;
    let header = this.header.replace(/^>/,'');
    let keys = Object.keys(this.dbs);
    var regex = new RegExp(`^(${keys.join("|")})\\|`,'i');
    let match = header.match(regex);
    if(match){
        let entry = header.split('|');
        let key = match[1].toLowerCase();
        let str = {}
        for(let i in this.dbs[key].structure){
            str[`${this.dbs[key].structure[i]}`] = entry[i] || '';
        }
        return this.dbs[key].link.replace(/\{\{(.*)\}\}/, function(m,k){ return str[k]; });
    }
    else {
        return null;
    }
}
  // Sanitize Sequence removing header, spaces, etc.
  get sanitize() {
    if(this.isFasta){
      return this.sequence.split('\n').map(function(l){ return (l[0] ==">")? "" : l; }).join('').replace(/[\s\d\n]/g, '') || "";
    }
    else
      return this.sequence.split('\n').join('').replace(/[\s\d\n]/g, '') || "";
  }
  // Check if the Sequence is in the Fasta format
  get isFasta() {
    return this.sequence.match(/^>/)? true: false;
  }
}